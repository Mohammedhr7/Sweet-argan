import re
import json

with open('instagram_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Search for any occurrences of "sweet_argan" or arabic or products
print("Occurrences of sweet_argan:", len(re.findall(r'sweet_argan', html, re.IGNORECASE)))
print("Occurrences of cdninstagram:", len(re.findall(r'cdninstagram', html, re.IGNORECASE)))
print("Occurrences of display_url:", len(re.findall(r'display_url', html, re.IGNORECASE)))

# Print lines mentioning sweet_argan
for line in html.splitlines():
    if 'sweet_argan' in line.lower() or 'coopérative' in line.lower():
        print("MATCH:", line[:200])
