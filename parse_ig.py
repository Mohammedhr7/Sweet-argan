import re
import json

with open('instagram_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
s32 = scripts[32]

with open('script32.txt', 'w', encoding='utf-8') as f:
    f.write(s32)

print('Written script32.txt, length:', len(s32))

shortcodes = set(re.findall(r'"shortcode":"([^"]+)"', s32))
print('Shortcodes found in s32:', shortcodes)

codes = set(re.findall(r'"code":"([^"]+)"', s32))
print('Codes found in s32:', codes)

# Search across all scripts
all_codes = set(re.findall(r'"code":"([^"]+)"', html))
print('All codes in html:', len(all_codes), all_codes)

all_shortcodes = set(re.findall(r'"shortcode":"([^"]+)"', html))
print('All shortcodes in html:', len(all_shortcodes), all_shortcodes)
