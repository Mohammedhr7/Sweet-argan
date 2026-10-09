import re

with open('embed_test.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Search for instagram urls or shortcodes in the embed HTML
links = re.findall(r'href="([^"]+)"', html)
for l in set(links):
    if '/p/' in l or '/reel/' in l:
        print("Post link:", l)

# Search for shortcodes in text
codes = re.findall(r'/p/([A-Za-z0-9_-]+)/', html)
print("P codes:", set(codes))
reel_codes = re.findall(r'/reel/([A-Za-z0-9_-]+)/', html)
print("Reel codes:", set(reel_codes))
