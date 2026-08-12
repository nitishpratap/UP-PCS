# -*- coding: utf-8 -*-
import pathlib
path = pathlib.Path(__file__).with_name("02_Turkish_Invasions_Delhi_Sultanate.md")
path.write_text(CONTENT, encoding="utf-8")
print("written", path, len(CONTENT), "chars")
