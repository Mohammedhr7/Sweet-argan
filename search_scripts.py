import json
import glob

def find_keys(obj, target_keys, path=""):
    results = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            current_path = f"{path}.{k}" if path else k
            if any(t.lower() in k.lower() for t in target_keys):
                results.append((current_path, v))
            results.extend(find_keys(v, target_keys, current_path))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            results.extend(find_keys(item, target_keys, f"{path}[{i}]"))
    return results

for f in sorted(glob.glob("script_*.json")):
    with open(f, "r", encoding="utf-8") as fp:
        data = json.load(fp)
    res = find_keys(data, ["caption", "post", "media", "product", "edge", "title", "text", "shortcode", "uri", "image"])
    print(f"File {f}: found {len(res)} matches")
    for p, v in res[:15]:
        v_str = str(v)
        if len(v_str) > 120:
            v_str = v_str[:120] + "..."
        print(f"  {p}: {v_str}")
