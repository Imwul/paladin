import re
import json

def parse_cultures():
    with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/ch17_complete_pages.txt", "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Define the cultures and their starting line prefixes/exact matches in raw text
    # We will find the line indices for each culture
    cultures_meta = [
        {"key": "basques", "name": "Basques", "start_idx": -1},
        {"key": "bretons", "name": "Bretons", "start_idx": -1},
        {"key": "britons", "name": "Britons", "start_idx": -1},
        {"key": "byzantines", "name": "Byzantines", "start_idx": -1},
        {"key": "danes", "name": "Danes", "start_idx": -1},
        {"key": "gascons", "name": "Gascons", "start_idx": -1},
        {"key": "huns", "name": "Huns", "start_idx": -1},
        {"key": "jews", "name": "Jews", "start_idx": -1},
        {"key": "lombards", "name": "Lombards", "start_idx": -1},
        {"key": "moors", "name": "Moors and Saracens", "start_idx": -1},
        {"key": "persians", "name": "Persians", "start_idx": -1},
        {"key": "romans", "name": "Romans", "start_idx": -1},
        {"key": "saxons", "name": "Saxons and Frisians", "start_idx": -1},
        {"key": "slavs", "name": "Slavs", "start_idx": -1},
        {"key": "visigoths", "name": "Visigoths", "start_idx": -1}
    ]

    # Find the starting line index of each culture
    # To prevent false positives, we check if the line is exactly the name
    for i, line in enumerate(lines):
        cleaned = line.strip()
        for c in cultures_meta:
            if cleaned == c["name"]:
                # If it's Bretons or Byzantines or Danes, it might appear multiple times as running header
                # We want the first occurrence which is followed by "Names" or "Pronunciation Note"
                if c["start_idx"] == -1:
                    c["start_idx"] = i

    # Verify indices
    for c in cultures_meta:
        print(f"Culture: {c['key']} ({c['name']}) -> Line {c['start_idx'] + 1}")

    # Section headers we care about
    target_headers = {
        "Appearance": "appearanceEN",
        "Character": "characterEN",
        "Skills": "skillsEN",
        "Relations with the Franks": "relationsEN",
        "Relations": "relationsEN",
        "Daily Life and Economy": "dailyLifeEN",
        "Daily Life": "dailyLifeEN",
        "Warfare": "warfareEN",
        "Standard Equipment": "equipmentEN",
        "Equipment": "equipmentEN",
        "Code of Honor": "codeOfHonorEN",
        "Fortifications": "fortificationsEN"
    }

    # All headers that could demarcate a section
    all_headers = [
        "Names", "Appearance", "Character", "Skills", "Relations with the Franks", "Relations",
        "Chronology", "Territory", "Territory and Nations", "Terrain Types", "Travel",
        "Places of Interest", "Places of Interest (Asturias, Northern Spain)",
        "Society", "Religion", "Daily Life and Economy", "Daily Life", "Warfare", "Armies and Tactics",
        "Standard Equipment", "Equipment", "Code of Honor", "Fortifications"
    ]

    extracted_data = {}

    for idx, c in enumerate(cultures_meta):
        start = c["start_idx"]
        end = cultures_meta[idx+1]["start_idx"] if idx + 1 < len(cultures_meta) else len(lines)
        
        culture_lines = lines[start:end]
        
        # Now find where each section header occurs in these lines
        header_occurrences = []
        for i, line in enumerate(culture_lines):
            cleaned = line.strip()
            # Clean punctuation from header match if any
            if cleaned in all_headers:
                header_occurrences.append((cleaned, i))
        
        # Sort occurrences by line number inside the culture block
        header_occurrences.sort(key=lambda x: x[1])
        
        culture_data = {
            "appearanceEN": "",
            "characterEN": "",
            "skillsEN": "",
            "relationsEN": "",
            "dailyLifeEN": "",
            "warfareEN": "",
            "equipmentEN": "",
            "codeOfHonorEN": "",
            "fortificationsEN": ""
        }
        
        # For each occurrence, get the text until the next header
        for j, (h_name, h_line) in enumerate(header_occurrences):
            next_h_line = header_occurrences[j+1][1] if j + 1 < len(header_occurrences) else len(culture_lines)
            
            # Extract content lines
            content_lines = culture_lines[h_line + 1 : next_h_line]
            
            # Clean content lines
            cleaned_content = []
            for cl in content_lines:
                cl_strip = cl.strip()
                # Skip page dividers and page numbers and running headers
                if cl_strip.startswith("====="):
                    continue
                if re.match(r'^\d+$', cl_strip):
                    continue
                if cl_strip == "Chapter Seventeen: Foreign Cultures" or cl_strip == "Chapter Seventeen:  " or cl_strip == "Foreign Cultures":
                    continue
                if cl_strip == c["name"]:
                    continue
                cleaned_content.append(cl)
            
            # Join and format the text
            text = " ".join([l.strip() for l in cleaned_content if l.strip()])
            
            # Clean double spaces, page numbers, hyphens
            # E.g. "ambas - sadors" -> "ambassadors", "con - vey" -> "convey"
            # Note: let's clean hyphens like "inde- pendence" or "rep- utation" or "equip - ment"
            # Replace ' - ' or '- ' or ' -' with just the letters joined
            text = re.sub(r'(\w+)\s*-\s*(\w+)', r'\1\2', text)
            # Sometimes single hyphens at line breaks are just word - word
            text = re.sub(r'\s+', ' ', text)
            
            # Map header to field name
            if h_name in target_headers:
                field_name = target_headers[h_name]
                # If relations or dailyLife has multiple parts or has already been populated (e.g. "Daily Life" vs "Daily Life and Economy")
                if culture_data[field_name]:
                    culture_data[field_name] += " " + text
                else:
                    culture_data[field_name] = text
        
        extracted_data[c["key"]] = culture_data

    # Print out results to verify
    for key, cdata in extracted_data.items():
        print(f"\n==================== {key.upper()} ====================")
        for f, val in cdata.items():
            print(f"{f}: {val[:80]}...")

    # Write output to json
    with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/parsed_cultures.json", "w", encoding="utf-8") as out:
        json.dump(extracted_data, out, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    parse_cultures()
