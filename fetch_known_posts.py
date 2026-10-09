import urllib.request
import re
import json
import os
from html import unescape

shortcodes = [
    'DKe2ZO0tVdK',
    'DKe18wMN3zV',
    'DKe10LLtx4d',
    'DKe1fyaNNY1',
    'DKe1NS5ttM1',
    'DDXmoQzNoOs',
    'DDhM5N3t8bJ'
]

results = []

for sc in shortcodes:
    url = f'https://www.instagram.com/p/{sc}/embed/captioned/'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            caption_m = re.search(r'class="Caption"[^>]*>(.*?)</div>', html, re.DOTALL)
            caption = ""
            if caption_m:
                caption = unescape(re.sub(r'<[^>]+>', ' ', caption_m.group(1)).strip())
            
            imgs = re.findall(r'class="EmbeddedMediaImage"[^>]*src="([^"]+)"', html)
            img = unescape(imgs[0]) if imgs else None
            
            # find all images
            all_imgs = [unescape(x) for x in re.findall(r'<img[^>]*src="([^"]+)"[^>]*>', html)]
            
            results.append({
                'shortcode': sc,
                'caption': caption,
                'image': img,
                'all_images': all_imgs
            })
            print(f"Fetched {sc}: caption length {len(caption)}, image: {bool(img)}")
    except Exception as e:
        print(f"Error fetching {sc}: {e}")

with open('known_posts.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved known_posts.json")
