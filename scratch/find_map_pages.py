import fitz

doc = fitz.open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/paladin_core_rulebook.pdf")
print("Total PDF pages:", len(doc))

# Let's search for keywords in pages 240 to 330
search_terms = ["A Map of Europe", "The Ardennes", "Aachen Palace", "A Map of Europe (814 AD)"]

for page_num in range(240, 330):
    text = doc[page_num].get_text()
    for term in search_terms:
        if term.lower() in text.lower():
            print(f"PDF Page {page_num + 1} (index {page_num}) contains term '{term}'")
            # Print a snippet
            print("--- Snippet ---")
            lines = text.split("\n")
            for line in lines[:5]:
                print(line)
            print("----------------")
