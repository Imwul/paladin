with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/ch17_complete_pages.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

search_words = ["Moor", "Saxon", "Legendary"]
for i, line in enumerate(lines):
    cleaned = line.strip()
    for word in search_words:
        if word in cleaned and len(cleaned) < 30:
            print(f"Line {i+1}: '{cleaned}'")
