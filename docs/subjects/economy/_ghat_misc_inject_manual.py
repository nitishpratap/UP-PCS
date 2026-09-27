# -*- coding: utf-8 -*-
"""
Manual inject — Ghatnachakra Economic & Social Development Miscellaneous desk.
Topic 12. Does not touch Consolidated (cap 50).
"""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MD = ROOT / "12_Economic_Laws_Reports_Rankings_Misc.md"

ITEMS: list[dict] = [
    {
        "exam": "71st B.P.S.C. (Pre) 2025",
        "stem": "Match List-I with List-II: A. Perform, Achieve and Trade (PAT) scheme B. Mangrove Initiative for Shoreline Habitats & Tangible Incomes (MISHTI) C. Lifestyle for Environment (LiFE) initiative D. National Clean Air Programme (NCAP) — 1. Introduced in Union Budget 2023–24 2. Aims to reduce emissions / specific energy use in energy-intensive industries 3. Launched in 2019 as a national-level strategy 4. Launched at COP26 Glasgow (November 2021). Codes A B C D:",
        "options": {
            "a": "1 3 2 4",
            "b": "3 4 1 2",
            "c": "2 1 4 3",
            "d": "2 4 1 3",
        },
        "ans": "c",
        "logic": "PAT (2012, BEE) cuts SEC in energy-intensive industry → 2; MISHTI = Budget 2023–24 → 1; LiFE = COP26 → 4; NCAP = January 2019 → 3.",
    },
    {
        "exam": "I.A.S. (Pre) 2025",
        "stem": "Consider the pairs: I. International Year of the Woman Farmer — 2026 II. International Year of Sustainable and Resilient Tourism — 2027 III. International Year of Peace and Trust — 2025 IV. International Year of Asteroid Awareness and Planetary Defence — 2029. How many pairs are correctly matched?",
        "options": {"a": "Only one", "b": "Only two", "c": "Only three", "d": "All the four"},
        "ans": "d",
        "logic": "All four UN International Year proclamations match the years listed.",
    },
    {
        "exam": "M.P. P.C.S. (Pre) 2021",
        "stem": "United Nations has declared the year 2023 as:",
        "options": {
            "a": "The International Year of Millets",
            "b": "The International Year of Wheat",
            "c": "The International Year of Rice",
            "d": "The International Year of Oil-seeds",
        },
        "ans": "a",
        "logic": "UN declared 2023 International Year of Millets on India’s proposal.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2021",
        "stem": "United Nations General Assembly has declared the year 2023 as the International year of:",
        "options": {
            "a": "Oilseed crops",
            "b": "Pulse crops",
            "c": "Millet crops",
            "d": "Animal fodder crops",
        },
        "ans": "c",
        "logic": "2023 = International Year of Millets.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2021",
        "stem": "With reference to India’s Third National Water Awards declared in January 2022, which statements is/are correct? 1. Uttar Pradesh was declared winner in the ‘Best State Category’. 2. Muzaffarnagar in Uttar Pradesh was declared Best District in ‘North Zone Category’.",
        "options": {"a": "Only 1", "b": "Only 2", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "c",
        "logic": "Third National Water Awards-2020 (announced Jan 2022): UP Best State; Muzaffarnagar Best District North Zone.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2025",
        "stem": "The compendium of Mission Mode Projects under National e-Governance Plan (NeGP) is known as:",
        "options": {"a": "E-Pramaan", "b": "DigiLocker", "c": "Saaransh", "d": "MeitY"},
        "ans": "c",
        "logic": "Saaransh is the NeGP Mission Mode Projects compendium — DigiLocker is a separate Digital India wallet.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2020",
        "stem": "Consider the following statements about New National Education Policy approved by Union Cabinet on 29 July 2020: 1. It was drafted by a Committee headed by Dr K. Kasturirangan. 2. It will replace the previous Education Policy which has been followed since last 38 years. Select the correct statement(s):",
        "options": {"a": "1 Only", "b": "2 Only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "a",
        "logic": "Kasturirangan panel is correct; NEP 1986 had been followed about 34 years, not 38 — statement 2 fails.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2017",
        "stem": "Who heads the panel on National Education Policy constituted in June 2017 by the Human Resource Development Ministry?",
        "options": {
            "a": "K.J. Alphonse",
            "b": "Ram Shankar Kureel",
            "c": "K. Kasturirangan",
            "d": "M.K. Shridhar",
        },
        "ans": "c",
        "logic": "NEP drafting panel headed by former ISRO chief Dr K. Kasturirangan.",
    },
    {
        "exam": "67th B.P.S.C. (Pre) (Re-Exam) 2022",
        "stem": "Which State has become the first State in the country to initiate the process of implementing the Centre’s New Education Policy?",
        "options": {
            "a": "Uttarakhand",
            "b": "Haryana",
            "c": "Rajasthan",
            "d": "Punjab",
            "e": "None of the above / More than one of the above",
        },
        "ans": "e",
        "logic": "Karnataka first for higher-education NEP rollout; Uttarakhand first to start pre-primary Bal Vatika process — keyed as more than one / none of the listed clean single State.",
    },
    {
        "exam": "69th B.P.S.C. (Pre) 2023",
        "stem": "The National Education Policy, 2020 emphasizes the integration of vocational education into mainstream education from which grade onwards?",
        "options": {"a": "Grade 6", "b": "Grade 8", "c": "Grade 10", "d": "Grade 12"},
        "ans": "a",
        "logic": "NEP 2020 recommends vocational education from Grade 6.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2024",
        "stem": "With reference to Guidelines for Elimination of Corporal Punishment (GECP), which statements is/are correct? 1. The Tamil Nadu School Education Department issued these guidelines on 26 April 2024. 2. These guidelines are focussed on safeguarding the physical and mental well-being of students.",
        "options": {"a": "Only 2", "b": "Neither 1 nor 2", "c": "Only 1", "d": "Both 1 and 2"},
        "ans": "d",
        "logic": "Both date and student well-being focus are correct for TN GECP.",
    },
    {
        "exam": "M.P. P.C.S. (Pre) 2023",
        "stem": "How did Madhya Pradesh perform in the assessment of States for Business Reforms Action Plan 2020?",
        "options": {
            "a": "Madhya Pradesh was rated as ‘Under Achievers’",
            "b": "Madhya Pradesh was rated as ‘Top Achievers’",
            "c": "Madhya Pradesh was not rated in the assessment",
            "d": "Madhya Pradesh was rated as ‘Achievers’",
        },
        "ans": "d",
        "logic": "BRAP 2020: MP in Achievers (with HP, Maharashtra, Odisha, UK, UP); Top Achievers were a different set.",
    },
    {
        "exam": "M.P. P.C.S. (Pre) 2020",
        "stem": "It is a method of making automatic predictions about the interest of a user by collecting preferences:",
        "options": {
            "a": "Social Networking",
            "b": "Social Targetting",
            "c": "Collaborative Publishing",
            "d": "Collaborative Filtering",
        },
        "ans": "d",
        "logic": "Collaborative filtering uses similar users’ preferences to recommend items.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2020",
        "stem": "The concept of ‘Marginal Man’ was propounded by:",
        "options": {
            "a": "Robert E. Park",
            "b": "Robert Redfield",
            "c": "Louis Wirth",
            "d": "Louis Dumont",
        },
        "ans": "a",
        "logic": "Robert E. Park (1928) — individual between two cultures.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2015",
        "stem": "The phrase ‘Missing women’ was coined by:",
        "options": {
            "a": "Helen Keller",
            "b": "Emma Watson",
            "c": "Medha Patkar",
            "d": "Amartya Sen",
        },
        "ans": "d",
        "logic": "Amartya Sen (1990) — shortfall of women relative to expected sex ratios.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2018",
        "stem": "The development of the concept of ‘Global Village’ is based on:",
        "options": {
            "a": "Social development",
            "b": "Political development",
            "c": "Transport and Communication development",
            "d": "International organization",
        },
        "ans": "c",
        "logic": "McLuhan’s Global Village rests on media / transport and communication interconnection.",
    },
    {
        "exam": "M.P. P.C.S. (Pre) 2020",
        "stem": "According to Gartner, 4-phase maturity model can be arranged in sequence as:",
        "options": {
            "a": "Transaction, Interaction, Transformation and Information",
            "b": "Information, Transformation, Interaction and Transaction",
            "c": "Transaction, Information, Interaction and Transformation",
            "d": "Information, Interaction, Transaction and Transformation",
        },
        "ans": "d",
        "logic": "Gartner e-gov maturity: Information → Interaction → Transaction → Transformation.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2012",
        "stem": "Who was the first Indian to join as a member of UN Human Rights Commission constituted in 1946?",
        "options": {
            "a": "Smt. Sarojini Naidu",
            "b": "Smt. Hansa Mehta",
            "c": "Smt. Vijaya Laxmi Pandit",
            "d": "None of the above",
        },
        "ans": "b",
        "logic": "Hansa Mehta was the first Indian member (1947–48) of the UN Human Rights Commission.",
    },
    {
        "exam": "68th B.P.S.C. (Pre) 2022",
        "stem": "Which committee suggested the enactment of the Competition Act, 2002?",
        "options": {
            "a": "Vijay Kelkar Committee",
            "b": "Rangarajan Committee",
            "c": "S.V.S. Raghavan Committee",
            "d": "More than one of the above",
            "e": "None of the above",
        },
        "ans": "c",
        "logic": "High Level Committee on Competition Policy and Law (S.V.S. Raghavan) recommended replacing MRTP with a modern competition law.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2004",
        "stem": "Competition Commission has been established in India in the year:",
        "options": {"a": "2001", "b": "2002", "c": "2003", "d": "2004"},
        "ans": "c",
        "logic": "CCI established 14 October 2003 under the Competition Act, 2002.",
    },
    {
        "exam": "R.A.S./R.T.S. (Pre) 2024",
        "stem": "Which of the following Institution has been engaged by the Competition Commission of India in 2024, to conduct a market study on Artificial Intelligence and Competition?",
        "options": {
            "a": "Indian School of Business",
            "b": "Management Development Institute Society",
            "c": "Institute of Rural Management, Anand",
            "d": "IIM, Indore",
        },
        "ans": "b",
        "logic": "CCI engaged Management Development Institute Society (MDIS) — agreement 9 September 2024.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2009",
        "stem": "Which one of the following deals with the marketing of milk?",
        "options": {"a": "CACP", "b": "GCMMF", "c": "NAFED", "d": "TRIFED"},
        "ans": "b",
        "logic": "Gujarat Co-operative Milk Marketing Federation (GCMMF / Amul) markets milk.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2022",
        "stem": "Match List-I (Person) with List-II (Concerned with): A. M.S. Swaminathan B. L.K. Jha C. Verghese Kurien D. Morarji Desai — 1. Social Control on Banks 2. Milk Production 3. Green Revolution 4. Economic Administration Reforms. Codes A B C D:",
        "options": {
            "a": "2 3 4 1",
            "b": "1 2 4 3",
            "c": "4 3 2 1",
            "d": "3 4 2 1",
        },
        "ans": "d",
        "logic": "Swaminathan–Green Revolution; L.K. Jha–Economic Administration Reforms; Kurien–Milk; Morarji Desai–Social Control on Banks.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2008",
        "stem": "Which one of the following pairs is not correctly matched?",
        "options": {
            "a": "Goiporia Committee — Banking Service Improvement",
            "b": "Nanjundappa Committee — Railway Fare",
            "c": "Rangarajan Committee — Balance of Payments",
            "d": "Rekhi Committee — Simplification of Export & Import",
        },
        "ans": "d",
        "logic": "Rekhi Committee (1992) related to indirect taxes — not EXIM simplification.",
    },
    {
        "exam": "67th B.P.S.C. (Pre) 2022",
        "stem": "Which of the following committees submitted a report on gas pricing, recommending complete pricing freedom from January 1, 2026?",
        "options": {
            "a": "P.K. Mohanty Committee",
            "b": "Arun Goel Committee",
            "c": "Kirit Parikh Committee",
            "d": "More than one of the above",
            "e": "None of the above",
        },
        "ans": "c",
        "logic": "Kirit Parikh Committee (2022) recommended floor/ceiling then complete pricing freedom from 1 Jan 2026.",
    },
    {
        "exam": "I.A.S. (Pre) 2016",
        "stem": "‘Gadgil Committee Report’ and ‘Kasturirangan Committee Report’, sometimes seen in the news, are related to:",
        "options": {
            "a": "Constitutional Reforms",
            "b": "Ganga Action Plan",
            "c": "Linking of rivers",
            "d": "Protection of Western Ghats",
        },
        "ans": "d",
        "logic": "Both reports address Western Ghats ecology / ESA delineation.",
    },
    {
        "exam": "68th B.P.S.C. (Pre) 2022",
        "stem": "Match List-I with List-II: A. Sarkaria Commission B. C. Rangarajan Committee C. Parekh Committee D. Narasimham Committee — 1. To Review the Methodology for Measurement of Poverty 2. Infrastructure Financing 3. Central-State Relationship 4. Banking Sector Reforms. Codes A B C D:",
        "options": {
            "a": "3 1 2 4",
            "b": "2 3 4 1",
            "c": "4 2 1 3",
            "d": "1 2 4 3",
            "e": "None of the above / More than one of the above",
        },
        "ans": "a",
        "logic": "Sarkaria–Centre–State; Rangarajan–poverty methodology; Parekh–infrastructure financing; Narasimham–banking reforms.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Spl.) (Pre) 2010",
        "stem": "Which of the following pairs is not correctly matched?",
        "options": {
            "a": "Goswami Committee — Problem of Industrial Sickness",
            "b": "Janakiraman Committee — Stock Market Scam",
            "c": "Malhotra Committee — Insurance Sector Reforms",
            "d": "Tarapore Committee — Customer Service in Banks",
        },
        "ans": "d",
        "logic": "Tarapore Committee = capital-account convertibility roadmap — not bank customer service.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2015",
        "stem": "Match List-I with List-II: A. Dutt Committee (1969) B. Wanchoo Committee (1971) C. Rajamannar Committee (1971) D. Chakravarty Committee (1985) — 1. Industrial licensing 2. Direct Tax 3. Centre-State relations 4. Monetary policy. Codes A B C D:",
        "options": {
            "a": "1 2 3 4",
            "b": "1 2 4 3",
            "c": "4 3 2 1",
            "d": "4 3 1 2",
        },
        "ans": "a",
        "logic": "Dutt–licensing; Wanchoo–direct tax; Rajamannar–Centre–State; Chakravarty–monetary policy.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2024",
        "stem": "Match List-I (Name of the City) with List-II (Period of being Planned): A. Kanchipuram B. Jaisalmer C. Kodaikanal D. Bhilai — 1. Post-independence 2. Colonial Period 3. Medieval Period 4. Ancient Period. Codes A B C D:",
        "options": {
            "a": "2 3 4 1",
            "b": "4 3 2 1",
            "c": "1 2 3 4",
            "d": "3 4 2 1",
        },
        "ans": "b",
        "logic": "Kanchipuram–Ancient; Jaisalmer–Medieval; Kodaikanal–Colonial; Bhilai–Post-independence.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2008",
        "stem": "Name the Governor of Reserve Bank of India who also became Finance Minister.",
        "options": {
            "a": "H.M. Patel",
            "b": "C.D. Deshmukh",
            "c": "C. Subramaniam",
            "d": "Sachin Chaudhari",
        },
        "ans": "b",
        "logic": "C.D. Deshmukh — first Indian RBI Governor (1943), later Union Finance Minister (1950–56).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2004",
        "stem": "Which among the following statements signifies a ‘Pressure Group’:",
        "options": {
            "a": "A group that works for social reform",
            "b": "A faction of political party tempting others to secure office in election",
            "c": "A group that exercises its influence on policy decisions",
            "d": "A group that works for welfare of the poor",
        },
        "ans": "c",
        "logic": "Pressure groups seek to influence policy without aiming to capture office like parties.",
    },
    {
        "exam": "I.A.S. (Pre) 2007",
        "stem": "Which one of the following pairs is not correctly matched?",
        "options": {
            "a": "William Dickson — Motion Picture Film",
            "b": "Charles Babbage — Programmable computer",
            "c": "Nicholas Stern — Construction technology",
            "d": "Brian Greene — String theory",
        },
        "ans": "c",
        "logic": "Nicholas Stern is an economist (Stern Review / climate economics) — not construction technology.",
    },
    {
        "exam": "Jharkhand P.C.S. (Pre) 2017",
        "stem": "When did the Prime Minister Narendra Modi launch National Disaster Management Plan (NDMP)?",
        "options": {"a": "1st June", "b": "2nd June", "c": "3rd June", "d": "1st May"},
        "ans": "a",
        "logic": "NDMP launched 1 June 2016.",
    },
    {
        "exam": "Chhattisgarh P.C.S. (Pre) 2023",
        "stem": "Who was awarded 2023 Sveriges Riksbank Prize (Nobel prize) in Economic Sciences?",
        "options": {
            "a": "Abhijit Banerjee",
            "b": "Claudia Goldin",
            "c": "Esther Duflo",
            "d": "None of the above",
        },
        "ans": "b",
        "logic": "2023 Economics Nobel — Claudia Goldin (women’s labour-market outcomes).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "Who among the following has authored the book ‘India’s Economic Policy : The Gandhian Blue Print’?",
        "options": {
            "a": "Aacharya Vinoba Bhave",
            "b": "Morarji Desai",
            "c": "Jai Prakash Narayan",
            "d": "Charan Singh",
        },
        "ans": "d",
        "logic": "Chaudhary Charan Singh authored India’s Economic Policy: The Gandhian Blue Print.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2024",
        "stem": "Match List-I (Economist/Author) with List-II (Book): A. Myrdal B. Hirschman C. Kaldor D. Adam Smith — 1. Economic Theory and Underdeveloped Regions 2. The Strategy of Economic Development 3. Strategic Factors in Economic Development 4. The Wealth of Nations. Codes A B C D:",
        "options": {
            "a": "1 2 3 4",
            "b": "2 3 1 4",
            "c": "3 2 1 4",
            "d": "2 1 3 4",
        },
        "ans": "a",
        "logic": "Myrdal–Economic Theory and Underdeveloped Regions; Hirschman–Strategy of Economic Development; Kaldor–Strategic Factors; Smith–Wealth of Nations.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2023",
        "stem": "Which of the following pairs is not correctly matched?",
        "options": {
            "a": "Karl Marx — Principles of Political Economy and Taxation",
            "b": "Gunnar Myrdal — Asian Drama",
            "c": "Adam Smith — Wealth of Nations",
            "d": "J.M. Keynes — General Theory of Employment, Interest and Money",
        },
        "ans": "a",
        "logic": "Principles of Political Economy and Taxation is David Ricardo — not Marx.",
    },
    {
        "exam": "Jharkhand P.S.C. (Pre) 2016",
        "stem": "Match List-I and List-II: A. Inequality Reexamined B. The Price of Inequality C. Inequality What Can Be Done D. The Economics of Inequality — 1. Joseph E. Stiglitz 2. Thomas Piketty 3. Amartya Sen 4. Anthony B. Atkinson. Codes A B C D:",
        "options": {
            "a": "4 3 2 1",
            "b": "3 4 1 2",
            "c": "2 3 4 1",
            "d": "3 1 4 2",
        },
        "ans": "d",
        "logic": "Sen–Inequality Reexamined; Stiglitz–Price of Inequality; Atkinson–What Can Be Done; Piketty–Economics of Inequality.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Spl.) (Pre) 2010",
        "stem": "Who was the Prime Minister of India when India had to pledge gold in foreign banks?",
        "options": {
            "a": "P.V. Narsimha Rao",
            "b": "V.P. Singh",
            "c": "Rajiv Gandhi",
            "d": "Chandrashekhar",
        },
        "ans": "d",
        "logic": "Gold pledge episode under PM Chandrashekhar (1991 crisis prelude).",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 1997",
        "stem": "Jayant Patil Committee is related to:",
        "options": {
            "a": "control of floods",
            "b": "control of plant diseases",
            "c": "the development of scanty rainfall area",
            "d": "the expansion of hydel power generation capacity",
        },
        "ans": "c",
        "logic": "Jayant Patil Committee — development of scanty rainfall / dryland areas.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2008",
        "stem": "Who among the following released “Citizens’ guide to fight corruption”?",
        "options": {
            "a": "Ministry of Family Welfare",
            "b": "Consumer Co-operative Societies",
            "c": "Central Vigilance Commission",
            "d": "Transparency International",
        },
        "ans": "c",
        "logic": "CVC released Citizens’ guide to fight corruption (2002).",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2010",
        "stem": "Which of the following Parliamentary Committee scrutinizes the report of the Comptroller and Auditor General (CAG) of India?",
        "options": {
            "a": "Estimate Committee",
            "b": "Assurance Committee",
            "c": "Public Accounts Committee",
            "d": "Standing Committee",
        },
        "ans": "c",
        "logic": "PAC examines Appropriation Accounts and CAG reports.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2011",
        "stem": "RESIDEX, an index of residential prices in India, was launched in the year",
        "options": {"a": "2001", "b": "2004", "c": "2007", "d": "2008"},
        "ans": "c",
        "logic": "NHB RESIDEX launched July 2007.",
    },
    {
        "exam": "U.P. P.C.S. (Mains) 2015",
        "stem": "Index ‘Residex’ is associated with:",
        "options": {
            "a": "Share prices",
            "b": "Mutual fund prices",
            "c": "Price index",
            "d": "Land prices",
        },
        "ans": "d",
        "logic": "RESIDEX tracks residential / housing (land–property) prices.",
    },
    {
        "exam": "U.P. P.C.S. (Mains) 2016",
        "stem": "Trade and Merchandise Marks Act was passed in:",
        "options": {"a": "1955", "b": "1956", "c": "1957", "d": "1958"},
        "ans": "d",
        "logic": "Trade and Merchandise Marks Act, 1958.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2012",
        "stem": "POCSO Act is related to:",
        "options": {"a": "Oil companies", "b": "Children", "c": "Civil servants", "d": "Oceans"},
        "ans": "b",
        "logic": "Protection of Children from Sexual Offences Act, 2012.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2012",
        "stem": "The new government at the Centre has recently ratified the Marrakesh Treaty. This treaty aims at:",
        "options": {
            "a": "Developing Marine Living resources",
            "b": "Regulating air transport services",
            "c": "Promotion of access to published works by visually impaired persons and persons with print disabilities",
            "d": "Promoting studies in cell-biology",
        },
        "ans": "c",
        "logic": "Marrakesh Treaty facilitates access to published works for the print-disabled; India first to ratify (2014).",
    },
    {
        "exam": "I.A.S. (Pre) 2011",
        "stem": "With reference to India, consider the following Central Acts: 1. Import and Export (Control) Act, 1947 2. Mining and Mineral Development (Regulation) Act 1957 3. Customs Act, 1962 4. Indian Forest Act, 1927. Which of the above Acts have relevance to/bearing on the biodiversity conservation in the country?",
        "options": {
            "a": "1 and 3 only",
            "b": "2, 3 and 4 only",
            "c": "1, 2, 3 and 4",
            "d": "None of the above",
        },
        "ans": "c",
        "logic": "All four can regulate trade / extraction / forests with biodiversity bearing.",
    },
    {
        "exam": "Jharkhand P.C.S. (Pre) 2013",
        "stem": "World Consumer Rights Day is celebrated on:",
        "options": {"a": "March 15", "b": "April 18", "c": "September 27", "d": "December 10"},
        "ans": "a",
        "logic": "15 March — World Consumer Rights Day (Kennedy message anniversary).",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
        "stem": "Which State Government has started the scheme ‘Nivesh Mitra’?",
        "options": {
            "a": "Maharashtra",
            "b": "Tamil Nadu",
            "c": "Uttar Pradesh",
            "d": "Madhya Pradesh",
        },
        "ans": "c",
        "logic": "Nivesh Mitra is UP’s single-window clearance portal under Invest UP.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "V.V. Giri National Labour Institution is located at:",
        "options": {"a": "Noida", "b": "New Delhi", "c": "Ghaziabad", "d": "Gurugram"},
        "ans": "a",
        "logic": "V.V. Giri National Labour Institute is at Noida, Uttar Pradesh.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
        "stem": "In which city is the ‘National Institute of Agricultural Economics and Policy Research’ located?",
        "options": {"a": "Lucknow", "b": "New Delhi", "c": "Hyderabad", "d": "Mumbai"},
        "ans": "b",
        "logic": "ICAR-NIAP is in New Delhi.",
    },
    {
        "exam": "Chhattisgarh P.C.S. (Pre) 2024",
        "stem": "Who is the founder of the “Indian Statistical Institute”?",
        "options": {
            "a": "V.K.R.V. Rao",
            "b": "Prof. Raj Krishna",
            "c": "P.C. Mahalanobis",
            "d": "D.T. Lakdawala",
        },
        "ans": "c",
        "logic": "P.C. Mahalanobis founded ISI, Kolkata (1931).",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2025",
        "stem": "Which of the following prepared the Annual Groundwater Quality Report 2024? 1. Central Pollution Control Board 2. Central Water Commission 3. Central Groundwater Board",
        "options": {"a": "1 and 2", "b": "Only 3", "c": "2 and 3", "d": "Only 1"},
        "ans": "b",
        "logic": "Annual Ground Water Quality Report 2024 prepared by Central Ground Water Board (CGWB).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2011",
        "stem": "Entrepreneurship Development Institute of India is located in:",
        "options": {"a": "Ahmedabad", "b": "Chennai", "c": "Mumbai", "d": "New Delhi"},
        "ans": "a",
        "logic": "EDII is in Ahmedabad (est. 1983).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2015",
        "stem": "National Institute for Entrepreneurship and Small Business Development is situated at:",
        "options": {"a": "New Delhi", "b": "Noida", "c": "Bengaluru", "d": "Hyderabad"},
        "ans": "b",
        "logic": "NIESBUD is at Noida (U.P.).",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2000",
        "stem": "Where is Indira Gandhi Rashtriya Manav Sangrahalaya located?",
        "options": {"a": "Delhi", "b": "Bhopal", "c": "Lucknow", "d": "Calcutta"},
        "ans": "b",
        "logic": "National Museum of Mankind is at Bhopal.",
    },
    {
        "exam": "67th B.P.S.C. (Pre) (Re-Exam) 2022",
        "stem": "What is the name of the campaign launched to ensure complete COVID-19 vaccination (in June 2022)?",
        "options": {
            "a": "Har Ghar Dastak Campaign 2.0",
            "b": "Atmanirbhar Vaccine Campaign 2.0",
            "c": "Pradhan Mantri Vaccine Campaign",
            "d": "Garib Kalyan Vaccine Campaign 2.0",
            "e": "None of the above / More than one of the above",
        },
        "ans": "a",
        "logic": "Har Ghar Dastak 2.0 launched 1 June 2022 for door-to-door COVID vaccination coverage.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2017",
        "stem": "Which among the following statements are true about ‘Urja Ganga’ project? 1. It is a gas pipeline project. 2. It was launched in October 2016. 3. It runs from Iran to India.",
        "options": {
            "a": "Only 2 and 3 are correct",
            "b": "Only 1 and 2 are correct",
            "c": "Only 1 and 3 are correct",
            "d": "All 1, 2 and 3 are correct",
        },
        "ans": "b",
        "logic": "Urja Ganga is a domestic gas-pipeline project launched Oct 2016 — not Iran–India.",
    },
    {
        "exam": "I.A.S. (Pre) 2016",
        "stem": "On which of the following can you find the Bureau of Energy Efficiency Star Label? 1. Ceiling fans 2. Electric geysers 3. Tubular fluorescent lamps",
        "options": {"a": "1 and 2 only", "b": "3 only", "c": "2 and 3 only", "d": "1, 2 and 3"},
        "ans": "d",
        "logic": "BEE Standards & Labelling covers all three (and more appliances).",
    },
    {
        "exam": "I.A.S. (Pre) 2016",
        "stem": "Regarding ‘DigiLocker’, sometimes seen in the news, which of the following statements is / are correct? 1. It is a digital locker system offered by the Government under Digital India Programme. 2. It allows you to access your e-documents irrespective of your physical location.",
        "options": {"a": "1 only", "b": "2 only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "c",
        "logic": "Both — DigiLocker is MeitY Digital India wallet with location-independent e-document access.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2025",
        "stem": "What is the objective of ‘DigiLocker’ service?",
        "options": {
            "a": "Provide cloud storage for personal documents",
            "b": "Offer online banking services",
            "c": "Facilitate online shopping",
            "d": "Enable video-conferencing with government officers",
        },
        "ans": "a",
        "logic": "DigiLocker stores / shares personal documents securely in the cloud.",
    },
    {
        "exam": "U.P. P.C.S. (Mains) 2016",
        "stem": "Which of the following online portals has been launched by the Ministry of Urban Development, Government of India for small traders?",
        "options": {"a": "e-traders", "b": "e-lala", "c": "e-urban", "d": "e-urban-dev"},
        "ans": "b",
        "logic": "e-lala (CAIT) portal launched Nov 2015 for small traders / B2B and trader–customer.",
    },
    {
        "exam": "I.A.S. (Pre) 2005",
        "stem": "Which one of the following companies has started a rural marketing network called ‘e-choupals’?",
        "options": {
            "a": "ITC",
            "b": "Dabur",
            "c": "Procter and Gamble",
            "d": "Hindustan Unilever",
        },
        "ans": "a",
        "logic": "ITC launched e-Choupal (2000) for rural agri supply-chain.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "Bhakra-Nangal is a joint project of:",
        "options": {
            "a": "Haryana-Punjab and Rajasthan",
            "b": "Haryana-Punjab and Delhi",
            "c": "Himachal Pradesh-Haryana and Punjab",
            "d": "Punjab-Delhi and Rajasthan",
        },
        "ans": "a",
        "logic": "Bhakra–Nangal is a joint project of Haryana, Punjab and Rajasthan.",
    },
    {
        "exam": "I.A.S. (Pre) 1997",
        "stem": "Assertion (A): The emergence of economic globalism does not imply the decline of socialist ideology. Reason (R): The ideology of socialism believes in universalism and globalism.",
        "options": {
            "a": "Both A and R are true and R is the correct explanation of A",
            "b": "Both A and R are true, but R is not the correct explanation of A",
            "c": "A is true, but R is false",
            "d": "A is false, but R is true",
        },
        "ans": "c",
        "logic": "A stands; R fails — universalism/globalism is not the defining belief of socialism in this keyed reading.",
    },
    {
        "exam": "69th B.P.S.C. (Pre) 2023",
        "stem": "Match List-I with List-II: A. Beret B. Stilettos C. Aviators D. Chignon E. Brogue — 1. A type of men’s footwear 2. A type of sun-glasses 3. A type of hat 4. A type of women’s footwear 5. A type of hairstyle. Codes A B C D E:",
        "options": {
            "a": "3 2 1 4 5",
            "b": "3 4 2 5 1",
            "c": "5 3 2 4 1",
            "d": "2 3 4 5 1",
        },
        "ans": "b",
        "logic": "Beret–hat; Stilettos–women’s footwear; Aviators–sunglasses; Chignon–hairstyle; Brogue–men’s footwear.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2010",
        "stem": "Who is the Father of ‘Modern Economics’?",
        "options": {"a": "Adam Smith", "b": "Marshall", "c": "Keynes", "d": "Robins"},
        "ans": "a",
        "logic": "Adam Smith — Father of Modern Economics / Capitalism tag.",
    },
    {
        "exam": "I.A.S. (Pre) 2008",
        "stem": "The term ‘Prisoner’s Dilemma’ is associated with which one of the following?",
        "options": {
            "a": "A technique in glass manufacture",
            "b": "A term used in shipping industry",
            "c": "A situation under the game theory",
            "d": "Name of a supercomputer",
        },
        "ans": "c",
        "logic": "Prisoner’s Dilemma is a classic game-theory situation.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2017",
        "stem": "Who is the father of scientific management?",
        "options": {
            "a": "Henry Fayol",
            "b": "Elton Mayo",
            "c": "Cheston Bernard",
            "d": "F.W. Taylor",
        },
        "ans": "d",
        "logic": "F.W. Taylor — Principles of Scientific Management (Taylorism).",
    },
    {
        "exam": "I.A.S. (Pre) 2020",
        "stem": "One common agreement between Gandhism and Marxism is:",
        "options": {
            "a": "the final goal of a stateless society",
            "b": "class struggle",
            "c": "abolition of private property",
            "d": "economic determinism",
        },
        "ans": "a",
        "logic": "Both envision a eventual stateless society; means differ (non-violence vs violence).",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2013",
        "stem": "The Gandhian economy is based on the principle of:",
        "options": {
            "a": "Competition",
            "b": "Trusteeship",
            "c": "State Control",
            "d": "None of these",
        },
        "ans": "b",
        "logic": "Gandhian economy rests on trusteeship of wealth for social welfare.",
    },
    {
        "exam": "I.A.S. (Pre) 2017",
        "stem": "Which of the following statements is/are correct regarding Smart India Hackathon 2017? 1. It is a centrally sponsored scheme for developing every city into Smart Cities in a decade. 2. It is an initiative to identify new digital technology innovations for solving the many problems faced by our country. 3. It is a programme aimed at making all financial transactions completely digital in a decade.",
        "options": {"a": "1 and 3 only", "b": "2 only", "c": "3 only", "d": "2 and 3 only"},
        "ans": "b",
        "logic": "Smart India Hackathon is a digital innovation contest — not Smart Cities CSS or full cashless mandate.",
    },
    {
        "exam": "I.A.S. (Pre) 2017",
        "stem": "With reference to the ‘Prohibition of Benami Property Transactions Act, 1988 (PBPT Act)’, consider the following statements: 1. A property transaction is not treated as a benami transaction if the owner of the property is not aware of the transaction. 2. Properties held benami are liable for confiscation by the Government. 3. The Act provides for three authorities for investigations but does not provide for any appellate mechanism. Which is/are correct?",
        "options": {"a": "1 only", "b": "2 only", "c": "1 and 3 only", "d": "2 and 3 only"},
        "ans": "b",
        "logic": "Only 2: benami properties are confiscable; lack of knowledge can still be benami; appellate mechanism exists.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2017",
        "stem": "The first Indian State to start State Data Centre (SDC) is:",
        "options": {
            "a": "Telangana",
            "b": "Rajasthan",
            "c": "Chhattisgarh",
            "d": "Himachal Pradesh",
        },
        "ans": "d",
        "logic": "Himachal Pradesh became the first State with SDC (June 2016 teaching).",
    },
    {
        "exam": "I.A.S. (Pre) 2023",
        "stem": "Statement-I: Carbon markets are likely to be one of the most widespread tools in the fight against climate change. Statement-II: Carbon markets transfer resources from the private sector to the State. Which is correct?",
        "options": {
            "a": "Both Statement-I and Statement-II are correct and Statement-II is the correct explanation for Statement-I",
            "b": "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I",
            "c": "Statement-I is correct but Statement-II is incorrect",
            "d": "Statement-I is incorrect but Statement-II is correct",
        },
        "ans": "b",
        "logic": "Both true; private→State transfer does not explain why carbon markets spread as a climate tool.",
    },
    {
        "exam": "I.A.S. (Pre) 2016",
        "stem": "The term ‘Intended Nationally Determined Contributions’ is sometimes seen in the news in the context of:",
        "options": {
            "a": "Pledges made by the European countries to rehabilitate refugees from the war-affected Middle East",
            "b": "Plan of action outlined by the countries of the world to combat climate change",
            "c": "Capital contribution by the member countries in the establishment of Asian Infrastructure Investment Bank",
            "d": "Plan of action outlined by the countries of the world regarding Sustainable Development Goals",
        },
        "ans": "b",
        "logic": "INDCs / NDCs are climate pledges under the Paris Agreement track.",
    },
    {
        "exam": "I.A.S. (Pre) 2017",
        "stem": "The term ‘Domestic Content Requirement’ is sometimes seen in the news with reference to:",
        "options": {
            "a": "Developing solar power production in our country",
            "b": "Granting licences to foreign T.V. channels in our country",
            "c": "Exporting our food products to other countries",
            "d": "Permitting foreign educational institutions to set up their campuses in our country",
        },
        "ans": "a",
        "logic": "DCR category under JNNSM for domestic solar manufacturing — WTO dispute with US.",
    },
    {
        "exam": "I.A.S. (Pre) 2015",
        "stem": "With reference to the Indian Renewable Energy Development Agency Limited (IREDA), which of the following statements is/are correct? 1. It is a Public Limited Government Company. 2. It is a Non-Banking Financial Company.",
        "options": {"a": "1 only", "b": "2 only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "c",
        "logic": "IREDA is a Public Limited Government Company and an NBFC under MNRE.",
    },
    {
        "exam": "I.A.S. (Pre) 2019",
        "stem": "Consider the following statements: 1. As per law, the Compensatory Afforestation Fund Management and Planning Authority exists at both National and State levels. 2. People’s participation is mandatory in the compensatory afforestation programmes carried out under the Compensatory Afforestation Fund Act, 2016. Which is/are correct?",
        "options": {"a": "1 only", "b": "2 only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "a",
        "logic": "National and State CAMPA exist; people’s participation is not mandatory under the Act.",
    },
    {
        "exam": "I.A.S. (Pre) 2019",
        "stem": "In India, ‘extended producer responsibility’ was introduced as an important feature in which of the following?",
        "options": {
            "a": "The Bio-medical Waste (Management and Handling) Rules, 1998",
            "b": "The Recycled Plastic (Manufacturing and Usage) Rules, 1999",
            "c": "The e-Waste (Management and Handling) Rules, 2011",
            "d": "The Food Safety and Standard Regulation, 2011",
        },
        "ans": "c",
        "logic": "EPR entered Indian teaching via e-Waste (Management and Handling) Rules, 2011.",
    },
    {
        "exam": "I.A.S. (Pre) 2024",
        "stem": "Statement-I: Recently, Venezuela has achieved a rapid recovery from its economic crisis and succeeded in preventing its people from fleeing/emigrating to other countries. Statement-II: Venezuela has the world’s largest oil reserves. Which is correct?",
        "options": {
            "a": "Both Statement-I and Statement-II are correct and Statement-II explains Statement-I",
            "b": "Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I",
            "c": "Statement-I is correct, but Statement-II is incorrect",
            "d": "Statement-I is incorrect, but Statement-II is correct",
        },
        "ans": "d",
        "logic": "Venezuela still faces crisis and large emigration; it does hold the world’s largest proven oil reserves.",
    },
    {
        "exam": "I.A.S. (Pre) 2016",
        "stem": "Which one of the following is a purpose of ‘UDAY’, a scheme of the Government?",
        "options": {
            "a": "Providing technical and financial assistance to start-up entrepreneurs in the field of renewable sources of energy",
            "b": "Providing electricity to every household in the country by 2018",
            "c": "Replacing the coal-based power plants with natural gas, nuclear, solar, wind and tidal power plants over a period of time",
            "d": "Providing for financial turnaround and revival of power distribution companies",
        },
        "ans": "d",
        "logic": "UDAY = Ujwal Discom Assurance Yojana — Discom financial turnaround.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2021",
        "stem": "To reduce the interest payment on the Electricity sector, which scheme has been launched by the Government of India?",
        "options": {
            "a": "UJALA Scheme",
            "b": "Urja Ganga Scheme",
            "c": "UDAY Scheme",
            "d": "Saubhagya Scheme",
        },
        "ans": "c",
        "logic": "UDAY targets Discom debt / interest burden and operational turnaround.",
    },
    {
        "exam": "R.A.S./R.T.S. (Pre) 2024",
        "stem": "Which of the following statements are correct about PM Surya Ghar Muft Bijli Yojana? (i) To install Solar plants on one crore houses to provide upto 300 unit free electricity every month. (ii) Provision of 30 percent subsidy for setting up rooftop solar plants. (iii) 100 percent online system for registration, application, approval and grant. (iv) Provision of loan at bank interest 4 percent to each applicant.",
        "options": {
            "a": "(i) and (iv)",
            "b": "(i), (ii) and (iii)",
            "c": "(i) and (iii)",
            "d": "(i), (iii) and (iv)",
        },
        "ans": "c",
        "logic": "One crore homes + up to 300 units and fully online flow are correct; CFA is capacity-slabbed (not flat 30%); loan rate is repo-linked (~6%), not flat 4%.",
    },
    {
        "exam": "I.A.S. (Pre) 2025",
        "stem": "Consider the following statements about ‘PM Surya Ghar Muft Bijli Yojana’: I. It targets installation of one crore solar rooftop panels in the residential sector. II. The Ministry of New and Renewable Energy aims to impart training on installation, operation, maintenance and repairs of solar rooftop systems at grassroot levels. III. It aims to create more than three lakhs skilled manpower through fresh skilling, and upskilling, under scheme component of capacity building. Which are correct?",
        "options": {
            "a": "I and II only",
            "b": "I and III only",
            "c": "II and III only",
            "d": "I, II and III",
        },
        "ans": "d",
        "logic": "All three — one crore RTS, MNRE grassroot training, and >3 lakh skilled manpower target.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2021",
        "stem": "Which of the following is not correctly matched?",
        "options": {
            "a": "Primary Energy — Tidal Power",
            "b": "Commercial Energy — Oil and Gas",
            "c": "Non-Commercial Energy — Animal Dung",
            "d": "Non-Conventional Energy — Solar Energy",
        },
        "ans": "a",
        "logic": "Tides are a primary resource; tidal power is converted secondary energy — pair is mismatched.",
    },
    {
        "exam": "I.A.S. (Pre) 2025",
        "stem": "India is one of the founding members of the International North-South Transport Corridor (INSTC), a multimodal transportation corridor, which will connect:",
        "options": {
            "a": "India to Central Asia to Europe via Iran",
            "b": "India to Central Asia via China",
            "c": "India to South-East Asia through Bangladesh and Myanmar",
            "d": "India to Europe through Azerbaijan",
        },
        "ans": "a",
        "logic": "INSTC links Indian Ocean / Persian Gulf via Iran to Caspian and onward to Russia / Europe / Central Asia.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2019",
        "stem": "The East-West corridor of the Golden Quadrilateral connects which of the following centers (nodes)?",
        "options": {
            "a": "Silchar and Porbander",
            "b": "Guwahati and Ahmedabad",
            "c": "Kandla and Tinsukia",
            "d": "Itanagar and Jamnagar",
        },
        "ans": "a",
        "logic": "East–West corridor = Silchar–Porbandar; North–South = Srinagar–Kanyakumari.",
    },
    {
        "exam": "R.A.S./R.T.S. (Pre) 2024",
        "stem": "The four segments of the Golden Quadrilateral join the following cities: A. Delhi – Mumbai B. Mumbai – Chennai C. Chennai – Kolkata D. Kolkata – Delhi. Consider the length of the above segments in descending order:",
        "options": {
            "a": "C, D, A, B",
            "b": "C, D, B, A",
            "c": "D, C, B, A",
            "d": "D, C, A, B",
        },
        "ans": "a",
        "logic": "Longest Chennai–Kolkata, then Kolkata–Delhi, Delhi–Mumbai, shortest Mumbai–Chennai.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2023",
        "stem": "How many railways stations have been identified for modernization under ‘Amrit Bharat Station Scheme’ in Uttar Pradesh as on February, 2023?",
        "options": {"a": "123", "b": "57", "c": "82", "d": "149"},
        "ans": "d",
        "logic": "As of Feb 2023, 149 UP stations under Amrit Bharat Station Scheme.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2016",
        "stem": "The cities which are included in ‘Golden Triangle’ of Indian Tourism are:",
        "options": {
            "a": "Agra, Delhi and Jaipur",
            "b": "Mathura, Agra and Gwalior",
            "c": "Agra, Kanpur and Lucknow",
            "d": "None of the above",
        },
        "ans": "a",
        "logic": "Tourism Golden Triangle = Delhi–Agra–Jaipur.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2022",
        "stem": "As of early 2022, which country was at the top in steel production in the world?",
        "options": {"a": "Japan", "b": "India", "c": "China", "d": "England"},
        "ans": "c",
        "logic": "China leads world crude steel production by a wide margin.",
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
    return "U.P.P.C.S" in e or "U.P. P.C.S" in e or "UPPCS" in e or "U.P.P.S.C. (R.I.)" in e


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


def main() -> None:
    md = MD.read_text(encoding="utf-8")
    have = existing_fps(md)
    fresh = []
    for it in ITEMS:
        fp = fingerprint(it["stem"])
        if fp in have:
            continue
        fresh.append(it)

    bank, uk, extra = [], [], []
    for it in fresh:
        if is_ukpcs(it["exam"]):
            uk.append(it)
        elif is_uppcs(it["exam"]) and not is_ro_aro(it["exam"]):
            bank.append(it)
        else:
            extra.append(it)

    print(f"fresh {len(fresh)} bank {len(bank)} uk {len(uk)} extra {len(extra)}")

    bank_sec = md.split("## Complete PYQ Bank (UPPCS)")[1].split("## Ghatnachakra Extra Drill")[0]
    extra_sec = md.split("## Ghatnachakra Extra Drill")[1].split("## UKPCS")[0]
    uk_sec = md.split("## UKPCS")[1].split("## Practice Zone")[0]
    next_bank = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", bank_sec)] or [0]) + 1
    next_extra = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra_sec)] or [0]) + 1
    next_uk = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", uk_sec)] or [0]) + 1

    bank_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(bank, next_bank))
    extra_header = (
        "\n### Ghatnachakra Purvalokan — Miscellaneous (Economic & Social Development)\n\n"
        if extra
        else ""
    )
    extra_blob = extra_header + "\n".join(
        fmt_q(it, n, False) for n, it in enumerate(extra, next_extra)
    )
    uk_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(uk, next_uk))

    shutil.copy2(MD, MD.with_suffix(".md.bak_misc"))
    bank_anchor = "## Ghatnachakra Extra Drill — Economic Laws, Reports and Rankings"
    if bank_blob:
        md = md.replace(bank_anchor, bank_blob + "\n---\n\n" + bank_anchor, 1)
    if extra_blob:
        md = md.replace("## UKPCS", extra_blob + "\n---\n\n## UKPCS", 1)
    if uk_blob:
        md = md.replace("## Practice Zone", uk_blob + "\n---\n\n## Practice Zone", 1)

    md = re.sub(
        r"> Extra Drill filled from Ghatnachakra \*Sustainable Economic Development\* Purvalokan\.",
        "> Extra Drill: Ghatnachakra **Sustainable Economic Development** + **Miscellaneous** "
        "(PAT/MISHTI/LiFE/NCAP, UN years, NEP, Competition, DigiLocker, UDAY/power, committees).",
        md,
        count=1,
    )

    m = re.search(r"## Consolidated — (\d+)", md)
    if m and int(m.group(1)) > 50:
        raise SystemExit("Consolidated bloated")

    MD.write_text(md, encoding="utf-8")
    print("wrote bank", next_bank, "-", next_bank + len(bank) - 1 if bank else "none")
    print("wrote extra", next_extra, "-", next_extra + len(extra) - 1 if extra else "none")
    print("wrote uk", next_uk, "-", next_uk + len(uk) - 1 if uk else "none")
    print("consolidated", m.group(1) if m else "?")


if __name__ == "__main__":
    main()
