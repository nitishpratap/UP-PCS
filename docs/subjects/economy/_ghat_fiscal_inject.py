# -*- coding: utf-8 -*-
"""Inject Fiscal Policy & Revenue Ghatnachakra PYQs into Topic 2."""
from pathlib import Path

PATH = Path(__file__).with_name("02_Public_Finance_Budget_Taxation.md")
text = PATH.read_text(encoding="utf-8")

BANK = r'''
**Q11. UPPCS (Pre) 2017** — Which among the following is not included in the ten main themes of the Union Budget for the financial year 2017–18?

A. Export performance
B. The Poor and the underprivileged
C. Youth
D. Rural population

<details>
<summary>Show answer</summary>

**Logic:** The 2017–18 themes covered farmers, rural population, youth, poor and underprivileged, infrastructure, financial sector, digital economy, public service, prudent fiscal management and tax administration — not “export performance” as a named theme.

**Ans: A.** Export performance.

</details>

**Q12. UPPCS (Pre) 2024** — According to the Economic Survey, 2022–23, what fiscal policy response did the Government of India undertake in response to the aggravated global supply disruptions?

1. Decreasing food and fertiliser subsidies
2. Increasing taxes on fuel and imported products
3. Reducing taxes on fuel and certain imported products

Select the correct answer from the codes given below:

A. Only 3
B. Only 1
C. Only 2
D. None of the above

<details>
<summary>Show answer</summary>

**Logic:** Survey 2022–23 describes a mix of higher food and fertiliser subsidies with **reduction** in taxes on fuel and certain imported products. Only statement 3 matches the keyed “correct” lever among the options.

**Ans: A.** Only 3.

</details>

**Q13. UPPCS (Pre) 2021** — As per the Economic Survey 2015–16, which one of the following has been constructed as the Chakravyuha Challenge of the Indian economy?

A. Movement of Indian economy from socialism to capitalism
B. Movement of Indian economy from socialism with limited entry to marketism with exit
C. Movement of Indian economy from socialism with limited entry to marketism without exit
D. Movement of Indian economy from mixed economy to capitalism

<details>
<summary>Show answer</summary>

**Logic:** Survey metaphor — entry eased, exit still hard → marketism **without** exit.

**Ans: C.**

</details>

**Q14. UPPCS (Pre) 2023** — Which statement is true for Finance Sector (Fiscal Management) in the Union Budget, 2023?

A. Fiscal Deficit of 3.5% of GSDP allowed for States
B. Budget estimates 2023–24 for total expenditure is Rs 55 lakh Cr.
C. Fiscal Deficit 2025–26, the target is to be below 5.5%
D. Twenty years interest free loans to States

<details>
<summary>Show answer</summary>

**Logic:** Budget 2023–24 allowed States fiscal deficit of **3.5% of GSDP** (0.5% tied to power reforms). Total expenditure BE was about ₹45 lakh crore; FD path toward below **4.5%** by 2025–26; interest-free loans were **50-year**, not twenty-year.

**Ans: A.**

</details>

**Q15. UPPCS (Pre) 2017** — Saksham project approved by Govt. of India is related to:

A. Skill development of SC and ST population
B. A military unit for effective disaster management
C. A new indirect tax network
D. Creating self confidence among ‘Divyang’ youth

<details>
<summary>Show answer</summary>

**Logic:** Project Saksham = CBEC/CBIC integrated **indirect tax** IT network supporting GST / customs facilitation.

**Ans: C.**

</details>

**Q16. U.P. R.O./A.R.O. (Pre) 2017** — Assertion (A): Fiscal deficit of Indian Government as a percentage of GDP was higher in 2017–18 as compared to Budget estimates.

Reason (R): Growth in indirect tax collection was relatively lower during 2017–18 on account of introduction of GST.

Select the correct answer using the codes given below:

A. Both (A) and (R) are true and (R) is the correct explanation of (A)
B. Both (A) and (R) are true, but (R) is not the correct explanation of (A)
C. (A) is true, but (R) is false
D. (A) is false, but (R) is true

<details>
<summary>Show answer</summary>

**A/R logic:** FD rose to about **3.5%** vs BE **3.2%**; GST transition dampened indirect-tax growth — R explains A.

**Ans: A.**

</details>

**Q17. U.P. R.O./A.R.O. (Pre) 2016** — Consider the following statements:

1. GST Council is chaired by the Union Finance Minister and the Minister of State-in-charge of Revenue or Finance at the centre is a member.
2. The GST Council will decide the tax rate, exempted goods and the threshold under the new taxation regime.
3. State Governments will have the option to levy VAT, if they so decide.

Of these —

A. Only 1 is correct
B. Only 2 is correct
C. Only 2 and 3 are correct
D. Only 1 and 2 are correct

<details>
<summary>Show answer</summary>

**Logic:** 1 and 2 match Article 279A design. After GST, States do **not** keep a general VAT option on subsumed goods — statement 3 fails.

**Ans: D.** Only 1 and 2 are correct.

</details>

**Q18. U.P. R.O./A.R.O. (Pre) 2023** — Which of the following statement/s is/are correct?

1. ITC means the credit of Input Tax on the supplies of goods and services or both received by a registered person.
2. Eligibility of ITC which may be as under — taxable supply, non-taxable supply, zero-rated supply.

Select the correct answer using the code given below:

A. Both 1 and 2
B. Only 2
C. Neither 1 nor 2
D. Only 1

<details>
<summary>Show answer</summary>

**Logic:** Statement 1 is the definition. Statement 2 wrongly includes **non-taxable** supply — ITC covers taxable and zero-rated, not non-taxable / exempt / nil-rated.

**Ans: D.** Only 1.

</details>

**Q19. U.P. R.O./A.R.O. (Pre) 2014** — Long-term fiscal policy was announced by which finance minister of India?

A. V.P. Singh
B. P. Chidambaram
C. Dr. Manmohan Singh
D. Yashwant Sinha

<details>
<summary>Show answer</summary>

**Logic:** V.P. Singh announced long-term fiscal policy in Budget **1985–86**.

**Ans: A.**

</details>

**Q20. U.P. R.O./A.R.O. (Pre) 2017** — Which one of the following did not take place in the Union Budget for 2017–18?

A. Elimination of the classification of expenditure into ‘Plan’ and ‘Non-Plan’
B. Increase in the number of centrally sponsored schemes
C. Bringing Railway finances into the mainstream budgeting
D. Advancing the date of Union Budget almost by a month

<details>
<summary>Show answer</summary>

**Logic:** Three reforms: early Budget date, Railway merger, Plan/Non-Plan removal. CSS count increase was **not** one of those reforms.

**Ans: B.**

</details>

'''

EXTRA = r'''
**Q29.** With reference to Union Budget, consider the following statements:

1. The Union Finance Minister on behalf of the Prime Minister lays the Annual Financial Statement before both the Houses of Parliament.
2. At the Union level, no demand for a grant can be made except on the recommendation of the President of India.

Which of the statements given above is/are correct?

A. 1 only
B. 2 only
C. Both 1 and 2
D. Neither 1 nor 2

<details>
<summary>Show answer</summary>

**Logic:** Statement 1 fails — AFS is laid by the FM **on behalf of the President**, not the PM. Statement 2 matches Art. 113(3).

**Ans: B.** 2 only.

</details>

**Q30.** Every year, along with the budget, the ‘Macro-Economic Framework Statement’ is presented before the Parliament by the Finance Minister. This is mandated under provisions of:

A. Article 112 of the Constitution
B. Article 110 of the Constitution
C. Section 3 of the Fiscal Responsibility and Budget Management (FRBM) Act, 2003
D. The Finance Commission Act

<details>
<summary>Show answer</summary>

**Logic:** Macro-Economic Framework Statement is an **FRBM** statutory statement, not the Art. 112 AFS itself.

**Ans: C.**

</details>

**Q31.** When was gender budgeting initiated in India?

A. Union Budget, 2005–06
B. Union Budget, 2006–07
C. Union Budget, 2008–09
D. Union Budget, 2004–05

<details>
<summary>Show answer</summary>

**Logic:** First Gender Budget Statement with Union Budget **2005–06**.

**Ans: A.**

</details>

**Q32.** Which one is not included in the Budget Priorities in pursuit of ‘Viksit Bharat’ in Union Budget 2024–25?

A. Energy Security
B. Productivity and Resilience in Agriculture
C. Sustainable Development
D. Employment and Skilling

<details>
<summary>Show answer</summary>

**Logic:** Nine priorities included agriculture productivity, employment and skilling, energy security, infrastructure, etc. — **Sustainable Development** was not a named priority in that list.

**Ans: C.**

</details>

**Q33.** Central Government in its Union Budget 2023–24 adopted seven priorities of the Government, these 7 priorities are named as:

A. Saptadev
B. Saptarishi
C. Saat Vachan
D. Saptadwar

<details>
<summary>Show answer</summary>

**Logic:** Budget 2023–24 branded the seven priorities as **Saptarishi**.

**Ans: B.**

</details>

**Q34.** Which of the following is not included in the priorities of India Budget 2022–23?

A. PM Gati Shakti
B. Inclusive Development
C. Productivity Enhancement and Investment, Sunrise Opportunities, Energy Transition, and Climate Action
D. Disinvestment

<details>
<summary>Show answer</summary>

**Logic:** Four priorities were PM GatiShakti, Inclusive Development, Productivity Enhancement & Investment / sunrise / energy transition / climate action, and Financing of Investments — **Disinvestment** was not one of those four named priorities.

**Ans: D.**

</details>

**Q35.** Which one of the following was not included in the intended objectives of the Union Budget, 2017–18?

A. Transform India
B. Clean India
C. Educate India
D. Energise India

<details>
<summary>Show answer</summary>

**Logic:** Agenda was **TEC India** — Transform, Energise, Clean — not “Educate India”.

**Ans: C.**

</details>

**Q36.** According to the Union Budget 2021–22, Finance Minister proposed a new levy Agriculture Infrastructure and Development Cess. This cess will be levied on how many products?

A. 12
B. 20
C. 25
D. 29

<details>
<summary>Show answer</summary>

**Logic:** AIDC was proposed on **29** products.

**Ans: D.**

</details>

**Q37.** Consider the following statements:

1. Tax revenue as a percent of GDP of India has steadily increased in the last decade.
2. Fiscal deficit as a percent of GDP of India has steadily increased in the last decade.

Which of the statements given above is/are correct?

A. 1 only
B. 2 only
C. Both 1 and 2
D. Neither 1 nor 2

<details>
<summary>Show answer</summary>

**Logic:** Both series show ups and downs — neither rose steadily every year.

**Ans: D.**

</details>

**Q38.** Consider the following items:

1. Cereal grains hulled
2. Chicken eggs cooked
3. Fish processed and canned
4. Newspapers containing advertising material

Which of the above items is/are exempted under GST (Goods and Services Tax)?

A. 1 only
B. 2 and 3 only
C. 1, 2 and 4 only
D. 1, 2, 3 and 4

<details>
<summary>Show answer</summary>

**Logic:** Hulled cereal grains, cooked chicken eggs (in shell) and newspapers (with/without ads) are exempt; **processed and canned fish** is taxable (5% lane in standard key).

**Ans: C.** 1, 2 and 4 only.

</details>

**Q39.** The ‘Goods and Services Tax’ was proposed by a task force, whose President was:

A. Vijay Kelkar
B. Montek Singh Ahluwalia
C. Arun Jaitley
D. Narasimham

<details>
<summary>Show answer</summary>

**Logic:** Kelkar FRBM Task Force (2004) recommended GST.

**Ans: A.**

</details>

**Q40.** What is/are the most likely advantages of implementing ‘Goods and Services Tax’ (GST)?

1. It will replace multiple taxes collected by multiple authorities and will thus create a single market in India.
2. It will drastically reduce the ‘Current Account Deficit’ of India and will enable it to increase its foreign exchange reserves.
3. It will enormously increase the growth and size of economy of India and will enable it to overtake China in the near future.

Select the correct answer using the code given below:

A. 1 only
B. 2 and 3 only
C. 1 and 3 only
D. 1, 2 and 3

<details>
<summary>Show answer</summary>

**Logic:** Single-market / subsumption logic is sound. “Drastically” cut CAD and “enormously” overtake China are overclaims.

**Ans: A.** 1 only.

</details>

**Q41.** Which of the following tax is not included in Goods and Services Tax (GST)?

A. Excise Duty
B. Custom Duty
C. Value Added Tax
D. Service Tax

<details>
<summary>Show answer</summary>

**Logic:** **Customs duty** stays outside GST; VAT, service tax and (most) excise were subsumed.

**Ans: B.**

</details>

**Q42.** What has been kept under the purview of Goods and Services Tax (GST)?

A. Alcohol for human consumption
B. Electricity
C. Petroleum Products
D. Ghee

<details>
<summary>Show answer</summary>

**Logic:** Alcohol, electricity and petroleum are outside until notified; **ghee** is under GST.

**Ans: D.**

</details>

**Q43.** The term ‘Revenue Neutral Rate’ was in news recently is related to:

A. Goods and Service Tax (GST)
B. Foreign Portfolio Investment (FPI)
C. Disinvestment of Public Sector Units
D. Foreign Direct Investment (FDI)

<details>
<summary>Show answer</summary>

**Logic:** RNR is the GST-era rate design to protect previous revenue.

**Ans: A.**

</details>

**Q44.** Which of the following statements is related to the benefit of the “Input Tax Credit Mechanism” of GST?

A. This avoid double taxation.
B. This avoid tax on production.
C. This provide tax relief to start-ups.
D. There is no need to keep records for producers.

<details>
<summary>Show answer</summary>

**Logic:** ITC’s core benefit is avoiding cascading / double taxation.

**Ans: A.**

</details>

**Q45.** In India, which one among the following formulates the fiscal policy?

A. Planning Commission
B. Finance Commission
C. Ministry of Finance
D. Reserve Bank of India

<details>
<summary>Show answer</summary>

**Logic:** MoF = fiscal; RBI = monetary; FC = devolution recommendations.

**Ans: C.**

</details>

**Q46.** Which one of the following is not a Department in the Ministry of Finance?

A. Expenditure
B. Revenue
C. Banking Division
D. Economic Affairs

<details>
<summary>Show answer</summary>

**Logic:** Banking Division is not keyed as a standalone MoF department in the standard list.

**Ans: C.**

</details>

**Q47.** Which one of the following is not an objective of fiscal policy of Government of India?

A. Full employment
B. Price stability
C. Regulation of inter-state trade
D. Equitable distribution of wealth and income

<details>
<summary>Show answer</summary>

**Logic:** Inter-State trade regulation is not a fiscal-policy objective.

**Ans: C.**

</details>

**Q48.** Which of the following is NOT a tool of fiscal policy?

A. Public expenditure
B. Interest rate
C. Deficit financing
D. Taxation

<details>
<summary>Show answer</summary>

**Logic:** Interest rate is a **monetary** tool.

**Ans: B.**

</details>

**Q49.** Which of the following economists introduced fiscal policy as a tool to rectify the Great Depression of 1929–30?

A. Prof. Keynes
B. Prof. Pigou
C. Prof. Marshall
D. Prof. Crowther

<details>
<summary>Show answer</summary>

**Logic:** Keynesian expansionary fiscal policy against deficient demand.

**Ans: A.**

</details>

**Q50.** Which one of the following statements appropriately describes the ‘fiscal stimulus’?

A. It is a massive investment by the Government in manufacturing sector to ensure the supply of goods to meet the demand surge caused by rapid economic growth.
B. It is an intense affirmative action of the Government to boost economic activity in the country.
C. It is Government’s intensive action of financial institutions to ensure disbursement of loans to agriculture and allied sectors to promote greater food production and contain food inflation.
D. It is an extreme affirmative action by the Government to pursue its policy of financial inclusion.

<details>
<summary>Show answer</summary>

**Logic:** Fiscal stimulus = strong fiscal push (tax cuts / spending) to boost activity.

**Ans: B.**

</details>

**Q51.** Which among the following steps is most likely to be taken at the time of an economic recession?

A. Cut in tax rates accompanied by increase in interest rate
B. Increase in expenditure on public projects
C. Increase in tax rates accompanied by reduction of interest rate
D. Reduction of expenditure on public projects

<details>
<summary>Show answer</summary>

**Logic:** Counter-cyclical fiscal response raises public project spending (often with tax relief). Option A mixes fiscal ease with monetary tightening.

**Ans: B.**

</details>

**Q52.** Which one of the following is responsible for the preparation and presentation of Union Budget to the Parliament?

A. Department of Revenue
B. Department of Economic Affairs
C. Department of Financial Services
D. Department of Expenditure

<details>
<summary>Show answer</summary>

**Logic:** DEA is the nodal budget-preparation department.

**Ans: B.**

</details>

**Q53.** Economic Survey of India is published officially, every year by the:

A. Reserve Bank of India
B. Planning Commission of India
C. Ministry of Finance, Govt. of India
D. Ministry of Industries, Govt. of India

<details>
<summary>Show answer</summary>

**Logic:** Survey is MoF / DEA under the Chief Economic Adviser.

**Ans: C.**

</details>

**Q54.** In which of the following countries was zero-based budgeting first adopted?

A. U.S.A.
B. France
C. India
D. Germany

<details>
<summary>Show answer</summary>

**Logic:** ZBB originated in the United States (Pyhrr / Carter-Georgia teaching).

**Ans: A.**

</details>

**Q55.** With respect to the procedure of Budget in the Parliament, “the amount of demand be reduced to Rs. 1” is called:

A. Economy Cut Motion
B. Policy Cut Motion
C. Basic Cut Motion
D. Token Cut Motion

<details>
<summary>Show answer</summary>

**Logic:** Policy Cut → ₹1; Economy Cut → specified amount; Token Cut → ₹100.

**Ans: B.**

</details>

**Q56.** Vote on Account is meant for:

A. Vote on the report of CAG
B. To meet unforeseen expenditure
C. Appropriating funds pending passing of budget
D. Budget

<details>
<summary>Show answer</summary>

**Logic:** Interim appropriation until the full Budget is passed.

**Ans: C.**

</details>

**Q57.** Ad hoc Treasury bill system of meeting budget deficit in India was abolished on:

A. 1 April, 1992
B. 1 April, 1994
C. 31 March, 1996
D. 31 March, 1997

<details>
<summary>Show answer</summary>

**Logic:** Abolished **31 March 1997**; Ways and Means Advances followed from 1 April 1997.

**Ans: D.**

</details>

**Q58.** Which one of the following inflationary methods is likely to be the most in its effects?

A. Repayment of public debt
B. Borrowing from the public to finance a budget deficit
C. Borrowing from the banks to finance a budget deficit
D. Creation of new money to finance a budget deficit

<details>
<summary>Show answer</summary>

**Logic:** Printing / creating new money is the most inflationary financing mode.

**Ans: D.**

</details>

**Q59.** After deducting grants for the creation of capital assets from revenue deficit, we arrive at:

A. Budgetary Deficit
B. Fiscal Deficit
C. Primary Deficit
D. Effective Revenue Deficit

<details>
<summary>Show answer</summary>

**Logic:** Effective Revenue Deficit = Revenue deficit − grants for capital-asset creation.

**Ans: D.**

</details>

**Q60.** Fiscal Responsibility and Budget Management Act was enacted in India in the year:

A. 2007
B. 2005
C. 2002
D. 2003

<details>
<summary>Show answer</summary>

**Logic:** FRBM Act **2003** (effective from 2004 teaching).

**Ans: D.**

</details>

'''

# Update Extra Drill intro
old_note = "Extra Drill rebuilt from coaching / mock stems (not a full Purvalokan dump). Expand when Ghatnachakra Economy MCQs are pasted."
new_note = "Extra Drill absorbs Ghatnachakra **Fiscal Policy & Revenue** stems (IAS / BPSC / State PCS / RO–ARO) behind the UPPCS Complete Bank. Expand further when newer Purvalokan pages are pasted."
if old_note in text:
    text = text.replace(old_note, new_note, 1)

# Insert Bank before Extra Drill heading
bank_anchor = "## Ghatnachakra Extra Drill — Public Finance, Budget and Taxation"
if BANK.strip() not in text:
    if bank_anchor not in text:
        raise SystemExit("Bank anchor missing")
    # Insert after Complete Bank's last Q10 block — immediately before Extra Drill
    text = text.replace(
        "---\n\n" + bank_anchor,
        BANK + "\n---\n\n" + bank_anchor,
        1,
    )

# Insert Extra before UKPCS bank
extra_anchor = "## UKPCS Prelims Bank"
if EXTRA.strip() not in text:
    if extra_anchor not in text:
        raise SystemExit("Extra anchor missing")
    text = text.replace(
        "---\n\n" + extra_anchor,
        EXTRA + "\n---\n\n" + extra_anchor,
        1,
    )

PATH.write_text(text, encoding="utf-8")
print("OK: fiscal PYQs injected into", PATH.name)
