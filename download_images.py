import json
import urllib.request
import os

with open('known_posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

os.makedirs('downloaded_ig_images', exist_ok=True)

for p in posts:
    sc = p['shortcode']
    url = p['image']
    if url:
        dest = f'downloaded_ig_images/{sc}.jpg'
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f_out:
                f_out.write(resp.read())
            print(f"Downloaded {dest}, size: {os.path.getsize(dest)}")
        except Exception as e:
            print(f"Error downloading {sc}: {e}")
