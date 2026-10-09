import json
import base64
import re
from urllib.parse import unquote

def id_to_shortcode(media_id):
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    shortcode = ''
    media_id = int(media_id)
    while media_id > 0:
        remainder = media_id % 64
        media_id //= 64
        shortcode = alphabet[remainder] + shortcode
    return shortcode

with open('known_posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

found_shortcodes = set()

for p in posts:
    found_shortcodes.add(p['shortcode'])
    for img in p.get('all_images', []):
        m = re.search(r'ig_cache_key=([^&]+)', img)
        if m:
            raw_key = unquote(m.group(1))
            # If it has . or _
            parts = raw_key.split('.')
            b64_part = parts[0]
            try:
                # Add padding if needed
                b64_part += '=' * (-len(b64_part) % 4)
                decoded = base64.b64decode(b64_part).decode()
                # If decoded is a numeric string (or has suffix)
                num = re.match(r'^\d+', decoded)
                if num:
                    sc = id_to_shortcode(int(num.group(0)))
                    found_shortcodes.add(sc)
                    print(f"Found shortcode: {sc} from {decoded}")
            except Exception as e:
                pass

print("All shortcodes discovered:", found_shortcodes)
