import re
import json

def clean_text(text):
    # Remove page dividers
    text = re.sub(r'=+ PAGE \d+ =+', '', text)
    text = re.sub(r'=================', '', text)
    
    # Split into lines to clean running headers and page numbers
    lines = text.split('\n')
    cleaned_lines = []
    
    running_headers = [
        "Chapter Seventeen: Foreign Cultures",
        "Chapter Seventeen: Foreign Cultures",
        "Chapter Seventeen:",
        "Foreign Cultures",
        "Basques", "Bretons", "Britons", "Byzantines", "Danes",
        "Gascons", "Huns", "Jews", "Lombards", "Moors and Saracens",
        "Persians", "Romans", "Saxons and Frisians", "Slavs", "Visigoths"
    ]
    
    for line in lines:
        stripped = line.strip()
        # Skip empty lines at beginning of processing
        if not stripped:
            cleaned_lines.append("")
            continue
        
        # Skip page numbers (lines consisting only of digits)
        if re.match(r'^\d+$', stripped):
            continue
            
        # Skip running headers
        if stripped in running_headers:
            continue
            
        # Also clean some common broken running headers
        if "Chapter Seventeen" in stripped:
            continue
            
        cleaned_lines.append(line)
        
    return '\n'.join(cleaned_lines)

# Read raw file
with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/ch17_complete_pages.txt", "r", encoding="utf-8") as f:
    raw_content = f.read()

cleaned_content = clean_text(raw_content)

# We can find the start index of each culture
cultures_list = [
    ("basques", "Basques", 34),
    ("bretons", "Bretons", 156),
    ("britons", "Britons", 313),
    ("byzantines", "Byzantines", 435),
    ("danes", "Danes", 645),
    ("gascons", "Gascons", 842),
    ("huns", "Huns", 954),
    ("jews", "Jews", 1197),
    ("lombards", "Lombards", 1296),
    ("moors", "Moors and Saracens", 1516),
    ("persians", "Persians", 1985),
    ("romans", "Romans", 2208),
    ("saxons", "Saxons and Frisians", 2322),
    ("slavs", "Slavs", 2597),
    ("visigoths", "Visigoths", 2754)
]

# Let's map headers to their respective keys
headers_map = {
    "Appearance": "appearanceEN",
    "Character": "characterEN",
    "Skills": "skillsEN",
    "Relations with the Franks": "relationsEN",
    "Daily Life and Economy": "dailyLifeEN",
    "Daily Life": "dailyLifeEN",
    "Warfare": "warfareEN",
    "Standard Equipment": "equipmentEN",
    "Equipment": "equipmentEN",
    "Code of Honor": "codeOfHonorEN",
    "Fortifications": "fortificationsEN"
}

# Let's do a sequential extraction
# First let's split the text into chunks for each culture
chunks = []
for i in range(len(cultures_list)):
    curr_key, curr_name, _ = cultures_list[i]
    start_pat = rf"\n{curr_name}\n"
    # Special regex for finding start of culture sections
    # Wait, let's just find the names in the cleaned text
    # Let's search sequentially
    pass

print("Successfully created test file framework.")
