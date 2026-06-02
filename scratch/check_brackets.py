with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/components/LoreEncyclopedia.jsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

stack = []
for idx, line in enumerate(lines):
    line_num = idx + 1
    for char_idx, char in enumerate(line):
        if char in ["{", "(", "["]:
            stack.append((char, line_num, char_idx))
        elif char in ["}", ")", "]"]:
            if not stack:
                print(f"Error: Excess closing char '{char}' at line {line_num}:{char_idx}")
                continue
            last_char, last_line, last_char_idx = stack.pop()
            
            # Match check
            if (char == "}" and last_char != "{") or \
               (char == ")" and last_char != "(") or \
               (char == "]" and last_char != "["):
                print(f"Mismatch: '{last_char}' opened at line {last_line}:{last_char_idx} but closed by '{char}' at line {line_num}:{char_idx}")

# Print remaining unclosed characters in the stack
if stack:
    print(f"Total unclosed brackets: {len(stack)}")
    for last_char, last_line, last_char_idx in stack[-10:]:
        print(f"Unclosed '{last_char}' opened at line {last_line}:{last_char_idx}")
else:
    print("All brackets are perfectly balanced!")
