"""One-off generator for 02_Geomorphology.md — run from repo root."""
from pathlib import Path

TITLES = [
    "Geomorphology — Basic Framework",
    "Weathering",
    "Physical / Mechanical Weathering",
    "Exfoliation",
    "Freeze–Thaw Weathering",
    "Chemical Weathering",
    "Chemical Weathering — Associations",
    "Biological Weathering",
    "Weathering vs Erosion",
    "Mass Wasting",
    "Rockfall",
    "Landslide",
    "Soil Creep",
    "Solifluction",
    "Erosional Agents",
    "Fluvial Geomorphology",
    "River Erosion",
    "Vertical vs Lateral Erosion",
    "V-Shaped Valley",
    "Gorge",
    "Canyon",
    "Potholes",
    "Waterfall",
    "Rapids",
    "Meander",
    "Oxbow Lake",
    "Floodplain",
    "Natural Levee",
    "Point Bar",
    "Delta",
    "Alluvial Fan",
    "Alluvial Fan vs Delta",
    "River Terrace",
    "Drainage Rejuvenation",
    "Incised Meander",
    "River Landforms — Master Ratta",
    "Glacial Geomorphology",
    "Glacial Erosion",
    "Cirque / Corrie / Cwm",
    "Arete",
    "Horn",
    "U-Shaped Valley",
    "Hanging Valley",
    "Fiord / Fjord",
    "Roche Moutonnée",
    "Drumlin",
    "Esker",
    "Moraine",
    "Glacial Landforms — Master Ratta",
    "Aeolian / Wind Geomorphology",
    "Wind Erosion",
    "Deflation Hollow",
    "Yardang",
    "Ventifact",
    "Mushroom Rock",
    "Inselberg",
    "Barchan",
    "Longitudinal / Seif Dune",
    "Star Dune",
    "Loess",
    "Wind Landforms — Master Ratta",
    "Karst Geomorphology",
    "Lappies / Karren",
    "Sinkhole / Doline",
    "Uvala",
    "Polje",
    "Cave / Cavern",
    "Stalactite vs Stalagmite",
    "Pillar / Column",
    "Karst Landforms — Master Ratta",
    "Coastal Geomorphology",
    "Wave Erosion",
    "Sea Cliff",
    "Wave-Cut Platform",
    "Sea Cave",
    "Sea Arch",
    "Sea Stack",
    "Stump",
    "Headland & Bay",
    "Beach",
    "Spit",
    "Bar",
    "Lagoon",
    "Tombolo",
    "Longshore Drift",
    "Coastal Landforms — Master Ratta",
    "Underground Features",
    "Process → Landform Master Table",
    "Agent → Signature Landform",
    "High-Yield Geomorphic Associations",
    "Important Indian Geomorphology",
    "Badlands",
    "Ravines",
    "Rift Valley",
    "Horst & Graben",
    "Fold Landforms",
    "Dome & Basin",
    "Residual Landforms",
    "Pediment",
    "Pediplain",
    "Peneplain",
    "Base Level",
    "Differential Erosion",
    "Cuesta",
    "Homoclinal Ridge",
    "Escarpment",
    "Geomorphological Cycle — Basic Ratta",
    "Rejuvenated Landscape",
    "Knick Point",
    "Landform → Process Final Ratta Table",
]

def _bodies() -> dict[int, str]:
    """Compact association bodies — one table or lock block per section."""
    return {
        1: """**Geomorphology** = study of landforms + processes that form/modify them.

| Force | Origin | Major processes |
| --- | --- | --- |
| Endogenic | Inside Earth | Folding, faulting, volcanism, earthquakes |
| Exogenic | Surface/atmosphere | Weathering, erosion, transport, deposition |

Endogenic → uplift/build · Exogenic → weathering → erosion → transport → deposition""",
        2: """Breakdown/decomposition at or near surface **without transportation**.

Physical · Chemical · Biological""",
        3: """| Process | Association |
| --- | --- |
| Exfoliation | Temperature change / pressure release |
| Freeze–thaw | Repeated freezing & melting |
| Thermal expansion | Heating/cooling |
| Block disintegration | Jointed rocks |
| Salt weathering | Salt crystal growth |""",
        4: """Thin shells / concentric layers peel off · **Granite + temperature variation** · pressure unloading · **Exfoliation = onion-skin weathering**""",
        5: """Frost wedging / frost action · water in cracks → freezes → expands → widens cracks · **Cold mountainous regions** · **Mechanical weathering**""",
        6: """| Process | Ratta |
| --- | --- |
| Solution | Minerals dissolve |
| Carbonation | CO₂ + water → carbonic acid |
| Hydration | Addition of water |
| Hydrolysis | Reaction with water |
| Oxidation | Reaction with oxygen |""",
        7: """| Lock | Fact |
| --- | --- |
| Carbonation | Limestone |
| Oxidation | Iron-bearing minerals → rust |
| Hydration | Absorption/addition of water |
| Hydrolysis | Feldspar → clay minerals |
| Climate | Hot + humid → chemical stronger; cold/dry → mechanical relatively important |""",
        8: """Plant roots · burrowing animals · microorganisms · human activity · **Roots in cracks → mechanical widening**""",
        9: """| Weathering | Erosion |
| --- | --- |
| Breakdown | Removal + transport |
| Material stays in place | Material transported |
| No agent necessary | Agent required |
| Produces regolith | Moves sediment |

Weathering → BREAK · Erosion → REMOVE · Transport → MOVE · Deposition → DROP""",
        10: """Gravity-driven downslope movement · rockfall · landslide · mudflow · debris flow · soil creep · solifluction""",
        11: """Individual rocks detach and fall on **steep cliffs / mountainous terrain**""",
        12: """Rapid downslope movement of rock/soil/debris · triggers: heavy rain, earthquakes, slope cutting, deforestation, snowmelt, volcanic activity · **Gravity = fundamental driving force**""",
        13: """Very slow downslope soil movement · slowest mass movement · tilted trees/poles/fences · **Creep = slow · Landslide = rapid**""",
        14: """Slow flow of water-saturated soil where frozen ground restricts drainage · **Periglacial / permafrost** · **Solifluction = periglacial environment**""",
        15: """Running water · glacier · wind · sea waves · groundwater — each produces characteristic landforms""",
        16: """Fluvial = rivers/running water · **Erosion → Transportation → Deposition**""",
        17: """| Type | Meaning |
| --- | --- |
| Hydraulic action | Force of flowing water |
| Abrasion / corrasion | Sediment scrapes bed/banks |
| Attrition | Load particles collide |
| Solution / corrosion | Soluble material dissolves |""",
        18: """| Type | Course | Produces |
| --- | --- | --- |
| Vertical erosion | Upper | V-valley, gorge, canyon, waterfall |
| Lateral erosion | Middle/lower | Meanders, floodplain, widening valley |""",
        19: """Strong vertical erosion · **Upper course** · **River → V-shaped valley · Glacier → U-shaped valley**""",
        20: """Deep, narrow, steep-sided valley · mainly **vertical river erosion**""",
        21: """| Canyon/Gorge | River |
| --- | --- |
| Grand Canyon | Colorado |
| Gandikota | **Pennar** |
| Marble Gorge | Narmada |
| Dhuandhar | Narmada |""",
        22: """Circular/elliptical holes in river bed · swirling pebbles (abrasion) · upper course / rocky beds · **Pothole → river bed → abrasion**""",
        23: """Sudden vertical drop · resistant over soft rock, faulting, rejuvenation, glacial hanging valley · **Waterfall → knick point**""",
        24: """Fast turbulent flow over steep/irregular bed · **Waterfall = abrupt vertical drop · Rapids = steep turbulent flow without one major drop**""",
        25: """Sinuous bend · middle/lower course · **Outer bend = erosion (faster flow) · Inner bend = deposition (slower flow)**""",
        26: """Meander loop cut off from main channel · meander → neck narrows → cutoff → oxbow · **Abandoned meander**""",
        27: """Broad flat depositional surface beside river · flood deposition · **Lower course → deposition**""",
        28: """Raised bank along channel · flood slows near bank → coarse sediment deposited first · **Flood deposition**""",
        29: """Deposition on **inner side of meander** · outer bend = cut bank (erosion) · inner bend = point bar (deposition)""",
        30: """| Delta | River |
| --- | --- |
| Ganga–Brahmaputra | Ganga + Brahmaputra |
| Mahanadi / Godavari / Krishna / Kaveri | Same-name rivers |
| Nile / Mississippi / Mekong | Same-name rivers |

Favourable: large sediment load · shallow coast · weak currents · low tidal removal · **River mouth → deposition**""",
        31: """Fan-shaped deposit where stream exits steep mountain valley onto flat plain · sudden slope decrease → velocity falls → deposition · **Mountain front → alluvial fan**""",
        32: """| Alluvial fan | Delta |
| --- | --- |
| Mountain front | River mouth |
| Stream exits steep slope | Enters standing water |
| Fan-shaped | Triangular/lobate |
| Terrestrial | Aquatic/coastal/lacustrine |""",
        33: """Step-like flat surface on valley sides · older floodplain/valley floor · **Rejuvenation / incision → terrace**""",
        34: """Renewed erosive power: land uplift, sea-level fall, increased discharge → vertical incision · terraces · incised meanders · knick points""",
        35: """Meander deeply cut into landscape · **Rejuvenation + renewed vertical erosion → incised meanders**""",
        36: """| Course | Landforms |
| --- | --- |
| Upper | V-valley, waterfall, gorge, potholes |
| Middle | Meanders |
| Lower | Floodplain, levee, oxbow, delta |""",
        37: """Persistent ice mass moving slowly under gravity · **Mountain/valley glacier · Continental ice sheet**""",
        38: """**Plucking** = ice freezes onto rock and pulls it away · **Abrasion** = debris grinds bedrock""",
        39: """Bowl-shaped hollow at head of glacial valley · cirque / corrie / cwm · **Glacial erosion**""",
        40: """Sharp knife-edge ridge between **two glacial cirques**""",
        41: """Sharp pyramidal peak when **3+ cirques** erode a mountain · classic: Matterhorn""",
        42: """Glacier transforms former river V-valley into **broad U-shaped valley** · **River → V · Glacier → U**""",
        43: """Tributary glacial valley above main valley · often produces **waterfall**""",
        44: """Deep narrow glacial valley flooded by sea · **Norway** · also Chile, NZ, Greenland, Alaska · **Drowned glacial valley**""",
        45: """Asymmetrical bedrock knob · gentle smooth stoss side + steep plucked lee side · **Glacial erosion**""",
        46: """Streamlined till hill · egg-shaped/elongated · long axis parallel to ice movement · **Glacial deposition**""",
        47: """Long winding ridge of sand/gravel from meltwater streams within/beneath ice · **Meltwater deposition**""",
        48: """| Moraine | Location |
| --- | --- |
| Lateral | Glacier sides |
| Medial | Middle of glacier |
| Terminal/End | Terminus |
| Ground | Beneath/behind ice |

Unsorted glacial debris/till · **Glacial deposition**""",
        49: """| Erosional | Depositional |
| --- | --- |
| Cirque (bowl), arête (knife-edge), horn (pyramid), U-valley, hanging valley, fjord, roche moutonnée | Moraine, drumlin, esker |""",
        50: """Important in **arid/semi-arid** regions · **Deflation + abrasion + deposition**""",
        51: """**Deflation** = removal of fine particles · **Abrasion** = sand strikes and wears surfaces""",
        52: """Wind removes loose particles → depression · deflation hollow / blowout""",
        53: """Long streamlined ridge carved by wind · parallel to prevailing wind · **Wind erosion**""",
        54: """Rock shaped/polished by wind-driven sand abrasion""",
        55: """Pedestal with narrow base, wider top · abrasion concentrated near ground level · **Wind erosion**""",
        56: """Isolated resistant hill rising from flat terrain · arid/semi-arid · classic: **Uluru, Australia** · differential erosion residual""",
        57: """Crescent dune · horns point **downwind** · limited sand supply · **Barchan = crescent**""",
        58: """Long narrow dune parallel to prevailing wind · also **seif dune** · **Barchan = crescent · Seif = longitudinal**""",
        59: """Multi-armed pyramid dune · **Winds from multiple directions**""",
        60: """Fine wind-blown silt · often fertile · major deposits in **China** · **Wind deposition**""",
        61: """| Erosional | Depositional |
| --- | --- |
| Deflation hollow, yardang, mushroom rock, ventifact, inselberg | Barchan, seif, star dune, loess |""",
        62: """Develops in **soluble rocks (especially limestone)** · dominant: **carbonation + solution**""",
        63: """Grooved ridged furrowed limestone surface · lappies / karren · **Limestone solution**""",
        64: """Closed depression · dissolution/collapse · **Sinkhole = karst · Doline = sinkhole**""",
        65: """Larger depression from joining/expanding dolines · **Doline → uvala → polje**""",
        66: """Large elongated closed karst depression · flat floor · may hold streams/lakes""",
        67: """Underground cavity · mainly **solution of limestone**""",
        68: """| Feature | Memory |
| --- | --- |
| Stalactite | Hangs from ceiling — **T = Top** |
| Stalagmite | Grows from ground — **G = Ground** |""",
        69: """Stalactite + stalagmite join → column/pillar""",
        70: """Limestone → carbonation · lappies/karren → grooved surface · doline → sinkhole · uvala → joined dolines · polje → large depression · cave → cavity · stalactite → ceiling · stalagmite → floor · column → joined""",
        71: """**Wave erosion + transportation + deposition**""",
        72: """Hydraulic action · abrasion/corrasion · attrition · solution — same logic as river erosion""",
        73: """Wave-cut notch → collapse → retreating cliff · **Sea cliff = wave erosion**""",
        74: """Gently sloping rocky surface in front of retreating cliff · **Cliff retreat → wave-cut platform**""",
        75: """Wave attacks weakness in headland · crack → cave""",
        76: """Cave enlarges until it cuts through headland → arch · **Crack → cave → arch**""",
        77: """Arch roof collapses → stack remains""",
        78: """Continued erosion reduces stack → stump · **Cave → arch → stack → stump**""",
        79: """Alternating hard + soft rocks · soft erodes faster → **bay** · hard resists → **headland**""",
        80: """Sediment accumulation along coast (sand, gravel, shells, pebbles) · **Coastal deposition**""",
        81: """Long narrow sand/gravel ridge projecting from coast · **Longshore drift → spit**""",
        82: """Sand/gravel ridge across bay/inlet · may partially/fully block water""",
        83: """Shallow water separated from open sea by barrier/spit/sandbar""",
        84: """Sand/gravel bar connecting island to mainland or another island""",
        85: """Sediment moves **parallel to coastline** · waves approach at an angle""",
        86: """| Erosional | Depositional |
| --- | --- |
| Sea cliff, wave-cut platform, cave, arch, stack, stump, headland | Beach, spit, bar, lagoon, tombolo |""",
        87: """| Feature | Agent/process |
| --- | --- |
| Cave, cavern | Groundwater solution |
| Stalactite, stalagmite, column | Groundwater deposition |
| Sinkhole, doline, uvala, polje | Limestone dissolution/collapse |""",
        88: """| Process | Landform |
| --- | --- |
| River erosion | V-valley, gorge, canyon, waterfall, meander |
| River deposition | Floodplain, levee, delta, oxbow |
| Glacier erosion | Cirque, arête, horn, U-valley, hanging valley |
| Glacial deposition | Moraine, drumlin, esker |
| Wind erosion | Yardang, mushroom rock, deflation hollow |
| Wind deposition | Barchan, loess |
| Groundwater solution | Sinkhole, cave, doline, polje |
| Groundwater deposition | Stalactite, stalagmite |
| Wave erosion | Sea cliff, cave, arch, stack |
| Coastal deposition | Beach, spit, bar, tombolo |""",
        89: """| Agent | Signature chain |
| --- | --- |
| River | V-valley → meander → oxbow → floodplain → delta |
| Glacier | U-valley → cirque → arête → horn → moraine |
| Wind | Yardang → mushroom rock → barchan → loess |
| Groundwater | Sinkhole → cave → stalactite → stalagmite |
| Sea | Cliff → cave → arch → stack → stump |""",
        90: """| Lock | Association |
| --- | --- |
| V-valley / U-valley | River / Glacier |
| Cirque, arête, horn, moraine, drumlin, esker | Glacier |
| Yardang, barchan, loess | Wind |
| Doline, polje | Karst |
| Stalactite / stalagmite | Ceiling / floor |
| Spit, tombolo | Longshore drift |
| Delta, oxbow, natural levee | River deposition |""",
        91: """| Feature | Lock |
| --- | --- |
| Gandikota | **Pennar River → canyon** |
| Chambal | **Badlands + ravines** |
| Narmada | **Rift/fault valley · Marble Rocks · Dhuandhar** |
| Damodar | **Fault-valley drainage (UPPCS 2019)** |""",
        92: """Highly dissected terrain · gullies, ravines, barren surfaces, soft sediment · **Chambal basin → badlands + ravines**""",
        93: """Deep narrow channels from intense running-water erosion · **Chambal region**""",
        94: """Long narrow depression from tension + faulting · East African Rift, Rhine · **India: Narmada + Tapi = rift/fault-controlled valleys**""",
        95: """| Block | Lock |
| --- | --- |
| Horst | Uplifted between faults — **High** |
| Graben | Downthrown between faults — **Ground/low** |
| Rift valley | Graben-type depression |""",
        96: """| Fold | Shape |
| --- | --- |
| Anticline | Upfold ∩ — **Arch** |
| Syncline | Downfold ∪ — **Trough** |""",
        97: """**Dome** = upwarp, rocks dip outward · **Basin** = downwarp, rocks dip inward""",
        98: """After long differential erosion · inselberg · monadnock · residual hills · **Hard rock survives → residual landform**""",
        99: """Gently sloping rock surface at mountain foot in arid/semi-arid · erosion + sheetwash""",
        100: """Large flat surface from coalescence of pediments · **Pediment → pediplain**""",
        101: """Theoretical low-relief surface from prolonged erosion · long-term fluvial erosion · **Peneplain**""",
        102: """Lowest level to which river can erode · ultimate base level = **sea level**""",
        103: """Different rocks erode at different rates · hard = resistant elevated · soft = depression · produces cuestas, escarpments, residual hills""",
        104: """Asymmetrical ridge from gently dipping resistant strata · gentle dip slope + steep scarp slope""",
        105: """Ridge from uniformly dipping rock strata · cuesta-type landscapes""",
        106: """Steep slope between two level surfaces · faulting, erosion, or differential erosion""",
        107: """Davisian cycle: **Youth → Maturity → Old age** · youth = high relief + vertical erosion · maturity = lateral widening · old age = low relief near peneplain""",
        108: """Renewed erosion from uplift / sea-level fall / increased discharge · terraces · incised meanders · knick points · gorges""",
        109: """Sudden break in river gradient · waterfall or rapid · uplift, rock resistance, base-level change, rejuvenation""",
        110: """| Landform | Process/Agent |
| --- | --- |
| V-valley, gorge, canyon | River erosion / downcutting |
| Pothole | River abrasion |
| Waterfall | Differential erosion / tectonics |
| Meander | Lateral erosion + deposition |
| Oxbow | Meander cutoff |
| Floodplain, levee, delta | River deposition |
| River terrace | Rejuvenation/incision |
| Cirque, arête, horn, U-valley, hanging valley, fjord | Glacial erosion |
| Moraine, drumlin | Glacial deposition |
| Esker | Meltwater deposition |
| Yardang, deflation hollow, mushroom rock | Wind erosion |
| Barchan, seif, loess | Wind deposition |
| Doline, uvala, polje, cave | Karst |
| Stalactite, stalagmite | Groundwater deposition |
| Sea cliff, wave-cut platform, cave, arch, stack | Wave erosion |
| Beach, spit, bar, tombolo, lagoon | Coastal deposition |
| Pediment, pediplain | Arid erosion |
| Peneplain | Prolonged fluvial erosion |
| Inselberg, cuesta | Differential erosion |""",
    }


BODIES = _bodies()

HEADER = """---
hide:
  - toc
---

<div class="fact-lock-hero" markdown="0">
<p class="fact-lock-hero__eyebrow">Geography · Part 2</p>
<h1 class="fact-lock-hero__title">Geomorphology</h1>
<div class="fact-lock-meta">
<span class="fact-lock-pill fact-lock-pill--high">Very high</span>
<span class="fact-lock-pill">Prelims ~9/10</span>
</div>
</div>

<div class="fact-lock-sheet fact-lock-sheet--dense" markdown="1">
"""

MUST_RATTA = """
## MUST RATTA

| Agent | Locks |
| --- | --- |
| **River** | Hydraulic action · abrasion · attrition · V-valley · meander outer=erosion inner=deposit · oxbow · floodplain · levee · delta · Gandikota=Pennar · Chambal=ravines · Damodar=fault valley |
| **Glacier** | Plucking · abrasion · cirque · arête · horn · U-valley · hanging valley · fjord · moraine · drumlin · esker |
| **Wind** | Deflation · abrasion · yardang · mushroom rock · barchan (horns downwind) · seif · star dune · loess |
| **Karst** | Limestone · carbonation · doline · uvala · polje · stalactite=ceiling · stalagmite=floor |
| **Coast** | Cliff · cave → arch → stack → stump · beach · spit · bar · lagoon · tombolo · longshore drift |

## The 1-Minute Geomorphology Sheet

| Chain | Recall |
| --- | --- |
| River | V → gorge → waterfall → meander → oxbow → floodplain → delta |
| Glacier | U → cirque → arête → horn → moraine |
| Wind | Yardang → mushroom → barchan → seif → loess |
| Karst | Doline → uvala → polje → cave → stalactite/stalagmite |
| Sea | Cliff → cave → arch → stack → stump |
| Arid | Pediment → pediplain |
| Long erosion | Peneplain |
| Faulting | Rift valley → horst + graben |
| Differential | Hard + soft rock → cuesta / residual relief |
"""

FOOTER = """
</div>
"""


def main() -> None:
    parts = [HEADER]
    for i, title in enumerate(TITLES, start=1):
        parts.append(f"## {i}. {title}\n\n")
        parts.append(BODIES[i])
        parts.append("\n\n")
    parts.append(MUST_RATTA)
    parts.append(FOOTER)
    out = Path(__file__).with_name("02_Geomorphology.md")
    out.write_text("".join(parts), encoding="utf-8")
    print(f"Wrote {out} ({len(parts)} blocks, {out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
