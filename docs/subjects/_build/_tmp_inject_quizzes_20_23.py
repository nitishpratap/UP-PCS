#!/usr/bin/env python3
"""Inject Mastery Drill quizzes + clean false Current Affairs tables for Topics 20–23."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
REV = ROOT / "docs" / "revision" / "must-score-facts" / "geography"
SUBJ = ROOT / "docs" / "subjects" / "geography"

HEADER = """## 🎯 Revision Practice MCQs (Mastery Drill)

> **Mastery Rule:** Read the consolidated facts above, attempt these high-yield questions, and score &ge;80% to conquer this chapter.

"""


def card(n, stem, opts, ans_letter, ans_text, logic, ar=False) -> str:
    if "|||" in logic:
        logic = logic.split("|||", 1)[1].strip()
    lines = [f"**Q{n}.**", stem, ""]
    for i, o in enumerate(opts):
        lines.append(f"{chr(65+i)}. {o}")
    lines += ["", "<details>", "<summary>Show answer</summary>", "", f"**Ans: {ans_letter}.** {ans_text}", ""]
    label = "A/R logic" if ar else "Logic"
    lines += [f"**{label}:** {logic}", "", "</details>", ""]
    return "\n".join(lines)


QUIZZES: dict[str, list[str]] = {}

# Balanced keys target: A=5, B=5, C=5, D=5
QUIZZES["20_World_Agriculture.md"] = [
    card(1,
         "With reference to plantation agriculture, which of the following statements is/are correct?\n\n1. Tea is the classic plantation crop in multi-option stems that also list wheat, rice and maize.\n2. Plantation agriculture means estate monoculture with hired labour for export.\n3. Fazenda is a Brazilian name for shifting cultivation.",
         ["1 and 2", "Only 1", "2 and 3", "1, 2 and 3"],
         "A", "Statements 1 and 2 are correct.",
         "Fazenda is a Brazil plantation estate name, not jhum/shifting."),
    card(2,
         "Arrange the following coffee-producing countries in descending order of production for the 2016 teaching frame:\n\nBrazil, Vietnam, Colombia, Indonesia",
         ["Vietnam > Brazil > Colombia > Indonesia", "Brazil > Vietnam > Colombia > Indonesia", "Brazil > Colombia > Vietnam > Indonesia", "Colombia > Brazil > Vietnam > Indonesia"],
         "B", "Brazil > Vietnam > Colombia > Indonesia.",
         "Brazil is arabica #1; Vietnam is robusta #2 in that frozen order. Trap starts with Vietnam or parks Colombia second."),
    card(3,
         "Which one of the following is NOT a major cocoa-producing country in the usual West African belt?",
         ["Côte d’Ivoire", "Ghana", "Cameroon", "Latvia"],
         "D", "Latvia is temperate Baltic and not a cocoa grower.",
         "Cocoa majors = Côte d’Ivoire, Ghana, Cameroon. Growers ≠ Swiss/Belgian chocolate factories."),
    card(4,
         "Assertion (A): India’s principal natural-rubber state is Kerala.\nReason (R): The Kinta Valley of Malaysia is famous for rubber estates.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "C", "(A) is true; (R) is false.",
         "Kinta Valley = tin, not rubber. Kerala rubber stands on its own Amazon-origin / Wickham story.|||A is true. R fails because Kinta is a tin match.",
         ar=True),
    card(5,
         "Match List-I with List-II and select the correct answer using the code given below the lists:\n\n| List-I (Name) | List-II (Region) |\n|---|---|\n| 1. Ladang | A. Mexico |\n| 2. Milpa | B. Malaysia |\n| 3. Roca | C. Sri Lanka |\n| 4. Chena | D. Brazil |\n\n*Row order is not the answer code.*",
         ["1-B, 2-A, 3-D, 4-C", "1-A, 2-B, 3-D, 4-C", "1-B, 2-A, 3-C, 4-D", "1-D, 2-A, 3-B, 4-C"],
         "A", "Ladang–Malaysia; Milpa–Mexico; Roca–Brazil; Chena–Sri Lanka.",
         "Classic shifting-name bank. Trap swaps Roca/Chena or Ladang/Milpa."),
    card(6,
         "In which of the following regions is the production of citrus fruits classically well developed as a world belt?",
         ["Equatorial rainforests", "Mediterranean west-coast belts near 30–45°", "Between Kangra and Dhauladhar as the world answer", "Polar tundra margins"],
         "B", "Mediterranean winter-rain west coasts are the citrus / vine / olive belt.",
         "Equatorial is too wet/cloudy; Himalayan distractors are not the world citrus answer."),
    card(7,
         "Consider the following pairs:\n\n1. Sugarcane leader — Brazil\n2. Sugar beet belt — temperate Europe\n3. Oil palm majors — Indonesia and Malaysia\n\nWhich of the pairs given above is/are correctly matched?",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "D", "All three pairs are correct.",
         "Cane = tropics/Brazil; beet = Europe; oil palm volume = Indonesia + Malaysia."),
    card(8,
         "With reference to rice, which of the following statements is/are correct?\n\n1. IRRI is located at Los Baños in the Philippines.\n2. Golden rice is genetically enriched with Vitamin A.\n3. China is the classic rice-export king in coaching frames.",
         ["1 and 2", "Only 3", "2 and 3", "1, 2 and 3"],
         "A", "Statements 1 and 2 are correct.",
         "China/India lead volume; Thailand/Vietnam-type names own the export story. Producer ≠ exporter."),
    card(9,
         "Which one of the following correctly distinguishes Von Thünen from Whittlesey?",
         ["Both map thirteen world agricultural regions", "Von Thünen = distance rings from a market; Whittlesey = world agricultural region types", "Whittlesey = dairy ring nearest the city; Von Thünen = climate belts only", "Neither model concerns agriculture"],
         "B", "Thünen is market-distance rent rings; Whittlesey is the ~thirteen-type world map.",
         "Do not merge climate-region names into Thünen rings."),
    card(10,
         "Which of the following crop–state pairs is correctly matched for India on the world plantation map?",
         ["Gujarat — Tea", "Uttar Pradesh — Jute", "Kerala — Rubber", "Assam — Wheat"],
         "C", "Kerala is India’s rubber state.",
         "Tea volume = Assam (not Gujarat); jute = WB/Bangladesh belt (not UP); wheat ≠ Assam."),
    card(11,
         "With reference to tea processing, which of the following is/are correct?\n\n1. Black tea is fully fermented.\n2. Green tea is not fermented.\n3. The pluck fact is two leaves and a bud.",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "D", "All three statements are correct.",
         "Oolong is the semi-fermented middle case; CTC vs orthodox is a processing style split."),
    card(12,
         "Assertion (A): Norman Borlaug received the Nobel Peace Prize in 1970 for HYV wheat work linked to CIMMYT, Mexico.\nReason (R): FAO headquarters is in Rome and World Food Day is observed on 16 October.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "A", "Both are true, but R does not explain A.",
         "A is the Borlaug/CIMMYT Peace Nobel fact. R is a separate FAO calendar/HQ fact.|||Both true; R is parallel institutional trivia, not the reason for the Nobel.",
         ar=True),
    card(13,
         "Which one of the following is NOT correctly matched?",
         ["Apiculture — bees", "Viticulture — grapes", "Sericulture — wool", "Olericulture — vegetables"],
         "C", "Sericulture is silk rearing, not wool.",
         "Wool/Merino is a livestock fibre story; sericulture volume often tags China."),
    card(14,
         "Consider the following statements about wheat:\n\n1. Winter wheat is sown in autumn in mild-winter belts.\n2. Spring wheat is sown in spring in harsh-winter Prairie / Siberia belts.\n3. Durum wheat is the pasta wheat of the Mediterranean.",
         ["Only 1", "1 and 2", "1, 2 and 3", "2 and 3"],
         "C", "All three statements are correct.",
         "Wheat needs cool growth and bright ripening (~50–75 cm rain)."),
    card(15,
         "To whom does the credit go for the development of coconut and sugarcane agriculture in the Philippines?",
         ["French", "Britishers", "Hollanders", "Spanish and Americans"],
         "D", "Spanish colony then US period.",
         "Dutch = Indonesia; British = Malaya/Ceylon; French = Indochina."),
    card(16,
         "Which of the following pairs is NOT correctly matched?",
         ["Intensive subsistence — monsoon wet rice", "Extensive commercial grain — Prairie / Pampas wheat", "Mixed farming — crops plus livestock", "Mediterranean agriculture — equatorial cocoa belt"],
         "D", "Mediterranean = citrus/vine/olive winter-rain belt, not equatorial cocoa.",
         "Cocoa is humid equatorial West Africa / Amazon-origin story."),
    card(17,
         "With reference to dairy and livestock, which of the following statements is/are correct?\n\n1. India leads world milk volume.\n2. New Zealand and the Netherlands dominate the dairy-export story.\n3. India’s large cattle inventory automatically makes it the classic beef-export king.",
         ["Only 3", "1 and 2", "2 and 3", "1, 2 and 3"],
         "B", "Statements 1 and 2 are correct.",
         "Beef-export leaders are usually Brazil / Australia / USA — herd size ≠ ship leadership."),
    card(18,
         "The soy export triangle in the usual coaching map is:",
         ["India–China–Japan", "USA–Brazil–Argentina", "Russia–Ukraine–Kazakhstan", "Nigeria–Ghana–Cameroon"],
         "B", "USA–Brazil–Argentina.",
         "China is a big user; India is not the soy-export triangle."),
    card(19,
         "Which one of the following correctly states the Golden Crescent?",
         ["Afghanistan–Iran–Pakistan opium belt", "Myanmar–Laos–Thailand only", "Colombia–Peru–Bolivia coffee belt", "Spain–Italy–Greece olive belt"],
         "A", "Golden Crescent = Afghanistan–Iran–Pakistan.",
         "Do not drag Iraq into the Crescent or confuse it with Golden Triangle SE Asia."),
    card(20,
         "Consider the following statements:\n\n1. Producer volume and exporter leadership are the same for rice and wheat.\n2. Assam leads Indian tea volume; Kerala is India’s rubber state.\n3. Jute world production is almost entirely India and Bangladesh.",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "C", "Statements 2 and 3 are correct.",
         "Statement 1 is the classic false trap — producer ≠ exporter."),
]

QUIZZES["21_World_Minerals_Energy.md"] = [
    card(1,
         "Match List-I with List-II and select the correct answer using the code given below the lists:\n\n| List-I (Coalfield) | List-II (Country) |\n|---|---|\n| 1. Appalachian | A. England |\n| 2. Lancashire | B. Germany |\n| 3. Ruhr | C. Russia |\n| 4. Kuzbass | D. USA |\n\n*Row order is not the answer code.*",
         ["1-D, 2-A, 3-B, 4-C", "1-A, 2-D, 3-B, 4-C", "1-D, 2-A, 3-C, 4-B", "1-C, 2-A, 3-B, 4-D"],
         "A", "Appalachian–USA; Lancashire–England; Ruhr–Germany; Kuzbass–Russia.",
         "Donetsk/Donbas is Ukraine’s coal centre — do not dump it onto Kuzbass."),
    card(2,
         "Mount Newman / Pilbara / Hamersley are famous for which mineral?",
         ["Manganese", "Iron ore", "Bauxite", "Copper"],
         "B", "Western Australia iron ore.",
         "Weipa/Gove = bauxite; Chile Andes = copper; Postmasburg = manganese."),
    card(3,
         "Which one of the following country–iron-ore pairs is NOT correctly matched?",
         ["Australia — Mount Newman", "Ukraine — Krivoy Rog", "Germany — Normandy", "Sweden — Kiruna"],
         "C", "Normandy is in France, not Germany.",
         "Lorraine/Normandy iron belongs with France; Mesabi = USA."),
    card(4,
         "Assertion (A): Chile is the leading producer of copper in the world in the usual porphyry teaching frame.\nReason (R): The Andes region of northern Chile holds large porphyry copper deposits.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "D", "Both true and R explains A.",
         "Chuquicamata / El Teniente / Escondida sit in that Andes porphyry story.|||A and R both true; northern Andes porphyry is the reason Chile leads.",
         ar=True),
    card(5,
         "In Malaysia, the Kinta Valley is famous for:",
         ["Rubber production", "Tea production", "Tin production", "Coffee production"],
         "C", "Kinta Valley = tin (cassiterite).",
         "Malaysia grows rubber elsewhere — Kinta is still the tin match. Pegu Yoma (Myanmar) = oil, not tin."),
    card(6,
         "Which one of the following country–oil-field pairs is NOT correctly matched?",
         ["Iran — Haft Kel", "Kuwait — Kashagan", "Saudi Arabia — Dhahran", "Iraq — Zubair"],
         "B", "Kashagan is in Kazakhstan; Kuwait’s classic giant is Burgan.",
         "Ghawar/Dhahran = Saudi; Kirkuk/Zubair = Iraq; Baku = Azerbaijan."),
    card(7,
         "The main constituent of natural gas is:",
         ["Butane", "Hexane", "Benzene", "Methane"],
         "D", "Methane (CH₄).",
         "LPG = propane–butane; CNG is also methane-based — do not equate LPG with CNG."),
    card(8,
         "Postmasburg and adjacent areas of South Africa are a major producer of:",
         ["Uranium", "Bauxite", "Manganese", "Mica"],
         "C", "Postmasburg = manganese.",
         "Witwatersrand = gold; Weipa = bauxite; mica classic = India."),
    card(9,
         "With reference to critical minerals, which of the following statements is/are correct?\n\n1. The Lithium Triangle is Chile–Argentina–Bolivia.\n2. Brazil is a member of the Lithium Triangle.\n3. Cobalt volume leadership often tags the DRC.",
         ["Only 2", "2 and 3", "1, 2 and 3", "1 and 3"],
         "D", "Statements 1 and 3 are correct.",
         "Brazil is the classic wrong fourth country dumped into the triangle. REE processing fact = China."),
    card(10,
         "Which of the following energy sources is/are NOT ultimately derived from the Sun’s energy?\n\n1. Biomass energy\n2. Nuclear energy\n3. Wind energy\n4. Geothermal energy",
         ["1 and 3", "2 and 4", "Only 2", "Only 4"],
         "B", "Nuclear and geothermal are not stored solar energy.",
         "Wind and biomass are solar-linked. Tidal is Moon-linked in usual teaching."),
    card(11,
         "OPEC headquarters is located at:",
         ["Paris", "Abu Dhabi", "Vienna", "Geneva"],
         "C", "OPEC HQ = Vienna.",
         "IAEA is also Vienna (different job). IEA = Paris; IRENA = Abu Dhabi."),
    card(12,
         "Consider the following pairs:\n\n1. Itaipu — Brazil–Paraguay\n2. Three Gorges — China (Yangtze)\n3. Uranium City — Australia\n\nWhich of the pairs given above is/are correctly matched?",
         ["1 and 2", "Only 3", "2 and 3", "1, 2 and 3"],
         "A", "Pairs 1 and 2 are correct.",
         "Uranium City = Canada (Athabasca). Olympic Dam = Australia U+Cu+Au."),
    card(13,
         "Which one of the following statements about German silver is correct?",
         ["It is pure silver from Germany", "It is a Cu–Ni–Zn alloy containing no silver", "It is silver mined in the Ruhr", "It is the same as platinum"],
         "B", "German silver = Cu–Ni–Zn with no silver metal.",
         "Name comes from appearance, not composition."),
    card(14,
         "Assertion (A): Qatar’s North Field and Iran’s South Pars form one continuous Gulf gas giant.\nReason (R): Natural gas is mainly propane and butane.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "C", "(A) is true; (R) is false.",
         "Main gas constituent is methane; propane–butane is LPG.|||A true (shared reservoir). R false (methane, not LPG mix).",
         ar=True),
    card(15,
         "Which one of the following is correctly matched?",
         ["Broken Hill — Australia lead–zinc", "Mesabi — copper", "Morocco — oil reserves king in all frames", "Sudbury — tin"],
         "A", "Broken Hill / Mount Isa = Australia Pb–Zn.",
         "Mesabi = iron; Morocco = phosphate; Sudbury = Ni (+Cu)."),
    card(16,
         "With reference to coal rank, which of the following sequences is correct (rising carbon)?",
         ["Anthracite → bituminous → lignite → peat", "Peat → lignite → bituminous → anthracite", "Lignite → anthracite → peat → bituminous", "Bituminous → peat → anthracite → lignite"],
         "B", "Peat → lignite → bituminous → anthracite.",
         "Coking coal is for steel; lignite is thermal-only."),
    card(17,
         "Which country is the usual modern volume leader for gold in recent teaching frames (e.g. 2023)?",
         ["U.S.A.", "Canada", "South Africa", "China"],
         "D", "China leads recent world gold output.",
         "South Africa / Witwatersrand is the historic trap, not the modern volume key."),
    card(18,
         "Consider the following statements:\n\n1. Hematite is the red bulk iron ore of world trade.\n2. Magnetite is the black highest-grade iron ore.\n3. Carajás is an Australian iron mine in the Pilbara.",
         ["1 and 2", "Only 3", "2 and 3", "1, 2 and 3"],
         "A", "Statements 1 and 2 are correct.",
         "Carajás = Brazil; Pilbara/Newman = Australia."),
    card(19,
         "The Peace Pipeline name refers to a gas line between:",
         ["Iran and Pakistan", "Russia and Germany", "Qatar and India", "USA and Mexico"],
         "A", "Peace Pipeline = Iran–Pakistan.",
         "Do not dump it onto Russia–Europe Nord Stream-type stories."),
    card(20,
         "Which one of the following is NOT correctly matched?",
         ["Bushveld — chromite / platinum (South Africa)", "Great Dyke — Zimbabwe chromite", "Weipa — Australian bauxite", "Pegu Yoma — Myanmar tin"],
         "D", "Pegu Yoma = mineral oil; Myanmar tin sits in Tenasserim.",
         "Kinta / Bangka are the tin-street names."),
]

QUIZZES["22_World_Industries.md"] = [
    card(1,
         "With reference to industrial location, which of the following statements is/are correct?\n\n1. Weight-losing industries such as iron–steel tend to sit near bulky raw materials.\n2. Weight-gaining industries such as bottling tend to sit near the market.\n3. Aluminium smelting typically seeks cheap hydel power.",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "D", "All three statements are correct.",
         "Footloose electronics are the opposite case — not tied to a coalfield."),
    card(2,
         "Which one of the following city–industry pairs is correctly matched?",
         ["Osaka — automobiles", "Detroit — cotton textiles", "Cuba — cigar", "St Petersburg — cotton"],
         "C", "Cuba–cigar is the classic pair.",
         "Osaka = cotton; Detroit = auto; St Petersburg = shipbuilding."),
    card(3,
         "Match List-I with List-II and select the correct answer using the code given below the lists:\n\n| List-I (Japan tag) | List-II (Meaning) |\n|---|---|\n| 1. Osaka | A. Detroit of Japan (autos) |\n| 2. Nagoya | B. Manchester of Japan (cotton) |\n| 3. Kawasaki | C. Pittsburgh of Japan (steel) |\n| 4. Keihin | D. Tokyo–Yokohama belt |\n\n*Row order is not the answer code.*",
         ["1-A, 2-B, 3-C, 4-D", "1-B, 2-A, 3-C, 4-D", "1-B, 2-A, 3-D, 4-C", "1-C, 2-A, 3-B, 4-D"],
         "B", "Osaka–Manchester/cotton; Nagoya–Detroit/autos; Kawasaki–Pittsburgh/steel; Keihin–Tokyo–Yokohama.",
         "Hanshin = Osaka–Kobe; Chukyo = Nagoya autos."),
    card(4,
         "Assertion (A): The Suez Canal joins the Mediterranean Sea and the Red Sea.\nReason (R): The Suez Canal uses a system of stepped chambers like Panama.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "C", "(A) is true; (R) is false.",
         "Suez is a sea-level cut (~7000 km India–Europe saving). Stepped chambers / Gatun belong to Panama.|||A true (Med–Red). R false (no stepped chambers on Suez).",
         ar=True),
    card(5,
         "Arrange the Suez lakes from north to south:",
         ["Timsah → Manzala → Great Bitter → Little Bitter", "Manzala → Timsah → Great Bitter → Little Bitter", "Great Bitter → Little Bitter → Manzala → Timsah", "Manzala → Great Bitter → Timsah → Little Bitter"],
         "B", "Manzala → Timsah → Great Bitter → Little Bitter.",
         "Port Said = north end; Suez town = south end."),
    card(6,
         "Which one of the following port–country pairs is NOT correctly matched?",
         ["Rotterdam — Netherlands", "Montevideo — Uruguay", "Jakarta — Indonesia", "Igarka — China"],
         "D", "Igarka is in Russia (Yenisei timber).",
         "Duisburg is an inland Rhine port in Germany, not a Dutch sea mouth."),
    card(7,
         "Entrepôt classics in this chapter are:",
         ["Detroit, Pittsburgh, Nagoya", "Akron, Toulouse, Seattle", "Singapore, Rotterdam, Hong Kong", "Lancashire, Yorkshire, Ruhr"],
         "C", "Singapore, Rotterdam, Hong Kong — import, store/sort, re-export.",
         "Shanghai leads many container-volume MCQs; Rhine mouth = Rotterdam."),
    card(8,
         "Which canal correctly joins the North Sea and the Baltic?",
         ["Suez", "Panama", "Kiel", "Suez and Panama both"],
         "C", "Kiel = North Sea–Baltic.",
         "Suez = Med–Red; Panama = Atlantic/Caribbean–Pacific."),
    card(9,
         "With reference to local winds, which of the following statements is/are correct?\n\n1. Chinook is a warm dry wind of the Rockies.\n2. Foehn is the Alps equivalent of Chinook.\n3. Mistral is a southern Australian local wind.",
         ["1 and 2", "Only 3", "2 and 3", "1, 2 and 3"],
         "A", "Statements 1 and 2 are correct.",
         "Mistral = southern France / Rhône — not Australia. Brickfielder = Australia."),
    card(10,
         "Which one of the following is NOT correctly matched?",
         ["Shamal — Arabia / Persian Gulf", "Santa Ana — California", "Haboob — Sudan", "Willy-willy — Australian local wind like Brickfielder"],
         "D", "Willy-willy is an Australian cyclone name, not a local wind.",
         "Brickfielder is the Australian local-wind name; do not merge the two."),
    card(11,
         "Italy’s industrial triangle is best described as:",
         ["Ruhr–Saar–Lorraine", "Po Basin / Milan–Turin–Genoa", "Keihin–Hanshin–Chukyo", "Pearl River Delta only"],
         "B", "Milan–Turin–Genoa / Po Basin.",
         "Wolfsburg and Turin are classic auto centres."),
    card(12,
         "Consider the following statements:\n\n1. Lancashire is associated with cotton textiles.\n2. Yorkshire is associated with wool.\n3. Ruhr is Germany’s coal–steel–heavy engineering belt.",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "D", "All three statements are correct.",
         "Pittsburgh–Great Lakes = steel; Detroit = autos."),
    card(13,
         "Silicon Valley is correctly associated with:",
         ["Detroit automobiles", "Ruhr steel", "California electronics / IT", "Osaka cotton"],
         "C", "California Bay Area electronics / IT — a footloose high-value cluster.",
         "Do not park Silicon Valley on Detroit."),
    card(14,
         "Assertion (A): Break-of-bulk industries concentrate at ports, lakes and railheads.\nReason (R): Cargo changes mode at such points, so refining and milling often cluster there.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "D", "Both true and R explains A.",
         "Oil refining, flour and lake-steel are classic break-of-bulk cases.|||A and R both true; mode-change cost logic explains the clustering.",
         ar=True),
    card(15,
         "Which one of the following wind–region pairs is correctly matched?",
         ["Khamsin — Egypt", "Harmattan — Alps", "Bora — warm Rockies wind", "Leveche — Japan"],
         "A", "Khamsin = Egypt.",
         "Harmattan = West Africa; Bora = Adriatic cold; Leveche = Spain; Yamo = Japan."),
    card(16,
         "Shipbuilding volume leaders in the usual modern frame are:",
         ["USA–UK–Germany", "China–South Korea–Japan", "India–Brazil–Russia", "France–Italy–Spain"],
         "B", "China–South Korea–Japan.",
         "St Petersburg remains the classic European city–shipbuilding match."),
    card(17,
         "Which one of the following is correctly matched?",
         ["Akron — tyres / rubber (USA)", "Toulouse — Boeing", "Seattle — Airbus", "Hollywood — watch industry"],
         "A", "Akron = tyres; Toulouse = Airbus; Seattle = Boeing; Hollywood = films.",
         "Swiss Jura = watches."),
    card(18,
         "With reference to Japan’s industrial belts, which of the following is/are correct?\n\n1. Hanshin = Osaka–Kobe\n2. Chukyo = Nagoya autos\n3. Keihin = Osaka–Kobe",
         ["1 and 2", "Only 3", "2 and 3", "1, 2 and 3"],
         "A", "Statements 1 and 2 are correct.",
         "Keihin = Tokyo–Yokohama, not Osaka–Kobe."),
    card(19,
         "China’s classic coastal manufacturing story in this chapter includes the:",
         ["Ruhr Valley", "Pearl River Delta", "Po Basin", "Mesabi Range"],
         "B", "Pearl River Delta; Shanghai leads common container-port MCQs.",
         "Ruhr = Germany; Po = Italy; Mesabi = USA iron."),
    card(20,
         "Which of the following statements about canals is/are correct?\n\n1. Panama joins the Atlantic/Caribbean and the Pacific with stepped chambers and Gatun Lake.\n2. Suez cuts India–Europe distance by about 7000 km.\n3. Kiel joins the Mediterranean and the Red Sea.",
         ["1 and 2", "Only 3", "2 and 3", "1, 2 and 3"],
         "A", "Statements 1 and 2 are correct.",
         "Kiel is North Sea–Baltic, not Med–Red (that is Suez)."),
]

QUIZZES["23_Political_Map_Geography.md"] = [
    card(1,
         "Under UNCLOS, which of the following distances is/are correctly matched?\n\n1. Territorial sea — 12 nm\n2. Contiguous zone — 24 nm\n3. EEZ — 200 nm",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "D", "All three are correct.",
         "Shelf may extend to 350 nm for seabed rights, but that does not widen EEZ water beyond 200."),
    card(2,
         "Innocent passage and transit passage are correctly distinguished as:",
         ["Innocent passage — international straits; transit passage — territorial sea", "Innocent passage — territorial sea; transit passage — international straits", "Both apply only on the high seas", "Both apply only inside internal waters"],
         "B", "Innocent passage = territorial sea; transit passage = international straits.",
         "Transit passage is stronger and cannot be switched off like innocent passage."),
    card(3,
         "Match List-I with List-II and select the correct answer using the code given below the lists:\n\n| List-I (Line) | List-II (Association) |\n|---|---|\n| 1. McMahon Line | A. Pakistan–Afghanistan (1893) |\n| 2. Durand Line | B. India–China (1914) |\n| 3. Radcliffe Line | C. USA–Canada (long stretch) |\n| 4. 49th Parallel | D. 1947 India–Pakistan/Bangladesh |\n\n*Row order is not the answer code.*",
         ["1-B, 2-A, 3-D, 4-C", "1-A, 2-B, 3-D, 4-C", "1-B, 2-A, 3-C, 4-D", "1-D, 2-A, 3-B, 4-C"],
         "A", "McMahon–India–China 1914; Durand–Pak–Afghanistan 1893; Radcliffe–1947; 49th–USA–Canada.",
         "38th Parallel ≈ Koreas; Rio Grande ≈ USA–Mexico; Oder–Neisse ≈ Germany–Poland."),
    card(4,
         "Assertion (A): India’s longest land border is with Bangladesh.\nReason (R): India’s shortest land border in the usual teaching frame is with Afghanistan.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "A", "Both are true, but R does not explain A.",
         "They are two independent border-length facts. Longest state coastline = Gujarat.|||Both true; shortest≠reason for longest.",
         ar=True),
    card(5,
         "Which one of the following correctly states India’s mainland latitudinal extent?",
         ["6°45′N to 37°6′N", "8°4′N to 37°6′N", "8°4′N to 36°12′N", "6°4′N to 36°7′N"],
         "B", "Mainland ≈ 8°4′N to 37°6′N.",
         "6°4′N is Indira Point (islands), not mainland Kanyakumari."),
    card(6,
         "Which one of the following is NOT correctly matched?",
         ["Uzbekistan — Tashkent", "Tajikistan — Dushanbe", "Kyrgyzstan — Bishkek", "Cape Verde — Bamako"],
         "D", "Cape Verde capital is Praia; Bamako is Mali.",
         "Turkmenistan = Ashgabat; Kazakhstan capital = Astana (not Almaty)."),
    card(7,
         "With reference to landlocked states, which of the following statements is/are correct?\n\n1. Laos is the only classic landlocked sovereign state in mainland Southeast Asia.\n2. Uzbekistan and Liechtenstein are the common double-landlocked pair.\n3. Bolivia is landlocked among common South America traps.",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "D", "All three statements are correct.",
         "Largest landlocked by area = Kazakhstan; most populous landlocked = Ethiopia; Lesotho = SA enclave."),
    card(8,
         "Which strait is the classic Persian Gulf oil chokepoint?",
         ["Malacca", "Hormuz", "Bosporus", "Gibraltar"],
         "B", "Hormuz.",
         "Malacca = Indian Ocean–South China Sea; Gibraltar = Med–Atlantic; Bosporus = Black Sea–Marmara."),
    card(9,
         "India’s area rank and land-share teaching pair is:",
         ["6th largest; about 2.4% of world land", "7th largest; about 2.4% of world land", "7th largest; about 4.2% of world land", "5th largest; wholly tropical"],
         "B", "India is 7th; about 2.4% of world land; Tropic through the middle — not wholly tropical.",
         "Tropic of Cancer does not cross Uttar Pradesh."),
    card(10,
         "Which one of the following old→new name pairs is NOT correctly matched?",
         ["Siam → Thailand", "Formosa → Taiwan", "Gold Coast → Ghana", "Dutch Guiana → Guyana"],
         "D", "Dutch Guiana → Suriname; British Guiana → Guyana.",
         "Southern Rhodesia → Zimbabwe; Ceylon → Sri Lanka; Burma → Myanmar."),
    card(11,
         "Horn of Africa correctly includes:",
         ["Djibouti, Eritrea, Ethiopia, Somalia", "Djibouti, Eritrea, Ethiopia, Sudan", "Ethiopia, Somalia, Kenya, Sudan", "Somalia, Yemen, Oman, Eritrea"],
         "A", "Djibouti, Eritrea, Ethiopia, Somalia — not Sudan.",
         "Austria is not Balkan; Indonesia is not Oceania; Caspian five exclude Armenia/Iraq."),
    card(12,
         "Assertion (A): Mediterranean climate (Köppen Cs) receives rain mainly in winter.\nReason (R): Thornthwaite argued that vegetation is the true index of climate, while Köppen uses letter-code classes.",
         ["Both (A) and (R) are true, but (R) is not the correct explanation of (A)", "(A) is false, but (R) is true", "(A) is true, but (R) is false", "Both (A) and (R) are true and (R) is the correct explanation of (A)"],
         "A", "Both true, but R does not explain A.",
         "Cfb Western Europe = rain in all months.|||A true (winter rain). R true as a separate classification fact, not the cause of Cs winter rain.",
         ar=True),
    card(13,
         "Which sobriquet pair is correctly matched?",
         ["Land of the Midnight Sun — Japan", "Land of the Rising Sun — Norway", "Thousand Lakes — Finland", "Morning Calm — Thailand"],
         "C", "Finland = Thousand Lakes.",
         "Midnight Sun = Norway; Rising Sun = Japan; Morning Calm = Korea; White Elephants = Thailand."),
    card(14,
         "Consider the following pairs:\n\n1. Pamir — Roof of the World\n2. Baikal — Pearl of Siberia\n3. Aberdeen — Oil Capital of Europe\n\nWhich of the pairs given above is/are correctly matched?",
         ["Only 1", "1 and 2", "2 and 3", "1, 2 and 3"],
         "D", "All three pairs are correct.",
         "Ninety East Ridge = Indian Ocean; Bahrain = Island of Pearls."),
    card(15,
         "Which canal joins the Atlantic/Caribbean and the Pacific?",
         ["Suez", "Kiel", "Panama", "Suez and Kiel"],
         "C", "Panama (stepped chambers / Gatun Lake).",
         "Suez = Med–Red; Kiel = North Sea–Baltic."),
    card(16,
         "Uttar Pradesh’s only foreign neighbour is:",
         ["China", "Bhutan", "Nepal", "Bangladesh"],
         "C", "Nepal only.",
         "India has seven land neighbours; maritime neighbours are Sri Lanka and Maldives."),
    card(17,
         "Which one of the following continent–highest-peak pairs is NOT correctly matched in the usual coaching bank?",
         ["Asia — Everest", "Australia (continent) — Denali", "South America — Aconcagua", "Africa — Kilimanjaro"],
         "B", "Denali is North America; Australia continent peak is Kosciuszko (Carstensz if Oceania framing).",
         "Europe coaching peak often Elbrus; Antarctica Vinson."),
    card(18,
         "With reference to rivers and lakes, which of the following statements is/are correct?\n\n1. The Volga drains to the Caspian Sea.\n2. Baikal is the deepest / largest-freshwater-by-volume lake in Siberia.\n3. The Rhine drains to the Mediterranean.",
         ["1 and 2", "Only 3", "2 and 3", "1, 2 and 3"],
         "A", "Statements 1 and 2 are correct.",
         "Rhine → North Sea; Danube → Black Sea; Nile → Mediterranean."),
    card(19,
         "Which one of the following is correctly matched?",
         ["Greenland — independent continent", "Baikonur — Ukraine", "Gaza — borders Egypt and Israel", "Afghanistan — borders Russia"],
         "C", "Gaza borders Egypt and Israel.",
         "Greenland = Denmark politically / N America geographically; Baikonur = Kazakhstan; Afghanistan does not border Russia."),
    card(20,
         "Köppen code Cs is best read as:",
         ["Equatorial rainforest", "Hot desert", "Mediterranean winter rain", "Ice cap"],
         "C", "Cs = Mediterranean winter rain.",
         "Af = equatorial rainforest; BWh = hot desert; Cfb = marine west-coast all-year rain; ET/EF = tundra/ice."),
]


def clean_traps_section(text: str) -> str:
    """Remove false Current Affairs section that duplicated confused-pairs table."""
    # Pattern: ### Current Affairs anchors ... --- ### Confused pairs
    text = re.sub(
        r"### Current Affairs anchors\n\n"
        r"\| Pair \| Correct \| Trap \| Hindi \|\n"
        r"\|.*?\n"
        r"(?:\|.*?\n)+"
        r"\n---\n\n### Confused pairs\n\n",
        "### Confused pairs\n\n",
        text,
        count=1,
        flags=re.S,
    )
    return text


def inject(path: Path, cards: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    text = clean_traps_section(text)
    # Also sync subject 22 locks into revision if present
    text = text.replace(
        "Do not swap Suez and Panama: Suez = Med–Red, no locks; Panama = Atlantic–Pacific, with locks / Gatun.",
        "Do not swap Suez and Panama: Suez = Med–Red, sea-level cut; Panama = Atlantic–Pacific, with stepped chambers / Gatun.",
    )
    text = text.replace(
        "Canal distance / geometry traps: Suez ~7000 km India–Europe saving; Panama uses locks; Kiel is North Sea–Baltic only.",
        "Canal distance / geometry traps: Suez ~7000 km India–Europe saving; Panama uses stepped chambers; Kiel is North Sea–Baltic only.",
    )
    quiz = HEADER + "\n".join(cards)
    # Replace from Mastery Drill heading to EOF
    if re.search(r"(?m)^##\s+.*Revision Practice MCQs", text):
        text = re.sub(
            r"(?m)^##\s+.*Revision Practice MCQs[\s\S]*\Z",
            quiz.rstrip() + "\n",
            text,
        )
    else:
        text = text.rstrip() + "\n\n---\n\n" + quiz.rstrip() + "\n"

    # Validate
    keys = re.findall(r"\*\*Ans:\s*([ABCD])\.", text)
    # only count in quiz section
    qm = re.search(r"(?m)^##\s+.*Revision Practice MCQs[\s\S]*\Z", text)
    keys = re.findall(r"\*\*Ans:\s*([ABCD])\.", qm.group(0))
    qs = re.findall(r"\*\*Q(\d+)\.\*\*", qm.group(0))
    if len(qs) != 20:
        raise SystemExit(f"{path.name}: expected 20 questions, got {len(qs)}")
    from collections import Counter
    c = Counter(keys)
    if set(c) != {"A", "B", "C", "D"} or any(v != 5 for v in c.values()):
        raise SystemExit(f"{path.name}: unbalanced keys {dict(c)} (need 5 each)")
    # Practice Zone order: Ans first then Logic — already done
    if re.search(r"<summary>Show answer</summary>\s*\n\s*\*\*(Logic|A/R logic):", qm.group(0)):
        raise SystemExit(f"{path.name}: Logic before Ans in a details block")
    if re.search(r"\bexam\b|\block(s)?\b", qm.group(0), re.I):
        # allow 'block' etc - check word lock
        if re.search(r"\bexam\b", qm.group(0), re.I) or re.search(r"(?<![a-zA-Z])locks?(?![a-zA-Z])", qm.group(0), re.I):
            # 'block' shouldn't match (?<![a-z])lock
            bad = re.findall(r"\b(?:exam|locks?)\b", qm.group(0), re.I)
            # filter false positives: none expected
            if bad:
                raise SystemExit(f"{path.name}: banned words in quiz {bad}")

    path.write_text(text, encoding="utf-8", newline="\n")
    print(f"OK {path.name}: quiz=20 keys={dict(c)}")


def sync_subject_22_again() -> None:
    # re-sync 22 after locks fix, preserving quiz we'll inject after
    pass


def main() -> None:
    # Re-sync topic 22 facts after locks wording fix
    import subprocess, sys
    subprocess.check_call(
        [sys.executable, str(ROOT / "docs/subjects/_build/sync_revision_msf.py"),
         "Geography", "--only", "22_World_Industries.md", "--strip-quiz"]
    )
    for name, cards in QUIZZES.items():
        if len(cards) != 20:
            raise SystemExit(f"{name}: {len(cards)} cards")
        inject(REV / name, cards)


if __name__ == "__main__":
    main()
