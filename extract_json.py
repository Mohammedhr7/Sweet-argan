import re
import json

with open('instagram_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's find all json scripts
scripts = re.findall(r'<script type="application/json"[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"Found {len(scripts)} json scripts")

for i, s in enumerate(scripts):
    if 'cdninstagram' in s:
        print(f"Script {i} has cdninstagram, length: {len(s)}")
        # Try to see what keys exist
        try:
            data = json.loads(s)
            print(f"Script {i} parsed as JSON!")
            with open(f"script_{i}.json", "w", encoding="utf-8") as out:
                json.dump(data, out, indent=2)
        except Exception as e:
            print(f"Script {i} json error: {e}")
            with open(f"script_{i}.raw", "w", encoding="utf-8") as out:
                out.write(s)
