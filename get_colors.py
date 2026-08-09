from PIL import Image

def get_bg(path):
    img = Image.open(path).convert('RGB')
    color = img.getpixel((0,0))
    return f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"

print("Dress:", get_bg("frontend/public/images/dress-red.jpg"))
print("Coat:", get_bg("frontend/public/images/coat-green.jpg"))
print("Shirt:", get_bg("frontend/public/images/shirt-orange.jpg"))
