"""Fix 03_Climatology.md: strip heading emojis + expand · compression."""
from pathlib import Path

from _expand_bodies import expand_markdown_sections

path = Path(__file__).with_name("03_Climatology.md")
text = path.read_text(encoding="utf-8")
fixed = expand_markdown_sections(text, strip_heading_emoji=True)
path.write_text(fixed, encoding="utf-8")
print(f"Fixed {path} — {path.stat().st_size} bytes, {fixed.count(chr(10))+1} lines")
