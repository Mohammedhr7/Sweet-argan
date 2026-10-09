from PIL import Image, ImageDraw, ImageFilter

def paste_feathered(canvas, im, pos, feather=40):
    w, h = im.size
    # Create mask with smooth feather at borders
    mask = Image.new("L", (w, h), 255)
    draw = ImageDraw.Draw(mask)
    for i in range(feather):
        alpha = int(255 * (i / feather))
        draw.rectangle([i, i, w - 1 - i, h - 1 - i], outline=alpha)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=feather // 3))
    canvas.paste(im, pos, mask)

# Test with soins-du-visage
c1 = Image.open(r"C:\Users\mohap\Documents\Codex\2026-10-02\create-the-initial-folder-architecture-for\outputs\ecommerce-project\final_visuals\products\creme-argan.jpg")
# sample color from creme-argan
bg_col = c1.getpixel((10, 10))
test_canvas = Image.new("RGB", (960, 600), bg_col)
c1_r = c1.resize((400, 533), Image.Resampling.LANCZOS)
paste_feathered(test_canvas, c1_r, (280, 33), feather=45)
test_canvas.save("test_feather.jpg")
print("Saved test_feather.jpg")
