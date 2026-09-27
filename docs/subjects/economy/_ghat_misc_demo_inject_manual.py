# -*- coding: utf-8 -*-
"""
Inject Ghat Misc leftovers (transport/marks/TRAI/colonial) + Demography desk.
Routes to Topics 12, 11, 08. Does not touch Consolidated (cap 50).
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# file key -> path + anchors
TARGETS = {
    "12": {
        "path": ROOT / "12_Economic_Laws_Reports_Rankings_Misc.md",
        "bank_h": "## Complete PYQ Bank (UPPCS)",
        "extra_h": "## Ghatnachakra Extra Drill — Economic Laws, Reports and Rankings",
        "uk_h": "## UKPCS",
        "practice_h": "## Practice Zone",
        "extra_section_title": "### Ghatnachakra Purvalokan — Misc leftovers (transport, colonial, CA)",
        "extra_note": (
            "> Extra Drill: Ghatnachakra **Sustainable / Misc** + transport corridors, "
            "colonial tags, BRI/O-SMART and related leftovers."
        ),
        "extra_note_pat": r"> Extra Drill:.*",
    },
    "11": {
        "path": ROOT / "11_Services_Cooperatives_Regulators.md",
        "bank_h": "## Complete PYQ Bank (UPPCS)",
        "extra_h": "## Ghatnachakra Extra Drill — Services, Cooperatives and Regulators",
        "uk_h": "## UKPCS",
        "practice_h": "## Practice Zone",
        "extra_section_title": "### Ghatnachakra Purvalokan — TRAI, posts and quality marks",
        "extra_note": (
            "> Extra Drill: Ghatnachakra **Services / Regulators** + TRAI, Project Arrow, "
            "AGMARK / FPO / Eco mark / GI."
        ),
        "extra_note_pat": r"> Extra Drill:.*|^## Ghatnachakra Extra Drill — Services",
    },
    "08": {
        "path": ROOT / "08_Employment_Poverty_Human_Capital.md",
        "bank_h": "## Complete PYQ Bank (UPPCS)",
        "extra_h": "## Ghatnachakra Extra Drill — Employment, Poverty and Human Capital",
        "uk_h": "## UKPCS",
        "practice_h": "## Practice Zone",
        "extra_section_title": "### Ghatnachakra Purvalokan — Demography and Census",
        "extra_note": (
            "> Extra Drill: Ghatnachakra **Employment / Welfare / Poverty** + **Demography** "
            "(transition, Census, density, literacy)."
        ),
        "extra_note_pat": r"> Extra Drill:.*",
    },
}

ITEMS: list[dict] = [
    # ---- Topic 12 leftovers ----
    {
        "file": "12",
        "exam": "M.P. P.C.S. (Pre) 2023",
        "stem": "Which of the following statements is not correct regarding the roadways of Madhya Pradesh according to Basic Road Statistics 2018-19?",
        "options": {
            "a": "The length of the National Highways is more than 8,000 kms",
            "b": "The length of the State Highways is more than 11,000 kms",
            "c": "The length of the District roads is more than 50,000 kms",
            "d": "This State ranks first in the country in road density",
        },
        "ans": "d",
        "logic": "MP does not rank first in road density — Chandigarh / Delhi lead density tables.",
    },
    {
        "file": "12",
        "exam": "U.P. Lower Sub. (Pre) 2015",
        "stem": "In which of the following States, India’s first Railway line has been made under public-private partnership model?",
        "options": {
            "a": "Rajasthan",
            "b": "Madhya Pradesh",
            "c": "Maharashtra",
            "d": "Gujarat",
        },
        "ans": "d",
        "logic": "First BG PPP railway: Gujarat (Tuna Tekra–Gandhidham), dedicated 14 July 2015.",
    },
    {
        "file": "12",
        "exam": "U.P.P.C.S (Pre) 2011",
        "stem": "More than one-third of the crude steel production of the world comes from:",
        "options": {"a": "China", "b": "Japan", "c": "Russia", "d": "U.S.A."},
        "ans": "a",
        "logic": "China dominates world crude steel output (well over one-third).",
    },
    {
        "file": "12",
        "exam": "U.P.U.D.A./L.D.A. (Pre) 2002",
        "stem": "The Kamaiya system is:",
        "options": {
            "a": "an arrangement of canals which cover unirrigated areas in Nepal",
            "b": "a system of bonded labour in Nepal which continues from generation to generation",
            "c": "a system of contract labour in Assam prevalent in tea gardens",
            "d": "a system of labour on sea-ports to load and unload goods",
        },
        "ans": "b",
        "logic": "Kamaiya = bonded labour system of Nepal.",
    },
    {
        "file": "12",
        "exam": "U.P. P.C.S. (Mains) 2013",
        "stem": "Which of the following statements is not correct?",
        "options": {
            "a": "India was a colony of Britain till 1947",
            "b": "The Indian economy stagnated during British period",
            "c": "India was a supplier of manufacturing goods during British rule",
            "d": "India was supplier of raw-materials during British rule",
        },
        "ans": "c",
        "logic": "Under colonial free-trade policy India supplied raw materials and imported British manufactures — not the reverse.",
    },
    {
        "file": "12",
        "exam": "70th B.P.S.C. (Pre) (Re-Exam) 2024",
        "stem": "In 1901 who has published the book ‘Poverty and Un-British Rule in India’?",
        "options": {
            "a": "Dadabhai Naoroji",
            "b": "S.N. Banerjee",
            "c": "R.C. Dutt",
            "d": "Phirozshah Mehta",
        },
        "ans": "a",
        "logic": "Dadabhai Naoroji published Poverty and Un-British Rule in India in 1901 (drain of wealth).",
    },
    {
        "file": "12",
        "exam": "U.P.P.C.S. (Pre) 1994",
        "stem": "Which one of the following statements about Arthashastra is not true?",
        "options": {
            "a": "It prescribes the duty of a king",
            "b": "It describes the then economic life of the country",
            "c": "It lays down the principles of politics",
            "d": "It highlights the need for financial reforms",
        },
        "ans": "b",
        "logic": "Arthashastra is a treatise on statecraft/policy — ‘describes then economic life’ is the false statement.",
    },
    {
        "file": "12",
        "exam": "48th to 52nd B.P.S.C. (Pre) 2008",
        "stem": "In how many adhikaranas is the Kautilya Arthashastra divided?",
        "options": {"a": "11", "b": "12", "c": "14", "d": "15"},
        "ans": "d",
        "logic": "Arthashastra has 15 adhikaranas.",
    },
    {
        "file": "12",
        "exam": "Jharkhand P.C.S. (Pre) 2003",
        "stem": "What is the meaning of ‘Athavana’?",
        "options": {
            "a": "Revenue department",
            "b": "Revenue",
            "c": "Import Tax",
            "d": "Trade Tax",
        },
        "ans": "a",
        "logic": "In Vijayanagara administration Athavana = Department of Revenue.",
    },
    {
        "file": "12",
        "exam": "I.A.S. (Pre) 2016",
        "stem": "‘Belt and Road Initiative’ is sometimes mentioned in the news in the context of the affairs of:",
        "options": {
            "a": "African Union",
            "b": "Brazil",
            "c": "European Union",
            "d": "China",
        },
        "ans": "d",
        "logic": "BRI / OBOR is China’s global infrastructure strategy (2013).",
    },
    {
        "file": "12",
        "exam": "Uttrakhand P.C.S. (Pre) 2024",
        "stem": "Government of India has extended the O-SMART scheme till 2026 which is aimed at:",
        "options": {
            "a": "Outer Space Development Activities",
            "b": "Optical Fibre Production R & D",
            "c": "Oxygen Plants in Smart Cities",
            "d": "Ocean Development Activities",
        },
        "ans": "d",
        "logic": "O-SMART = Ocean Services, Modelling, Applications, Resources and Technology (MoES).",
    },
    {
        "file": "12",
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "Yamuna Expressway runs between:",
        "options": {
            "a": "Noida to Greater Noida",
            "b": "Greater Noida to Agra",
            "c": "Lucknow to Agra",
            "d": "Agra to Allahabad",
        },
        "ans": "b",
        "logic": "Yamuna / Taj Expressway connects Greater Noida with Agra.",
    },
    {
        "file": "12",
        "exam": "I.A.S. (Pre) 2024",
        "stem": "Consider the following airports: 1. Donyi Polo Airport 2. Kushinagar International Airport 3. Vijayawada International Airport. In the recent past, which of the above have been constructed as Greenfield projects?",
        "options": {
            "a": "1 and 2 only",
            "b": "2 and 3 only",
            "c": "1 and 3 only",
            "d": "1, 2 and 3",
        },
        "ans": "a",
        "logic": "Donyi Polo and Kushinagar are Greenfield operationalised airports; Vijayawada is not Greenfield in the keyed set.",
    },
    {
        "file": "12",
        "exam": "I.A.S. (Pre) 2022",
        "stem": "Consider the following statements: 1. Vietnam has been one of the fastest growing economies in the world in the recent years. 2. Vietnam is led by a multi-party political system. 3. Vietnam’s economic growth is linked to its integration with global supply chains and focus on exports. 4. For a long time Vietnam’s low labour costs and stable exchange rates have attracted global manufacturers. 5. Vietnam has the most productive e-service sector in the Indo-Pacific region. Which are correct?",
        "options": {
            "a": "2 and 4",
            "b": "3 and 5",
            "c": "1, 3 and 4",
            "d": "1 and 2",
        },
        "ans": "c",
        "logic": "Vietnam is a one-party State; e-services are nascent — statements 2 and 5 fail; 1, 3, 4 stand.",
    },
    {
        "file": "12",
        "exam": "U.P.P.C.S. (Mains) 2007",
        "stem": "After the merger of Air India and Indian Airlines, the New entity is now known as:",
        "options": {
            "a": "Indian Airways",
            "b": "Indian Airlines",
            "c": "Air India",
            "d": "Indo-Air",
        },
        "ans": "c",
        "logic": "Merged national carrier retained the name Air India.",
    },
    {
        "file": "12",
        "exam": "I.A.S. (Pre) 2008",
        "stem": "How much is one barrel of oil approximately?",
        "options": {"a": "131 litres", "b": "159 litres", "c": "179 litres", "d": "201 litres"},
        "ans": "b",
        "logic": "One oil barrel ≈ 159 litres (≈42 US gallons).",
    },
    {
        "file": "12",
        "exam": "U.P.P.C.S. (Pre) 2009",
        "stem": "Weight of L.P.G. in Kilogram filled in non-domestic gas cylinder is:",
        "options": {"a": "14.2", "b": "15.8", "c": "19.0", "d": "19.4"},
        "ans": "c",
        "logic": "Non-domestic LPG cylinder teaching weight = 19.0 kg (domestic classic = 14.2 kg).",
    },
    {
        "file": "12",
        "exam": "U.P.P.C.S. (Mains) 2011",
        "stem": "In which State, India’s largest Naphtha Cracker Plant was inaugurated by Union Petroleum Minister in February, 2011?",
        "options": {
            "a": "Andhra Pradesh",
            "b": "Karnataka",
            "c": "Haryana",
            "d": "Odisha",
        },
        "ans": "c",
        "logic": "IOC Panipat Complex, Haryana.",
    },
    # ---- Topic 11 TRAI / marks ----
    {
        "file": "11",
        "exam": "U.P. R.O./A.R.O. (Pre) 2017",
        "stem": "‘TRAI’ is a regulatory body associated with which of the following sectors?",
        "options": {
            "a": "Transport",
            "b": "Tourism",
            "c": "Technical Education",
            "d": "Telecom",
        },
        "ans": "d",
        "logic": "TRAI = Telecom Regulatory Authority of India.",
    },
    {
        "file": "11",
        "exam": "Jharkhand P.C.S. (Pre) 2023",
        "stem": "Which of the following statements are true about Telecom Regulatory Authority of India (TRAI)? I. It was first established in 1997. II. It is a statutory body. III. It was established to regulate telecom services including fixation/revising tariffs. IV. Its headquarters is located in Mumbai.",
        "options": {
            "a": "Only I, III and IV",
            "b": "Only I, II and III",
            "c": "Only II and III",
            "d": "All of the above",
        },
        "ans": "b",
        "logic": "HQ is New Delhi — IV fails; I–III correct.",
    },
    {
        "file": "11",
        "exam": "Uttarakhand P.C.S. (Mains) 2006",
        "stem": "India is divided into how many PIN zones?",
        "options": {"a": "5", "b": "6", "c": "7", "d": "8"},
        "ans": "d",
        "logic": "Eight PIN zones for States/UTs (ninth for Army/FPO in fuller teaching).",
    },
    {
        "file": "11",
        "exam": "I.A.S. (Pre) 2005",
        "stem": "Consider the following statements: 1. The number of post offices in India is in excess of 1.5 lakh. 2. Bharat Sanchar Nigam Limited (BSNL) was formed in the year 1997. 3. Telecom Regulatory Authority of India (TRAI) was established in the year 2000. Which is/are correct?",
        "options": {"a": "1, 2 and 3", "b": "1 and 2", "c": "1 only", "d": "3 only"},
        "ans": "c",
        "logic": "Post offices >1.5 lakh true; BSNL ≈2000 not 1997; TRAI =1997 not 2000.",
    },
    {
        "file": "11",
        "exam": "U.P.P.C.S. (Pre) 2010",
        "stem": "‘Project Arrow’ is concerned with the modernization of which of the following?",
        "options": {
            "a": "Airports",
            "b": "Post Offices",
            "c": "Road Transport",
            "d": "Railways",
        },
        "ans": "b",
        "logic": "Project Arrow (2008) modernises India Post.",
    },
    {
        "file": "11",
        "exam": "U.P.P.C.S. (Mains) 2009",
        "stem": "Project ARROW is related with:",
        "options": {
            "a": "welfare of old scheduled tribal men",
            "b": "a wing of the Armed Forces",
            "c": "a standard of quality of garments",
            "d": "giving a new identity to post offices",
        },
        "ans": "d",
        "logic": "Project Arrow gives a modern identity / quality upgrade to post offices.",
    },
    {
        "file": "11",
        "exam": "U.P.P.C.S. (Mains) 2003",
        "stem": "Universal Service Obligation Fund is concerned with:",
        "options": {
            "a": "adjustment of liabilities of telecom companies",
            "b": "adjustment of accounts of oil refining companies to maintain the same price",
            "c": "the aid of people suffering from contagious diseases",
            "d": "the aid in the time of natural disasters",
        },
        "ans": "a",
        "logic": "USOF subsidises rural/remote telegraph–telecom services via telecom USO contributions.",
    },
    {
        "file": "11",
        "exam": "M.P. P.C.S. (Pre) 2022",
        "stem": "As per the Food Safety and Standards Act, 2006, which of the following mark is made mandatory on all processed fruit products sold in our country?",
        "options": {"a": "FPO", "b": "ISI", "c": "BEE", "d": "HALLMARK"},
        "ans": "a",
        "logic": "FPO mark is mandatory for processed fruit products under FSS lineage.",
    },
    {
        "file": "11",
        "exam": "U.P. Lower Sub. (Pre) 2013",
        "stem": "‘AGMARK’ is related with:",
        "options": {
            "a": "Processing",
            "b": "Quality",
            "c": "Packaging",
            "d": "None of the above",
        },
        "ans": "b",
        "logic": "AGMARK is an agricultural produce quality / grade certification mark.",
    },
    {
        "file": "11",
        "exam": "U.P. R.O./A.R.O. (Pre) 2023",
        "stem": "With reference to ‘AGMARK’, which of the following statement/s is/are correct? 1. ‘AGMARK’ is the sign of quality of agricultural products. 2. Certificate of ‘AGMARK’ is issued by Food Corporation of India.",
        "options": {
            "a": "Only 2",
            "b": "Both 1 and 2",
            "c": "Neither 1 nor 2",
            "d": "Only 1",
        },
        "ans": "d",
        "logic": "AGMARK = agri quality mark via DMI — not FCI.",
    },
    {
        "file": "11",
        "exam": "U.P.P.C.S. (Mains) 2004",
        "stem": "AGMARK is a:",
        "options": {
            "a": "Co-operative society for egg production",
            "b": "Co-operative society of farmers",
            "c": "Regulated market for eggs",
            "d": "A seal of quality guarantee",
        },
        "ans": "d",
        "logic": "AGMARK is a quality-guarantee seal for graded agri produce.",
    },
    {
        "file": "11",
        "exam": "I.A.S. (Pre) 2017",
        "stem": "Consider the following statements: 1. The Standard Mark of Bureau of Indian Standards (BIS) is mandatory for automotive tyres and tubes. 2. AGMARK is a quality Certification Mark issued by the Food and Agriculture Organization (FAO). Which is/are correct?",
        "options": {"a": "1 only", "b": "2 only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "a",
        "logic": "BIS mark mandatory for tyres/tubes; AGMARK is Indian DMI — not FAO.",
    },
    {
        "file": "11",
        "exam": "U.P.P.C.S. (Pre) 1999",
        "stem": "ISO 14001 is:",
        "options": {
            "a": "an international spy network to watch nuclear explosions in any part of the world",
            "b": "a Pakistani network which organizes terrorist activities in India",
            "c": "an international certificate issued to industrial units for having established Pollution Control System",
            "d": "a certificate issued by the Government regarding the quality of a product",
        },
        "ans": "c",
        "logic": "ISO 14001 = environmental management / pollution-control system certificate.",
    },
    {
        "file": "11",
        "exam": "U.P. R.O./A.R.O. (Pre) 2021",
        "stem": "‘Geographical Indication Tag’ for black pottery is associated with which of the following place in Uttar Pradesh?",
        "options": {"a": "Najibabad", "b": "Khurja", "c": "Nizamabad", "d": "Kasganj"},
        "ans": "c",
        "logic": "Nizamabad (Azamgarh) black clay pottery has GI tag.",
    },
    {
        "file": "11",
        "exam": "I.A.S. (Pre) 1998",
        "stem": "‘Eco mark’ is given to the Indian products that are:",
        "options": {
            "a": "pure and unadulterated",
            "b": "rich in proteins",
            "c": "environment friendly",
            "d": "economically viable",
        },
        "ans": "c",
        "logic": "Eco mark / ECOMARC labels environment-friendly products.",
    },
    {
        "file": "11",
        "exam": "U.P. P.C.S. (Pre) 2022",
        "stem": "Eco mark is given to a product which is:",
        "options": {
            "a": "Economically viable",
            "b": "Rich in carbohydrates",
            "c": "Un-adulterated",
            "d": "Environment friendly",
        },
        "ans": "d",
        "logic": "Eco mark = environment-friendly product label.",
    },
    # ---- Topic 08 Demography ----
    {
        "file": "08",
        "exam": "Uttarakhand P.C.S. (Pre) 2025",
        "stem": "Who had used the concept of ‘Jail cost of living’ to estimate poverty line in India?",
        "options": {
            "a": "Dadabhai Naoroji",
            "b": "Mahatma Gandhi",
            "c": "C.D. Deshmukh",
            "d": "Vallabh Bhai Patel",
        },
        "ans": "a",
        "logic": "Dadabhai Naoroji used jail cost of living for an early poverty-line estimate.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2018",
        "stem": "Natural growth of population is the outcome of which of the following? A. Crude Birth Rate B. Crude Death Rate C. Migration D. Marriages",
        "options": {"a": "Only A", "b": "Only C", "c": "B and D", "d": "A and B"},
        "ans": "d",
        "logic": "Natural growth = CBR − CDR; migration is not natural change.",
    },
    {
        "file": "08",
        "exam": "I.A.S. (Pre) 1993",
        "stem": "Which arrangement would show the sequence of demographic transition as typically associated with economic development? 1. High birth rate with high death rate 2. Low birth rate with low death rate 3. High birth rate with low death rate",
        "options": {"a": "1, 2, 3", "b": "1, 3, 2", "c": "3, 1, 2", "d": "2, 1, 3"},
        "ans": "b",
        "logic": "High-high → high-low → low-low.",
    },
    {
        "file": "08",
        "exam": "I.A.S. (Pre) 2012",
        "stem": "Consider the following specific stages of demographic transition associated with economic development: 1. Low birth rate with low death rate 2. High birth rate with high death rate 3. High birth rate with low death rate. Select the correct order:",
        "options": {"a": "1, 2, 3", "b": "2, 1, 3", "c": "2, 3, 1", "d": "3, 2, 1"},
        "ans": "c",
        "logic": "Stage order 2 → 3 → 1.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2016",
        "stem": "A gradual change in the manner of population growth occurring over a long period of time is known as:",
        "options": {
            "a": "Demographic transition",
            "b": "Population explosion",
            "c": "Demographic dynamism",
            "d": "Demographic transformation",
        },
        "ans": "a",
        "logic": "Long-period shift in growth pattern = demographic transition.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Mains) 2014",
        "stem": "Select one of the following set of processes leading to stable population structure:",
        "options": {
            "a": "Increasing birth rate and constant death rate",
            "b": "Decreasing birth rate and increasing death rate",
            "c": "Constant birth and death rate",
            "d": "Constant birth rate and decreasing death rate",
        },
        "ans": "c",
        "logic": "Stable structure keys controlled constant birth and death rates.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2015",
        "stem": "At present India’s population growth is passing through the phase of which one of the following?",
        "options": {
            "a": "Stagnant population",
            "b": "Steady growth",
            "c": "Rapid high growth",
            "d": "High growth rate with definite signs of slowing down",
        },
        "ans": "d",
        "logic": "India’s phase = high growth with definite signs of slowing down.",
    },
    {
        "file": "08",
        "exam": "M.P. P.C.S. (Pre) 1997",
        "stem": "What is the main reason in India for increasing population?",
        "options": {
            "a": "Reduction in death rate",
            "b": "Economic progress",
            "c": "Marriages at low age",
            "d": "Increase in birth rate",
        },
        "ans": "a",
        "logic": "Death-rate fall with persistently high birth rate drives mid-transition growth.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2017",
        "stem": "According to Malthus, which one of the following is the most effective measure of population control?",
        "options": {"a": "War", "b": "Misery", "c": "Birth control", "d": "Vices"},
        "ans": "c",
        "logic": "Malthus preferred preventive checks / moral restraint / birth control.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2024",
        "stem": "Malthus argued that the population grows in a ______ progression, while agricultural production/food supply grows in a ______ progression.",
        "options": {
            "a": "Linear, Exponential",
            "b": "Exponential, Linear",
            "c": "Arithmetic, Geometric",
            "d": "Geometric, Arithmetic",
        },
        "ans": "d",
        "logic": "Population geometric; food arithmetic.",
    },
    {
        "file": "08",
        "exam": "Uttarakhand P.C.S. (Pre) 2012",
        "stem": "According to Malthusian Theory of Population, population increases in:",
        "options": {
            "a": "Geometrical Progression",
            "b": "Arithmetic Progression",
            "c": "Harmonic Progression",
            "d": "None of the above",
        },
        "ans": "a",
        "logic": "Malthus: population grows geometrically if unchecked.",
    },
    {
        "file": "08",
        "exam": "U.P. P.C.S. (Pre) 2022",
        "stem": "T. Malthus propounded one of the most famous theories, called ‘The Malthusian Theory’ which is related to:",
        "options": {
            "a": "Population",
            "b": "Poverty",
            "c": "Economy",
            "d": "Unemployment",
        },
        "ans": "a",
        "logic": "Malthusian theory is a population theory.",
    },
    {
        "file": "08",
        "exam": "U.P. P.C.S. (Pre) 2023",
        "stem": "Match list-I with list-II: A. Optimum Population Theory B. Social Maladjustment Theory C. Demographic Transition Theory D. Population-Food Supply Relationship Theory — 1. Thompson 2. Malthus 3. Edwin Cannan 4. Henry George. Codes A B C D:",
        "options": {
            "a": "1 2 3 4",
            "b": "4 3 1 2",
            "c": "2 3 4 1",
            "d": "3 4 1 2",
        },
        "ans": "d",
        "logic": "Cannan–Optimum; Henry George–Social Maladjustment; Thompson–Transition; Malthus–Food.",
    },
    {
        "file": "08",
        "exam": "U.P. P.C.S. (Pre) 2023",
        "stem": "Assertion (A): Population control is necessary to maintain the environment of the country. Reason (R): Due to the rapid increase in population, the environmental balance is maintained.",
        "options": {
            "a": "Both (A) and (R) are true but (R) is not correct explanation of (A)",
            "b": "(A) is false but (R) is true",
            "c": "Both (A) and (R) are true but (R) is correct explanation of (A)",
            "d": "(A) is true but (R) is false",
        },
        "ans": "d",
        "logic": "A true; rapid population rise disturbs — not maintains — environmental balance.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2015",
        "stem": "Which one of the following is not a part of the demographic feature of a population?",
        "options": {
            "a": "Density of population",
            "b": "Standard of living",
            "c": "Sex-ratio",
            "d": "Rural-urban population",
        },
        "ans": "b",
        "logic": "Standard of living is socio-economic, not a core demographic feature.",
    },
    {
        "file": "08",
        "exam": "M.P.P.C.S. (Pre) 2017",
        "stem": "From which year was regular and scientific Census started in India?",
        "options": {"a": "1861", "b": "1871", "c": "1881", "d": "1891"},
        "ans": "c",
        "logic": "First synchronous / regular Census = 1881.",
    },
    {
        "file": "08",
        "exam": "U.P. P.C.S. (Mains) 2007",
        "stem": "In which year was the first regular Census held in India?",
        "options": {"a": "1921", "b": "1881", "c": "1911", "d": "1931"},
        "ans": "b",
        "logic": "First regular synchronous Census = 1881.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2023",
        "stem": "The first Census in India during the British period was held in the tenure of:",
        "options": {
            "a": "Lord Dufferin",
            "b": "Lord Lytton",
            "c": "Lord Mayo",
            "d": "Lord Ripon",
        },
        "ans": "c",
        "logic": "First modern Census effort (~1872) under Lord Mayo; 1881 sync under Ripon.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2016",
        "stem": "Assertion (A): The Census of India is carried out every 10 years. Reason (R): The population of India has largely remained unchanged over the period of ten years.",
        "options": {
            "a": "Both (A) and (R) are true and (R) correctly explains (A)",
            "b": "Both (A) and (R) are true but (R) does not correctly explain (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "c",
        "logic": "Decennial Census is true; population has not remained unchanged.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2016",
        "stem": "Which among the following was used as the motto for Census of India 2011?",
        "options": {
            "a": "Our Future, Our Country",
            "b": "Our Country, Our Census",
            "c": "People of India, Our Census",
            "d": "Our Census, Our Future",
        },
        "ans": "d",
        "logic": "Census 2011 motto = Our Census, Our Future.",
    },
    {
        "file": "08",
        "exam": "I.A.S. (Pre) 2002",
        "stem": "Match List-I (Period) with List-II (Phase): A. 1901-1921 B. 1921-1951 C. 1951-1981 D. 1981-2001 — 1. Steady growth 2. Rapid high growth 3. Stagnant growth 4. High growth with definite signs of slowdown. Codes A B C D:",
        "options": {
            "a": "3 1 2 4",
            "b": "1 3 2 4",
            "c": "3 1 4 2",
            "d": "1 3 4 2",
        },
        "ans": "a",
        "logic": "1901–21 stagnant; 1921–51 steady; 1951–81 rapid high; 1981–2001 high with slowdown signs.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "The decadal growth rate of population in India has been lowest during:",
        "options": {
            "a": "1961-1971",
            "b": "1981-1991",
            "c": "1991-2001",
            "d": "2001-2011",
        },
        "ans": "d",
        "logic": "Among recent decades, 2001–11 has the lowest decadal growth (~17.7%).",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) (Re-Exam) 2015",
        "stem": "According to the Census of India 2011, the percentage growth of population in the country during the period of 2001-2011 was:",
        "options": {"a": "31.34", "b": "17.70", "c": "13.31", "d": "23.85"},
        "ans": "b",
        "logic": "2001–11 decadal growth ≈ 17.7%.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2016",
        "stem": "Which one of the following pairs is not correctly matched? Decade — Decadal growth rate of population (in percent)",
        "options": {
            "a": "1971-81 — 24.66",
            "b": "1981-91 — 23.87",
            "c": "1991-2001 — 21.54",
            "d": "2001-2011 — 19.05",
        },
        "ans": "d",
        "logic": "2001–11 growth is ~17.7%, not 19.05%.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Mains) 2014",
        "stem": "In which of the following Census year in India was recorded the highest percentage change in population?",
        "options": {"a": "1971", "b": "1981", "c": "1991", "d": "2001"},
        "ans": "a",
        "logic": "Highest decadal change keyed to Census 1971 (1961–71 ≈24.80%).",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2007",
        "stem": "In the context of population, which one of the following years has been termed as the year of ‘Great Divide’, after which population of India gradually registered accelerated growth?",
        "options": {"a": "1911", "b": "1921", "c": "1941", "d": "1951"},
        "ans": "b",
        "logic": "1921 = Great / Demographic Divide (only negative decade).",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2000",
        "stem": "Assertion (A): India has experienced a phenomenal growth of population since 1951. Reason (R): 1951 is called the demographic divide in India’s demographic history.",
        "options": {
            "a": "Both A and R are true and R is the correct explanation of A",
            "b": "Both A and R are true but R is not the correct explanation of A",
            "c": "A is true, but R is false",
            "d": "A is false, but R is true",
        },
        "ans": "c",
        "logic": "Post-1951 growth true; Demographic Divide is 1921, not 1951.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2012",
        "stem": "Which of the following is the most populous State in India as per the provisional figures of Census of India 2011?",
        "options": {
            "a": "Madhya Pradesh",
            "b": "Andhra Pradesh",
            "c": "Odisha",
            "d": "Uttar Pradesh",
        },
        "ans": "d",
        "logic": "Uttar Pradesh is the most populous State.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2024",
        "stem": "Write in descending order the following States on the basis of their population as per Census, 2011: 1. Bihar 2. Andhra Pradesh 3. Uttar Pradesh 4. West Bengal",
        "options": {"a": "3,4,1,2", "b": "1,3,2,4", "c": "1,3,4,2", "d": "3,1,4,2"},
        "ans": "d",
        "logic": "UP > Bihar > West Bengal > Andhra Pradesh (undivided).",
    },
    {
        "file": "08",
        "exam": "U.P. P.C.S. (Pre) 2011",
        "stem": "After Uttar Pradesh which of the following States in the country has the largest population?",
        "options": {
            "a": "Maharashtra",
            "b": "Bihar",
            "c": "West Bengal",
            "d": "Andhra Pradesh",
        },
        "ans": "a",
        "logic": "Maharashtra is second after UP.",
    },
    {
        "file": "08",
        "exam": "60th to 62th B.P.S.C. (Pre) 2016",
        "stem": "As per Census 2011, what is the rank of Bihar State in terms of population in the country?",
        "options": {
            "a": "I",
            "b": "II",
            "c": "III",
            "d": "IV",
            "e": "None of the above/More than one of the above",
        },
        "ans": "c",
        "logic": "Bihar is third after UP and Maharashtra.",
    },
    {
        "file": "08",
        "exam": "M.P. P.C.S. (Pre) 2022",
        "stem": "According to the 2011 Census, which of the following States has the highest growth rate of population?",
        "options": {
            "a": "Arunachal Pradesh",
            "b": "Bihar",
            "c": "Meghalaya",
            "d": "Punjab",
        },
        "ans": "c",
        "logic": "Meghalaya (~27.9%) highest State decadal growth 2001–11.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2017",
        "stem": "Which of the following States recorded a decline in its population in Census 2011?",
        "options": {"a": "Nagaland", "b": "Kerala", "c": "Sikkim", "d": "Manipur"},
        "ans": "a",
        "logic": "Nagaland recorded negative decadal growth (−0.6%).",
    },
    {
        "file": "08",
        "exam": "Uttarakhand P.C.S. (Pre) 2021",
        "stem": "Which districts of Uttarakhand State recorded negative population growth during 2001-2011 as per Census of India, 2011?",
        "options": {
            "a": "Tehri-Garhwal and Bageshwar",
            "b": "Pauri Garhwal and Almora",
            "c": "Uttarkashi and Champawat",
            "d": "Chamoli and Rudraprayag",
        },
        "ans": "b",
        "logic": "Pauri Garhwal and Almora recorded negative growth.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2008",
        "stem": "Assertion (A): Uttar Pradesh has the largest concentration of India’s population. Reason (R): It is also the most densely populated State of India.",
        "options": {
            "a": "Both (A) and (R) are true and (R) is the correct explanation of (A)",
            "b": "Both (A) and (R) are true, but (R) is NOT the correct explanation of (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "c",
        "logic": "UP most populous true; densest State is Bihar (2011) / was West Bengal (2001) — R false.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2014",
        "stem": "Population density in India:",
        "options": {
            "a": "has steadily increased",
            "b": "has remained almost constant",
            "c": "has decreased slightly",
            "d": "first increased and then decreased after 1991",
        },
        "ans": "a",
        "logic": "India’s population density has risen steadily across Censuses.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2021",
        "stem": "According to Census 2011, the density of population in India was?",
        "options": {"a": "325", "b": "335", "c": "382", "d": "385"},
        "ans": "c",
        "logic": "India’s 2011 density = 382 persons/sq km.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2017",
        "stem": "As per Census 2011 of India, which among the following States recorded highest density of population?",
        "options": {
            "a": "Uttar Pradesh",
            "b": "Bihar",
            "c": "Punjab",
            "d": "Tamil Nadu",
        },
        "ans": "b",
        "logic": "Bihar (1106) densest State in 2011.",
    },
    {
        "file": "08",
        "exam": "U.P. B.E.O. (Pre) 2019",
        "stem": "Which one of the following is arranged in correct descending order in terms of population density as per 2011 Census?",
        "options": {
            "a": "West Bengal, Bihar, Kerala, Uttar Pradesh",
            "b": "Bihar, Uttar Pradesh, West Bengal, Kerala",
            "c": "West Bengal, Uttar Pradesh, Bihar, Kerala",
            "d": "Bihar, West Bengal, Kerala, Uttar Pradesh",
        },
        "ans": "d",
        "logic": "Bihar > West Bengal > Kerala > UP.",
    },
    {
        "file": "08",
        "exam": "I.A.S. (Pre) 2007",
        "stem": "Which one among the following States of India has the lowest density of population?",
        "options": {
            "a": "Himachal Pradesh",
            "b": "Meghalaya",
            "c": "Arunachal Pradesh",
            "d": "Sikkim",
        },
        "ans": "c",
        "logic": "Arunachal Pradesh has the lowest State density.",
    },
    {
        "file": "08",
        "exam": "U.P. R.O./A.R.O. (Pre) 2014",
        "stem": "Effective literacy rate in India is calculated:",
        "options": {
            "a": "From the total population",
            "b": "From the population of children",
            "c": "From the population of adults",
            "d": "From the population above the age of 7",
        },
        "ans": "d",
        "logic": "Effective literacy uses population aged 7 and above.",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "As per the provisional figures of Census 2011, the literacy rate in India is:",
        "options": {"a": "82.14%", "b": "74.04%", "c": "65.46%", "d": "75.14%"},
        "ans": "b",
        "logic": "Provisional Census 2011 literacy ≈74.04% (final ~73.0%).",
    },
    {
        "file": "08",
        "exam": "U.P.P.C.S. (Pre) 2011",
        "stem": "Which one of the following States of India has recorded the maximum increase in literacy rate during 2001-2011?",
        "options": {
            "a": "Bihar",
            "b": "Gujarat",
            "c": "Rajasthan",
            "d": "Uttar Pradesh",
        },
        "ans": "a",
        "logic": "Among the listed major States, Bihar recorded the largest literacy-rate rise 2001–11.",
    },
]


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def fingerprint(stem: str) -> str:
    words = [w for w in norm(stem).split() if len(w) > 2][:14]
    return " ".join(words)


def is_uppcs(exam: str) -> bool:
    e = exam.upper()
    return "U.P.P.C.S" in e or "U.P. P.C.S" in e or "UPPCS" in e or "U.P.P.S.C. (R.I.)" in e or "U.P. B.E.O" in e


def is_ro_aro(exam: str) -> bool:
    e = exam.upper()
    return "R.O" in e or "A.R.O" in e or "U.D.A" in e or "L.D.A" in e or "LOWER" in e or "GIC" in e


def is_ukpcs(exam: str) -> bool:
    e = exam.upper()
    return "UTTARAKHAND" in e or "UKPCS" in e or "UTTRAKHAND" in e


def existing_fps(md: str) -> set[str]:
    fps = set()
    for m in re.finditer(r"(?:\*\*Q\d+\.[^*]*\*\*\s*)?([^\n]{25,200})", md):
        fps.add(fingerprint(m.group(1)))
    return {f for f in fps if f}


def fmt_q(item: dict, qid: int, bank: bool) -> str:
    lines = [f"**Q{qid}. {item['exam']}**", "", item["stem"], ""]
    for L, v in item["options"].items():
        lines.append(f"{L.upper()}. {v}")
    lines.append("")
    ans = item["ans"].upper()
    logic = item["logic"]
    if bank:
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Logic:** {logic}\n\n"
            f"**Ans: {ans}.**\n\n"
            "</details>\n"
        )
    else:
        block = (
            "<details>\n<summary>Show answer</summary>\n\n"
            f"**Ans: {ans}.**\n\n"
            f"**Logic:** {logic}\n\n"
            "</details>\n"
        )
    lines.append(block)
    return "\n".join(lines)


def inject_file(key: str, items: list[dict]) -> None:
    cfg = TARGETS[key]
    path: Path = cfg["path"]
    md = path.read_text(encoding="utf-8")
    have = existing_fps(md)
    fresh = [it for it in items if fingerprint(it["stem"]) not in have]

    bank, uk, extra = [], [], []
    for it in fresh:
        if is_ukpcs(it["exam"]):
            uk.append(it)
        elif is_uppcs(it["exam"]) and not is_ro_aro(it["exam"]):
            bank.append(it)
        else:
            extra.append(it)

    print(f"[{key}] fresh {len(fresh)} bank {len(bank)} uk {len(uk)} extra {len(extra)}")

    bank_sec = md.split(cfg["bank_h"])[1].split(cfg["extra_h"])[0]
    extra_sec = md.split(cfg["extra_h"])[1].split(cfg["uk_h"])[0]
    uk_sec = md.split(cfg["uk_h"])[1].split(cfg["practice_h"])[0]
    next_bank = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", bank_sec)] or [0]) + 1
    next_extra = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra_sec)] or [0]) + 1
    next_uk = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", uk_sec)] or [0]) + 1

    bank_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(bank, next_bank))
    extra_header = f"\n{cfg['extra_section_title']}\n\n" if extra else ""
    extra_blob = extra_header + "\n".join(
        fmt_q(it, n, False) for n, it in enumerate(extra, next_extra)
    )
    uk_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(uk, next_uk))

    shutil.copy2(path, path.with_suffix(f".md.bak_demo{key}"))
    if bank_blob:
        md = md.replace(cfg["extra_h"], bank_blob + "\n---\n\n" + cfg["extra_h"], 1)
    if extra_blob:
        md = md.replace(cfg["uk_h"], extra_blob + "\n---\n\n" + cfg["uk_h"], 1)
    if uk_blob:
        md = md.replace(cfg["practice_h"], uk_blob + "\n---\n\n" + cfg["practice_h"], 1)

    if re.search(cfg["extra_note_pat"], md):
        md = re.sub(cfg["extra_note_pat"], cfg["extra_note"], md, count=1)

    m = re.search(r"## Consolidated — (\d+)", md)
    if m and int(m.group(1)) > 50:
        raise SystemExit(f"{key} Consolidated bloated: {m.group(1)}")

    path.write_text(md, encoding="utf-8")
    print(
        f"[{key}] wrote bank {next_bank}-{next_bank+len(bank)-1 if bank else 'none'} "
        f"extra {next_extra}-{next_extra+len(extra)-1 if extra else 'none'} "
        f"uk {next_uk}-{next_uk+len(uk)-1 if uk else 'none'} "
        f"consol {m.group(1) if m else '?'}"
    )


def main() -> None:
    by: dict[str, list] = {"08": [], "11": [], "12": []}
    for it in ITEMS:
        by[it["file"]].append(it)
    for key in ("12", "11", "08"):
        inject_file(key, by[key])


if __name__ == "__main__":
    main()
