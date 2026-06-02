import re

with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/ch17_complete_pages.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

culture_names = [
    "Basques", "Bretons", "Britons", "Byzantines", "Danes",
    "Gascons", "Huns", "Jews", "Lombards", "Moors",
    "Persians", "Romans", "Saxons", "Slavs", "Visigoths", "Legendary"
]

print("Scanning for culture headings...")
for i, line in enumerate(lines):
    cleaned = line.strip()
    # Check if the line is exactly one of the culture names or close to it
    for name in culture_names:
        if cleaned == name or (name in cleaned and len(cleaned) < len(name) + 5):
            print(f"Line {i+1}: {cleaned} (Target: {name})")
            # Print next 5 lines
            for j in range(1, 6):
                if i + j < len(lines):
                    print(f"  + {lines[i+j].strip()}")
