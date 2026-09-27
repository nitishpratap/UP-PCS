# -*- coding: utf-8 -*-
"""Inject Ghat India: Urbanization into Topic 08. Consolidated untouched (cap 50)."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

MD = Path(__file__).resolve().parent / "08_Employment_Poverty_Human_Capital.md"

ITEMS: list[dict] = [
    {
        "exam": "U.P.P.C.S. (Spl.) (Mains) 2004",
        "stem": "A city is different from a village: 1. In terms of social values 2. In terms of household composition 3. In terms of way of living 4. In terms of economic activities",
        "options": {"a": "1 and 2", "b": "2 and 3", "c": "1, 2 and 3", "d": "All of the above"},
        "ans": "d",
        "logic": "All four dimensions distinguish city from village in the keyed reading.",
    },
    {
        "exam": "U.P.P.C.S. (Spl.) (Mains) 2004",
        "stem": "Urban growth is indicative of: 1. Rise in the total urban population 2. Rise in the number of urban centres 3. Rise in the total population of a country 4. Rise in the income from urban areas",
        "options": {"a": "1 and 2", "b": "2 and 3", "c": "1, 2 and 3", "d": "All of the above"},
        "ans": "d",
        "logic": "Classic key treats all four as indicators of urban growth.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2021",
        "stem": "Which one of the following is NOT an element of rural community?",
        "options": {"a": "We-feeling", "b": "Cultural diversity", "c": "Territory", "d": "Self-sufficiency"},
        "ans": "b",
        "logic": "Cultural diversity is an urban community feature, not a rural element.",
    },
    {
        "exam": "Jharkhand P.C.S. (Pre) 2021",
        "stem": "Which of the following is not a feature of urban life?",
        "options": {
            "a": "Competition",
            "b": "Impersonal relationship",
            "c": "Loss of humanistic value",
            "d": "Informal ties",
        },
        "ans": "d",
        "logic": "Informal ties are not a classic urban-life feature; formality/anonymity are.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2014",
        "stem": "T.K. Oommen distinguished urban families through:",
        "options": {
            "a": "mode of earning and changing value pattern",
            "b": "structure of authority",
            "c": "urban social milieu and social ecology",
            "d": "all of the above",
        },
        "ans": "d",
        "logic": "Oommen uses all three patterns to distinguish urban families.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2017",
        "stem": "Consider the following in relation to causes of urbanization: 1. High rate of migration from rural to urban areas 2. Increasing number of educational institutions in cities 3. High rate of industrialization 4. High standard of living in rural areas",
        "options": {
            "a": "1, 2 and 3 are correct",
            "b": "2, 3 and 4 are correct",
            "c": "1, 2 and 4 are correct",
            "d": "1, 3 and 4 are correct",
        },
        "ans": "a",
        "logic": "High rural living standards reduce push migration — not a cause of urbanization.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2015",
        "stem": "Consider the following in relation to causes of urbanization: 1. High rate of migration from rural to urban areas 2. Increasing number of educational institutions in cities 3. High standard of living in rural areas. Which are correct?",
        "options": {"a": "1 and 2", "b": "2 and 3", "c": "1 and 3", "d": "1, 2 and 3"},
        "ans": "a",
        "logic": "Statement 3 is not a cause of urbanization.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2016",
        "stem": "Which of the following segments of population is not included in the scheme of inclusive development?",
        "options": {
            "a": "Marginal farmers",
            "b": "Landless agricultural labourers",
            "c": "Schedule Castes/Schedule Tribes",
            "d": "Persons living in semi-urban areas",
        },
        "ans": "d",
        "logic": "Inclusive-development focus is on marginalised rural/agrarian/SC-ST segments — not semi-urban residents as a class.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) (Re-Exam) 2015",
        "stem": "At current rate of growth, the urban population of India by the year 2030 will reach:",
        "options": {"a": "575 million", "b": "675 million", "c": "750 million", "d": "900 million"},
        "ans": "a",
        "logic": "Question-period MoUD / India Yearbook teaching keyed ~575 million by 2030.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 1998",
        "stem": "In terms of Urbanization India is a:",
        "options": {
            "a": "Moderately-low urbanized country",
            "b": "Very-low urbanized country",
            "c": "Highly urbanized country",
            "d": "None of the above",
        },
        "ans": "a",
        "logic": "India’s urban share (~28% in 2001; ~31% in 2011) is keyed as moderately low.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "Assertion (A): India is a case of an over-urbanized country. Reason (R): Most of the large cities in India do not have adequate infrastructure.",
        "options": {
            "a": "Both (A) and (R) are correct and (R) explains (A)",
            "b": "Both (A) and (R) are correct, but (R) does not explain (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "d",
        "logic": "India is not over-urbanized (~31% urban); infrastructure stress in large cities is true.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Pre) 2010",
        "stem": "Assertion (A): India’s level of urbanization is much lower than that of China. Reason (R): Indian cities are poorly planned.",
        "options": {
            "a": "Both (A) and (R) are true, and (R) is the correct explanation of (A)",
            "b": "Both (A) and (R) are true, but (R) is not the correct explanation of (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "b",
        "logic": "Both true historically; poor planning does not explain China’s higher urbanization rate.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2003",
        "stem": "Which statements are correct according to Census 2001? I. Total urban population of India is 285 million II. Contribution of urban population in total population is 27.78 percent III. Urban population of India is more than the total population of USA IV. Indian urbanization is basically self-reliant urbanization",
        "options": {"a": "I and II", "b": "II and III", "c": "I, II and IV", "d": "All"},
        "ans": "d",
        "logic": "Question-period key treated all four as correct for Census 2001 teaching.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2000",
        "stem": "Assertion (A): The urban population of India is more than that of the U.S.A. Reason (R): The level of urbanization in the U.S.A. is higher than that in India.",
        "options": {
            "a": "Both A and R are true and R is the correct explanation of A",
            "b": "Both A and R are true but R is not the correct explanation of A",
            "c": "A is true, but R is false",
            "d": "A is false, but R is true",
        },
        "ans": "b",
        "logic": "India’s urban headcount can exceed USA total population while USA’s urbanization rate stays higher — R does not explain A.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2002",
        "stem": "Assertion (A): India’s urban population exceeds the total population of USA. Reason (R): India has made a spectacular growth in urbanization.",
        "options": {
            "a": "Both A and R are true and R is the correct explanation of A",
            "b": "Both A and R are true but R is not the correct explanation of A",
            "c": "A is true, but R is false",
            "d": "A is false, but R is true",
        },
        "ans": "a",
        "logic": "Rapid urbanization growth explains how urban India overtook USA’s total population in the keyed reading.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2015",
        "stem": "The expansion of Urban India is a platform for:",
        "options": {
            "a": "Industrial growth",
            "b": "Modern service sector growth",
            "c": "Creation of improved income opportunities",
            "d": "All of the above",
        },
        "ans": "d",
        "logic": "Urbanization supports industry, services and income opportunities together.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2016",
        "stem": "Assertion (A): Urbanization in India has increased rapidly after 2001. Reason (R): A revolution in mobile communication has been taking place in India.",
        "options": {
            "a": "Both (A) and (R) are true and (R) truly explains (A)",
            "b": "Both (A) and (R) are true, but (R) does not explain (A)",
            "c": "(A) is true, but (R) is false",
            "d": "(A) is false, but (R) is true",
        },
        "ans": "b",
        "logic": "Both true; mobile boom does not explain post-2001 urbanization.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2002",
        "stem": "Which of the following statements regarding urbanization in India is not true?",
        "options": {
            "a": "With a few exceptions, the urban growth rate in India has been always increasing",
            "b": "The concentration of urban population in India has increased in relatively big cities",
            "c": "Urbanization of all regions in India has taken place in uniform manner",
            "d": "Employment, housing, pollution and energy are the main urban problems in India",
        },
        "ans": "c",
        "logic": "Regional urbanization is highly uneven (e.g. Goa high, Himachal low).",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2021",
        "stem": "With reference to ‘birth rate’ which statement(s) is/are correct? 1. Urbanization helps in reducing the birth rate 2. High literacy rate is directly related to low birth rate",
        "options": {"a": "Only 1", "b": "Only 2", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "c",
        "logic": "Both urbanization and high literacy associate with lower birth rates.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2007",
        "stem": "Urbanization in India has:",
        "options": {
            "a": "reduced both birth rate and death rate",
            "b": "reduced the birth rate only, not the death rate",
            "c": "increased birth rate and death rate both",
            "d": "no effect on both birth rate and death rate",
        },
        "ans": "a",
        "logic": "Urbanization links to lower fertility and better health access → lower birth and death rates.",
    },
    {
        "exam": "Chhattisgarh P.C.S. (Pre) 2021",
        "stem": "Read the statements: Statement-I: First All India Census was attempted in 1871. Statement-II: From 1881 onwards decennial censuses became a regular feature. Statement-III: In forty years from 1900 to 1940, urban population increased from 10% of total population to 18%.",
        "options": {
            "a": "Statement-I, II, III all are true",
            "b": "Only Statement-I is true",
            "c": "Only Statement-II is true",
            "d": "Only Statement-III is true",
        },
        "ans": "c",
        "logic": "Only II is cleanly true (1881 sync Census). I misdates the first attempt; III’s 10%→18% by 1940 fails the keyed urban shares.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2003",
        "stem": "Which one of the following periods is characterized by the stage of moderate urbanization in India?",
        "options": {"a": "1881-1901", "b": "1901-1931", "c": "1931-1961", "d": "1961-2001"},
        "ans": "c",
        "logic": "1931–61 is keyed as the moderate-urbanization era.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2007",
        "stem": "In India, the largest percentage of decadal growth of urbanization has been witnessed during:",
        "options": {"a": "1961-71", "b": "1971-81", "c": "1981-91", "d": "1991-2001"},
        "ans": "b",
        "logic": "Largest urban decadal change teaching = 1971–81 (~46.1%).",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2008",
        "stem": "Which of the following criteria is not accepted to define any domicile in India as an urban center?",
        "options": {
            "a": "Physical expansion",
            "b": "Population size",
            "c": "Population density",
            "d": "Occupational structure",
        },
        "ans": "a",
        "logic": "Census urban criteria use size, density and non-agri occupation — not physical expansion.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2009",
        "stem": "Which conditions determine an area as urban as given in the Census Report of 2001? 1. Minimum population 5,000 2. Minimum 75% male working population in non-agricultural work 3. Density at least 400 persons per sq. km 4. Minimum area of 10 sq. km",
        "options": {"a": "1 and 2", "b": "1, 2 and 3", "c": "2, 3 and 4", "d": "All four"},
        "ans": "b",
        "logic": "Statements 1–3 are Census Town criteria; fixed 10 sq km area is not.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Mains) 2010",
        "stem": "According to 2011 Census, the total number of Census Towns in India is:",
        "options": {"a": "3894", "b": "4041", "c": "5161", "d": "7935"},
        "ans": "a",
        "logic": "Provisional teaching ~3894 Census Towns (final ~3892).",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2017",
        "stem": "As per 2011 Census, the percentage of urban population to total population in India was:",
        "options": {"a": "28.50", "b": "31.16", "c": "37.60", "d": "39.20"},
        "ans": "b",
        "logic": "Provisional 31.16%; final ≈31.1%.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2023",
        "stem": "According to the 2011 Census of India, the percentage of India’s urban population was:",
        "options": {"a": "30.7%", "b": "31.2%", "c": "31.8%", "d": "None of the above"},
        "ans": "d",
        "logic": "Exact final share ≈31.1% — none of the printed options match cleanly.",
    },
    {
        "exam": "M.P. P.C.S. (Pre) 2021",
        "stem": "Out of total population of 121 crore, what was the level (percentage) of urbanization in 2011 census of India?",
        "options": {"a": "33.15%", "b": "32.15%", "c": "30.15%", "d": "31.15%"},
        "ans": "d",
        "logic": "Urbanization ≈31.15%/31.1% in 2011 teaching.",
    },
    {
        "exam": "64th B.P.S.C. (Pre) 2018",
        "stem": "As per 2011 Census the urban population percentage to total population of India was about:",
        "options": {
            "a": "21",
            "b": "31",
            "c": "36",
            "d": "40",
            "e": "None of the above/More than one of the above",
        },
        "ans": "b",
        "logic": "About 31% urban in 2011.",
    },
    {
        "exam": "U.P.P.S.C. (R.I.) 2014",
        "stem": "According to the Census 2011, the number of people living in cities in India is approximately:",
        "options": {"a": "37 crore", "b": "33 crore", "c": "35 crore", "d": "39 crore"},
        "ans": "a",
        "logic": "Urban population ≈377 million ≈37 crore.",
    },
    {
        "exam": "U.P. P.C.S. (Pre) 2022",
        "stem": "Which religious group in India has its highest urban population?",
        "options": {"a": "Bauddh", "b": "Jain", "c": "Hindu", "d": "Christian"},
        "ans": "b",
        "logic": "Jains have the highest urban share (~80%).",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2004",
        "stem": "More than one-fourth of India’s urban population lives in the two States of:",
        "options": {
            "a": "Andhra Pradesh and West Bengal",
            "b": "Maharashtra and Gujarat",
            "c": "Uttar Pradesh and Tamil Nadu",
            "d": "Maharashtra and Uttar Pradesh",
        },
        "ans": "d",
        "logic": "Maharashtra + UP hold more than one-fourth of India’s urban population.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2014",
        "stem": "The State with lowest urban population in India is:",
        "options": {"a": "Sikkim", "b": "Kerala", "c": "Nagaland", "d": "Manipur"},
        "ans": "a",
        "logic": "Sikkim has the lowest absolute urban population among States.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2006",
        "stem": "According to 2001 Census, three States housing maximum urban population of the country are:",
        "options": {
            "a": "Tamil Nadu, Gujarat, Karnataka",
            "b": "Maharashtra, Andhra Pradesh, Tamil Nadu",
            "c": "Uttar Pradesh, Tamil Nadu, West Bengal",
            "d": "Maharashtra, Uttar Pradesh, Tamil Nadu",
        },
        "ans": "d",
        "logic": "Maharashtra, UP, Tamil Nadu top absolute urban population.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Mains) 2010",
        "stem": "Arrange the following States of India in descending order of their urban population (2011): 1. Maharashtra 2. Tamil Nadu 3. Uttar Pradesh 4. West Bengal",
        "options": {"a": "1, 3, 2, 4", "b": "1, 2, 3, 4", "c": "4, 3, 2, 1", "d": "2, 1, 4, 3"},
        "ans": "a",
        "logic": "Maharashtra > UP > Tamil Nadu > West Bengal.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2002",
        "stem": "Which of the following statements is correct?",
        "options": {
            "a": "Maharashtra is the most urbanized State of India",
            "b": "Himachal Pradesh is the least urbanized State of India",
            "c": "Uttar Pradesh has the highest concentration of urban population in India",
            "d": "Nagaland has the lowest concentration of urban population in India",
        },
        "ans": "b",
        "logic": "Himachal is least urbanized by share; Goa most urbanized; Maharashtra has largest absolute urban population.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Spl.) (Mains) 2010",
        "stem": "Which State of India has the highest percentage of urban population, according to the Census 2011?",
        "options": {"a": "Maharashtra", "b": "Goa", "c": "Tamil Nadu", "d": "Mizoram"},
        "ans": "b",
        "logic": "Goa (~62.2%) highest urban share.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
        "stem": "Which one of the following States was most urbanised as per Census 2011?",
        "options": {"a": "Gujarat", "b": "Goa", "c": "Tamil Nadu", "d": "Maharashtra"},
        "ans": "b",
        "logic": "Goa is the most urbanised State by share.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2009",
        "stem": "The most urbanized State of India is:",
        "options": {"a": "Gujarat", "b": "Maharashtra", "c": "Tamil Nadu", "d": "West Bengal"},
        "ans": "c",
        "logic": "Among the given options, Tamil Nadu is the most urbanized.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "According to the 2011 Census, the most urbanized State of India is:",
        "options": {"a": "Kerala", "b": "Maharashtra", "c": "Tamil Nadu", "d": "West Bengal"},
        "ans": "c",
        "logic": "Among listed States, Tamil Nadu (~48.4%) is most urbanized.",
    },
    {
        "exam": "U.P.P.S.C. (GIC) 2010",
        "stem": "Which one of the following is the most urbanized State of India?",
        "options": {"a": "Maharashtra", "b": "Mizoram", "c": "Goa", "d": "Tamil Nadu"},
        "ans": "c",
        "logic": "Goa is the most urbanized State overall.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2002",
        "stem": "The three most urbanized States of India in correct sequence are:",
        "options": {
            "a": "Gujarat, Maharashtra, Tamil Nadu",
            "b": "Maharashtra, Karnataka, Gujarat",
            "c": "Tamil Nadu, Maharashtra, Gujarat",
            "d": "Punjab, Gujarat, Maharashtra",
        },
        "ans": "c",
        "logic": "Among these large States: Tamil Nadu > Maharashtra > Gujarat by urban share.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2007",
        "stem": "Arrange the following Indian States in the descending order from the urbanization point of view: 1. West Bengal 2. Tamil Nadu 3. Maharashtra 4. Gujarat",
        "options": {"a": "1, 2, 3, 4", "b": "2, 3, 4, 1", "c": "3, 4, 2, 1", "d": "4, 3, 2, 1"},
        "ans": "b",
        "logic": "Tamil Nadu > Maharashtra > Gujarat > West Bengal.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2013",
        "stem": "In which of the following land-locked States of India, the percentage of urban population is highest as per 2011 Census?",
        "options": {
            "a": "Haryana",
            "b": "Jammu and Kashmir",
            "c": "Punjab",
            "d": "Madhya Pradesh",
        },
        "ans": "c",
        "logic": "Among listed land-locked States, Punjab has the highest urban share.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Re-Exam) (Pre) 2016",
        "stem": "According to 2011 Census among the following States, which one has the lowest level of urbanization?",
        "options": {
            "a": "Andhra Pradesh",
            "b": "Haryana",
            "c": "Mizoram",
            "d": "West Bengal",
        },
        "ans": "d",
        "logic": "West Bengal lowest urbanization % among the given set.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2009",
        "stem": "Arrange the following States in descending order of the percentage of urban population (2011): 1. Gujarat 2. Kerala 3. Maharashtra 4. Tamil Nadu",
        "options": {"a": "4, 2, 3, 1", "b": "2, 4, 1, 3", "c": "3, 1, 2, 4", "d": "1, 3, 4, 2"},
        "ans": "a",
        "logic": "Tamil Nadu > Kerala > Maharashtra > Gujarat.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2013",
        "stem": "Which one of the following States of India has the highest urban density?",
        "options": {"a": "Maharashtra", "b": "Punjab", "c": "Tamil Nadu", "d": "West Bengal"},
        "ans": "d",
        "logic": "Among the set, West Bengal keys highest urban density (persons/sq km of urban area).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "In which of the following States the level of urbanization (% of urban population) is the lowest as per 2011 Census?",
        "options": {
            "a": "Arunachal Pradesh",
            "b": "Sikkim",
            "c": "Bihar",
            "d": "Nagaland",
        },
        "ans": "c",
        "logic": "Bihar (~11.3%) lowest among the given; Himachal is lowest overall.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2017",
        "stem": "As per Census 2011, which among the following States recorded lowest percentage of urban population?",
        "options": {
            "a": "Tripura",
            "b": "Sikkim",
            "c": "Arunachal Pradesh",
            "d": "Himachal Pradesh",
        },
        "ans": "d",
        "logic": "Himachal Pradesh (~10%) lowest urban share.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2021",
        "stem": "According to Population Census 2011, which of the following States of India has lowest percentage of Urban population to its total population?",
        "options": {
            "a": "Himachal Pradesh",
            "b": "Odisha",
            "c": "Jharkhand",
            "d": "Rajasthan",
        },
        "ans": "a",
        "logic": "Himachal Pradesh has the lowest urban share.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2004",
        "stem": "As per the Census 2001, the least urbanized State of India is:",
        "options": {
            "a": "Arunachal Pradesh",
            "b": "Assam",
            "c": "Himachal Pradesh",
            "d": "Uttarakhand",
        },
        "ans": "c",
        "logic": "Himachal Pradesh least urbanized in 2001 and 2011.",
    },
    {
        "exam": "M.P.P.C.S. (Pre) 2024",
        "stem": "According to 2011 Census, which district had the highest percentage of urban population?",
        "options": {"a": "Indore", "b": "Gwalior", "c": "Bhopal", "d": "Jabalpur"},
        "ans": "c",
        "logic": "Among MP districts listed, Bhopal (~80.9%) highest urban share.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "Among the following Union Territories which one is least urbanized?",
        "options": {
            "a": "Lakshadweep",
            "b": "Andaman and Nicobar Islands",
            "c": "Dadra and Nagar Haveli",
            "d": "Puducherry",
        },
        "ans": "b",
        "logic": "A&N Islands are the least urbanized UT among the set.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Mains) 2010",
        "stem": "Arrange the following UTs of India in descending order of their level of urbanization (2011): 1. Chandigarh 2. Daman and Diu 3. Delhi 4. Lakshadweep",
        "options": {"a": "2, 1, 4, 3", "b": "3, 1, 4, 2", "c": "3, 2, 1, 4", "d": "4, 3, 1, 2"},
        "ans": "b",
        "logic": "Delhi > Chandigarh > Lakshadweep > Daman & Diu.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2008",
        "stem": "According to 2001 Census report, the percentage of rural population in India is:",
        "options": {"a": "72.2", "b": "76.7", "c": "74.3", "d": "80.1"},
        "ans": "a",
        "logic": "Rural share 2001 = 72.2% (2011 ≈68.9%).",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
        "stem": "Which one of the following states recorded the maximum decadal growth of urban population during the period 2001-2011?",
        "options": {"a": "Maharashtra", "b": "Nagaland", "c": "Kerala", "d": "Sikkim"},
        "ans": "d",
        "logic": "Among the set, Sikkim recorded the highest urban decadal growth 2001–11.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2015",
        "stem": "According to 2011 Census, which State has the highest proportion of rural population?",
        "options": {
            "a": "Bihar",
            "b": "Kerala",
            "c": "Madhya Pradesh",
            "d": "Himachal Pradesh",
        },
        "ans": "d",
        "logic": "Himachal Pradesh (~90%) highest rural share.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2018",
        "stem": "According to 2011 Census which of the following States has the largest rural population?",
        "options": {
            "a": "Madhya Pradesh",
            "b": "Maharashtra",
            "c": "Punjab",
            "d": "Uttar Pradesh",
        },
        "ans": "d",
        "logic": "UP has the largest absolute rural population.",
    },
    {
        "exam": "I.A.S. (Pre) 2008",
        "stem": "Amongst the following States, which one has the highest percentage of rural population to its total population (Census 2001)?",
        "options": {
            "a": "Himachal Pradesh",
            "b": "Bihar",
            "c": "Odisha",
            "d": "Uttar Pradesh",
        },
        "ans": "a",
        "logic": "Himachal Pradesh highest rural share.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2015",
        "stem": "Which of the following refers to occupational structure of population?",
        "options": {
            "a": "Number of persons living in the country",
            "b": "Size of working population",
            "c": "Distribution of working population among different occupations",
            "d": "Nature of different occupations",
        },
        "ans": "c",
        "logic": "Occupational structure = distribution of workers across occupations.",
    },
    {
        "exam": "U.P.P.C.S. (Spl.) (Pre) 2008",
        "stem": "The classified number of urban centres in India is:",
        "options": {"a": "4", "b": "7", "c": "5", "d": "6"},
        "ans": "d",
        "logic": "Census classifies urban centres into six population tiers.",
    },
    {
        "exam": "Chhattisgarh P.C.S. (Pre) 2024",
        "stem": "In India classification of cities on the basis of size of population are in how many categories?",
        "options": {"a": "03", "b": "04", "c": "05", "d": "06"},
        "ans": "d",
        "logic": "Six population-size classes for urban centres.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2007",
        "stem": "Which one of the following classes of towns are included in the category of small towns by the Census of India?",
        "options": {
            "a": "Class VI",
            "b": "Class V and VI",
            "c": "Class IV, V and VI",
            "d": "Class III, IV, V and VI",
        },
        "ans": "c",
        "logic": "Small towns = Class IV–VI (population <20,000).",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2010",
        "stem": "As per Census 2001, the class I cities of India claim a share of the total urban population of:",
        "options": {"a": "44.40%", "b": "56.50%", "c": "65.20%", "d": "62.32%"},
        "ans": "d",
        "logic": "Class I share ≈62.32% of urban population in 2001 (~70% in 2011 keys).",
    },
    {
        "exam": "U.P. B.E.O. (Pre) 2019",
        "stem": "With reference to urbanization in India, which statement(s) is/are correct? 1. According to the 2011 Census more than 60% of total urban population resides in category 1 cities 2. There were 53 urban agglomerations with million plus population each in 2011",
        "options": {"a": "1 only", "b": "2 only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "c",
        "logic": "Both Class I share >60% and 53 million+ UAs are correct for 2011 teaching.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "According to 2011 Census, how many million cities are there in India?",
        "options": {"a": "35", "b": "46", "c": "53", "d": "57"},
        "ans": "c",
        "logic": "53 million+ cities/UAs in 2011 provisional teaching (35 in 2001).",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2017",
        "stem": "As per 2011 Census, the percentage of population of metropolitan cities to the total urban population of India was:",
        "options": {"a": "31.16", "b": "36.48", "c": "42.61", "d": "49.20"},
        "ans": "c",
        "logic": "Million+ metros held ~42.6% of urban population in 2011 teaching.",
    },
    {
        "exam": "Jharkhand P.C.S. (Pre) 2021",
        "stem": "As per 2011 Indian population Census, which of the following States has largest number of towns in India?",
        "options": {
            "a": "Madhya Pradesh",
            "b": "Uttar Pradesh",
            "c": "Gujarat",
            "d": "Maharashtra",
        },
        "ans": "b",
        "logic": "UP has the largest number of towns among the options.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2016",
        "stem": "As per Census of India 2011, which of the following pairs of cities recorded the highest population?",
        "options": {
            "a": "Kolkata and Delhi",
            "b": "Delhi and Bengaluru",
            "c": "Mumbai and Kolkata",
            "d": "Mumbai and Delhi",
        },
        "ans": "d",
        "logic": "Greater Mumbai and Delhi are the two largest UAs.",
    },
    {
        "exam": "Uttarakhand U.D.A./L.D.A. (Pre) 2007",
        "stem": "Which is the most populous city of India?",
        "options": {"a": "Kolkata", "b": "Chennai", "c": "Mumbai", "d": "Delhi"},
        "ans": "c",
        "logic": "Greater Mumbai is the most populous UA.",
    },
    {
        "exam": "Jharkhand P.C.S. (Pre) 2023",
        "stem": "On the basis of population size, which of the following is the increasing order of urban agglomerations?",
        "options": {
            "a": "Chennai-Bengaluru-Ahmedabad-Hyderabad",
            "b": "Bengaluru-Hyderabad-Ahmedabad-Chennai",
            "c": "Ahmedabad-Hyderabad-Bengaluru-Chennai",
            "d": "Hyderabad-Chennai-Bengaluru-Ahmedabad",
        },
        "ans": "c",
        "logic": "Ahmedabad < Hyderabad < Bengaluru < Chennai (2011 P sizes).",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2015",
        "stem": "As per Census 2011, the number of ‘Daslakhi cities’ (Million) in Uttar Pradesh is:",
        "options": {"a": "5", "b": "7", "c": "10", "d": "11"},
        "ans": "b",
        "logic": "UP had 7 million+ cities in 2011 teaching.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2002",
        "stem": "Which of the following was the first million city of the country according to 1901 Census?",
        "options": {"a": "Chennai", "b": "Delhi", "c": "Kolkata", "d": "Mumbai"},
        "ans": "c",
        "logic": "Kolkata was the only million city in 1901.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2009",
        "stem": "Uttar Pradesh recorded the highest growth rate of urban population during:",
        "options": {"a": "1961-71", "b": "1971-81", "c": "1981-91", "d": "1991-2001"},
        "ans": "b",
        "logic": "UP’s highest urban growth decade among the set = 1971–81.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2012",
        "stem": "According to the provisional figures of Census 2011 of India, the density of population is the highest in which of the following cities of U.P.?",
        "options": {
            "a": "Kanpur Nagar",
            "b": "Lucknow",
            "c": "Moradabad",
            "d": "Ghaziabad",
        },
        "ans": "d",
        "logic": "Ghaziabad is the densest among listed UP cities.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "Among the following whose name is associated with migration theory?",
        "options": {"a": "Notestein", "b": "Thompson", "c": "Lee", "d": "Doubleday"},
        "ans": "c",
        "logic": "Lee’s push–pull migration theory.",
    },
    {
        "exam": "70th B.P.S.C. (Pre) 2024",
        "stem": "Which of the following is a cause of rural to urban migration in India?",
        "options": {
            "a": "High labour demand in cities",
            "b": "Unbalanced rural-urban development",
            "c": "Few jobs in rural areas",
            "d": "All the above",
        },
        "ans": "d",
        "logic": "Push and pull factors together drive rural–urban migration.",
    },
    {
        "exam": "Chhattisgarh P.C.S. (Pre) 2018",
        "stem": "Which one of the following types of migration has contributed most in population movement in India in 2011?",
        "options": {
            "a": "Rural to rural",
            "b": "Urban to rural",
            "c": "Rural to urban",
            "d": "Urban to urban",
        },
        "ans": "a",
        "logic": "Rural–rural was the largest internal migration stream in 2011 teaching (~47%).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2005",
        "stem": "During the last 30 years Delhi has received the highest number of migrants from:",
        "options": {"a": "Haryana", "b": "Punjab", "c": "Rajasthan", "d": "Uttar Pradesh"},
        "ans": "d",
        "logic": "UP is the largest source of migrants to Delhi in the keyed period.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2002",
        "stem": "The percentage of population living in slums is highest in:",
        "options": {"a": "Chennai", "b": "Delhi", "c": "Kolkata", "d": "Mumbai"},
        "ans": "d",
        "logic": "Mumbai keys the highest slum share among metros.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2011",
        "stem": "Which one of the following cities has the largest slum population?",
        "options": {"a": "Bangalore", "b": "Chennai", "c": "Delhi", "d": "Surat"},
        "ans": "c",
        "logic": "Among the options, Delhi has the largest slum population (Mumbai larger overall but not listed).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2009",
        "stem": "Arrange the following States of India in descending order of their slum population: 1. Andhra Pradesh 2. Maharashtra 3. Uttar Pradesh 4. West Bengal",
        "options": {"a": "2, 1, 4, 3", "b": "2, 3, 4, 1", "c": "3, 2, 1, 4", "d": "4, 2, 3, 1"},
        "ans": "a",
        "logic": "Maharashtra > Andhra Pradesh > West Bengal > UP in slum-population share teaching.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2007",
        "stem": "In India, maximum number of cities reporting slums are found in:",
        "options": {
            "a": "Andhra Pradesh",
            "b": "Maharashtra",
            "c": "Tamil Nadu",
            "d": "Uttar Pradesh",
        },
        "ans": "c",
        "logic": "Tamil Nadu reports the maximum number of slum-reporting cities in 2011 teaching.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Pre) 2021",
        "stem": "India Urban Observatory is situated at which one of the following place?",
        "options": {"a": "Dehradun", "b": "New Delhi", "c": "Chandigarh", "d": "Varanasi"},
        "ans": "b",
        "logic": "India Urban Observatory is at MoHUA, New Delhi.",
    },
    {
        "exam": "I.A.S. (Pre) 2022",
        "stem": "Consider the following statements: 1. The India Sanitation Coalition is a platform to promote sustainable sanitation and is funded by the Government of India and the World Health Organization. 2. The National Institute of Urban Affairs is an apex body of the Ministry of Housing and Urban Affairs and provides innovative solutions to address the challenges of Urban India. Which is/are correct?",
        "options": {"a": "1 only", "b": "2 only", "c": "Both 1 and 2", "d": "Neither 1 nor 2"},
        "ans": "b",
        "logic": "NIUA statement true; ISC is a multi-stakeholder FICCI platform — not GoI+WHO funded as stated.",
    },
    {
        "exam": "U.P.P.C.S. (Spl.) (Mains) 2004",
        "stem": "Which one of the following does not consist of urban infrastructure?",
        "options": {"a": "Drinking water", "b": "Housing", "c": "Sanitation", "d": "Transport"},
        "ans": "b",
        "logic": "Housing is not counted as urban infrastructure in this key set.",
    },
    {
        "exam": "U.P.P.C.S. (Pre) 2016",
        "stem": "Which of the following is not a new scheme announced for the development of Urban Infrastructure?",
        "options": {
            "a": "Swachh Bharat Mission",
            "b": "Heritage City Development and Augmentation Scheme",
            "c": "Smart City Scheme",
            "d": "Digital India Scheme",
        },
        "ans": "d",
        "logic": "Digital India is a broader e-governance/knowledge programme — not an urban-infrastructure scheme.",
    },
    {
        "exam": "Uttarakhand P.C.S. (Pre) 2005",
        "stem": "The Finance Minister of India while presenting the Budget Proposals for 2005-06 announced the decision for formation of:",
        "options": {
            "a": "Rural Development Commission",
            "b": "Administrative Reforms Commission",
            "c": "National Development Fund",
            "d": "Urban Renewal Mission",
        },
        "ans": "d",
        "logic": "Budget 2005–06 announced the Urban Renewal Mission (later JNNURM).",
    },
    {
        "exam": "U.P.P.C.S. (Spl.) (Mains) 2004",
        "stem": "The National Urban Renewal Mission has been named after:",
        "options": {
            "a": "Indira Gandhi",
            "b": "Jawaharlal Nehru",
            "c": "Rajendra Prasad",
            "d": "Rajiv Gandhi",
        },
        "ans": "b",
        "logic": "Jawaharlal Nehru National Urban Renewal Mission (JNNURM).",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2010",
        "stem": "Which one of the following is not an objective of JNNURM?",
        "options": {
            "a": "Urban Electrification",
            "b": "Urban Transport",
            "c": "Development of Heritage area",
            "d": "Sanitation and Sewage",
        },
        "ans": "a",
        "logic": "Urban electrification is not a classic JNNURM objective.",
    },
    {
        "exam": "U.P. R.O./A.R.O. (Mains) 2013",
        "stem": "Which one of the following is not true for Jawahar Lal Nehru National Urban Renewal Mission? It was:",
        "options": {
            "a": "launched in 2005",
            "b": "a 10 year programme",
            "c": "to upgrade the quality of life in Indian cities",
            "d": "to promote inclusive growth",
        },
        "ans": "b",
        "logic": "JNNURM was ~7 years, not 10.",
    },
    {
        "exam": "U.P. U.D.A./L.D.A. (Spl.) (Pre) 2010",
        "stem": "JNNURM is concerned with improving which of the following?",
        "options": {
            "a": "Rural Housing",
            "b": "Urban and Rural Marketing Structure",
            "c": "Employment to Educated Persons",
            "d": "Urban Infrastructure",
        },
        "ans": "d",
        "logic": "JNNURM targets urban infrastructure and basic services to the urban poor.",
    },
    {
        "exam": "U.P. Lower Sub. (Pre) 2015",
        "stem": "The revenue from which water and sewage will be financed in the Smart Cities Mission, that is:",
        "options": {
            "a": "Entertainment tax",
            "b": "Octrai and Entry tax",
            "c": "Education tax",
            "d": "Property tax",
        },
        "ans": "d",
        "logic": "Smart Cities water/sewerage finance teaching keys property tax.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2017",
        "stem": "Which one of the following is not the objective of the smart city development?",
        "options": {
            "a": "Good governance",
            "b": "Clean green city",
            "c": "Stabilizing quality of life",
            "d": "Smart mobility",
        },
        "ans": "c",
        "logic": "Smart Cities aim to improve/decent quality of life — ‘stabilizing’ is the odd wording.",
    },
    {
        "exam": "U.P.P.C.S. (Mains) 2003",
        "stem": "According to Philip M. Hauser, the migration of people from rural areas to urban areas is known by which one of the following names:",
        "options": {
            "a": "Population Disposal",
            "b": "Population Implosion",
            "c": "Population Technoplosion",
            "d": "Population Pariplosion",
        },
        "ans": "b",
        "logic": "Hauser termed rural–urban concentration as Population Implosion.",
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
    return (
        "U.P.P.C.S" in e
        or "U.P. P.C.S" in e
        or "UPPCS" in e
        or "U.P.P.S.C. (R.I.)" in e
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
        "\n### Ghatnachakra Purvalokan — India: Urbanization\n\n" if extra else ""
    )
    extra_blob = extra_header + "\n".join(
        fmt_q(it, n, False) for n, it in enumerate(extra, next_extra)
    )
    uk_blob = "\n".join(fmt_q(it, n, True) for n, it in enumerate(uk, next_uk))

    shutil.copy2(MD, MD.with_suffix(".md.bak_urban"))
    if bank_blob:
        md = md.replace(extra_h, bank_blob + "\n---\n\n" + extra_h, 1)
    if extra_blob:
        md = md.replace(uk_h, extra_blob + "\n---\n\n" + uk_h, 1)
    if uk_blob:
        md = md.replace(practice_h, uk_blob + "\n---\n\n" + practice_h, 1)

    md = re.sub(
        r"> Extra Drill:.*",
        "> Extra Drill: Ghatnachakra **Employment / Welfare / Poverty / Demography** "
        "+ **India: Urbanization** (definitions, ranks, million cities, JNNURM/Smart Cities).",
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
