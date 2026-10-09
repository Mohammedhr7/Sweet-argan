import re
with open('../../work/build_storefront.py', 'r', encoding='utf-8') as f:
    text = f.read()

print("Length:", len(text))
for match in re.finditer(r'instagram\.com[^\s\'"]+', text):
    print("IG URL in build_storefront:", match.group(0))

# Search for product names or mock data
for match in re.finditer(r'(crème|huile|savon|serum|deodorant|pack)[^\n,"]*', text, re.IGNORECASE):
    print("Product mention:", match.group(0)[:80])
