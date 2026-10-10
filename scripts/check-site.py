"""Check the production site with an isolated headless browser.

Requires Python Playwright and its Chromium browser (already installed on this workstation).
"""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json
import os

ROOT = Path(__file__).resolve().parents[1]
pages = json.loads((ROOT / 'src/content.json').read_text(encoding='utf-8'))
routes = ['/', '/reflections/', *pages]
core = ['/', '/reflections/', *[route for route, data in pages.items() if not data['article']]]
errors = []

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            # Route checks intentionally cancel video/image streams on navigation.
            pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT / 'dist')))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
try:
    with sync_playwright() as p:
        options = {'headless': True}
        installed = Path(os.environ.get('LOCALAPPDATA', '')) / 'ms-playwright/chromium-1234/chrome-win64/chrome.exe'
        if installed.is_file():
            options['executable_path'] = str(installed)
        browser = p.chromium.launch(**options)
        page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: errors.append(f'HTTP {response.status}: {response.url}') if response.status >= 400 and response.url.startswith(base) else None)
        for route in routes:
            response = page.goto(base + route, wait_until='load')
            assert response.status == 200, f'{route}: HTTP {response.status}'
            assert page.locator('main h1').count() == 1, f'{route}: missing or duplicate page heading'
            assert 'Let’s find your' not in page.locator('h1').inner_text(), f'{route}: rendered not found'
            assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), f'{route}: desktop overflow'
            # Resolve every rendered internal route, including links in imported articles.
            for href in page.locator('a[href]').evaluate_all('(links) => links.map(a => a.getAttribute("href"))'):
                if href.startswith('/') and not href.startswith('/#') and not href.endswith('.pdf'):
                    path = href.split('#')[0]
                    assert path in routes, f'{route}: unresolved link {href}'
        print(f'PASS: {len(routes)} production routes, headings, local links, and desktop widths.', flush=True)

        for width in [320, 390, 768]:
            page.set_viewport_size({'width': width, 'height': 844})
            for route in core:
                page.goto(base + route, wait_until='load')
                assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), f'{route}: overflow at {width}px'
        print(f'PASS: {len(core)} pages at 320px, 390px, and 768px.', flush=True)

        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.goto(base + '/', wait_until='load')
        page.get_by_role('navigation', name='Main navigation').get_by_role('link', name='Services', exact=True).click()
        page.wait_for_url('**/services/')
        assert 'Support for the life' in page.locator('h1').inner_text()
        page.get_by_role('navigation', name='Main navigation').get_by_role('link', name='Our team', exact=True).click()
        page.wait_for_url('**/careteam/')
        assert page.locator('.provider-card').count() == 5
        page.locator('.provider-card').first.click()
        page.wait_for_url('**/stacy/')
        assert page.locator('h1').inner_text() == 'Stacy Hixon'
        page.go_back()
        assert 'Real people' in page.locator('h1').inner_text()
        page.get_by_role('navigation', name='Main navigation').get_by_role('link', name='Our approach', exact=True).click()
        page.wait_for_url('**/#approach')
        assert page.locator('#approach').is_visible()
        assert page.evaluate('window.scrollY') > 100
        print('PASS: client navigation, profile links, browser Back, and homepage anchors.', flush=True)

        page.goto(base + '/reflections/', wait_until='load')
        assert page.locator('.journal-card').count() == 9
        page.get_by_role('button', name='Load more reflections').click()
        assert page.locator('.journal-card').count() == 18
        page.get_by_role('searchbox', name='Search reflections').fill('Why Counselors Need Therapy Too')
        assert page.locator('.journal-card').count() == 1
        page.locator('.journal-card').click()
        page.wait_for_url('**/2026/10/01/why-counselors-need-therapy-too/')
        assert 'Counselors are people first' in page.locator('.page-prose').inner_text()
        page.goto(base + '/reflections/', wait_until='load')
        page.get_by_role('button', name='Counseling', exact=True).click()
        assert '34 reflections' in page.get_by_role('status').inner_text()
        page.get_by_role('searchbox', name='Search reflections').fill('does-not-exist-12345')
        assert page.get_by_role('heading', name='No reflections found.').is_visible()
        page.get_by_role('button', name='Show all reflections').click()
        assert page.locator('.journal-card').count() == 9
        print('PASS: archive search, category filters, pagination, empty state, and article reading.', flush=True)

        page.goto(base + '/frequently-asked-questions/', wait_until='load')
        assert page.locator('.page-faq-list details').count() == 12
        question = page.locator('.page-faq-list details').nth(1)
        question.locator('summary').click()
        assert question.get_attribute('open') is not None
        page.goto(base + '/consultation/', wait_until='load')
        assert page.get_by_role('link', name='Choose a consultation time').get_attribute('href') == 'https://calendar.app.google/nyiYDRBgML4yuVa39'
        page.set_viewport_size({'width': 390, 'height': 844})
        page.get_by_role('button', name='Open navigation').click()
        assert page.get_by_role('button', name='Close navigation').get_attribute('aria-expanded') == 'true'
        page.get_by_role('navigation', name='Main navigation').get_by_role('link', name='Services', exact=True).click()
        page.wait_for_url('**/services/')
        assert page.get_by_role('button', name='Open navigation').get_attribute('aria-expanded') == 'false'
        print('PASS: FAQ disclosure, original booking link, and mobile navigation.', flush=True)

        # The service directory must open, navigate, and close with the keyboard.
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.get_by_role('button', name='Explore services', exact=True).click()
        assert page.locator('#service-navigation').is_visible()
        page.keyboard.press('Escape')
        assert not page.locator('#service-navigation').is_visible()
        page.get_by_role('button', name='Explore services', exact=True).click()
        page.locator('#service-navigation').get_by_role('link', name='Trauma & recovery').click()
        page.wait_for_url('**/trauma/')
        assert page.locator('.service-hero').is_visible()
        assert page.locator('.service-methods article').count() == 4
        assert page.locator('.service-topics li').count() == 14
        assert not page.locator('#service-navigation').is_visible()
        print('PASS: service directory, keyboard dismissal, and detailed service content.', flush=True)

        for width in [320, 390, 768, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 1000})
            page.goto(base + '/', wait_until='load')
            box = page.locator('#sanctuary').bounding_box()
            assert box['x'] == 0 and abs(box['width'] - width) < 1, f'Sanctuary does not fill {width}px viewport'
        print('PASS: Sanctuary fills the viewport from 320px through 1920px.', flush=True)
        assert not errors, '\n'.join(errors)
        browser.close()
        print('PASS: no browser JavaScript errors or failed local requests.', flush=True)
finally:
    server.shutdown()
