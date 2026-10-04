#!/usr/bin/env python3
"""One-shot: replace consolidated Must-Score Facts in Topics 20–23."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
GEO = ROOT / "docs" / "subjects" / "geography"

FACTS: dict[str, tuple[int, list[str]]] = {}

FACTS["20_World_Agriculture.md"] = (45, [
    "In plantation MCQs the classic plantation crop is **tea**, not wheat, rice, or maize. Plantation means estate, capital, monoculture, hired labour, and export. **Fazenda** = Brazil plantation; it is **not** jhum.",
    "Coffee producer order often taught for **2016** is **Brazil > Vietnam > Colombia > Indonesia**. Brazil is mainly **arabica** on Terra Roxa; Vietnam is bulk **robusta**. **Mocha** = Yemen; **Kona** = Hawaii. Ethiopia is the arabica **origin** story, not that tonnage king.",
    "Major cocoa producers are **Côte d’Ivoire, Ghana, and Cameroon**. **Latvia** is not a cocoa producer. Cocoa originated in the Amazon; chocolate manufacturing centres (Switzerland, Belgium) are not the same as growers.",
    "India’s rubber fact is **Kerala**. Rubber (*Hevea*) originated in the Amazon; **Henry Wickham** moved seed stock to Ceylon / Malaya. Malaysia’s **Kinta Valley** is **tin**, not rubber. Tree tapping starts after about **6–7 years**. Recent world rubber volume often tags **Thailand**.",
    "Shifting-cultivation names: **Jhum** (NE India), **Podu** (Andhra/Odisha), **Ladang** (Malaysia), **Milpa** (Mexico), **Roca** (Brazil), **Chena** (Sri Lanka), **Caingin** (Philippines), **Taungya** (Myanmar). It needs low density, short crop years and long fallow — not estate tea.",
    "The world **citrus** / vine / olive belt is **Mediterranean** on five **west coasts** near **30–45°** (Med basin, California, C Chile, Cape, SW Australia), not equatorial. **Olive** majors = Spain, Italy, Greece.",
    "Philippines cane and coconut history fact: **Spanish and Americans**. Dutch = Indonesia estates; British = Malaya rubber / Ceylon tea. Wrong Indian crop–state dumps include Gujarat–tea, UP–jute and Assam–wheat. Right pairs: **Kerala–rubber**; **Assam–tea** volume.",
    "**Oil palm** majors are **Indonesia and Malaysia**. World **sugarcane** leader is **Brazil**; **sugar beet** belongs to temperate **Europe** (France / Russia / Ukraine belt).",
    "For rice and wheat, **China and India** lead in **volume**, but classic **exporters** are often other countries (Thailand / Vietnam / India / Pakistan / USA for rice; Russia / USA / Canada / France / Australia for wheat). **Golden rice** carries **Vitamin A**.",
    "Rice types: **Indica** (long-grain South / SE Asia), **Japonica** (stickier East Asia), **Javanica** (Indonesia). **IRRI** sits at **Los Baños, Philippines**; classic HYV rice = **IR-8**. Rice climate ≈ **20–27°C** and **100–200 cm** rain or irrigation.",
    "Wheat needs cool growth and bright ripening (~**50–75 cm** rain). **Winter wheat** = autumn sow in mild-winter belts; **spring wheat** = spring sow in harsh-winter Prairie / Siberia; **durum** = pasta wheat of the Mediterranean.",
    "**Intensive subsistence** = monsoon wet rice. **Extensive commercial grain** = Prairie / Pampas / Downs / steppe wheat. **Mixed farming** = crops plus livestock (West Europe / US Midwest). Ranching belts = Pampas, Prairie, Veld, Downs.",
    "**Black tea** is fermented; **green tea** is not; **oolong** is semi-fermented. The pluck fact is **two leaves and a bud**. Tea likes **20–30°C**, **150–300 cm** rain, slope and acid soil. China leads tea volume; Assam leads Indian volume; Kenya is a classic African export name.",
    "**Von Thünen** = market rings around a city (distance rent: dairy/veg → forestry → intensive crops → grain → ranching). **Whittlesey** = about **thirteen** world agricultural region types. Do not merge the two models.",
    "Cotton: long staple = **Egypt / Sudan** (and Sea Island); medium = USA Upland; short staple = India–Pakistan–China belt. Maize volume order often **USA > China > Brazil**; **US Corn Belt** is the classic tag.",
    "Banana: India produces heavily; **Ecuador** is a classic shipper. Silk and wool volume often centre on **China**; Australia is famous for **Merino** wool. **Shahtoosh** = Chiru wool. Pig numbers often tag **China**.",
    "Soy export triangle = **USA–Brazil–Argentina**. India leads world **milk volume**; New Zealand and the Netherlands dominate the dairy-**export** story. World Food Day = **16 October**.",
    "**IRRI** (Philippines) drove HYV rice; **CIMMYT (Mexico)** and **Norman Borlaug** drove HYV wheat — Nobel for **Peace** (**1970**), not “agriculture.” **FAO** HQ = **Rome**. Green Revolution package = HYV + water + fertiliser + pesticide.",
    "Term cards: **apiculture** = bees; **viticulture** = grapes; **sericulture** = silk (**China** leads volume); **floriculture** hub = Netherlands; **olericulture** = vegetables; **pisciculture** = fish rearing; **horticulture** = fruit / veg / flowers.",
    "India often leads milk + banana + castor; China leads tea / tobacco / silk volume stories; Brazil leads cane + coffee #1; Thailand is a rubber story. **Golden Crescent** = Afghanistan–Iran–Pakistan opium.",
    "Jute (“golden fibre”) world is almost entirely **India and Bangladesh** on Ganga–Brahmaputra alluvium — do not treat UP as a jute state.",
    "Plantation vs shifting: plantation = capital estate monoculture for export; shifting = humid-tropics slash-and-burn subsistence. They are not the same system.",
    "Subsistence farming feeds the family with little surplus; **commercial** farming grows for market / export. **Sedentary** stays on fixed fields; nomadic herding and shifting plots **move**.",
    "Mediterranean agriculture grows citrus, vine, olive, winter wheat and vegetables under **winter rain** and dry bright summers — not under equatorial cloud.",
    "Dairy farming classics = NW Europe, Great Lakes, New Zealand, Denmark and the Netherlands. Truck / market gardening sits on **urban fringes** for perishable vegetables, fruit and flowers.",
    "Commercial wheat belts: **Prairies** (Canada–USA), **Pampas** (Argentina), **Downs** (Australia), Ukrainian–Russian **steppe**, and N European plain (France export story).",
    "Millets / coarse grains belong to **drought** belts of Africa and India — low rain, not 200 cm tea slopes.",
    "Coffee climate wants **15–28°C**, **150–250 cm** rain, shade and no frost. Coffee rust (*Hemileia*) is a famous plantation disease linked to Ceylon’s historic tea shift.",
    "Cocoa wants equatorial heat, shade and high rain; pods grow on the trunk (**cauliflory**). Growers ≠ chocolate manufacturers.",
    "Oilseeds map: groundnut tropics; rapeseed / canola cool temperate (Canada–EU–China–India); sunflower temperate (Russia–Ukraine–Argentina). Oil palm ≠ olive; oil palm ≠ rubber.",
    "India coffee belt = Karnataka (Kodagu / Chikmagalur / Hassan) ahead of Kerala and Tamil Nadu — not Assam as coffee king.",
    "Nomadic herding = Sahara–Arabia–Central Asia–tundra subsistence with camel, sheep, yak or reindeer. Livestock **ranching** on Pampas / Downs / Veld is commercial — do not merge the two.",
    "Spice Islands / Maluku story = Indonesia cloves and nutmeg. Vietnam / India / Indonesia share the pepper trade map; cardamom classics = Guatemala and India’s Kerala–Karnataka hills.",
    "Collective / cooperative teaching examples include former USSR kolkhoz, Israel kibbutz and Denmark dairy co-ops — secondary to the main Whittlesey systems.",
    "Producer ≠ exporter remains the chapter rule for rice, wheat, tea, banana and milk: China / India volume leaders often do **not** own the classic export nickname.",
    "Rubber climate wants **25–35°C**, evenly high rain (**>200 cm**), humidity and no frost. Natural rubber ≠ synthetic neoprene chemistry fact.",
    "Tea processing ladder: black = fully fermented; green = not fermented; oolong = semi-fermented; CTC = crush–tear–curl bulk; orthodox = whole-leaf quality.",
    "Whittlesey’s rice-dominant intensive subsistence belts = East / Southeast / South Asia deltas and coasts; intensive without paddy = North China, interior India wheat–millet and Nile-type belts.",
    "Commercial plantation belts in the Whittlesey map include Caribbean estates, NE India–Sri Lanka tea, Malaysia–Indonesia rubber/palm, Brazil coffee and West Africa cocoa.",
    "India cattle inventory is often #1, but beef-export leaders are usually Brazil / Australia / USA — do not equate herd size with beef-ship leadership.",
    "Groundnut and tobacco volume stories often put **China** high; castor oilseed leadership often tags **India** in coaching frames.",
    "Philippines coconut + cane credit is Spanish–American; do not dump Dutch (Indonesia) or British (Malaya) onto that pair.",
    "Von Thünen’s outer ring is livestock ranching; forestry sits near the city because wood is bulky — climate-region names belong to Whittlesey, not Thünen rings.",
    "Hybrid-rice volume association often tags **China**; India’s harvested rice **area** is often the largest even when China leads rice **output**.",
    "World Food Day is **16 October**; FAO HQ is **Rome**; Borlaug’s Nobel is **Peace (1970)** — three separate identity facts that papers still mix.",
])

FACTS["21_World_Minerals_Energy.md"] = (46, [
    "Coalfield–country pairs: **Appalachian–USA**, **Lancashire–England**, **Ruhr–Germany**, **Kuzbass–Russia**. **Donetsk / Donbas** = Ukraine’s coal centre. **Karaganda** = Kazakhstan coal city.",
    "**Mount Newman / Pilbara / Hamersley** = **iron** in Western Australia. **Krivoy Rog** = Ukraine iron. **Lorraine** and **Normandy** = France (Germany–Normandy iron is wrong). **Kiruna** = Sweden magnetite. **Mesabi** = USA Lake Superior.",
    "Iron exporters = Australia (**Pilbara**) and Brazil (**Carajás** / Minas). China mines iron and still imports heavily. **Hematite** = red bulk ore; **magnetite** = black highest grade.",
    "**Chile** leads copper with northern Andes **porphyry** deposits (**Chuquicamata**, **El Teniente**, Escondida). Also fact Katanga (DRC), Copperbelt (Zambia), and Bingham Canyon (USA).",
    "Malaysia’s **Kinta Valley** = **tin** (cassiterite). Also tin centres: Bangka–Belitung (Indonesia) and the Andes of Bolivia. Myanmar’s **Pegu Yoma** = **mineral oil**, not tin (tin sits in Tenasserim).",
    "**Kashagan** oil is in **Kazakhstan**, not Kuwait. **Burgan** = Kuwait. Also fact Ghawar / Dhahran (Saudi), Kirkuk / Zubair (Iraq), Haft Kel (Iran), Baku (Azerbaijan). **Brent** = North Sea light crude.",
    "Natural gas’s main constituent is **methane**. **LPG** (propane–butane) is not the same as **CNG**. Qatar’s **North Field** and Iran’s **South Pars** are one continuous Gulf gas giant.",
    "**Postmasburg** (South Africa) = **manganese** (not uranium / mica / bauxite). Also Mn: Moanda (Gabon), Groote Eylandt (Australia), Nikopol (Ukraine).",
    "Bauxite → aluminium: **Weipa / Gove / Darling Range** (Australia); **Guinea** for reserves renown; Les Baux (France) is the name origin. Mount Newman is **iron**, not bauxite.",
    "Gold: **Witwatersrand** (South Africa historic); Kalgoorlie (Australia); modern volume often **China**. Diamond: **Kimberley** / kimberlite (South Africa); Golconda is historical **India**.",
    "Nickel: **Sudbury** (Canada) and **Norilsk** (Russia). Chromite: **Bushveld** (South Africa) and Great Dyke (Zimbabwe). Lead–zinc: **Broken Hill** / Mount Isa (Australia).",
    "Phosphate rock king = **Morocco**. Potash names include Canada (Saskatchewan) and the Dead Sea belt. **Iodine** (2018 spelling “lodine”) fact = **Chile** Atacama caliche.",
    "Uranium volume often facts on **Kazakhstan**; Canada **Athabasca**; Australia **Olympic Dam** (U + Cu + Au). **Uranium City** = **Canada**. Thorium / monazite sands = India (Kerala–TN), Brazil, Australia.",
    "**Lithium Triangle** = Chile–Argentina–Bolivia (Brazil is **not** in it). Cobalt volume = **DRC**. REE processing fact = **China**. Tungsten volume often **China**.",
    "Nuclear and geothermal energy are **not** “stored solar”. Wind, biomass and hydro are solar-linked renewables. Coal, oil and gas are conventional non-renewables. Tidal energy is linked to the Moon’s gravity in usual teaching.",
    "**OPEC** HQ = **Vienna**. Original OPEC five (**1960**): Iran, Iraq, Kuwait, Saudi Arabia, Venezuela. North Sea oil/gas = UK–Norway; West Siberia = Russia’s giant hydrocarbon province. IAEA HQ is also Vienna — different job.",
    "**Itaipu** = Brazil–Paraguay hydel on the Paraná. **Three Gorges** = China on the Yangtze. Steel tonnage top = **China**.",
    "Ancient **shields** host many metals. Sedimentary **basins** host coal, oil and gas. Andean porphyry belts host copper, with lithium brines nearby in the same broad story.",
    "**German silver** contains **no silver** (Cu–Ni–Zn). **Peace Pipeline** = Iran–Pakistan. Sheet **mica** classic = **India**. Platinum = Bushveld / Norilsk.",
    "Coal rank rises in carbon from peat → lignite → bituminous → anthracite. Coking coal is for steel; lignite is thermal-only. Pennsylvania anthracite and South Wales are high-rank names.",
    "Coal producer ≠ exporter: China is the huge volume miner–consumer; classic shippers include **Indonesia, Australia, Russia, USA and South Africa**.",
    "Brass = copper + zinc; bronze = copper + tin. Chalcopyrite is the chief copper ore. Do not swap brass / bronze alloys.",
    "Oil reserves names often put Venezuela / Saudi Arabia high; production names often put USA / Saudi / Russia high — freeze a year only when the paper quotes it.",
    "Gas reserves names often tag Russia / Iran / Qatar; LNG export classics = Qatar / Australia / USA. Groningen = historic Netherlands giant; Urengoy = West Siberia volume gas.",
    "Geothermal classics: Iceland (power + heating), New Zealand (Rotorua / Taupo), Philippines (Ring of Fire), USA The Geysers, Italy Larderello (first plant).",
    "Tidal classics: **La Rance** (France) and Sihwa (Korea). India’s potential teaching often ranks Gulf of Khambhat ahead of Kutch.",
    "Nuclear electricity **share** classic = **France**; large **capacity** classic = USA. Main nuclear fuel = uranium.",
    "Solar and wind capacity leadership often tags **China**; high wind-share teaching names include Denmark and the UK.",
    "Saar = Germany–France border coal story; Silesia Upper = Poland coal–steel; Lusatia / Rhineland lignite = Germany — do not dump Saar as an iron-field only.",
    "Australia Hunter Valley and Bowen Basin are export coal names; South Africa Witbank / Highveld are coal tags; India’s Damodar (Jharia coking / Raniganj) is the India-map contrast.",
    "Carajás = Brazil iron (Amazon-side giant); Itabira / Minas Gerais = Brazil iron quadrangle; Cerro Bolívar = Venezuela iron — keep them off the Pilbara list.",
    "Sudbury yields nickel **with** copper; Grasberg (Indonesia) is copper **with** gold — polymetallic traps sit next to pure Cu/Ni dumps.",
    "Morocco phosphate ≠ Moroccan oil; Broken Hill Pb–Zn ≠ Broken Hill iron; Mesabi = iron, not copper.",
    "Silver volume often tags **Mexico** in recent frames; primary aluminium volume often tags **China**; diamond volume often tags **Russia**.",
    "Non-ferrous teaching set = aluminium, copper, zinc, nickel, tin — pig iron and carbon steel are ferrous products.",
    "Ras Tanura = Saudi export / refining terminal; Masjid-i-Suleiman = early Iran commercial oil story; Yenangyaung–Chauk sit with Myanmar’s Pegu Yoma oil belt.",
    "IEA HQ = Paris; IRENA HQ = Abu Dhabi; OPEC and IAEA share Vienna as a city but not as a job description.",
    "Gasohol teaching ≈ 90% gasoline + 10% ethanol — USA classic producer/consumer frame.",
    "First commercial oil teaching often parks Romania (1857 register) beside Drake 1859 Titusville (USA) — two classic “first well” stories, not one exclusive key.",
    "Camphor tree native belt in coaching lists = China / Japan (*Cinnamomum camphora*) — not a mineral, but a GC extras neighbour on the same sheet.",
    "Producer vs exporter for iron and coal: China can lead volume and still import; Australia / Brazil / Indonesia often own the shipping nickname.",
    "Anthracite = highest-rank hard coal; lignite = brown soft thermal coal — swapping them flips coking / thermal logic.",
    "Katanga (DRC) and Zambia Copperbelt are the African copper–cobalt pair opposite Chile’s Andes porphyry story.",
    "Olympic Dam (Australia) is the multi-metal U + Cu + Au deposit — do not park it as a pure gold or pure iron dump.",
    "Hydro needs fall + discharge: Three Gorges / Itaipu / Grand Coulee / Aswan High / Guri are the usual world match bank.",
    "Energy classification check: coal / oil / gas = conventional non-renewable; wind / biomass / hydro = renewable solar-linked; nuclear and geothermal stand apart from “stored solar” wording.",
])

FACTS["22_World_Industries.md"] = (45, [
    "**Weight-losing** industries (iron–steel, sugar, timber) sit near bulky raw materials. **Weight-gaining** industries (bottling, brewing) sit near the **market**.",
    "**Aluminium** and electro-chemicals seek cheap **hydel**. **Oil refining** often sits at a port or pipeline end. **Cement** follows bulky limestone.",
    "**Footloose** industries (electronics, software, diamond cutting) are light and high-value — not tied to a coalfield. **Silicon Valley** (California) = electronics / IT, not Detroit.",
    "Classic location factors are raw material, power, labour, market, transport, agglomeration and government/SEZ — not “any city works.”",
    "City–industry pairs: **Osaka–cotton**, **Detroit–auto**, **Cuba–cigar**, **St Petersburg–shipbuilding**.",
    "**Akron** = tyres / rubber (USA). **Toulouse** = Airbus. **Seattle** = Boeing. **Hollywood / Los Angeles** = films. Swiss Jura = watches.",
    "Japan nicknames: **Osaka** = Manchester of Japan (cotton); **Nagoya** = Detroit of Japan (autos); **Kawasaki** = Pittsburgh of Japan (steel). **Ivanovo** = Russian Manchester.",
    "Japan belts: **Keihin** = Tokyo–Yokohama; **Hanshin** = Osaka–Kobe; **Chukyo** = Nagoya autos.",
    "**Ruhr** (Germany) = coal, steel, heavy engineering (Essen–Dortmund–Duisburg). **Lancashire** = cotton; **Yorkshire** = wool.",
    "**Pittsburgh–Great Lakes** = steel (Mesabi ore + Appalachian coal story). **Detroit** = automobiles and parts agglomeration.",
    "Italy’s industrial triangle is the **Po Basin / Milan–Turin–Genoa** belt. **Wolfsburg** and **Turin** are classic auto centres.",
    "China’s classic coastal manufacturing story includes the **Pearl River Delta**; **Shanghai** leads common container-port MCQs. Shipbuilding volume leaders = **China–South Korea–Japan**.",
    "Europe coal–steel belt tags: **Saar**, **Lorraine** (France iron/steel), **Sambre–Meuse** (Belgium), **Upper Silesia** (Poland), **Randstad** (Netherlands port + manufacturing).",
    "**Aberdeen** = oil capital of Europe. Japan’s steel is largely **port / market-based** because ore and coal are imported.",
    "**Igarka** is in **Russia** (Yenisei timber), not China. **Rotterdam** is in the **Netherlands**. **Montevideo** = Uruguay. **Jakarta** = Indonesia.",
    "**Duisburg** is an inland **Rhine** port in **Germany**, not a Dutch sea mouth. Break-of-bulk points concentrate at ports and lake/rail junctions.",
    "**Entrepôt** classics = **Singapore, Rotterdam, Hong Kong** — import, store/sort, re-export.",
    "The **Suez Canal** joins the **Mediterranean** and **Red Sea**, cuts India–Europe distance by about **7000 km**, and is a **sea-level** cut (no stepped chambers).",
    "Suez lakes north to south: **Manzala → Timsah → Great Bitter → Little Bitter**. **Port Said** = north end; **Suez** town = south end.",
    "**Panama** joins Atlantic / Caribbean and Pacific **with stepped chambers** and **Gatun Lake**. **Kiel** joins the **North Sea** and **Baltic**.",
    "Shipbuilding likes deep estuaries: Glasgow, St Petersburg, Yokohama, Busan, Belfast. Textiles seek labour + market clusters.",
    "**Chinook** = warm dry Rockies wind; **Foehn** = Alps equivalent. Both can be true together in a multi-statement stem.",
    "**Mistral** = southern France / Rhône (**not** Australia). **Shamal** = Arabia / Persian Gulf (**not** Austria). **Brickfielder** = Australia.",
    "A **willy-willy** is an Australian **cyclone** name, not a local wind like Brickfielder.",
    "More local-wind pairs: **Santa Ana** = California; **Haboob** = Sudan; **Yamo** = Japan; **Leveche** = Spain; **Bora** = Adriatic cold; **Harmattan** = West Africa; **Sirocco** = Sahara→Med; **Khamsin** = Egypt.",
    "Cotton textiles favour humid labour districts (Lancashire, Osaka, Mumbai–Ahmedabad). Wool follows sheep hinterland + mill town (Yorkshire).",
    "Iron–steel classic locations: coalfield, ore field, or lake/port mixing both. Sugar and sawmills pull to bulky perishable cane/timber.",
    "Aircraft needs tech + large airfield (**Toulouse** Airbus; **Seattle** Boeing). Pharma / electronics pull capital and R&D.",
    "**Least-cost** idea: plant sits where assembly + processing + distribution cost is lowest. Ubiquitous inputs (air, water) do not pull location; localised minerals do.",
    "Agglomeration keeps auto parts around Detroit / Nagoya / Turin. Government / SEZ can create planned estates.",
    "Do not swap Suez and Panama: Suez = Med–Red, no locks; Panama = Atlantic–Pacific, with locks / Gatun.",
    "Do not dump Duisburg into the Netherlands or call Igarka Chinese. Do not park Silicon Valley on Detroit.",
    "Port–country traps: Rotterdam = Netherlands; Montevideo = Uruguay (not Argentina); Jakarta = Indonesia.",
    "**Manchester of the East** tag for Osaka means cotton, not autos. Nagoya holds the auto nickname.",
    "Container / entrepôt story: Shanghai for volume MCQs; Singapore–Rotterdam–Hong Kong for re-export hubs; Rhine mouth = Rotterdam.",
    "Lorraine = France iron–steel; do not park Normandy iron under Germany (that belongs with France in mineral chapters).",
    "Film industry classic = Hollywood / Los Angeles. Watch industry classic = Switzerland (Alps–Jura skilled labour).",
    "Soft teaching still separates **primary** (mines/fields) from **secondary** (this chapter’s factories) — world industries = secondary activities plus Lucent port/canal/wind lists.",
    "**Break-of-bulk** industries (oil refining, flour, lake-steel) concentrate where cargo changes mode — ports, lakes, railheads.",
    "Cold vs warm wind traps: Bora / Mistral are cold or cold-dry Mediterranean stories; Chinook / Foehn / Santa Ana are warm-dry downslope / desert-margin winds.",
    "Harmattan = dusty West African winter wind; Sirocco / Khamsin / Leveche are hot dusty Sahara-outflow families toward the Med / Spain / Egypt.",
    "Industrial region map spine: Ruhr, UK Lancashire/Yorkshire, US Great Lakes–Detroit, Po Basin, Japan Pacific belts, Pearl River Delta, Chotanagpur (India mineral heartland contrast).",
    "When a stem says “Manchester of …”, map cotton. When it says “Detroit of …”, map autos. When it says “Pittsburgh of …”, map steel.",
    "Canal distance / geometry traps: Suez ~7000 km India–Europe saving; Panama uses locks; Kiel is North Sea–Baltic only.",
    "Local-wind vs cyclone trap: Brickfielder = local wind (Australia); willy-willy = cyclone name (Australia) — do not merge them.",
])

FACTS["23_Political_Map_Geography.md"] = (48, [
    "UNCLOS: **territorial sea 12 nm**, **contiguous zone 24 nm**, **EEZ 200 nm**. The continental shelf may extend to **350 nm**, but that does **not** push EEZ water beyond 200.",
    "**Innocent passage** applies in the territorial sea. **Transit passage** applies in international straits. One nautical mile ≈ **1.852 km**.",
    "**McMahon Line** = India–China (1914, Simla / Henry McMahon). **Durand Line** = Pakistan–Afghanistan (1893). **Radcliffe Line** = 1947 India–Pakistan/Bangladesh.",
    "India has **seven** land neighbours (Pakistan, Afghanistan via Wakhan/PoK, China, Nepal, Bhutan, Myanmar, Bangladesh). Maritime neighbours are **Sri Lanka** and the **Maldives**.",
    "Longest Indian **state** coastline = **Gujarat**. Longest land border = **Bangladesh**. Shortest land border = **Afghanistan**. Mainland plus islands coastline ≈ **7516 km**. Nine coastal states; **Telangana** is not coastal; shortest coastal state often **Goa**.",
    "The **Suez Canal** joins Med and Red Sea, shortens India–Europe by about **7000 km**, and lakes run Manzala → Timsah → Great Bitter → Little Bitter.",
    "**Panama** = Atlantic–Pacific canal (with stepped chambers / Gatun Lake). **Kiel** = North Sea–Baltic.",
    "Straits: **Hormuz** = Persian Gulf oil chokepoint; **Malacca** = Indian Ocean–South China Sea; **Gibraltar** = Med–Atlantic; **Bosporus** = Black Sea–Marmara; **Bering** = Russia–USA.",
    "Area ladder: Russia > Canada > USA > China > Brazil > Australia > **India (7th)**. Longest world coastline = **Canada** (then Indonesia, Russia, Philippines, Japan, Australia in the usual set).",
    "Central Asia capital set: Uzbekistan **Tashkent**, Tajikistan **Dushanbe**, Kyrgyzstan **Bishkek**, Turkmenistan **Ashgabat**; Kazakhstan capital = **Astana** (Nur-Sultan phase), not Almaty.",
    "**Bolivia** is landlocked among common South America traps. **Laos** = only SE Asia landlocked. **Nobi/Kanto** = Japan. **Igarka** = Russia.",
    "**Thornthwaite** is the true **vegetation** climate index. **Köppen** gives letter-code climate classes. Mediterranean = **winter rain** (**Cs**). Western Europe = rain **all months** plus westerlies (**Cfb**).",
    "India is the **seventh**-largest country, about **2.4%** of world land, with the Tropic of Cancer through the middle — so India is **not** wholly tropical. The Tropic does **not** cross **Uttar Pradesh**.",
    "**Cape Verde** capital = **Praia**. **Bamako** = Mali. Only common double-landlocked states: **Uzbekistan** and **Liechtenstein**.",
    "Uttar Pradesh’s only foreign neighbour is **Nepal**. Mainland India latitudinal extent ≈ **8°4′N to 37°6′N**; **6°4′N** is Indira Point (islands).",
    "Largest landlocked country by area = **Kazakhstan**. Most populous landlocked = **Ethiopia**. **Lesotho** is an enclave inside South Africa.",
    "**49th Parallel** ≈ USA–Canada. **38th Parallel** ≈ Koreas. Maginot ≈ France–Germany; Rio Grande ≈ USA–Mexico; Oder–Neisse ≈ Germany–Poland.",
    "Equator traps: Egypt and Mexico are **not** equatorial countries in the usual MCQ sense. North America and Oceania have no classic landlocked sovereign states.",
    "Capitals ≠ famous cities: Australia **Canberra**; Brazil **Brasília**; Nigeria **Abuja**; Myanmar **Naypyidaw**; Tanzania **Dodoma**; Türkiye **Ankara**; Slovenia **Ljubljana** (Bratislava = Slovakia).",
    "Old names: Siam→Thailand; Formosa→Taiwan; Gold Coast→Ghana; Dutch Guiana→**Suriname**; Southern Rhodesia→Zimbabwe; Ceylon→Sri Lanka; Burma→Myanmar; Abyssinia→Ethiopia.",
    "Horn of Africa = Djibouti, Eritrea, Ethiopia, Somalia (**not Sudan**). Balkans include Slovenia/Greece/etc. — **Austria not** Balkan. Oceania excludes **Indonesia**. Caspian five exclude Armenia/Iraq.",
    "Greenland = Denmark politically / N America geographically. Gaza borders **Egypt + Israel**. Afghanistan does **not** border Russia. Dead Sea shores = Israel / West Bank / Jordan — not Lebanon.",
    "**Norway** = Land of the Midnight Sun (Arctic Circle). **Japan** = Land of the Rising Sun. **Finland** = Thousand Lakes. **(South) Korea** = Morning Calm. **Thailand** = White Elephants.",
    "**South America** = Bird Continent. **Sri Lanka** = Mistress of the Eastern Sea / Pearl of the Indian Ocean. **Singapore** = Gateway to Asia. **Istanbul** = Gateway to the West.",
    "City tags: **Venice** = canals; **Osaka** = Manchester of the East; **San Francisco** = Golden Gate; **Chicago** = City of Smoke; **Buenos Aires** = Paris of South America; **St. Petersburg** = Venice of the North.",
    "**Pamir** = Roof of the World. **Baikal** = Pearl of Siberia. **Bahrain** = Island of Pearls. **Aberdeen** = Oil Capital of Europe. **Ninety East Ridge** = Indian Ocean.",
    "LoC = India–Pakistan (J&K); LAC = India–China actual control; Sir Creek = India–Pakistan creek / maritime Kutch–Sindh story — do not dump them onto McMahon / Durand.",
    "India’s extremes teaching: south **Indira Point** (islands) / mainland Kanyakumari; west **Ghuar Mota** (Gujarat); east **Kibithu** (Arunachal); IST meridian **82°30′ E**.",
    "Sri Lanka sits across **Palk Strait / Gulf of Mannar**; Maldives across the **8° Channel**. Tajikistan is **not** an India land neighbour.",
    "UNCLOS timeline: adopted **1982**, in force **1994**, India party from **1995**. High seas beyond national zones keep freedom of navigation; the Area seabed is common heritage (ISA HQ Kingston).",
    "Continent peaks match bank: Asia **Everest**; Africa **Kilimanjaro**; South America **Aconcagua**; North America **Denali**; Europe **Elbrus** (usual coaching); Antarctica **Vinson**; Australia **Kosciuszko** (continent) / Carstensz if Oceania framing.",
    "Range–region pairs often asked: Andes–South America; Rockies–North America; Alps–Europe; Atlas–NW Africa; Great Dividing Range–Australia; Urals–Europe/Asia divide teaching.",
    "River mouths / seas: Nile→Mediterranean; Amazon→Atlantic; Congo→Atlantic; Volga→Caspian; Danube→Black Sea; Rhine→North Sea; Indus→Arabian Sea; Ganga–Brahmaputra→Bay of Bengal.",
    "Lakes: **Baikal** = deepest / largest freshwater by volume (Siberia); **Caspian** = largest lake / inland sea; **Superior** = largest freshwater by area among Great Lakes set; Dead Sea = hypersaline rift low.",
    "Port–country map: Rotterdam–Netherlands; Shanghai–China; Singapore–Singapore; Hamburg–Germany; Santos–Brazil; Mombasa–Kenya; Karachi–Pakistan; Chittagong–Bangladesh.",
    "Dependent territories: Greenland–Denmark; Falklands–UK; Puerto Rico–USA; Canaries–Spain; Azores–Portugal; Christmas Island–Australia.",
    "Great Britain = England + Wales + Scotland (**not** Northern Ireland). UK adds Northern Ireland. Chechnya = republic of **Russia**.",
    "Arabian Peninsula core = Saudi Arabia, Yemen, Oman, UAE, Bahrain, Qatar, Kuwait — **Syria not**. UAE has **seven** emirates.",
    "Afghanistan neighbours = Iran, Pakistan, China, Tajikistan, Uzbekistan, Turkmenistan (+ India SE teaching note) — not Russia / Azerbaijan / Kyrgyzstan as the usual wrong trio.",
    "Myanmar neighbours = India, Bangladesh, China, Laos, Thailand — not Vietnam / Cambodia / Malaysia as that trio.",
    "Israel land borders = Lebanon, Syria, Jordan, Egypt. Chile’s extreme N–S length is a common South America trap option.",
    "Indonesia land borders = Malaysia, Papua New Guinea, Timor-Leste — **not Brunei**. Japan is the largest among common “island state without land border” options vs NZ / Philippines / Cuba.",
    "South Asia area: India largest; **Maldives** smallest. South Asia set ≈ Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, Sri Lanka, Afghanistan.",
    "Köppen quick tags: **Af** equatorial rainforest; **Am** monsoon; **Aw** tropical savanna; **BWh** hot desert; **Cs** Mediterranean winter rain; **Cfb** marine west-coast all-year rain; **ET/EF** tundra / ice.",
    "Mountain pass / strait neighbours often revised with canals: Hormuz for Gulf oil; Malacca for East Asia trade; Gibraltar for Med access; Bosporus for Black Sea access.",
    "Most megacities are coastal as **ocean gateways**. Alaska = USA; Malta = Mediterranean island state; Baikonur = **Kazakhstan**.",
    "Mindanao = Land of Promise (Philippines teaching). Bird Continent = South America — not Australia. Morning Calm = Korea — not Japan.",
    "Shelf rights beyond 200 nm (up to 350) are seabed rights — they do not create a wider EEZ water column. Contiguous zone is for customs / fiscal / immigration / sanitary control, not full sovereignty like the territorial sea.",
])


def replace_facts(path: Path, count: int, facts: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    body = "\n".join(f"{i}. {fact}" for i, fact in enumerate(facts, 1)) + "\n\n"
    pattern = re.compile(
        r'<details class="st-chapter-toggle st-toggle-facts"[^>]*>\s*'
        r"<summary><strong>🎯 Consolidated — \d+ Must-Score Facts</strong>"
        r' <span class="st-toggle-hint">\(Click to Expand\)</span></summary>\s*'
        r".*?"
        r"</details>",
        re.S,
    )
    m = pattern.search(text)
    if not m:
        raise SystemExit(f"No consolidated block in {path.name}")
    full = (
        f'<details class="st-chapter-toggle st-toggle-facts" markdown="1">\n'
        f"<summary><strong>🎯 Consolidated — {count} Must-Score Facts</strong> "
        f'<span class="st-toggle-hint">(Click to Expand)</span></summary>\n\n'
        f"{body}"
        f"</details>"
    )
    text2 = pattern.sub(full, text, count=1)
    if text2 == text:
        # Identical content already in place (e.g. Topic 22 pre-upgraded).
        mm = pattern.search(text)
        got = len(re.findall(r"^\d+\.\s", mm.group(0), re.M)) if mm else 0
        if got == count:
            print(f"OK {path.name}: already had {count} facts (unchanged)")
            return
        raise SystemExit(f"Replace failed for {path.name}")
    mm = pattern.search(text2)
    got = len(re.findall(r"^\d+\.\s", mm.group(0), re.M))
    if got != count:
        raise SystemExit(f"{path.name}: expected {count} facts, got {got}")
    if re.search(r"\bexam\b", mm.group(0), re.I):
        raise SystemExit(f"{path.name}: contains banned word exam")
    if re.search(r"\block(s)?\b", mm.group(0), re.I):
        raise SystemExit(f"{path.name}: contains banned word lock")
    if "→ §" in mm.group(0) or "→ Topic" in mm.group(0):
        raise SystemExit(f"{path.name}: contains section refs")
    path.write_text(text2, encoding="utf-8", newline="\n")
    print(f"OK {path.name}: {count} facts written")


def main() -> None:
    for name, (count, facts) in FACTS.items():
        if len(facts) != count:
            raise SystemExit(f"{name}: list has {len(facts)}, heading {count}")
        replace_facts(GEO / name, count, facts)


if __name__ == "__main__":
    main()
