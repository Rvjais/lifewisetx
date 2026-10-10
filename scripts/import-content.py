"""Import the supplied offline reference, without WordPress runtime code."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from bs4 import BeautifulSoup, NavigableString
import hashlib
import html
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'scraped_site'
SLUGS = '''services careteam stacy martha-sharpe caity-boyd hazel-dettmer lynn consultation pricing frequently-asked-questions referral-partners supervision lifewise-career-development-program-2 anxiety-and-depression neurodivergence trauma relationships stress life-challenges lgbtq-affirmative-support client-rights good-faith-estimate website-privacy-policy terms-of-use client-information-and-website-disclosures'''.split()
FILES = [SOURCE / 'pages' / (slug + '.html') for slug in SLUGS]
FILES += sorted((SOURCE / 'pages').glob('2026__*.html'), reverse=True)
routes = {file.name: '/' + file.stem.replace('__', '/') + '/' for file in FILES}
routes['index.html'] = '/'
assets = ROOT / 'public' / 'images' / 'reference'
assets.mkdir(parents=True, exist_ok=True)

def asset(src, page):
    if not src or urlsplit(src).scheme:
        return None
    file = (page.parent / unquote(src.split('?')[0])).resolve()
    if not file.is_relative_to(SOURCE.resolve()) or not file.is_file():
        return None
    name = hashlib.sha1(str(file.relative_to(SOURCE)).encode()).hexdigest()[:10] + file.suffix
    shutil.copyfile(file, assets / name)
    return '/images/reference/' + name

def link(href):
    if not href:
        return None
    url = urlsplit(href)
    if url.scheme and url.scheme not in ['https', 'http', 'mailto', 'tel']:
        return None
    if url.netloc in ['lifewisetx.com', 'www.lifewisetx.com']:
        return url.path + ('#' + url.fragment if url.fragment else '')
    filename = Path(url.path).name
    if filename in routes:
        return routes[filename] + ('#' + url.fragment if url.fragment else '')
    if filename.startswith('reflections') or filename.startswith('category__'):
        return '/reflections/'
    if href.startswith('../_external/www.cms.gov/'):
        file = (SOURCE / 'pages' / href).resolve()
        target = ROOT / 'public' / 'documents' / 'good-faith-estimate-notice.pdf'
        target.parent.mkdir(parents=True, exist_ok=True)
        if file.is_file():
            shutil.copyfile(file, target)
            return '/documents/good-faith-estimate-notice.pdf'
    if not url.scheme and filename.endswith('.html'):
        return None
    return href

ALLOWED = {'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'hr'}
def clean(node, page):
    if isinstance(node, NavigableString):
        return html.escape(str(node))
    if node.name in ['script', 'style', 'iframe', 'form', 'svg', 'noscript', 'input', 'button']:
        return ''
    if node.name == 'img':
        # Keep meaningful illustrations; decorative backgrounds and headshots are handled by page layouts.
        if 'wp-block-cover__image-background' in node.get('class', []):
            return ''
        src = asset(node.get('src'), page)
        if not src:
            return ''
        alt = node.get('alt') or node.get('data-image-title', 'LifeWise illustration')
        if 'Logo' in alt or 'logo' in alt.lower():
            return ''
        return '<img src="' + src + '" alt="' + html.escape(alt, quote=True) + '" loading="lazy" />'
    children = ''.join(clean(child, page) for child in node.children)
    if node.name not in ALLOWED:
        return children
    attrs = ''
    if node.name == 'a':
        href = link(node.get('href'))
        if not href:
            return children
        attrs = ' href="' + html.escape(href, quote=True) + '"'
        if href.startswith('http'):
            attrs += ' target="_blank" rel="noopener noreferrer"'
    if node.name in ['h2', 'h3', 'h4']:
        text = node.get_text(' ', strip=True)
        if text.isupper():
            children = html.escape(text.capitalize())
        attrs = ' id="' + re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-') + '"'
    if node.name in ['br', 'hr']:
        return '<' + node.name + ' />'
    return '<' + node.name + attrs + '>' + children + '</' + node.name + '>'

pages = {}
for file in FILES:
    soup = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
    content = soup.select_one('.entry-content')
    title = soup.select_one('main h1') or soup.select_one('h1')
    title = title.get_text(' ', strip=True) if title else file.stem
    images = []
    for image in soup.select('main img'):
        src = asset(image.get('src'), file)
        if src:
            images.append({'src': src, 'alt': image.get('alt', '')})
    body = ''.join(clean(child, file) for child in content.children) if content else ''
    if file.stem.startswith('2026__') and images:
        # A featured image is shown in the article hero; don't repeat it in the body.
        body = re.sub(r'<img src="' + re.escape(images[0]['src']) + r'"[^>]*>', '', body)
    # The profile already has its own portrait in the hero.
    if file.stem in ['stacy', 'martha-sharpe', 'caity-boyd', 'hazel-dettmer', 'lynn']:
        body = re.sub(r'<img[^>]+>', '', body)
    if file.stem == 'life-challenges':
        body = body.replace('forward.u’re experiencing and find a way forward.', 'forward.')
    date = soup.select_one('time')
    category = soup.select_one('.wp-block-post-terms')
    paragraphs = content.find_all('p') if content else []
    excerpt = next((p.get_text(' ', strip=True) for p in paragraphs if len(p.get_text()) > 80), '')
    pages[routes[file.name]] = {
        'title': title, 'html': body, 'excerpt': excerpt,
        'image': images[0]['src'] if images else None,
        'date': date.get('datetime', '')[:10] if date else '',
        'category': category.get_text(' ', strip=True) if category else 'Reflections',
        'categories': [a.get_text(' ', strip=True) for a in category.select('a')] if category else [],
        'article': file.stem.startswith('2026__'),
    }
(ROOT / 'src' / 'content.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Imported {len(pages)} pages and {len(list(assets.iterdir()))} reference assets.')
