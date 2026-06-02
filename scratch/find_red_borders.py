import os
from PIL import Image

assets_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/assets"
path = os.path.join(assets_dir, "europe_814.jpg")

img = Image.open(path)
w, h = img.size

# Let's sample colors along the horizontal center line or average columns
# to see where the red border ends. Red has high R compared to G and B.
for x in range(0, w, 10):
    # Sample a few points in column x
    r_sum, g_sum, b_sum = 0, 0, 0
    samples = 10
    for y in range(h // 4, 3 * h // 4, h // 20):
        r, g, b = img.getpixel((x, y))
        r_sum += r
        g_sum += g
        b_sum += b
    r_avg = r_sum / samples
    g_avg = g_sum / samples
    b_avg = b_sum / samples
    # If r is high and g, b are low, it's likely red
    ratio = r_avg / (max(g_avg, b_avg, 1))
    print(f"x={x:4d}: R={r_avg:5.1f}, G={g_avg:5.1f}, B={b_avg:5.1f}, ratio={ratio:5.2f}")
