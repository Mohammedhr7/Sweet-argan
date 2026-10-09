import sys
import re
from html import unescape

sys.stdout.reconfigure(encoding='utf-8')

with open('embed_test.html', 'r', encoding='utf-8') as f:
    html = f.read()

caption = re.search(r'class="Caption"[^>]*>(.*?)</div>', html, re.DOTALL)
if caption:
    text = re.sub(r'<[^>]+>', ' ', caption.group(1))
    print("CAPTION TEXT:\n", unescape(text.strip()))

imgs = re.findall(r'class="EmbeddedMediaImage"[^>]*src="([^"]+)"', html)
print("IMAGES:", imgs)

# All img tags
all_imgs = re.findall(r'<img[^>]*src="([^"]+)"[^>]*>', html)
print("ALL IMGS:", all_imgs[:5])
