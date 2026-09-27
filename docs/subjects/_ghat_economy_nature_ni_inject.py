# -*- coding: utf-8 -*-
"""Inject Ghatnachakra Economy (Nature + National Income) PYQs into Topic 1 Extra Drill
and add UPPCS stems to Complete PYQ Bank. Also patch Topic 4 savings teaching."""
from pathlib import Path
import re

ROOT = Path(r"c:\Users\Axeno\Desktop\UP-PCS\docs\subjects\economy")
T1 = ROOT / "01_Indian_Economy_Basics_Planning.md"
T4 = ROOT / "04_Inflation_Prices_Savings_Investment_Markets.md"


def q(tag, stem, opts, letter, ans, logic, ar=False):
    logic_key = "A/R logic:" if ar else "Logic:"
    return (
        f"**{tag}**\n{stem}\n"
        + "\n".join(opts)
        + "\n\n<details>\n<summary>Show answer</summary>\n\n"
        f"**{logic_key}** {logic}\n\n**Ans: {letter}.** {ans}\n\n</details>\n\n"
    )


# ── Extra Drill pack (other papers + older UP / RO-ARO / multi-PSC) ─────────
EXTRA = []

def E(tag, stem, opts, letter, ans, logic, ar=False):
    EXTRA.append((tag, stem, opts, letter, ans, logic, ar))

# Nature — mixed / developing
E("U.P. U.D.A./L.D.A. (Pre) 1999",
  "Mixed economy means:",
  ["A. Where agriculture and industry are given equal importance",
   "B. Where public sector and private sector co-exist in the national economy",
   "C. Where process of globalization is affected by a heavy dose of swadeshi in national economy",
   "D. Where the Centre and States are equal partners in economic planning and development"],
  "B", "Public and private sectors coexist.",
  "Not agri=industry, not Centre–State parity, not swadeshi–globalisation mix.")

E("U.P.P.C.S. (Mains) 2013",
  "Mixed economy in India means:",
  ["A. Co-existence of large and cottage industries",
   "B. Foreign collaboration in economic development",
   "C. Co-existence of public and private sector",
   "D. None of the above"],
  "C", "Co-existence of public and private sector.",
  "Same definition stem — large/cottage is not the mixed-economy key.")

E("U.P.P.C.S. (Pre) 1990 / U.P.U.D.A. (Pre) 2006 / UK U.D.A. (Pre) 2007",
  "Mixed economy means:",
  ["A. Existence of both small and large industries",
   "B. Existence of both private and public sectors",
   "C. Existence of both primary and secondary sectors",
   "D. None of the above"],
  "B", "Private and public sectors.",
  "Sectors of production (primary/secondary) are not the mixed-economy definition.")

E("U.P. R.O./A.R.O. (Mains) 2016",
  "Indian Economy is:",
  ["A. Mixed economy", "B. Socialist economy", "C. Capitalist economy", "D. Gandhian socialist economy"],
  "A", "Mixed economy.",
  "India blends private property with State regulation and selected public enterprise.")

E("U.P.P.C.S. (Pre) (Re-Exam) 2015 / (Mains) 2013",
  "Which of the following is the main characteristic of Indian Economy?",
  ["A. Capitalist economy", "B. Socialist economy", "C. Mixed economy", "D. None of the above"],
  "C", "Mixed economy.",
  "Main textbook characteristic among the system labels.")

E("53rd to 55th B.P.S.C. (Pre) 2011",
  "Which type of economy does India have?",
  ["A. Socialist", "B. Gandhian", "C. Mixed", "D. Free"],
  "C", "Mixed.",
  "Same public–private coexistence key.")

E("48th to 52nd B.P.S.C. (Pre) 2008",
  "It will be true to classify India as:",
  ["A. A food-deficit economy", "B. A labour-surplus economy",
   "C. A trade-surplus economy", "D. A capital-surplus economy"],
  "B", "A labour-surplus economy.",
  "Large working-age supply at subsistence wages — not capital- or trade-surplus.")

E("U.P.P.C.S. (Mains) 2017",
  "An underdeveloped economy is generally characterized by:\nI. Low per capita income\nII. Low rate of capital formation\nIII. Low dependency ratio\nIV. Work force largely in the tertiary sector",
  ["A. I and II", "B. II and III", "C. III and IV", "D. I and IV"],
  "A", "I and II.",
  "Low dependency and tertiary-heavy workforce are developed-economy tags.")

E("Chhattisgarh P.C.S. (Pre) 2017",
  "Which of the following correctly explains that India is an underdeveloped economy?\n1. Inequitable distribution of income\n2. High dependency ratio\n3. Slower rate of increase in national income\n4. Change in banking and financial sector",
  ["A. 1, 3 and 4", "B. 1, 2 and 4", "C. 1 and 4", "D. All of these", "E. None of these"],
  "E", "None of these (as coded — 1–3 fit underdeveloped; 4 does not, so ‘all’ fails).",
  "Banking/financial change is reform, not an underdevelopment characteristic. Stem key rejects options that include 4.")

E("U.P.P.C.S. (Mains) 2017",
  "Which of the following features indicates that Indian economy is in a developing category?\nI. Occupation is mainly agriculture\nII. Disguised unemployment\nIII. Poor quality of human capital\nIV. High per capita intake of proteins",
  ["A. I & II only", "B. I & IV", "C. II & III only", "D. I, II & III"],
  "D", "I, II and III.",
  "High protein intake is not a developing-economy indicator.")

E("U.P.P.C.S. (Mains) 2011",
  "The Indian Economy can be described as:",
  ["A. A backward and stagnant economy", "B. A developing economy",
   "C. An underdeveloped economy", "D. A developed economy"],
  "B", "A developing economy.",
  "Standard classification among the four labels.")

E("U.P. Lower Sub. (Spl.) (Pre) 2004",
  "The Indian Economy is characterised by:\nI. Pre-dominance of Agriculture\nII. Pre-dominance of Industry\nIII. Low per Capita Income\nIV. Massive Unemployment",
  ["A. I & II only", "B. I, II & III only", "C. II, III & IV only", "D. I, III & IV only"],
  "D", "I, III and IV only.",
  "Industrial predominance is a developed-economy tag — drop II.")

E("U.P.P.C.S. (Spl.) (Mains) 2004",
  "Which of the following is not a characteristic of Indian Economy?",
  ["A. Low productivity of labour", "B. Lower per capita income",
   "C. Low rate of capital formation", "D. Lack of Natural Resources"],
  "D", "Lack of natural resources.",
  "India is resource-rich; low productivity / PCI / capital formation are the textbook traits.")

E("U.P. P.C.S. (Pre) 2023",
  "Which of the following is not an economic activity?",
  ["A. Voluntary Social Service", "B. Farming", "C. Transportation", "D. Service"],
  "A", "Voluntary Social Service.",
  "Economic activity needs resource input → production → marketed/ valued output; voluntary social service is unpaid community work.")

E("R.A.S./R.T.S. (Pre) 1996",
  "Which of the following is a non-economic element in growth of the country?",
  ["A. Social Behaviour", "B. Natural resources", "C. Energy resources", "D. Capital resources"],
  "A", "Social Behaviour.",
  "Natural / energy / capital resources are economic factors; social behaviour is non-economic.")

E("U.P.P.C.S. (Mains) 2009",
  "Which of the following is not part of the ‘Second Generation of Economic Reforms’ identified by the Government?",
  ["A. Oil Sector Reforms", "B. Public Sector Reforms",
   "C. Legal System Reforms", "D. Reform of Government and Public Institutions"],
  "C", "Legal System Reforms.",
  "Among the listed menu, judicial/legal-system reform was the odd one out in that key.")

E("U.P. U.D.A./L.D.A. (Pre) 2013",
  "Indian model of development ensures interest of—",
  ["A. Person", "B. State", "C. State and Person both", "D. None of the above"],
  "C", "State and Person both.",
  "Mixed economy: public sector State-led; private sector individual/group-led.")

# National Income arithmetic
E("I.A.S. (Pre) 2001",
  "The term National Income represents:",
  ["A. Gross National Product at market prices minus depreciation",
   "B. Gross National Product at market prices minus depreciation plus net factor income from abroad",
   "C. Gross National Product at market prices minus depreciation and indirect taxes plus subsidies",
   "D. Gross National Product at market prices minus net factor income from abroad"],
  "C", "GNPMp − depreciation − indirect taxes + subsidies (= NNP at factor cost).",
  "NI = NNPFC. NNPMp alone (option A) is not yet factor-cost NI.")

E("70th B.P.S.C. (Pre) (Re-Exam) 2024",
  "NNP at factor cost is equal to:",
  ["A. GNP at factor cost − Net indirect tax", "B. GNP at Market Price",
   "C. Disposable Personal Income", "D. National Income"],
  "D", "National Income.",
  "NNPFC ≡ National Income in older Indian teaching.")

E("I.A.S. (Pre) 1997",
  "National Income is:",
  ["A. Net National Product at market prices", "B. Net National Product at factor cost",
   "C. Net Domestic Product at market prices", "D. Net Domestic Product at factor cost"],
  "B", "NNP at factor cost.",
  "Same NI = NNPFC lock.")

E("R.A.S./R.T.S. (Pre) 2021",
  "The Net National Product at Market Price (NNPmp) is:",
  ["A. GNP at Market Price − Net Income from abroad",
   "B. GNP at Market Price − Transfer Payments",
   "C. GNP at Market Price − Depreciation",
   "D. GNP at Market Price − Subsidies"],
  "C", "GNPMp − Depreciation.",
  "Net = Gross − depreciation; NFIA is already inside GNP.")

E("I.A.S. (Pre) 2000",
  "National Income (NI) is:",
  ["A. NI = NNP at Basic Price − (Indirect taxes − Subsidies)",
   "B. NI = NNP at Market Price − (Indirect taxes − Subsidies)",
   "C. NI = NNP at Market Price − (Direct taxes − Subsidies)",
   "D. None of the above"],
  "B", "NNPMp − (Indirect taxes − Subsidies).",
  "Net indirect taxes bridge market price to factor cost — not direct taxes.")

E("Uttarakhand P.C.S. (Pre) 2021",
  "Which of the following statement is correct?",
  ["A. NNP = GNP − Depreciation",
   "B. NNP = GDP + Net Income from Abroad − Depreciation",
   "C. Both (a) and (b) are correct",
   "D. None of these"],
  "C", "Both (a) and (b).",
  "GNP = GDP + NFIA, so both identities hold.")

E("I.A.S. (Pre) 2013",
  "The National income of a country for a given period is equal to the:",
  ["A. total value of goods and services produced by the nationals",
   "B. sum of total consumption and investment expenditure",
   "C. sum of personal income of all individuals",
   "D. money value of final goods and services produced"],
  "D", "Money value of final goods and services produced.",
  "Final-output identity; personal income ≠ NI; C+I alone omits G and NX.")

E("Chhattisgarh P.C.S. (Pre) 2023",
  "In an open economy, the national income (Y) of the economy is:\n(C, I, G, X, M stand for Consumption, Investment, Govt. Expenditure, total exports and total imports respectively)",
  ["A. Y = C+I+G+X", "B. Y = C+I+G−X+M", "C. Y = C+I+G+(X−M)", "D. Y = C+I−G+X−M"],
  "C", "Y = C+I+G+(X−M).",
  "Net exports (X−M) close the open-economy identity.")

E("66th B.P.S.C. (Pre) (Re-Exam) 2020",
  "Which of the following is not a method to calculate the Gross Domestic Product (GDP)?",
  ["A. Product method", "B. Diminishing cost method",
   "C. Income method", "D. Expenditure method"],
  "B", "Diminishing cost method.",
  "Only product, income and expenditure methods.")

E("Chhattisgarh P.C.S. (Pre) 2023",
  "Nominal (GDP) is:",
  ["A. GDP evaluated at exchange rate", "B. GDP evaluated at current market prices",
   "C. GDP evaluated at constant market prices", "D. None of the above"],
  "B", "GDP at current market prices.",
  "Constant prices = real GDP.")

E("63rd B.P.S.C. (Pre) 2017",
  "One of the problems in calculating National Income in India is:",
  ["A. underemployment", "B. inflation", "C. low level of savings",
   "D. non-organized sector", "E. None of the above / More than one of the above"],
  "D", "Non-organized (unorganised) sector.",
  "Informal units and agri often lack proper records — classic measurement trap.")

E("Chhattisgarh P.C.S. (Pre) 2020",
  "Read the following statements:\nStatement I: Net Domestic Product = Gross Domestic Product + Depreciation.\nStatement II: Per Capita Income = Net Domestic Product / Total Population of the Nation.\nStatement III: Net Domestic Product is the better metrics than Gross Domestic Product for comparing the economies of the world.\nChoose:",
  ["A. Statement I, II and III all are true", "B. Only Statement I and II are true",
   "C. Only Statement II and III are true", "D. None of the above options is true"],
  "D", "None of the above options is true.",
  "I is wrong (NDP = GDP − Dep). II is wrong (PCI uses National Income / population). III alone cannot save options A–C.")

E("Chhattisgarh P.C.S. (Pre) 2023",
  "Personal Disposable Income (PDI) is:",
  ["A. PDI = Personal Income − Personal Tax Payments",
   "B. PDI = Personal Income − Personal Tax Payments − Non-tax Payments",
   "C. PDI = Personal Income − Non-tax Payments",
   "D. None of the above"],
  "B", "PI − personal tax − non-tax payments (fines etc.).",
  "NCERT: both tax and non-tax household levies are deducted.")

E("U.P.P.C.S. (Mains) 2004",
  "If over a given period of time both prices and monetary income have been doubled, the real income will be:",
  ["A. Doubled", "B. Halved", "C. Unchanged", "D. Prices do not affect real income"],
  "C", "Unchanged.",
  "Real income = money income / price level — both ×2 cancel.")

E("Jharkhand P.C.S. (Pre) 2013",
  "If economic growth is conceptualized, which one of the following is not usually taken into consideration?",
  ["A. Growth in GDP", "B. Growth in financial aid from World Bank",
   "C. Growth in GNP", "D. Growth in Per Capita GNP"],
  "B", "Growth in financial aid from World Bank.",
  "Aid inflow is not a domestic-output growth measure.")

E("U.P.P.C.S. (Pre) 1999",
  "Consider the following statements about Amartya Sen’s advices regarding priorities for Indian Economy:\n1. It should be commodity-oriented\n2. It should be people-oriented\n3. Economic security to the poorest of the poor\n4. Safeguards against integration of these with world economy",
  ["A. 1, 2 and 3 are correct", "B. 2, 3 and 4 are correct",
   "C. 1, 3 and 4 are correct", "D. 1, 2 and 4 are correct"],
  "B", "2, 3 and 4.",
  "Welfare / capability view — people-oriented, not commodity-oriented.")

E("U.P. Lower Sub. (Spl.) (Pre) 2004",
  "The view that ‘Planning in India should, in future, pay more attention to the people than to commodities’ was given by:",
  ["A. Amartya Sen", "B. Yashwant Sinha", "C. Atal Bihari Vajpayee", "D. Manmohan Singh"],
  "A", "Amartya Sen.",
  "1998 Nobel welfare economist — people over commodities.")

E("U.P.P.C.S. (Pre) 1996, 2006 / (Mains) 2004",
  "The Hindu rate of growth refers to the growth rate of:",
  ["A. Per Capita Income", "B. National Income", "C. Population", "D. Literacy"],
  "B", "National Income (GDP ~3.5% from 1950s to early 1980s).",
  "Coined by Prof. Raj Krishna — stagnant NI/GDP growth tag.")

E("65th B.P.S.C. (Pre) 2019",
  "Hindu growth rate is related to:",
  ["A. Money", "B. GDP", "C. Population", "D. GNP", "E. None of the above/More than one of the above"],
  "B", "GDP.",
  "Same Raj Krishna tag — ~3.5% GDP growth.")

E("I.A.S. (Pre) 2011",
  "Economic growth is usually coupled with:",
  ["A. Deflation", "B. Inflation", "C. Stagflation", "D. Hyper-inflation"],
  "B", "Inflation.",
  "Rising demand with growth usually lifts prices — not deflation.")

E("U.P.P.C.S. (Mains) 2008",
  "The proportion of labour in GNP becomes low due to the following reason:",
  ["A. Prices lag behind wages", "B. Profit lags behind prices",
   "C. Prices lag behind Profit", "D. Wages lag behind prices"],
  "D", "Wages lag behind prices.",
  "Inflation outrunning wages shrinks labour’s income share.")

E("I.A.S. (Pre) 2000",
  "Match List-I with List-II:\nA. Boom — 1. Business activity high; income, output, employment rising\nB. Recession — 2. Gradual fall of income, output, employment\nC. Depression — 3. Unprecedented unemployment; drastic fall in income, output, employment\nD. Recovery — 4. Steady rise in prices, income, output, employment\nCodes for A B C D:",
  ["A. 1 2 3 4", "B. 1 2 4 3", "C. 2 1 4 3", "D. 2 1 3 4"],
  "A", "1-2-3-4.",
  "Boom → Recession → Depression → Recovery sequence of intensity.")

E("I.A.S. (Pre) 2010",
  "In the context of Indian economy, consider the following pairs:\n1. Meltdown — Fall in stock prices\n2. Recession — Fall in growth rate\n3. Slow down — Fall in GDP\nWhich is/are correctly matched?",
  ["A. 1 only", "B. 2 and 3", "C. 1 and 3", "D. 1, 2 and 3"],
  "A", "1 only.",
  "Recession = massive contraction of activity (not mere growth-rate dip). Slowdown ≠ GDP fall alone.")

E("I.A.S. (Pre) 2000",
  "Economic liberalization in India started with:",
  ["A. substantial changes in industrial licensing policy",
   "B. the convertibility of Indian rupee",
   "C. doing away with procedural formalities for foreign direct investment",
   "D. significant reduction in tax rates"],
  "A", "Substantial changes in industrial licensing policy.",
  "New Industrial Policy 24 July 1991 — delicensing of most industries.")

E("I.A.S. (Pre) 1996",
  "Which one is correct regarding stabilization and structural adjustment as two components of the new economic policy?",
  ["A. Stabilization is gradual; structural adjustment is quick",
   "B. Structural adjustment is gradual; stabilization is a quick adaptation process",
   "C. Both are identical and inseparable",
   "D. Stabilization is only Central; structural adjustment only State"],
  "B", "Structural adjustment is gradual; stabilization is quicker.",
  "Stabilization = short-term demand (inflation, fiscal, BoP). Structural adjustment = long-term supply-side reforms.")

E("M.P.P.C.S. (Pre) 2008",
  "Who is called the pioneer of liberalization of Indian Economy?",
  ["A. Dr. Manmohan Singh", "B. P.V. Narsimha Rao", "C. Dr. Bimal Jalan", "D. P. Chidambaram"],
  "A", "Dr. Manmohan Singh (Finance Minister, 1991).",
  "Rao was PM; FM Singh is the ‘pioneer of liberalisation’ teaching tag.")

E("I.A.S. (Pre) 1995",
  "One of the reasons for India's occupational structure remaining more or less the same over the years has been that:",
  ["A. investment pattern has been directed towards capital intensive industries",
   "B. productivity in agriculture has been high enough to induce people to stay with agriculture",
   "C. ceiling on land holdings have enabled more people to own land and hence their preference to stay with agriculture",
   "D. people are largely unaware of the significance of transition from agriculture to industry for economic development"],
  "A", "Investment directed toward capital-intensive industries.",
  "Capital-heavy industry absorbs less labour — occupational structure stays agri-heavy.")

E("I.A.S. (Pre) 2022",
  "Which of the following activities constitute real sector in the economy?\n1. Farmers harvesting their crops\n2. Textile mills converting raw cotton into fabrics\n3. A commercial bank lending money to a trading company\n4. A corporate body issuing Rupee Denominated Bonds overseas",
  ["A. 1 and 2 only", "B. 2, 3 and 4 only", "C. 1, 3 and 4 only", "D. 1, 2, 3 and 4"],
  "A", "1 and 2 only.",
  "Real sector = production of goods/services. Bank lending and Masala Bonds are financial-sector.")

E("U.P.P.C.S. (Pre) 2021",
  "Which among the following is NOT a major factor of economic growth?",
  ["A. Accumulation of capital and reforms in technology",
   "B. Change in population",
   "C. Division of labour in specialised activities",
   "D. Technocrats and Bureaucrats"],
  "D", "Technocrats and Bureaucrats.",
  "Natural resources, physical/human capital, technology, labour — not the bureaucracy label.")

E("R.A.S./R.T.S. (Pre) 2013",
  "Which one of the following is a sign of economic growth?",
  ["A. An increase in National Income at constant prices during a year",
   "B. A sustained increase in real Per Capita Income",
   "C. An increase in National Income at current prices over time",
   "D. An increase in National Income along with increase in population"],
  "B", "Sustained increase in real Per Capita Income.",
  "Best single sign among options — real PCI sustained rise.")

E("67th B.P.S.C. (Pre) 2022",
  "The best index of economic development is provided by:",
  ["A. growth in national income at current prices",
   "B. growth in per capita real income from year to year",
   "C. growth in savings ratio",
   "D. improvement in balance of payments position"],
  "B", "Growth in per capita real income year to year.",
  "Same real-PCI index.")

E("I.A.S. (Pre) 2013 / U.P. Lower Sub. (Pre) 2013 / Chhattisgarh P.C.S. (Pre) 2015",
  "The most appropriate measure of a country's economic growth is its:",
  ["A. GDP", "B. NDP", "C. NNP", "D. Per Capita Product (PCP)"],
  "D", "Per Capita Product / real per capita income.",
  "Aggregate GDP alone ignores population — PCI is preferred.")

E("I.A.S. (Pre) 2018",
  "Increase in absolute and per capita real GNP do not connote a higher level of economic development, if:",
  ["A. industrial output fails to keep pace with agricultural output",
   "B. agricultural output fails to keep pace with industrial output",
   "C. poverty and unemployment increase",
   "D. imports grow faster than exports"],
  "C", "Poverty and unemployment increase.",
  "Growth without welfare improvement ≠ development.")

E("I.A.S. (Pre) 2000 / U.P.P.C.S. (Pre) 2013",
  "The growth rate of Per Capita Income at current prices is higher than that of Per Capita Income at constant prices, because the latter takes into account the rate of:",
  ["A. growth of population", "B. increase in price level",
   "C. growth of money supply", "D. increase in the wage rate"],
  "B", "Increase in price level (inflation).",
  "Constant-price PCI strips inflation — so current-price growth looks higher.")

E("I.A.S. (Pre) 2000 / U.P.P.C.S. (Pre) 2007 / (Mains) 2013",
  "That the Per Capita Income in India was Rs. 20 in 1867-68, was ascertained for the first time by:",
  ["A. M.G. Ranade", "B. Sir W. Hunter", "C. R.C. Dutta", "D. Dadabhai Naoroji"],
  "D", "Dadabhai Naoroji.",
  "First National Income estimate of India — 1867–68.")

E("U.P.P.C.S. (Mains) 2015",
  "Who was the chairman of National Income Committee appointed by the Government of India in 1949?",
  ["A. C.R. Rae", "B. P.C. Mahalanobis", "C. V.K.R.V. Rao", "D. K.N. Raj"],
  "B", "P.C. Mahalanobis.",
  "Members: D.R. Gadgil and V.K.R.V. Rao.")

E("60th to 62nd B.P.S.C. (Pre) 2016",
  "The economist who for the first time scientifically determined National Income in India:",
  ["A. D.R. Gadgil", "B. V.K.R.V. Rao", "C. Manmohan Singh", "D. Y.V. Alagh"],
  "B", "V.K.R.V. Rao (1931–32).",
  "Naoroji = first attempt; Rao = first scientific estimate.")

E("U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
  "Estimation of National Income in India is done by the:",
  ["A. Reserve Bank of India", "B. National Income Committee",
   "C. National Statistical Office", "D. Planning Commission"],
  "C", "National Statistical Office (NSO), MoSPI.",
  "CSO + NSSO merged into NSO (2019). Older keys saying CSO are historically true.")

E("U.P. Lower Sub. (Pre) 2008",
  "In India which agency is entrusted with the collection of data of capital formation?",
  ["A. RBI and Central Statistical Organisation",
   "B. RBI and SBI",
   "C. RBI and all other Commercial Banks",
   "D. Central Statistical Organisation and National Sample Survey"],
  "A", "RBI and CSO (now NSO).",
  "K.N. Raj committee split: RBI for private corporate / household financial saving; CSO/NSO for rest and totals.")

E("R.A.S./R.T.S. (Pre) 2021",
  "'Base year' in National Income accounting means:",
  ["A. The year whose income is being used to calculate the nominal GDP",
   "B. The year whose prices are being used to calculate the nominal GDP",
   "C. The year whose prices are being used to calculate the real GDP",
   "D. The year whose income is being used to calculate the real GDP"],
  "C", "The year whose prices are used for real GDP.",
  "Current National Accounts base year (from Feb 2026): **2022–23**.")

E("R.A.S./R.T.S. (Pre) (Re-Exam) 2013",
  "Indicate the vital change in the measurement of National Income of India (2015 series):",
  ["A. Both the base year and calculation method have changed",
   "B. Base year has been changed from 2004-05 to 2011-12",
   "C. Calculation has changed from factor cost to market prices",
   "D. Calculation has changed from current prices to constant prices"],
  "A", "Both base year and method changed.",
  "2011–12 base + GVA at basic prices (UNSNA 2008) replacing GDP at factor cost.")

E("I.A.S. (Pre) 1995",
  "The main reason for low growth rate in India, inspite of high rate of savings and capital formation is:",
  ["A. high birth rate", "B. low level of foreign aid",
   "C. low capital-output ratio", "D. high capital-output ratio"],
  "D", "High capital-output ratio.",
  "High COR = more capital needed per unit output → slower growth.")

E("I.A.S. (Pre) 2018",
  "Despite being a high saving economy, capital formation may not result in significant increase in output due to:",
  ["A. weak administrative machinery", "B. illiteracy",
   "C. high population density", "D. high capital-output ratio"],
  "D", "High capital-output ratio.",
  "G × C = S identity — high C dampens G for given S.")

E("I.A.S. (Pre) 1993",
  "Which of the following are the main causes of slow rate of growth of Per Capita Income in India:\n1. High capital-output ratio\n2. High rate of growth of population\n3. High rate of capital formation\n4. High level of fiscal deficits",
  ["A. 1, 2, 3 and 4", "B. 2, 3 and 4", "C. 1 and 4", "D. 1 and 2"],
  "D", "1 and 2.",
  "High COR + fast population growth slow PCI — not high capital formation.")

E("I.A.S. (Pre) 2013",
  "Economic growth in country X will necessarily have to occur if:",
  ["A. there is technical progress in the world economy",
   "B. there is population growth in X",
   "C. there is capital formation in X",
   "D. the volume of trade grows in the world economy"],
  "C", "There is capital formation in X.",
  "Domestic capital formation is the necessary growth lever among these options.")

E("U.P.P.C.S. (Pre) 2021",
  "With reference to the 'Capital formation' which of the statements is/are correct?\n1. Process of capital formation depends on savings and effectiveness of financial institutions.\n2. Investment is the essential factor of capital formation.",
  ["A. Only 1", "B. Only 2", "C. Both 1 and 2", "D. Neither 1 nor 2"],
  "C", "Both 1 and 2.",
  "Save → channel via institutions → invest = capital formation.")

E("U.P. R.O./A.R.O. (Pre) (Re-Exam) 2023",
  "Which state has the largest economy in India?",
  ["A. Maharashtra", "B. Gujarat", "C. Uttar Pradesh", "D. Tamil Nadu"],
  "A", "Maharashtra (largest NSDP among States).",
  "UP is large by population but not the largest State economy by NSDP.")

E("63rd B.P.S.C. (Pre) 2017",
  "The latest Per Capita Income at current prices is lowest for the Indian State of:",
  ["A. Bihar", "B. Uttar Pradesh", "C. Odisha", "D. Nagaland"],
  "A", "Bihar.",
  "Bihar remains lowest PCI among States; Sikkim/Goa sit at the top end.")

E("U.P. U.D.A./L.D.A. (Pre) 2001 / U.P.P.C.S. (Mains) 2004",
  "Which among the following sectors contribute the most in savings in India?",
  ["A. Banking and financial sector", "B. Export sector",
   "C. Household sector", "D. Private sector"],
  "C", "Household sector.",
  "Households dominate gross domestic savings share.")

E("Uttarakhand P.C.S. (Pre) 2024",
  "Which has the highest share in the household savings of India?",
  ["A. Deposits", "B. Currency", "C. Physical assets", "D. Shares and debentures"],
  "C", "Physical assets.",
  "Physical assets (housing, gold teaching) outscore deposits/currency/shares in household savings.")


def inject_extra(path: Path, items: list) -> int:
    text = path.read_text(encoding="utf-8")
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    m_next = re.search(r"^## (UKPCS Prelims Bank|Practice Zone)[^\n]*\n", text, re.M)
    if not m_extra or not m_next:
        print("SKIP Extra", path.name)
        return 0
    extra = text[m_extra.end() : m_next.start()]
    # Replace the placeholder note line if present
    note = "Extra Drill rebuilt from coaching / mock stems (not a full Purvalokan dump). Expand when Ghatnachakra Economy MCQs are pasted.\n"
    if note in extra:
        text = text.replace(note, "Extra Drill filled from Ghatnachakra *Economic & Social Development* — Nature of Indian Economy + National Income & GDP (Purvalokan).\n\n", 1)
        extra = text[m_extra.end() : m_next.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", extra)), default=0)
    # renumber if Extra starts at Q14 awkwardly — keep continuing
    out = []
    marker = "### Ghatnachakra Purvalokan — Nature + National Income"
    if marker in text[m_extra.start() : m_next.start()]:
        print("ALREADY Extra block", path.name)
        return 0
    for tag, stem, opts, letter, ans, logic, ar in items:
        key = re.sub(r"\s+", " ", stem[:65]).lower()
        if key in text.lower():
            continue
        n += 1
        out.append(q(f"Q{n}. {tag}", stem, opts, letter, ans, logic, ar=ar))
    if not out:
        print("NONE Extra", path.name)
        return 0
    block = f"\n{marker}\n\n" + "".join(out)
    new = text[: m_next.start()] + block + text[m_next.start() :]
    path.write_text(new, encoding="utf-8", newline="\n")
    print(f"EXTRA +{len(out)} → {path.name}")
    return len(out)


# UPPCS Complete Bank additions (missing from bank)
UPPCS_BANK = [
    ("U.P.P.C.S. (Pre) 2023",
     "Which of the following is not an economic activity?",
     ["A. Voluntary Social Service", "B. Farming", "C. Transportation", "D. Service"],
     "A", "Voluntary Social Service.",
     "Unpaid voluntary social service ≠ economic activity."),
    ("U.P.P.C.S. (Pre) 2021",
     "Which among the following is NOT a major factor of economic growth?",
     ["A. Accumulation of capital and reforms in technology",
      "B. Change in population",
      "C. Division of labour in specialised activities",
      "D. Technocrats and Bureaucrats"],
     "D", "Technocrats and Bureaucrats.",
     "Bureaucracy label is not a major growth factor in the keyed list."),
    ("U.P.P.C.S. (Pre) 2021",
     "With reference to the 'Capital formation' which of the statements is/are correct?\n1. Process of capital formation depends on savings and effectiveness of financial institutions.\n2. Investment is the essential factor of capital formation.",
     ["A. Only 1", "B. Only 2", "C. Both 1 and 2", "D. Neither 1 nor 2"],
     "C", "Both 1 and 2.",
     "Save + institutions + investment."),
    ("U.P.P.C.S. (Pre) 1990",
     "Mixed economy means:",
     ["A. Existence of both small and large industries",
      "B. Existence of both private and public sectors",
      "C. Existence of both primary and secondary sectors",
      "D. None of the above"],
     "B", "Private and public sectors.",
     "Classic mixed-economy definition."),
]


def inject_uppcs_bank(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    m_bank = re.search(r"^## Complete PYQ Bank \(UPPCS\)[^\n]*\n", text, re.M)
    m_extra = re.search(r"^## Ghatnachakra Extra Drill[^\n]*\n", text, re.M)
    if not m_bank or not m_extra:
        print("SKIP bank")
        return 0
    chunk = text[m_bank.end() : m_extra.start()]
    n = max((int(x) for x in re.findall(r"\*\*Q(\d+)\.", chunk)), default=0)
    out = []
    for tag, stem, opts, letter, ans, logic in UPPCS_BANK:
        key = re.sub(r"\s+", " ", stem[:65]).lower()
        if key in text.lower():
            continue
        n += 1
        out.append(q(f"Q{n}. {tag}", stem, opts, letter, ans, logic))
    if not out:
        print("NONE bank")
        return 0
    new = text[: m_extra.start()] + "\n" + "".join(out) + text[m_extra.start() :]
    path.write_text(new, encoding="utf-8", newline="\n")
    print(f"BANK +{len(out)}")
    return len(out)


def main():
    e = inject_extra(T1, EXTRA)
    b = inject_uppcs_bank(T1)
    print("DONE extra", e, "bank", b)


if __name__ == "__main__":
    main()
