import json
import re

# Load parsed cultures from JSON
with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/parsed_cultures.json", "r", encoding="utf-8") as f:
    parsed_cultures = json.load(f)

# Custom translations for missing sections and legendary lands
custom_fields = {
    "gascons": {
        "fortificationsEN": "The Gascons adopt Frankish-style motte-and-bailey castles and erect wooden watchtowers at key points to defend their border frontiers."
    },
    "jews": {
        "equipmentEN": "Unarmed: Silk robes, religious scriptures, and boxes of ancient scholarly texts.",
        "codeOfHonorEN": "Strictly adhere to the Mosaic Law of the Bible and the Ten Commandments, holding peaceful compromise and contracts (Honest) as sacred duties.",
        "fortificationsEN": "They build no fortifications of their own, but are protected under the public city walls provided by the royal magistrates and defending Frankish lords."
    },
    "romans": {
        "dailyLifeEN": "Of Roman origin, the rich papal cities are walled and often have paved streets, bathhouses, and various Roman monuments. Apart from the traditional economic functions of a great city, the most important source of income is the Church. The tithe brings in good money, as do the gifts of pilgrims and ambassadors seeking the favor of the Roman pontiff. In addition, the numerous cathedrals and abandoned tombs draw a lot of relic collectors from all over the West, and some unscrupulous Romans make a substantial living out of the relic trade.",
        "fortificationsEN": "Rome is protected by impressive double walls and ancient stone guard towers. In times of extreme danger, the Pope and Roman citizens retreat to ancient fortified stone structures and brick monuments within the Eternal City."
    },
    "legendary": {
        "appearanceEN": "Mysterious figures from far-off lands of Cathay in the East and Ethiopia in the South. They wear garments of gold and silk, and carry exotic magical treasures and jewelry.",
        "characterEN": "These travelers from unknown realms are fabulously rich and possess strange mystical abilities. In Cathay, they have so much gold that it is worthless to them. The Ethiopians are devout Christians who are deeply loyal to their king, Senapo.",
        "skillsEN": "The people of these lands are well-versed in magic, illusions, and unique healing arts, and speak exotic foreign languages.",
        "relationsEN": "The Ethiopians are allies of the Franks against the Saracens. Charlemagne helps them by sending grain, wine, and oil. The British knight, Astolf, visits Ethiopia during his travels in 776. Cathay's powerful magician sends his beautiful daughter and son to Charlemagne's court in 775.",
        "dailyLifeEN": "Ethiopia is described as a Christian island surrounded by pagans, ruled by Senapo, thought by some to be the legendary Prester John. The capital of Cathay is the fabled, wondrous city of Albracca, ruled by a powerful magician, where wealth and magic flourish.",
        "warfareEN": "They rely on magic, unique tactics, and legendary creatures such as the Hippogriff, or standard eastern mercenaries, to overwhelm their enemies.",
        "equipmentEN": "Nobles: Golden silk plate garments (15 points armor), magical gem rings, invisible silk mist veils.\\nNomads: Mystical eastern scimitars, runic magic horns.",
        "codeOfHonorEN": "They are noble and honorable figures who, though unfamiliar with Frankish chivalry, possess a deep spiritual sense of honor; some may choose to receive baptism and join the Paladins.",
        "fortificationsEN": "They possess mystical levitating castles, magical abbeys, and ancient cities shielded from intruders by magic and illusion."
    }
}

# Load original lore.js
with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/data/lore.js", "r", encoding="utf-8") as f:
    lore_content = f.read()

# Parse the cultures array
match = re.search(r'export const cultures = (\[.*?\]);', lore_content, re.DOTALL)
if not match:
    raise ValueError("Could not find cultures array in lore.js")

cultures_str = match.group(1)
cultures = json.loads(cultures_str)

# Update each culture
keys_to_update = [
    "appearanceEN", "characterEN", "skillsEN", "relationsEN",
    "dailyLifeEN", "warfareEN", "equipmentEN", "codeOfHonorEN", "fortificationsEN"
]

for c in cultures:
    key = c["key"]
    # Get parsed values
    parsed = parsed_cultures.get(key, {})
    
    # Update standard fields
    for field in keys_to_update:
        if field in parsed and parsed[field]:
            c[field] = parsed[field]
        else:
            c[field] = ""
            
    # Apply custom overrides/additions
    if key in custom_fields:
        for field, value in custom_fields[key].items():
            c[field] = value

# Serialize back with perfect indentation and spacing
# The original formatting uses two spaces for array items, and four spaces for object contents
new_cultures_str = json.dumps(cultures, ensure_ascii=False, indent=2)

# Indent the dumped JSON string by 2 spaces to match the file structure
indented_lines = []
for line in new_cultures_str.split("\n"):
    if line.strip() == "[" or line.strip() == "]":
        indented_lines.append(line)
    else:
        # Match indentation of original lore.js
        indented_lines.append(line)

new_cultures_str = "\n".join(indented_lines)

# Replace in content
updated_lore_content = lore_content.replace(match.group(1), new_cultures_str)

# Save the updated lore.js
with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/data/lore.js", "w", encoding="utf-8") as f:
    f.write(updated_lore_content)

print("Successfully merged English culture fields into src/data/lore.js!")
