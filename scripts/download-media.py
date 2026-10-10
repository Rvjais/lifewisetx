"""Download the selected free Unsplash images as local site assets."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import requests
import json
import hashlib

ROOT = Path(__file__).resolve().parents[1]
media = json.loads((ROOT / 'src/media.json').read_text(encoding='utf-8'))

def download(item):
    name, data = item
    target = ROOT / 'public' / data['src'].lstrip('/')
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.is_file():
        response = requests.get(data['cdn'] + '?w=1400&q=82&fit=max&fm=jpg', timeout=45)
        response.raise_for_status()
        if not response.headers.get('content-type', '').startswith('image/'):
            raise ValueError(f'{name}: response is not an image')
        target.write_bytes(response.content)
    with Image.open(target) as image:
        image.verify()
    return hashlib.sha256(target.read_bytes()).hexdigest()

with ThreadPoolExecutor(max_workers=5) as pool:
    hashes = list(pool.map(download, media.items()))
assert len(hashes) == len(set(hashes)), 'Duplicate downloaded photographs'
credits = ['# Additional photography', '', 'Free Unsplash photographs downloaded as local assets. These are illustrative scenes, not photographs of the LifeWise office or its clients.', '']
for name, data in media.items():
    credits += [f'- **{name}**: [{data["alt"]}]({data["source"]})']
(ROOT / 'docs' / 'media-credits.md').write_text('\n'.join(credits) + '\n', encoding='utf-8')
print(f'Downloaded and verified {len(media)} distinct photographs.')
