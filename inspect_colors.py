from PIL import Image, ImageFilter, ImageOps, ImageDraw
import glob
import os

brain_dir = r"C:\Users\mohap\.gemini\antigravity\brain\90147712-5ffb-4fe5-8352-c7cb3a909a70"

# Check corner colors of generated images
sample_files = glob.glob(os.path.join(brain_dir, "*.jpg"))
for f in sample_files[:3]:
    im = Image.open(f)
    corner = im.getpixel((10, 10))
    print(os.path.basename(f), "corner color:", corner)
