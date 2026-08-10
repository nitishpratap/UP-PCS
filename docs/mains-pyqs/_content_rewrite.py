# Script to splice rewritten Content sections into markdown files
import re
from pathlib import Path

BASE = Path(r"C:\Users\Axeno\Desktop\UP-PCS\mains-pyqs")
CONTENT_DIR = BASE / "_content_sections"

FILE_MAP = {
    "GS-1/06_Society_Features/01_Indian_Society_Features.md": "01_Indian_Society_Features.md",
    "GS-1/07_Society_Development/01_Women_Status_Organisations.md": "01_Women_Status_Organisations.md",
    "GS-1/07_Society_Development/02_Population_Policy_Explosion.md": "02_Population_Policy_Explosion.md",
    "GS-1/07_Society_Development/03_Poverty_Causes_Consequences.md": "03_Poverty_Causes_Consequences.md",
    "GS-1/07_Society_Development/04_Urbanization_Slums_Remedies.md": "04_Urbanization_Slums_Remedies.md",
    "GS-1/08_LPG_Globalization/01_LPG_Effects_India.md": "01_LPG_Effects_India.md",
    "GS-1/08_LPG_Globalization/02_Modernization_Westernization.md": "02_Modernization_Westernization.md",
    "GS-1/08_LPG_Globalization/03_Globalization_Social_Institutions.md": "03_Globalization_Social_Institutions.md",
    "GS-1/09_Social_Issues/01_Regionalism.md": "01_Regionalism.md",
    "GS-1/09_Social_Issues/02_Secularism_Communalism.md": "02_Secularism_Communalism.md",
    "GS-1/09_Social_Issues/03_Social_Empowerment.md": "03_Social_Empowerment.md",
}

FILES = list(FILE_MAP.keys())


def splice(file_rel: str, content_body: str) -> None:
    path = BASE / file_rel
    text = path.read_text(encoding="utf-8")
    new_content = "## Content\n\n" + content_body.strip() + "\n\n---"
    new_text, n = re.subn(
        r"## Content\n\n.*?\n\n---\n\n## Answers",
        new_content + "\n\n## Answers",
        text,
        count=1,
        flags=re.DOTALL,
    )
    if n != 1:
        raise RuntimeError(f"Failed to splice {file_rel}")
    path.write_text(new_text, encoding="utf-8")


def count_content(file_rel: str) -> tuple[int, list[str]]:
    path = BASE / file_rel
    text = path.read_text(encoding="utf-8")
    m = re.search(r"## Content\n\n(.*?)\n\n---\n\n## Answers", text, re.DOTALL)
    if not m:
        return 0, []
    body = m.group(1)
    words = len(body.split())
    headings = re.findall(r"^### .+", body, re.MULTILINE)
    return words, headings


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "splice":
        for file_rel, content_name in FILE_MAP.items():
            content_body = (CONTENT_DIR / content_name).read_text(encoding="utf-8")
            splice(file_rel, content_body)
            print(f"Spliced: {file_rel}")
    elif len(sys.argv) > 1 and sys.argv[1] == "report":
        for f in FILES:
            w, h = count_content(f)
            print(f"{f}|{w}|{len(h)}")
            for hd in h:
                print(f"  {hd}")
