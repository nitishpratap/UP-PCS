# -*- coding: utf-8 -*-
"""Inject Ghat World Population & Urbanization into Topic 08. Consolidated cap 50."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

MD = Path(__file__).resolve().parent / "08_Employment_Poverty_Human_Capital.md"

ITEMS: list[dict] = [
    {
        "exam": "63rd B.P.S.C. (Pre) 2017",
        "stem": "During 10000 BC, the population of the world was:",
        "options": {
            "a": "2 million",
            "b": "3 million",
            "c": "4 million",
            "d": "5 million",
            "e": "None of the above / More than one of the above",
        },
        "ans": "e",
        "logic": "Estimates for ~10000 BC range about 1–10 million — no single listed figure is locked.",
    },
    {
        "exam": "66th B.P.S.C. (Pre) 2020",
        "stem": "Which one of the following countries of the world has the largest Indian population as on December 2018?",
        "options": {
            "a": "United Arab Emirates",
            "b": "Malaysia",
            "c": "United Kingdom",
            "d": "United States of America",
            "e": "None of the above / More than one of the above",
        },
        "ans": "a",
        "logic": "MoEA teaching (Dec 2018): UAE held the largest Indian diaspora; Saudi Arabia second.",
    },
    {
        "exam": "U.P.P.S.C. (GIC) 2017",
        "stem": "Which of the following subjects deals with the studies in population and vital statistics of Human communities?",
        "options": {"a": "Ecology", "b": "Genetics", "c": "Demography", "d": "Virology"},
        "ans": "c",
        "logic": "Demography = statistical study of populations and vital statistics.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2013",
        "stem": "The idea of ‘Folk-Urban Continuum’ was developed on the basis of studies conducted in:",
        "options": {"a": "Mexico", "b": "Brazil", "c": "Indonesia", "d": "India"},
        "ans": "a",
        "logic": "Robert Redfield’s Folk–Urban Continuum grew from Mexican Yucatán / Maya community studies.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2013",
        "stem": "In the view of Redfield and Singer, the process of primary urbanization is characterized by the development of a:",
        "options": {
            "a": "Folk tradition",
            "b": "Elite tradition",
            "c": "Great tradition",
            "d": "Little tradition",
        },
        "ans": "c",
        "logic": "Primary urbanization coordinates activities to norms of the Great Tradition.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2021",
        "stem": "Which among the following organizations released the World Population Report, 2021?",
        "options": {
            "a": "International Monetary Fund",
            "b": "United Nations Population Fund",
            "c": "World Health Organization",
            "d": "United Nations Development Programme",
        },
        "ans": "b",
        "logic": "UNFPA released State of World Population 2021 (My Body is My Own).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "The World Population Day commemorates the day on which the estimated world population become five billion. That day was:",
        "options": {
            "a": "11 July 1987",
            "b": "11 Sept. 1994",
            "c": "11 Nov. 1995",
            "d": "11 July 1997",
        },
        "ans": "a",
        "logic": "Five Billion Day ≈ 11 July 1987; World Population Day is observed every 11 July.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2015",
        "stem": "World Population Day is celebrated on:",
        "options": {"a": "October 4", "b": "May 3", "c": "July 11", "d": "December 10"},
        "ans": "c",
        "logic": "World Population Day = 11 July.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2017",
        "stem": "What has been the theme of the 2017 World Population Day?",
        "options": {
            "a": "Be counted: Say what you need",
            "b": "Investing in teenage girls",
            "c": "Vulnerable population in emergency",
            "d": "Family planning : Empowering People, Developing Nations",
        },
        "ans": "d",
        "logic": "WPD 2017 theme = Family Planning: Empowering People, Developing Nations.",
    },
    {
        "exam": "R.A.S./R.T.S. (Pre) (Re-Exam) 2013",
        "stem": "Which one of the following is the theme of the World Population Day, 2015?",
        "options": {
            "a": "Universal access to reproductive health services",
            "b": "Vulnerable populations in emergencies",
            "c": "A time to reflect on population trends and related issues",
            "d": "Focus is on adolescent pregnancy",
        },
        "ans": "b",
        "logic": "WPD 2015 theme = Vulnerable Populations in Emergencies.",
    },
    {
        "exam": "I.A.S. (Pre) 1997",
        "stem": "About 50% of the total population of the world is concentrated between the latitudes of:",
        "options": {
            "a": "5°N and 20° N",
            "b": "20°N and 40° N",
            "c": "40° N and 60° N",
            "d": "20° S and 40°S",
        },
        "ans": "b",
        "logic": "~50% of world population lies between 20°N and 40°N.",
    },
    {
        "exam": "I.A.S. (Pre) 1993",
        "stem": "The ‘New Population Bomb’ refers to:",
        "options": {
            "a": "an increase in the population of the aged in the Third World",
            "b": "rapidly growing urban population in the Third World",
            "c": "large scale distress migration in the Third World",
            "d": "deluge of Soviet emigrants",
        },
        "ans": "b",
        "logic": "New Population Bomb = rapid Third World urban population growth.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2012",
        "stem": "What percentage of the total population of the world resides in India as estimated in the year 2011?",
        "options": {"a": "15", "b": "17.5", "c": "20", "d": "22.5"},
        "ans": "b",
        "logic": "India ≈17.5% of world population in 2011 teaching.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2016",
        "stem": "The percentage of India’s population in the total population of the world as per 2011 Census is:",
        "options": {"a": "17.31", "b": "18.50", "c": "18.90", "d": "19.05"},
        "ans": "a",
        "logic": "Closest keyed figure to ≈17.5% world share.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2008",
        "stem": "As per World Statistics 2008, what approximate percentage of world population lives in Asia?",
        "options": {"a": "61%", "b": "63%", "c": "65%", "d": "66%"},
        "ans": "a",
        "logic": "~61% of world population in Asia in 2008 teaching.",
    },
    {
        "exam": "U.P. P.C.S. (Mains) 2010",
        "stem": "Which of the following countries has the largest population?",
        "options": {"a": "Brazil", "b": "Bangladesh", "c": "Indonesia", "d": "Pakistan"},
        "ans": "c",
        "logic": "Among the set, Indonesia is the most populous.",
    },
    {
        "exam": "I.A.S. (Pre) 2008",
        "stem": "Which two countries follow China and India in the decreasing order of their populations?",
        "options": {
            "a": "Brazil and USA",
            "b": "USA and Indonesia",
            "c": "Canada and Malayasia",
            "d": "Russia and Nigeria",
        },
        "ans": "b",
        "logic": "Classic order after China–India: USA then Indonesia.",
    },
    {
        "exam": "I.A.S. (Pre) 2002",
        "stem": "Consider the following countries: 1. Brazil 2. Indonesia 3. Japan 4. Russia. What is the decreasing order of the size of their populations?",
        "options": {"a": "1, 2, 4, 3", "b": "2, 3, 1, 4", "c": "2, 1, 4, 3", "d": "1, 2, 3, 4"},
        "ans": "c",
        "logic": "Indonesia > Brazil > Russia > Japan.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2011",
        "stem": "Africa’s most populous country is:",
        "options": {"a": "Egypt", "b": "Ethiopia", "c": "Nigeria", "d": "South Africa"},
        "ans": "c",
        "logic": "Nigeria is Africa’s most populous country.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2005",
        "stem": "Which of the following is the most populous Islamic country?",
        "options": {"a": "Pakistan", "b": "Bangladesh", "c": "Indonesia", "d": "Egypt"},
        "ans": "c",
        "logic": "Indonesia is the most populous Muslim-majority country.",
    },
    {
        "exam": "U.P. Lower Sub. (Spl.) (Pre) 2003",
        "stem": "In which of the following, population growth was minimum during the year 1990-2000?",
        "options": {
            "a": "Australia",
            "b": "Europe",
            "c": "North America",
            "d": "South America",
        },
        "ans": "b",
        "logic": "Europe had the minimum population growth among the continents listed.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2008",
        "stem": "Highest percentage of population growth has been noticed in the countries of the continent of:",
        "options": {"a": "Africa", "b": "Asia", "c": "Latin America", "d": "Oceania"},
        "ans": "a",
        "logic": "Africa has the highest continental population growth rate.",
    },
    {
        "exam": "I.A.S. (Pre) 1994",
        "stem": "Which one of the following regions of Asia is experiencing the highest annual growth rate of population?",
        "options": {
            "a": "South Asia",
            "b": "South-East Asia",
            "c": "Central Asia",
            "d": "West Asia",
        },
        "ans": "c",
        "logic": "Question-period key: Central Asia highest among listed Asian regions.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 1999",
        "stem": "Which one of the following countries has highest population growth rate?",
        "options": {"a": "Indonesia", "b": "Japan", "c": "Philippines", "d": "Singapore"},
        "ans": "c",
        "logic": "Among the set, Philippines has the highest growth rate.",
    },
    {
        "exam": "I.A.S. (Pre) 2024",
        "stem": "Consider the following countries: 1. Italy 2. Japan 3. Nigeria 4. South Korea 5. South Africa. Which are frequently mentioned in the media for their low birth rates, or ageing population or declining population?",
        "options": {
            "a": "1, 2 and 4",
            "b": "1, 3 and 5",
            "c": "2 and 4 only",
            "d": "3 and 5 only",
        },
        "ans": "a",
        "logic": "Italy, Japan and South Korea are the low-fertility / ageing set — not Nigeria/South Africa.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2010",
        "stem": "Assertion (A): The areas of low density of population are often over populated. Reason (R): Their carrying capacity is less.",
        "options": {
            "a": "Both (A) and (R) are true, and (R) is the correct explanation of (A)",
            "b": "Both (A) and (R) are true, but (R) is not a correct explanation of (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "d",
        "logic": "Low-density areas are not ‘often over-populated’; low carrying capacity can still be true.",
    },
    {
        "exam": "Uttarakhand U.D.A./L.D.A. (Pre) 2007",
        "stem": "Which Continent has the highest population density?",
        "options": {"a": "Asia", "b": "Europe", "c": "Africa", "d": "North America"},
        "ans": "a",
        "logic": "Asia is the densest continent.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2014",
        "stem": "Which of the following continents had the lowest population density in the year 2011?",
        "options": {
            "a": "South America",
            "b": "North America",
            "c": "Europe",
            "d": "Africa",
        },
        "ans": "b",
        "logic": "Among listed continents, North America had the lowest density.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
        "stem": "Consider the following statements with reference to world population: I. Brazil has the highest population among the South American countries. II. Asia continent has the highest growth rate of population. III. Africa is the most densely populated continent of the world.",
        "options": {
            "a": "Both I and III",
            "b": "Only II",
            "c": "Both I and II",
            "d": "Only I",
        },
        "ans": "d",
        "logic": "Only I true; highest growth = Africa; densest continent = Asia.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2013",
        "stem": "Which one of the following countries has the lowest density of population?",
        "options": {"a": "Canada", "b": "Finland", "c": "Norway", "d": "Russia"},
        "ans": "a",
        "logic": "Canada has the lowest density among the set.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2017",
        "stem": "Which country has the lowest density of population?",
        "options": {"a": "Mongolia", "b": "Saudi Arabia", "c": "Iraq", "d": "Afghanistan"},
        "ans": "a",
        "logic": "Mongolia has the lowest density among the set.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2009",
        "stem": "Most densely populated country among the SAARC countries is:",
        "options": {"a": "Bangladesh", "b": "India", "c": "Maldives", "d": "Sri Lanka"},
        "ans": "c",
        "logic": "Maldives is the densest SAARC country.",
    },
    {
        "exam": "I.A.S. (Pre) 2009",
        "stem": "Which one among the following South Asian countries has the highest population density?",
        "options": {"a": "Sri Lanka", "b": "India", "c": "Nepal", "d": "Pakistan"},
        "ans": "b",
        "logic": "Among the listed larger South Asian countries, India is densest.",
    },
    {
        "exam": "U.P. P.C.S. (Mains) 2014",
        "stem": "The most densely populated country in East Asia is:",
        "options": {"a": "China", "b": "Japan", "c": "North Korea", "d": "South Korea"},
        "ans": "d",
        "logic": "South Korea densest among the East Asian set.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Mains) 2010",
        "stem": "The most densely populated country of South America is:",
        "options": {"a": "Bolivia", "b": "Colombia", "c": "Ecuador", "d": "Venezuela"},
        "ans": "c",
        "logic": "Ecuador densest among the listed South American countries.",
    },
    {
        "exam": "I.A.S. (Pre) 2001",
        "stem": "The high density of population in Nile Valley and Island of Jawa is primarily due to:",
        "options": {
            "a": "intensive agriculture",
            "b": "industrialization",
            "c": "urbanization",
            "d": "topographic constraints",
        },
        "ans": "a",
        "logic": "Fertile intensive agriculture supports high density in Nile Valley and Java.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2011",
        "stem": "Which of the following countries has the most favourable sex-ratio?",
        "options": {
            "a": "Sweden",
            "b": "Switzerland",
            "c": "The Netherlands",
            "d": "Finland",
        },
        "ans": "d",
        "logic": "Among the set, Finland has the most favourable sex ratio.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2004",
        "stem": "There is a fear of decreasing sex-ratio of the world in future due to increasing:",
        "options": {
            "a": "Urbanization",
            "b": "Expectation of life",
            "c": "Sex determination tests",
            "d": "Women’s status",
        },
        "ans": "c",
        "logic": "Sex-determination tests drive fear of falling sex ratios.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2004",
        "stem": "The Population of the world in descending order, on the basis of religion is:",
        "options": {
            "a": "Buddhists, Christians, Muslims, Hindus",
            "b": "Christians, Muslims, Hindus, Buddhists",
            "c": "Christians, Buddhists, Hindus, Muslims",
            "d": "Buddhists, Muslims, Christians, Hindus",
        },
        "ans": "b",
        "logic": "Christians > Muslims > Hindus > Buddhists.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2018",
        "stem": "According to the UN Department of Economic and Social Affairs (UN-DESA), what percentage total of world’s population is currently living in urban areas?",
        "options": {"a": "25", "b": "45", "c": "35", "d": "55"},
        "ans": "d",
        "logic": "WUP 2018 teaching ≈55% urban worldwide.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2021",
        "stem": "Which one of the following is known as acceleration stage in the urbanization curve?",
        "options": {
            "a": "First stage",
            "b": "Second stage",
            "c": "Third stage",
            "d": "Fourth stage",
        },
        "ans": "b",
        "logic": "Second stage of the S-shaped urbanization curve = acceleration.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "As per United Nations data, what percentage of world’s population was estimated to live in urban settlements in 2016?",
        "options": {"a": "53.5", "b": "54.5", "c": "55.5", "d": "56.5"},
        "ans": "b",
        "logic": "UN 2016 urban share teaching ≈54.5%.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2008",
        "stem": "According to an estimate, seventy percent of the world’s population would be localized in urban areas by the year:",
        "options": {"a": "2040", "b": "2050", "c": "2060", "d": "2070"},
        "ans": "b",
        "logic": "Older UN projection keyed ~70% urban by 2050 (later revisions ≈68%).",
    },
    {
        "exam": "I.A.S. (Pre) 2017",
        "stem": "With reference to the role of UN-Habitat in the United Nations programme working towards a better urban future, which statements is/are correct? 1. UN-Habitat has been mandated by the United Nations General Assembly to promote socially and environmentally sustainable towns and cities to provide adequate shelter for all. 2. Its partners are either governments or local urban authorities only. 3. UN-Habitat contributes to the overall objective of the United Nations system to reduce poverty and to promote access to safe drinking water and basic sanitation.",
        "options": {"a": "1, 2 and 3", "b": "1 and 3 only", "c": "2 and 3 only", "d": "1 only"},
        "ans": "b",
        "logic": "1 and 3 true; partners include civil society, academia and private sector — not governments only.",
    },
    {
        "exam": "I.A.S. (Pre) 2010",
        "stem": "As per the UN-Habitat’s Global Report on Human Settlements 2009, which one among the following regions has shown the fastest growth rate of urbanization in the last three decades?",
        "options": {
            "a": "Asia",
            "b": "Europe",
            "c": "Latin America and Caribbean",
            "d": "North America",
        },
        "ans": "a",
        "logic": "Asia showed the fastest urbanization growth rate in that report’s period.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2013",
        "stem": "Which one of the following is not a criterion to determine prosperity of cities according to U.N. Habitat Report on the State of World’s Cities?",
        "options": {
            "a": "Productivity",
            "b": "Optimum population",
            "c": "Quality of life",
            "d": "Equality",
        },
        "ans": "b",
        "logic": "Optimum population is not a UN-Habitat city-prosperity criterion.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2008",
        "stem": "Which one of the following countries has the largest urban population in the world?",
        "options": {"a": "China", "b": "India", "c": "Indonesia", "d": "U.S.A."},
        "ans": "a",
        "logic": "China has the world’s largest absolute urban population.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2010",
        "stem": "The most urbanized continent is:",
        "options": {
            "a": "Africa",
            "b": "Australia",
            "c": "North Amercia",
            "d": "Europe",
        },
        "ans": "b",
        "logic": "Australia / Oceania keys the most urbanized continental set in many tables.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2005",
        "stem": "At present, the most urbanized country of the world is:",
        "options": {"a": "Germany", "b": "Japan", "c": "Singapore", "d": "U.S.A."},
        "ans": "c",
        "logic": "Singapore (100% urban) is the classic most-urbanized country among options.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2008",
        "stem": "The most urbanized country of South America is:",
        "options": {"a": "Argentina", "b": "Brazil", "c": "Uruguay", "d": "Venezuela"},
        "ans": "c",
        "logic": "Uruguay is the most urbanized among the listed South American countries.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2014",
        "stem": "Which one of the following is the most urbanized country of South Asia?",
        "options": {"a": "India", "b": "Bhutan", "c": "Sri Lanka", "d": "Pakistan"},
        "ans": "b",
        "logic": "Among current World Bank-type tables for this option set, Bhutan often leads; older keys preferred Pakistan — use Bhutan for the printed 2014 stem set with Bhutan listed.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2011",
        "stem": "Which one of the following is the most urbanized country of West Asia?",
        "options": {"a": "Israel", "b": "Kuwait", "c": "Qatar", "d": "Saudi Arabia"},
        "ans": "b",
        "logic": "Kuwait keys 100% urban among the West Asian set.",
    },
    {
        "exam": "70th B.P.S.C. (Pre) 2024",
        "stem": "Which of the following is a technopolis?",
        "options": {"a": "Silicon Valley", "b": "London", "c": "Paris", "d": "Moscow"},
        "ans": "a",
        "logic": "Technopolis = technology/innovation hub; Silicon Valley is the classic example.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2016",
        "stem": "Assertion (A): Urbanization follows industrialization. Reason (R): In developing countries, urbanization is a movement in itself.",
        "options": {
            "a": "Both (A) and (R) are true and (R) is the correct explanation of (A)",
            "b": "Both (A) and (R) are true, but (R) is not the correct explanation of (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "b",
        "logic": "Both true; developing-country urban surge does not explain the industrialization→urbanization link.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2010",
        "stem": "Assertion (A): The Asian cities are over-urbanized. Reason (R): Their growth has outpaced their economic development.",
        "options": {
            "a": "Both (A) and (R) are true and (R) is the correct explanation of (A)",
            "b": "Both (A) and (R) are true, but (R) is not the correct explanation of (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "a",
        "logic": "Over-urbanization is keyed to urban growth outpacing economic development.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2012",
        "stem": "Which one of the following countries was the first to adopt family planning programme officially?",
        "options": {"a": "Brazil", "b": "USA", "c": "India", "d": "China"},
        "ans": "c",
        "logic": "India launched the first official national family-planning programme in 1952.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2005",
        "stem": "In which year Family Planning Programme was started in India?",
        "options": {"a": "1950", "b": "1951", "c": "1952", "d": "1955"},
        "ans": "c",
        "logic": "National Family Planning Programme started in 1952.",
    },
    {
        "exam": "I.A.S. (Pre) 2003",
        "stem": "Life expectancy is highest in the world in:",
        "options": {"a": "Canada", "b": "Germany", "c": "Japan", "d": "Norway"},
        "ans": "c",
        "logic": "Japan keys the highest life expectancy among the set.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2007",
        "stem": "Which one of the following countries has the highest birth rate?",
        "options": {
            "a": "Afghanistan",
            "b": "Bangladesh",
            "c": "India",
            "d": "Pakistan",
        },
        "ans": "a",
        "logic": "Afghanistan has the highest birth rate among the listed South Asian countries.",
    },
    {
        "exam": "U.P. P.S.C. (GIC) 2008",
        "stem": "Which of the following countries of Asia, is witnessing higher number of deaths than births per year?",
        "options": {"a": "Behrain", "b": "Israel", "c": "Japan", "d": "Singapore"},
        "ans": "c",
        "logic": "Japan keys natural decrease / deaths exceeding births among the set.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2013",
        "stem": "In South Asia, the country with the largest percentage of aged population is:",
        "options": {"a": "Bhutan", "b": "India", "c": "Nepal", "d": "Sri Lanka"},
        "ans": "d",
        "logic": "Sri Lanka has the largest share of aged population among the set.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Pre) 2010",
        "stem": "About eighty percent of the world’s population is not protected by:",
        "options": {
            "a": "Economic security",
            "b": "Food security",
            "c": "Child security",
            "d": "Social security",
        },
        "ans": "d",
        "logic": "~80% of world population lacks social-security protection in the keyed reading.",
    },
    {
        "exam": "I.A.S. (Pre) 2024",
        "stem": "Consider the following countries: 1. Italy 2. Japan 3. Nigeria 4. South Korea 5. South Africa — low birth rates / ageing / declining population media set",
        "options": {
            "a": "1, 2 and 4",
            "b": "1, 3 and 5",
            "c": "2 and 4 only",
            "d": "3 and 5 only",
        },
        "ans": "a",
        "logic": "Duplicate-safe: Italy–Japan–South Korea.",
    },
]

# Deduplicate identical stems in ITEMS before inject
_seen = set()
_deduped = []
for it in ITEMS:
    k = it["stem"][:80]
    if k in _seen:
        continue
    _seen.add(k)
    _deduped.append(it)
ITEMS = _deduped


def norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def fingerprint(stem: str) -> str:
    words = [w for w in norm(stem).split() if len(w) > 2][:14]
    return " ".join(words)


def is_uppcs(exam: str) -> bool:
    e = exam.upper()
    return (
        "U.P.P.C.S" in e
        or "U.P. P.C.S" in e
        or "UPPCS" in e
        or "U.P.P.S.C" in e
        or "U.P. B.E.O" in e
    )


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
    fresh = [it for it in ITEMS if fingerprint(it["stem"]) not in have]

    bank, uk, extra = [], [], []
    for it in fresh:
        if is_ukpcs(it["exam"]):
            uk.append(it)
        elif is_uppcs(it["exam"]) and not is_ro_aro(it["exam"]):
            bank.append(it)
        else:
            extra.append(it)

    print(f"fresh {len(fresh)} bank {len(bank)} uk {len(uk)} extra {len(extra)}")

    bank_h = "## Complete PYQ Bank (UPPCS)"
    extra_h = "## Ghatnachakra Extra Drill — Employment, Poverty and Human Capital"
    uk_h = "## UKPCS"
    practice_h = "## Practice Zone"

    bank_sec = md.split(bank_h)[1].split(extra_h)[0]
    extra_sec = md.split(extra_h)[1].split(uk_h)[0]
    uk_sec = md.split(uk_h)[1].split(practice_h)[0]
    next_bank = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", bank_sec)] or [0]) + 1
    next_extra = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra_sec)] or [0]) + 1
    next_uk = max([int(x) for x in re.findall(r"\*\*Q(\d+)\.", uk_sec)] or [0]) + 1

    bank_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(bank, next_bank))
    extra_header = (
        "\n### Ghatnachakra Purvalokan — World Population and Urbanization\n\n"
        if extra
        else ""
    )
    extra_blob = extra_header + "\n".join(
        fmt_q(it, n, False) for n, it in enumerate(extra, next_extra)
    )
    uk_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(uk, next_uk))

    shutil.copy2(MD, MD.with_suffix(".md.bak_worldpop"))
    if bank_blob:
        md = md.replace(extra_h, bank_blob + "\n---\n\n" + extra_h, 1)
    if extra_blob:
        md = md.replace(uk_h, extra_blob + "\n---\n\n" + uk_h, 1)
    if uk_blob:
        md = md.replace(practice_h, uk_blob + "\n---\n\n" + practice_h, 1)

    md = re.sub(
        r"> Extra Drill:.*",
        "> Extra Drill: Ghatnachakra **Employment / Demography / India Urbanization** "
        "+ **World Population & Urbanization** (UNFPA, density, global cities).",
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
