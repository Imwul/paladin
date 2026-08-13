#!/usr/bin/env python3
"""Build the private v1.1 rulebook reference data from the owned source PDF."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "paladin_core_rulebook.pdf"
OUTPUT_DIR = ROOT / "src" / "features" / "rulebook" / "data"
CHAPTER_DIR = OUTPUT_DIR / "chapters"

CHAPTERS = [
    {"id": "front", "number": "Front", "title": "Front Matter and Indexes", "start": 1, "end": 13, "runtimeView": "rulebook"},
    {"id": "introduction", "number": "Intro", "title": "Introduction", "start": 14, "end": 24, "runtimeView": "dashboard"},
    {"id": "chapter-1", "number": "1", "title": "Character Creation", "start": 25, "end": 44, "runtimeView": "character"},
    {"id": "chapter-2", "number": "2", "title": "The Past", "start": 45, "end": 64, "runtimeView": "family"},
    {"id": "chapter-3", "number": "3", "title": "Personality: Traits and Passions", "start": 65, "end": 82, "runtimeView": "personality"},
    {"id": "chapter-4", "number": "4", "title": "Reputation: Glory and Standing", "start": 83, "end": 94, "runtimeView": "glory"},
    {"id": "chapter-5", "number": "5", "title": "Skills", "start": 95, "end": 106, "runtimeView": "character"},
    {"id": "chapter-6", "number": "6", "title": "General Mechanics", "start": 107, "end": 114, "runtimeView": "procedures"},
    {"id": "chapter-7", "number": "7", "title": "Combat", "start": 115, "end": 136, "runtimeView": "combat"},
    {"id": "chapter-8", "number": "8", "title": "Mass Combat", "start": 137, "end": 162, "runtimeView": "battle"},
    {"id": "chapter-9", "number": "9", "title": "Magic", "start": 163, "end": 172, "runtimeView": "personality"},
    {"id": "chapter-10", "number": "10", "title": "The Winter Phase", "start": 173, "end": 182, "runtimeView": "winter"},
    {"id": "chapter-11", "number": "11", "title": "Ambitions and Ideals", "start": 183, "end": 192, "runtimeView": "procedures"},
    {"id": "chapter-12", "number": "12", "title": "Wealth and Treasure", "start": 193, "end": 212, "runtimeView": "economy"},
    {"id": "chapter-13", "number": "13", "title": "Frankish Society", "start": 213, "end": 260, "runtimeView": "reference"},
    {"id": "chapter-14", "number": "14", "title": "Frankland", "start": 261, "end": 284, "runtimeView": "reference"},
    {"id": "chapter-15", "number": "15", "title": "The Future", "start": 285, "end": 320, "runtimeView": "chronicle"},
    {"id": "chapter-16", "number": "16", "title": "Non-Player Characters", "start": 321, "end": 340, "runtimeView": "reference"},
    {"id": "chapter-17", "number": "17", "title": "Foreign Cultures", "start": 341, "end": 372, "runtimeView": "reference"},
    {"id": "chapter-18", "number": "18", "title": "Opponents and Creatures", "start": 373, "end": 390, "runtimeView": "combat"},
    {"id": "chapter-19", "number": "19", "title": "Adventures", "start": 391, "end": 438, "runtimeView": "adventure"},
    {"id": "appendices", "number": "App.", "title": "Appendices and Character Sheets", "start": 439, "end": 462, "runtimeView": "reference"},
]

AMBIGUITIES = [
    {"id": "AMB-01", "page": 30, "label": "Female Son Number and order wording", "handling": "Expose the printed wording; do not infer a replacement order."},
    {"id": "AMB-02", "page": 42, "label": "Inheritance edge wording", "handling": "Preserve the source text and require the existing lifecycle choice."},
    {"id": "AMB-03", "page": 80, "label": "Melancholy duration wording", "handling": "Keep recovery timing explicit instead of inventing a timer."},
    {"id": "AMB-04", "page": 311, "label": "Phase Four 801-813 / 801-814 framing", "handling": "Display both source framings; runtime chronology keeps its certified boundary."},
    {"id": "AMB-05", "page": 368, "label": "Generic Slav Pony", "handling": "Leave the mount specification as a source ambiguity."},
    {"id": "AMB-06", "page": 386, "label": "Hippogriff Hoofs versus claw/bite", "handling": "Show the conflict; retain the certified Chapter 18 adapter."},
    {"id": "AMB-07", "page": 413, "label": "Table 19-7 prose/table count", "handling": "Present the source table and prose together."},
    {"id": "AMB-08", "page": 425, "label": "Table 19-11 overlapping result 4", "handling": "Expose the overlap and require player/GM selection."},
    {"id": "AMB-09", "page": 432, "label": "Table 19-24 malformed amount", "handling": "Display the printed amount without correction."},
]

NUMBERED_TABLES = {
    "1": [
        ("1-1", "Family Characteristics, Male", 27), ("1-2", "Family Characteristics, Female", 27),
        ("1-3", "Family Patron Saints", 27), ("1-4", "Father's Class", 29),
        ("1-5", "Lord or Officer Father", 30), ("1-6", "Father's Survival", 30),
        ("1-7", "Page Training", 30), ("1-8", "Base Attributes", 31),
        ("1-9", "Distinctive Features", 32), ("1-10", "Passions Base Value", 33),
        ("1-11", "Standings Base Value", 33), ("1-12", "Frankish Base Skills, Men", 34),
        ("1-13", "Frankish Base Skills, Women", 34), ("1-14", "Starting Outfits", 38),
        ("1-15", "Frankish Birth Gifts", 39), ("1-16", "Salvation Score", 41),
        ("1-17", "Frankish Blessing", 42),
    ],
    "2": [("2-1", "Ordinary Year Events", 46), ("2-2", "Combat Survival", 46), ("2-3", "Miscellaneous Death Causes", 46)],
    "3": [("3-1", "Standard Trait Results", 70), ("3-2", "Dishonorable Acts", 74), ("3-3", "Amor Modifiers", 76), ("3-4", "Standard Passion Results", 78)],
    "4": [("4-1", "Glory Ranking", 84), ("4-2", "Basic Glory Awards", 85), ("4-3", "Sample Glory", 85), ("4-4", "Human Opponents", 87)],
    "5": [("5-1", "Skill Levels", 95)],
    "6": [("6-1", "Standard Modifiers", 108), ("6-2", "Travel Distances (in miles per day)", 111)],
    "7": [("7-1", "Encumbrance", 119), ("7-2", "Combat Modifiers Summary", 122), ("7-3", "First Aid Roll Results", 132), ("7-4", "Chirurgery Results", 132), ("7-5", "Health", 133)],
    "8": [
        ("8-1", "Commander's Battle Roll Results", 138), ("8-2", "Non-Player Followers' Fates", 138),
        ("8-3", "Mounted vs. Mounted, Mounted vs. Foot, or Foot vs. Foot", 145), ("8-4", "Foot vs. Mounted", 145),
        ("8-5", "Battle Special Events", 145), ("8-6", "Rally", 146), ("8-7", "Flee", 146),
        ("8-8", "Followers' Fates", 147), ("8-9", "Victory", 148), ("8-10", "Battle Results", 148),
        ("8-11", "Siege Health", 158), ("8-12", "Siege Assault Results", 158), ("8-13", "Blockade", 159),
        ("8-14", "Treachery", 159), ("8-15", "Defender Morale Effects", 160), ("8-16", "Attacker Morale Effects", 160),
    ],
    "9": [("9-1", "Prayer Modifiers", 166), ("9-2", "Prayer Results", 166)],
    "10": [
        ("10-1", "Aging", 174), ("10-2", "Attributes Lost", 174), ("10-3", "Harvest", 174),
        ("10-4", "Stewardship Modifiers", 175), ("10-5", "Economic Maintenance Effects", 175),
        ("10-6", "NPC and Horse Survival Age Modifier", 176), ("10-7", "NPC Survival", 176),
        ("10-8", "Mount Survival", 176), ("10-9", "Personal Events", 177),
        ("10-10", "Random Marriage for Vassal Knights", 179), ("10-11", "Childbirth", 179),
        ("10-12", "Family Events", 180), ("10-13", "Family Member", 181),
    ],
    "12": [("12-1", "Heribannum", 196)],
    "15": [("15-1", "Military Synopsis", 286)],
    "17": [("17-1", "Foreign Culture Attributes", 371)],
    "18": [("18-1", "Normal Horses in Combat", 378)],
    "19": [
        ("19-1", "Mountain Dangers", 401), ("19-2", "Rumors", 403),
        ("19-3", "Random Battle Enemy", 404), ("19-4", "Random Battle Enemy", 405),
        ("19-5", "Battle of Mount Bitter Events", 406), ("19-6", "Faerie Skill Test", 412),
        ("19-7", "Faerie Temptation", 413), ("19-8", "Hunting Terrain Modifiers", 425),
        ("19-9", "Hunt Versus Avoidance Results", 425), ("19-10", "Hunting Obstacles", 425),
        ("19-11", "Prey", 425), ("19-12", "Weapon Versus Avoidance Results", 426),
        ("19-13", "Challenge Encounters (number of opponents per month)", 427), ("19-14", "Quality of Knight", 427),
        ("19-15", "Feuding Enemies", 428), ("19-16", "Lost in the Woods Encounters", 429),
        ("19-17", "Manor Encounters", 430), ("19-18", "Holy Lands Travel Events", 430),
        ("19-19", "Holy Lands Events", 430), ("19-20", "Mad Acts", 431),
        ("19-21", "Character Changes", 431), ("19-22", "Nobleman's Complaints", 431),
        ("19-23", "Oath-Givers", 432), ("19-24", "Offered Bribes", 432),
        ("19-25", "Missi Dominici Conclusions", 433), ("19-26", "Pilgrimage Encounters", 433),
        ("19-27", "Amor Modifiers", 433), ("19-28", "Lover's Tasks", 434),
        ("19-29", "Sample Discovery Factors", 435), ("19-30", "Exposure Results", 435),
        ("19-31", "Tournament Glory", 436), ("19-32", "Tournament Jousting Opponents", 436),
        ("19-33", "Tournament Melee Opponents", 437), ("19-34", "Knight Home Service", 437),
        ("19-35", "Common Court Participants", 438), ("19-36", "Disputes", 438),
    ],
}

ANCESTOR_TABLES = [
    *[(f"ancestor-grandfather-{year}", f"Grandfather Events Table ({year})", page) for year, page in [
        (723, 48), (725, 48), (728, 48), (729, 49), (731, 49), (732, 50), (735, 51),
        (736, 52), (737, 52), (738, 52), (739, 53), (740, 53), (741, 53), (742, 54),
        (743, 54), (744, 55),
    ]],
    ("ancestor-poitiers", "Battle of Poitiers Events Table", 50),
    *[(f"ancestor-father-{year}", f"Father Events Table ({year})", page) for year, page in [
        (745, 55), (746, 55), (747, 56), (749, 56), (750, 56), (751, 57), (753, 58),
        (754, 58), (756, 59), (757, 59), (758, 59), (760, 60), (761, 60), (762, 60),
        (763, 61), (764, 61), (765, 62), (766, 62),
    ]],
]

UNNUMBERED_TABLES = [
    ("glory-additional", "Additional Glory", 87), ("glory-battle-round", "Battle Glory per Round", 89),
    ("glory-tournament", "Tournament Glory", 89), ("battle-pamplona", "Example Battle of Pamplona", 141),
    ("battle-situation", "Situation Modifiers", 142), ("battle-tactics", "Tactics Modifier", 142),
    ("market-mounts", "Mounts", 199), ("market-farming-animals", "Farming Animals", 200),
    ("market-hunting-animals", "Hunting Animals", 200), ("market-armor", "Armor", 200),
    ("market-horse-armor", "Horse Armor", 201), ("market-melee-weapons", "Melee Weapons", 201),
    ("market-missile-weapons", "Missile Weapons", 201), ("market-clothing", "Clothing", 202),
    ("market-jewelry", "Jewelry", 202), ("market-cities-courts", "Cities and Courts", 202),
    ("market-monastery", "Monastery", 202), ("paladin-roster", "Roster of Paladins", 326),
    ("magical-powder", "Magical Powder Effects", 416),
    ("hunt-special-encounters", "Special Encounters", 425),
    ("challenge-special-encounters", "Special Encounters", 428),
]

SOURCE_TABLE_INDEX = [
    *[(table_id, f"Table {table_id}: {title}", page) for entries in NUMBERED_TABLES.values() for table_id, title, page in entries],
    *ANCESTOR_TABLES,
    *UNNUMBERED_TABLES,
]

TABLES_BY_PAGE = {}
for source_table_id, source_table_title, source_table_page in SOURCE_TABLE_INDEX:
    TABLES_BY_PAGE.setdefault(source_table_page, []).append({"id": source_table_id, "title": source_table_title})


def chapter_for_printed_page(page_number: int) -> dict:
    for chapter in CHAPTERS:
        if chapter["start"] <= page_number <= chapter["end"]:
            return chapter
    return CHAPTERS[0] if page_number < 14 else CHAPTERS[-1]


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    value = value.replace("\u0000", "").replace("\xad", "")
    value = re.sub(r"-\n(?=[a-z])", "", value)
    value = re.sub(r"[ \t]+\n", "\n", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def join_heading_words(words: list[dict]) -> str:
    ordered = sorted(words, key=lambda word: word["x0"])
    text = " ".join(word["text"] for word in ordered)
    return re.sub(r"\s+", " ", text).strip(" .")


def extract_headings(page) -> list[str]:
    words = page.extract_words(extra_attrs=["size", "fontname"])
    candidates = [
        word for word in words
        if "Cimbrian" in word.get("fontname", "")
        and float(word.get("size", 0)) >= 18
        and 45 < float(word.get("top", 0)) < page.height - 35
    ]
    lines: list[list[dict]] = []
    for word in sorted(candidates, key=lambda item: (round(item["top"] / 3), item["x0"])):
        match = next((line for line in lines if abs(line[0]["top"] - word["top"]) <= 3), None)
        if match is None:
            lines.append([word])
        else:
            match.append(word)
    headings = []
    for line in lines:
        value = join_heading_words(line)
        if value and value not in headings and not value.isdigit():
            headings.append(value)
    return headings


def extract_table_titles_from_page(page) -> list[str]:
    words = page.extract_words(extra_attrs=["size", "fontname"])
    rows: list[list[dict]] = []
    for word in sorted(words, key=lambda item: (round(item["top"] / 3), item["x0"])):
        match = next((row for row in rows if abs(row[0]["top"] - word["top"]) <= 3), None)
        if match is None:
            rows.append([word])
        else:
            match.append(word)
    titles = []
    for row in rows:
        if not any("Charlemagne" in word.get("fontname", "") for word in row):
            continue
        value = join_heading_words(row)
        normalized = re.sub(r"^t\s+able", "Table", value, flags=re.IGNORECASE)
        normalized = re.sub(r"\s+", " ", normalized)
        if re.search(r"\bTable\s+\d+[–-]\d+", normalized, re.IGNORECASE):
            titles.append(normalized)
    return list(dict.fromkeys(titles))


def strip_running_matter(value: str, printed_page: int) -> str:
    lines = [line.rstrip() for line in value.splitlines()]
    filtered = []
    for line in lines:
        compact = re.sub(r"\s+", " ", line).strip()
        if compact == str(printed_page):
            continue
        if compact in {"Paladin: Warriors of Charlemagne", "Table of Contents"}:
            continue
        filtered.append(line)
    return clean_text("\n".join(filtered))


def extract_columns(page, printed_page: int) -> tuple[str, str]:
    top = 45
    bottom = page.height - 32
    gutter = 7
    left = page.crop((18, top, page.width / 2 + gutter, bottom)).extract_text(layout=True) or ""
    right = page.crop((page.width / 2 - gutter, top, page.width - 18, bottom)).extract_text(layout=True) or ""
    return strip_running_matter(left, printed_page), strip_running_matter(right, printed_page)


def classify_segment(value: str, chapter: dict) -> str:
    lower = value.lower()
    if re.search(r"\btable\s+\d+[–-]\d+", lower) or lower.startswith("special encounters"):
        return "TABLE"
    if re.search(r"\bexample\b", lower):
        return "EXAMPLE"
    if "gamemaster" in lower or re.search(r"\bthe gm\b", lower):
        return "GM NOTES"
    if re.search(r"\bplayer(?:-knight)?s?\b", lower):
        return "PLAYER NOTES"
    if re.search(r"\bexcept\b|\bexception\b|\bunless\b|\bhowever\b", lower):
        return "EXCEPTIONS"
    if re.search(r"\bprocedure\b|\bphase\b|\bstep\b|\bthen\b|\bfirst\b.+\bnext\b", lower):
        return "PROCEDURE"
    if re.search(r"\bmust\b|\broll\b|\bmodifier\b|\bresult\b|\bsuccess\b|\bfumble\b", lower):
        return "RULE"
    if chapter["id"] in {"chapter-13", "chapter-14", "chapter-15", "chapter-16", "chapter-17", "appendices"}:
        return "CONTEXT"
    return "SOURCE"


def extract_segments(left: str, right: str, chapter: dict) -> list[dict]:
    segments = []
    seen = set()
    for column in (left, right):
        for block in re.split(r"\n\s*\n", column):
            value = clean_text(block)
            normalized = re.sub(r"\s+", " ", value)
            if len(normalized) < 18 or normalized in seen:
                continue
            seen.add(normalized)
            segments.append({"type": classify_segment(normalized, chapter), "text": value})
    return segments


def page_title(chapter: dict, headings: list[str], text: str, printed_page: int) -> str:
    if headings:
        return headings[0]
    first = next((line.strip() for line in text.splitlines() if len(line.strip()) > 2), "")
    return first[:100] or f"{chapter['title']} - p.{printed_page}"


def parse_cross_references(text: str) -> list[dict]:
    references = []
    for match in re.finditer(r"(?:page|pages|p\.|pp\.)\s*(\d{1,3})", text, re.IGNORECASE):
        page = int(match.group(1))
        if 1 <= page <= 462:
            references.append({"type": "page", "page": page, "label": match.group(0)})
    for match in re.finditer(r"Chapter\s+(\d{1,2})", text, re.IGNORECASE):
        number = int(match.group(1))
        if 1 <= number <= 19:
            references.append({"type": "chapter", "chapterId": f"chapter-{number}", "label": match.group(0)})
    unique = []
    seen = set()
    for reference in references:
        key = json.dumps(reference, sort_keys=True)
        if key not in seen:
            seen.add(key)
            unique.append(reference)
    return unique[:24]


def build() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CHAPTER_DIR.mkdir(parents=True, exist_ok=True)

    pages_by_chapter = {chapter["id"]: [] for chapter in CHAPTERS}
    search_pages = []
    detected_tables = []
    section_count = 0
    example_count = 0
    gm_guidance_pages = 0
    procedure_pages = 0
    rule_pages = 0
    segment_counts = {key: 0 for key in ["RULE", "PROCEDURE", "EXCEPTIONS", "TABLE", "EXAMPLE", "GM NOTES", "PLAYER NOTES", "CONTEXT", "SOURCE"]}
    cross_link_count = 0

    with pdfplumber.open(PDF_PATH) as pdf:
        if len(pdf.pages) != 463:
            raise RuntimeError(f"Expected 463 PDF pages, found {len(pdf.pages)}")

        for pdf_index, page in enumerate(pdf.pages, start=1):
            printed_page = max(0, pdf_index - 1)
            chapter = chapter_for_printed_page(printed_page)
            full_text = clean_text(page.extract_text(x_tolerance=2, y_tolerance=3))
            left, right = extract_columns(page, printed_page)
            headings = extract_headings(page)
            detected_table_titles = extract_table_titles_from_page(page)
            indexed_table_titles = [entry["title"] for entry in TABLES_BY_PAGE.get(printed_page, [])]
            tables = indexed_table_titles or detected_table_titles
            title = page_title(chapter, headings, full_text, printed_page)
            segments = extract_segments(left, right, chapter)
            for segment in segments:
                segment_counts[segment["type"]] += 1
            ambiguity = next((item for item in AMBIGUITIES if item["page"] == printed_page), None)
            lower = full_text.lower()
            classifications = []
            if re.search(r"\bmust\b|\broll\b|\bmodifier\b|\bresult\b", lower):
                classifications.append("RULE")
                rule_pages += 1
            if re.search(r"\bprocedure\b|\bphase\b|\bstep\b|\bthen\b", lower):
                classifications.append("PROCEDURE")
                procedure_pages += 1
            if re.search(r"\bexcept\b|\bexception\b|\bunless\b|\bhowever\b", lower):
                classifications.append("EXCEPTIONS")
            if tables:
                classifications.append("TABLE")
            if re.search(r"\bexample\b", lower):
                classifications.append("EXAMPLE")
                example_count += 1
            if "gamemaster" in lower:
                classifications.append("GM NOTES")
                gm_guidance_pages += 1
            if re.search(r"\bplayer\b|\bplayer-knight\b", lower):
                classifications.append("PLAYER NOTES")
            if chapter["id"] in {"chapter-13", "chapter-14", "chapter-15", "chapter-16", "chapter-17", "appendices"}:
                classifications.append("CONTEXT")
            classifications.append("SOURCE")

            cross_references = parse_cross_references(full_text)
            cross_link_count += len(cross_references)
            page_record = {
                "pdfPage": pdf_index,
                "printedPage": printed_page,
                "chapterId": chapter["id"],
                "title": title,
                "headings": headings,
                "tables": tables,
                "classifications": list(dict.fromkeys(classifications)),
                "leftColumn": left,
                "rightColumn": right,
                "fullText": full_text,
                "segments": segments,
                "crossReferences": cross_references,
                "ambiguity": ambiguity,
            }
            pages_by_chapter[chapter["id"]].append(page_record)
            section_count += len(headings)
            search_pages.append({
                "pdfPage": pdf_index,
                "printedPage": printed_page,
                "chapterId": chapter["id"],
                "title": title,
                "headings": headings,
                "tables": tables,
                "classifications": page_record["classifications"],
                "snippet": re.sub(r"\s+", " ", full_text)[:360],
                "searchText": re.sub(r"\s+", " ", full_text).lower(),
            })
            for table_title in detected_table_titles:
                number_match = re.search(r"Table\s+(\d+[–-]\d+)", table_title, re.IGNORECASE)
                detected_tables.append({
                    "id": (number_match.group(1) if number_match else f"p{printed_page}-{len(detected_tables) + 1}").replace("–", "-"),
                    "number": number_match.group(1).replace("–", "-") if number_match else "Source table",
                    "title": table_title,
                    "printedPage": printed_page,
                    "pdfPage": pdf_index,
                    "chapterId": chapter["id"],
                    "runtimeView": chapter["runtimeView"],
                })

    table_entries = []
    for chapter_number, entries in NUMBERED_TABLES.items():
        for table_id, title, printed_page in entries:
            chapter = chapter_for_printed_page(printed_page)
            table_entries.append({
                "id": table_id,
                "number": table_id,
                "title": f"Table {table_id}: {title}",
                "printedPage": printed_page,
                "pdfPage": printed_page + 1,
                "chapterId": chapter["id"],
                "chapterNumber": chapter_number,
                "runtimeView": chapter["runtimeView"],
                "kind": "numbered",
                "sourceVerified": True,
                "runtimeConsumer": chapter["runtimeView"],
            })

    for table_id, title, printed_page in [*ANCESTOR_TABLES, *UNNUMBERED_TABLES]:
        chapter = chapter_for_printed_page(printed_page)
        table_entries.append({
            "id": table_id,
            "number": "Source table",
            "title": title,
            "printedPage": printed_page,
            "pdfPage": printed_page + 1,
            "chapterId": chapter["id"],
            "chapterNumber": chapter["number"],
            "runtimeView": chapter["runtimeView"],
            "kind": "source-index",
            "sourceVerified": True,
            "runtimeConsumer": chapter["runtimeView"],
        })

    indexed_ids = {entry["id"] for entry in table_entries}
    for detected in detected_tables:
        if detected["id"] in indexed_ids:
            continue
        table_entries.append({
            **detected,
            "kind": "detected-caption",
            "sourceVerified": False,
            "runtimeConsumer": detected["runtimeView"],
        })
        indexed_ids.add(detected["id"])

    for chapter in CHAPTERS:
        output = CHAPTER_DIR / f"{chapter['id']}.json"
        output.write_text(json.dumps(pages_by_chapter[chapter["id"]], ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    chapter_summaries = []
    for chapter in CHAPTERS:
        chapter_pages = pages_by_chapter[chapter["id"]]
        chapter_summaries.append({
            **chapter,
            "pageCount": len(chapter_pages),
            "sectionCount": sum(len(page["headings"]) for page in chapter_pages),
            "tableCount": sum(entry["chapterId"] == chapter["id"] for entry in table_entries),
            "gmGuidancePages": sum("GM NOTES" in page["classifications"] for page in chapter_pages),
            "examplePages": sum("EXAMPLE" in page["classifications"] for page in chapter_pages),
        })

    manifest = {
        "version": "1.1-personal",
        "source": "paladin_core_rulebook.pdf",
        "pdfPageCount": 463,
        "printedPageRange": [1, 462],
        "chapters": chapter_summaries,
        "ambiguities": AMBIGUITIES,
        "coverage": {
            "chapters": len(CHAPTERS),
            "sourcePages": 463,
            "rules": segment_counts["RULE"],
            "ruleSourcePages": rule_pages,
            "tables": len(table_entries),
            "procedures": segment_counts["PROCEDURE"],
            "procedureSourcePages": procedure_pages,
            "sections": section_count,
            "examples": segment_counts["EXAMPLE"],
            "examplePages": example_count,
            "gmGuidance": segment_counts["GM NOTES"],
            "gmGuidancePages": gm_guidance_pages,
            "playerGuidance": segment_counts["PLAYER NOTES"],
            "exceptions": segment_counts["EXCEPTIONS"],
            "crossLinks": cross_link_count,
            "historicalReferencePages": sum(len(pages_by_chapter[key]) for key in ["chapter-13", "chapter-15", "chapter-16"]),
            "geographicReferencePages": len(pages_by_chapter["chapter-14"]),
            "creatureReferencePages": len(pages_by_chapter["chapter-18"]),
            "culturalReferencePages": len(pages_by_chapter["chapter-17"]),
        },
    }
    (OUTPUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUTPUT_DIR / "search-index.json").write_text(json.dumps(search_pages, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (OUTPUT_DIR / "table-index.json").write_text(json.dumps(table_entries, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(manifest["coverage"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    build()
