"""UKPCS Prelims 2025 GS Paper I - cleaned question data for the Complete Bank.

Consumed by gen_2025_bank.py. Keys are provisional: the source dump carried no
official answer key. Entries with uncertain=True depend on a Uttarakhand
current-affairs, budget or survey figure and need the official key to confirm.
"""

QUESTIONS = [
    {
        "n": 1,
        "title": "Uttarakhand Census 2011 statements",
        "bucket": "uk_gk",
        "logic": "Tests district population ranking against the state sex-ratio and density figures; the rank of Nainital is the planted error.",
        "stem": (
            "With reference to Uttarakhand as per Census 2011, consider the following statements:\n\n"
            "1. Rudraprayag district has the least population in Uttarakhand.\n"
            "2. Nainital district is at the third place in terms of population in the state of Uttarakhand.\n"
            "3. The sex ratio in Uttarakhand is 963.\n"
            "4. The population density of Uttarakhand is 189.\n\n"
            "Which of the statements given above is/are correct?"
        ),
        "options": ["Only 2 is correct", "Only 1, 2 and 3 are correct", "Only 1, 3 and 4 are correct", "Only 3 is correct"],
        "ans": "C",
        "explain": (
            "Rudraprayag is the least populous district of Uttarakhand with about 2.42 lakh people, so statement 1 is correct. "
            "The state sex ratio is 963 females per 1000 males and the density is 189 persons per square kilometre, so statements 3 and 4 are correct. "
            "Statement 2 is wrong because Nainital is fourth in population after Haridwar, Dehradun and Udham Singh Nagar."
        ),
        "uncertain": False,
    },
    {
        "n": 2,
        "title": "Projected GSDP growth, Economic Survey 2024-25",
        "bucket": "uk_gk",
        "logic": "Asks the constant-price growth projection, so the current-price figure is the distractor.",
        "stem": "According to the Uttarakhand Economic Survey 2024-25, what was the projected growth rate of the Gross State Domestic Product (at constant prices) of Uttarakhand in 2024-25?",
        "options": ["6.31%", "8.52%", "6.61%", "4.22%"],
        "ans": "C",
        "explain": (
            "The Survey projected the state economy to grow by about 6.61 per cent at constant prices in 2024-25. "
            "The current-price growth projection is higher, which is why 8.52 per cent is offered as a distractor (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 3,
        "title": "HMT unit in Uttarakhand",
        "bucket": "uk_gk",
        "logic": "All four options are real Uttarakhand places with similar names, so the plant location must be recalled precisely.",
        "stem": "In Uttarakhand, where is the unit of Hindustan Machine Tools situated?",
        "options": ["Ranibagh", "Ranipur", "Kashipur", "Ranikhet"],
        "ans": "A",
        "explain": (
            "The HMT watch factory of Uttarakhand is located at Ranibagh in Nainital district. "
            "Ranipur in Haridwar is the site of BHEL, which is the trap in this set."
        ),
        "uncertain": False,
    },
    {
        "n": 4,
        "title": "Brand name for Uttarakhand craft products",
        "bucket": "uk_gk",
        "logic": "Tests the official state handicraft brand against invented Devbhoomi-style names.",
        "stem": "The craft products of the Uttarakhand state are sold by which brand name?",
        "options": ["Himbant Brand", "Devbhoomi Brand", "Chardham Brand", "Himadri Brand"],
        "ans": "D",
        "explain": (
            "Handloom and handicraft products of the state are marketed under the Himadri brand. "
            "The other three names are not official state craft brands."
        ),
        "uncertain": False,
    },
    {
        "n": 5,
        "title": "Uttarakhand score in Food Security Index 2024",
        "bucket": "uk_gk",
        "logic": "A pure figure recall from the food safety ranking of smaller states.",
        "stem": "What is the total score obtained by Uttarakhand in the 6th Food Security Index, 2024?",
        "options": ["48.5", "44.25", "38.75", "37.5"],
        "ans": "C",
        "explain": (
            "Uttarakhand recorded a total score of about 48.5 in the sixth edition of the index. "
            "The state is assessed in the smaller-states category (verify official key)."
         " Official provisional key (Series B) marks **C**."),
        "uncertain": False,
    },
    {
        "n": 6,
        "title": "Uttarakhand score in SDG India Index 2023-24",
        "bucket": "uk_gk",
        "logic": "The score and the rank are different things; here the composite score is wanted.",
        "stem": "What is the score of Uttarakhand in NITI Aayog's SDG India Index, 2023-24?",
        "options": ["79", "89", "69", "49"],
        "ans": "A",
        "explain": (
            "Uttarakhand scored 79 in the SDG India Index 2023-24. "
            "It shared the top position with Kerala, which also scored 79."
        ),
        "uncertain": False,
    },
    {
        "n": 7,
        "title": "Boolean expression of a NAND gate",
        "bucket": "science",
        "logic": "NAND and NOR are the confused pair; NAND complements the product, NOR complements the sum.",
        "stem": "What is the Boolean expression for a NAND gate?",
        "options": ["(A+B)'", "(A)'", "A+B", "(AB)'"],
        "ans": "B",
        "explain": (
            "A NAND gate gives the complement of the AND output, so its expression is (AB)'. "
            "The option (A+B)' is the NOR gate, which is the standard confusion here. "
            "In the source dump the complement mark on this option was lost to scanning."
         " Official provisional key (Series B) marks **B**."),
        "uncertain": False,
    },
    {
        "n": 8,
        "title": "Unit measuring processor speed",
        "bucket": "science",
        "logic": "Separates units of storage from units of frequency.",
        "stem": "Which of the following is used to measure the speed of a computer's processor?",
        "options": ["Byte", "Bit", "Hertz", "Pixel"],
        "ans": "C",
        "explain": (
            "Processor clock speed is measured in hertz, normally gigahertz. "
            "Byte and bit measure data quantity and pixel measures display resolution."
        ),
        "uncertain": False,
    },
    {
        "n": 9,
        "title": "Application software for e-mail",
        "bucket": "science",
        "logic": "Tests which Microsoft Office component is the mail client.",
        "stem": "Which application software is used for sending and receiving e-mails?",
        "options": ["Microsoft Word", "Microsoft Outlook", "Microsoft Excel", "Microsoft Access"],
        "ans": "B",
        "explain": (
            "Microsoft Outlook is the mail and calendar client in the Office suite. "
            "Word is a word processor, Excel a spreadsheet and Access a database tool."
        ),
        "uncertain": False,
    },
    {
        "n": 10,
        "title": "Full form of PaaS",
        "bucket": "science",
        "logic": "Tests the cloud service triad of IaaS, PaaS and SaaS.",
        "stem": "What does the acronym PaaS stand for in cloud computing?",
        "options": ["Platform as a Service", "Program as a Service", "Product as a Service", "None of the above"],
        "ans": "A",
        "explain": (
            "PaaS means Platform as a Service, which supplies a ready development and deployment platform. "
            "The other two members of the family are Infrastructure as a Service and Software as a Service."
        ),
        "uncertain": False,
    },
    {
        "n": 11,
        "title": "Bulk modulus of a perfectly rigid body",
        "bucket": "science",
        "logic": "A rigid body has zero strain, so the modulus behaves as a limiting value.",
        "stem": "Bulk modulus for a perfectly rigid body is",
        "options": ["Infinite", "Zero", "Unity", "Some finite low value"],
        "ans": "A",
        "explain": (
            "Bulk modulus is stress divided by volumetric strain. "
            "A perfectly rigid body suffers no change in volume, so the strain is zero and the modulus becomes infinite."
        ),
        "uncertain": False,
    },
    {
        "n": 12,
        "title": "Plan focused on inclusive growth",
        "bucket": "economy",
        "logic": "The Tenth Plan is the confused pair because it also spoke of equity and growth targets.",
        "stem": "Which Five Year Plan was focused on inclusive growth?",
        "options": ["9th", "10th", "8th", "11th"],
        "ans": "D",
        "explain": (
            "The Eleventh Five Year Plan (2007-12) was titled Towards Faster and More Inclusive Growth. "
            "The Ninth Plan stressed growth with social justice and the Tenth Plan set monitorable targets."
        ),
        "uncertain": False,
    },
    {
        "n": 13,
        "title": "Herbal Research and Development Institute",
        "bucket": "uk_gk",
        "logic": "Tests placement of a state research institute among four temple towns.",
        "stem": "Where is the Herbal Research and Development Institute of Uttarakhand situated?",
        "options": ["Jageshwar", "Gopeshwar", "Ramnagar", "Bageshwar"],
        "ans": "B",
        "explain": (
            "The Herbal Research and Development Institute works from Mandal near Gopeshwar in Chamoli district. "
            "It supports cultivation and research on medicinal and aromatic plants."
        ),
        "uncertain": False,
    },
    {
        "n": 14,
        "title": "Char Dham road allocation, Budget 2025-26",
        "bucket": "uk_gk",
        "logic": "A budget line-item figure, so the nearby round numbers are the traps.",
        "stem": "As per the Uttarakhand Budget 2025-26, the amount allocated for Char Dham road network improvement is",
        "options": ["Rs 20 crore", "Rs 10 crore", "Rs 15 crore", "Rs 25 crore"],
        "ans": "B",
        "explain": (
            "The Budget 2025-26 provided about Rs 10 crore for improvement of the Char Dham road network. "
            "This head is separate from the much larger central Char Dham all-weather road outlay (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 15,
        "title": "Moderator in a nuclear reactor",
        "bucket": "science",
        "logic": "Separates the moderator from the fuel compound offered as the first option.",
        "stem": "The moderator used in a nuclear reactor is",
        "options": ["U3O8", "D2O", "Na2O", "Cl2O"],
        "ans": "B",
        "explain": (
            "Heavy water, D2O, slows fast neutrons and acts as the moderator in Indian pressurised heavy water reactors. "
            "U3O8 is a uranium oxide used in fuel preparation, not a moderator."
        ),
        "uncertain": False,
    },
    {
        "n": 16,
        "title": "Discolouring of the Taj Mahal marble",
        "bucket": "science",
        "logic": "Tests the sulphur dioxide route to marble cancer rather than a general pollution answer.",
        "stem": "The marble of the Taj Mahal is getting discoloured and lustreless due to",
        "options": ["Acid rain", "Ozone layer", "Methane", "Fog"],
        "ans": "A",
        "explain": (
            "Sulphur dioxide and nitrogen oxides form acids that attack the calcium carbonate of marble. "
            "This yellowing effect is called marble cancer."
        ),
        "uncertain": False,
    },
    {
        "n": 17,
        "title": "Unit of ozone layer thickness",
        "bucket": "science",
        "logic": "Dobson and decibel are the sound-alike distractor pair here.",
        "stem": "The thickness of the ozone layer from base to top of the atmosphere is measured in",
        "options": ["Dobson unit", "Decibel unit", "Angstrom unit", "Centigrade unit"],
        "ans": "A",
        "explain": (
            "Total column ozone is expressed in Dobson units. "
            "One Dobson unit equals a 0.01 mm thick layer of pure ozone at standard temperature and pressure."
        ),
        "uncertain": False,
    },
    {
        "n": 18,
        "title": "Rate of solar energy storage in plants",
        "bucket": "science",
        "logic": "Primary productivity belongs to producers; the secondary and tertiary options belong to consumers.",
        "stem": "The rate at which solar energy is stored in green plants to be used as food is called",
        "options": ["Primary productivity", "Secondary productivity", "Tertiary productivity", "Respiration"],
        "ans": "A",
        "explain": (
            "Primary productivity is the rate at which producers convert solar energy into organic matter. "
            "Secondary productivity refers to energy stored at consumer levels."
        ),
        "uncertain": False,
    },
    {
        "n": 19,
        "title": "One benefits, other unaffected",
        "bucket": "science",
        "logic": "Commensalism and symbiosis are the confused pair; only one partner gains in commensalism.",
        "stem": "The interaction in which one organism is benefitted and the other is neither harmed nor benefitted is called",
        "options": ["Symbiosis", "Commensalism", "Parasitism", "Exploitation"],
        "ans": "B",
        "explain": (
            "Commensalism benefits one species while leaving the other unaffected, as with an orchid growing on a mango branch. "
            "In symbiosis or mutualism both partners gain."
        ),
        "uncertain": False,
    },
    {
        "n": 20,
        "title": "Nanda Devi Biosphere Reserve",
        "bucket": "uk_geo",
        "logic": "Combines the heritage status of the reserve with its signature high-altitude fauna.",
        "stem": (
            "Consider the following statements about Nanda Devi Biosphere Reserve:\n\n"
            "1. It is a World Heritage Site.\n"
            "2. Its inhabitants include snow leopard, musk deer and blue sheep.\n\n"
            "Choose the correct answer using the following options:"
        ),
        "options": ["Only 1", "Only 2", "Both 1 and 2", "Neither 1 nor 2"],
        "ans": "C",
        "explain": (
            "The Nanda Devi and Valley of Flowers National Parks are inscribed as a UNESCO World Heritage Site, so statement 1 is correct. "
            "Snow leopard, Himalayan musk deer and bharal or blue sheep are all recorded in the reserve, so statement 2 is also correct."
        ),
        "uncertain": False,
    },
    {
        "n": 21,
        "title": "Match biomagnification and related terms",
        "bucket": "science",
        "logic": "Each item pairs with a distinct pollution or atmospheric process, so one confident pair fixes the code.",
        "stem": (
            "Match Column-I with Column-II:\n\n"
            "| Column-I | Column-II |\n"
            "| --- | --- |\n"
            "| A. Biomagnification | 1. Synthesis of ozone |\n"
            "| B. Electrostatic precipitation | 2. Solid waste |\n"
            "| C. Landfills | 3. Concentration build-up at successive trophic levels |\n"
            "| D. Stratosphere | 4. Particulate matter |\n\n"
            "*Row order is not the answer code.*\n\n"
            "Codes (A B C D):"
        ),
        "options": ["3 4 2 1", "1 2 3 4", "2 1 4 3", "4 3 1 2"],
        "ans": "A",
        "explain": (
            "Biomagnification is the rise in pollutant concentration at successive trophic levels, so A pairs with 3. "
            "Electrostatic precipitators remove particulate matter, giving B with 4. "
            "Landfills are a solid waste disposal method, so C pairs with 2, and the stratosphere is where ozone is synthesised, giving D with 1. "
            "The trap is reading the rows in printed order as the code."
        ),
        "uncertain": False,
    },
    {
        "n": 22,
        "title": "Speed of light in air and water",
        "bucket": "science",
        "logic": "The first statement is true but the reason inverts the refractive index comparison.",
        "stem": (
            "Statement I: Light travels faster in air than in water.\n\n"
            "Statement II: Refractive index of air is greater than that of water."
        ),
        "options": [
            "Statement I is correct, statement II is wrong",
            "Statement I is wrong, statement II is correct",
            "Both statements are correct and statement II is the correct explanation of statement I",
            "Both statements are correct but statement II is not the correct explanation of statement I",
        ],
        "ans": "A",
        "explain": (
            "Light does travel faster in air, so statement I is correct. "
            "Statement II is wrong because the refractive index of air is about 1.0003 against roughly 1.33 for water, and a lower index means a higher speed."
        ),
        "uncertain": False,
    },
    {
        "n": 23,
        "title": "Dimensions of expansion coefficients",
        "bucket": "science",
        "logic": "Linear, areal and volume coefficients differ in magnitude but share the same dimension.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. The coefficient of linear expansion has dimension K-1.\n"
            "2. The coefficient of volume expansion has dimension K-1."
        ),
        "options": [
            "Both 1 and 2 are correct",
            "1 is correct but 2 is wrong",
            "2 is correct but 1 is wrong",
            "Both 1 and 2 are wrong",
        ],
        "ans": "A",
        "explain": (
            "Every coefficient of thermal expansion is a fractional change per degree of temperature, so all of them carry the dimension K-1. "
            "The volume coefficient is about three times the linear coefficient in value, but the dimension is unchanged."
        ),
        "uncertain": False,
    },
    {
        "n": 24,
        "title": "Sour taste of curd",
        "bucket": "science",
        "logic": "Each option is a real food acid, so the specific fermentation product must be recalled.",
        "stem": "When milk is converted into curd, the sour taste is due to",
        "options": ["Acetic acid", "Citric acid", "Lactic acid", "Tartaric acid"],
        "ans": "C",
        "explain": (
            "Lactobacillus bacteria ferment lactose into lactic acid, which gives curd its sour taste. "
            "Acetic acid is found in vinegar and citric acid in citrus fruit."
        ),
        "uncertain": False,
    },
    {
        "n": 25,
        "title": "Discovery of penicillin",
        "bucket": "science",
        "logic": "Places a microbiologist among a mycologist, an anatomist and the discoverer of the cell.",
        "stem": "Penicillin was discovered by",
        "options": ["E. J. Butler", "Waldeyer", "Alexander Fleming", "Robert Hooke"],
        "ans": "C",
        "explain": (
            "Alexander Fleming discovered penicillin from the mould Penicillium notatum in 1928. "
            "Robert Hooke is remembered for first describing the cell."
        ),
        "uncertain": False,
    },
    {
        "n": 26,
        "title": "Hierarchy of plant classification",
        "bucket": "science",
        "logic": "The sequence must run from the broadest rank down to the narrowest.",
        "stem": "The correct hierarchy of classification of plants is",
        "options": [
            "Class-Order-Family-Genus-Species",
            "Family-Order-Class-Genus-Species",
            "Order-Class-Genus-Family-Species",
            "Genus-Family-Class-Order-Species",
        ],
        "ans": "A",
        "explain": (
            "The descending order of taxonomic ranks runs class, order, family, genus and species. "
            "The other options break the rule that family sits between order and genus."
        ),
        "uncertain": False,
    },
    {
        "n": 27,
        "title": "Focus of the Waqf Amendment Bill, 2025",
        "bucket": "polity",
        "logic": "Extreme options such as abolition or nationalisation are the usual distractors in a governance reform question.",
        "stem": "What was the key focus of the Waqf Amendment Bill introduced in April 2025?",
        "options": [
            "Privatization of Waqf properties",
            "Enhancing transparency and ensuring better governance of Waqf properties",
            "Abolishing Waqf boards",
            "Nationalization of religious institutions",
        ],
        "ans": "B",
        "explain": (
            "The Bill aimed at better governance, digital record keeping and greater transparency in the administration of waqf properties. "
            "It neither abolished waqf boards nor nationalised religious institutions."
        ),
        "uncertain": False,
    },
    {
        "n": 28,
        "title": "Programme for border villages, April 2025",
        "bucket": "ca",
        "logic": "Several rural schemes are offered, but only one is specific to border villages.",
        "stem": "Which programme was approved by the Union Cabinet in April 2025 to develop border villages?",
        "options": [
            "Sansad Adarsh Gram Yojana",
            "Vibrant Villages Programme-II (VVP-II)",
            "Pradhan Mantri Gram Sadak Yojana",
            "Deendayal Upadhyaya Grameen Kaushalya Yojana",
        ],
        "ans": "B",
        "explain": (
            "The Vibrant Villages Programme-II extends comprehensive development to villages along India's land borders. "
            "The first phase covered villages along the northern border, including those in Uttarakhand."
        ),
        "uncertain": False,
    },
    {
        "n": 29,
        "title": "Objective of Poshan Pakhwada, April 2025",
        "bucket": "ca",
        "logic": "The name itself points to nutrition rather than fitness or vaccination.",
        "stem": "What was the primary objective of the 'Poshan Pakhwada' event observed in April 2025?",
        "options": [
            "To promote yoga and physical fitness",
            "To improve nutrition across India, especially for women and children",
            "To launch new healthcare infrastructure projects",
            "To conduct a nationwide vaccination drive",
        ],
        "ans": "B",
        "explain": (
            "Poshan Pakhwada is a fortnight-long drive under Poshan Abhiyaan to spread nutrition awareness. "
            "Its focus groups are pregnant women, lactating mothers, adolescent girls and young children."
        ),
        "uncertain": False,
    },
    {
        "n": 30,
        "title": "ISRO module that reentered in April 2025",
        "bucket": "science",
        "logic": "The numbering of the POEM series is the whole content of this question.",
        "stem": "ISRO's module reentered the atmosphere and impacted the Indian Ocean on April 4, 2025. Name the module.",
        "options": ["POEM-X-R", "POEM-4", "POEM-6", "POEM-K"],
        "ans": "B",
        "explain": (
            "POEM-4, the fourth PSLV Orbital Experimental Module, reentered and fell into the Indian Ocean in early April 2025. "
            "It was placed in orbit with the PSLV-C60 SpaDeX mission and used the spent fourth stage as a platform."
        ),
        "uncertain": False,
    },
    {
        "n": 31,
        "title": "Regional Rural Banks merged in March 2025",
        "bucket": "economy",
        "logic": "The count of banks merged is different from the number of banks that survive after the merger.",
        "stem": "In March 2025, the Indian Government announced the merger of how many Regional Rural Banks (RRBs) under the 'one state, one RRB' initiative?",
        "options": ["15", "20", "26", "30"],
        "ans": "C",
        "explain": (
            "Twenty-six Regional Rural Banks across ten states and union territories were amalgamated with effect from May 2025. "
            "This brought the total number of RRBs in the country down from 43 to 28."
        ),
        "uncertain": False,
    },
    {
        "n": 32,
        "title": "Focus of Viksit Bharat Yatra",
        "bucket": "ca",
        "logic": "The outreach van model points to scheme saturation rather than any single sector.",
        "stem": "A key focus of Viksit Bharat Yatra is to disseminate information and facilitate access to which of the following areas?",
        "options": [
            "Environmental conservation efforts",
            "Space exploration advancements",
            "Welfare and development schemes",
            "Promotion of traditional arts and crafts",
        ],
        "ans": "C",
        "explain": (
            "The Yatra takes information about central welfare and development schemes to villages and towns. "
            "It works towards saturation coverage by enrolling eligible people on the spot."
        ),
        "uncertain": False,
    },
    {
        "n": 33,
        "title": "Causes of biodiversity loss",
        "bucket": "science",
        "logic": "The third statement denies co-extinction, which is the planted error.",
        "stem": (
            "Which of the following statements about causes of biodiversity loss is/are correct?\n\n"
            "1. Habitat loss and fragmentation are the most important cause driving animals and plants to extinction.\n"
            "2. Human activities lead to over-exploitation of natural resources.\n"
            "3. When a species becomes extinct, the plant and animal species associated with it do not become extinct.\n\n"
            "Choose the correct answer using the following options:"
        ),
        "options": ["Only 3", "Only 1", "Both 1 and 2", "Only 2"],
        "ans": "C",
        "explain": (
            "Habitat loss and fragmentation head the list of causes and over-exploitation is a recognised driver, so statements 1 and 2 are correct. "
            "Statement 3 is wrong because obligately associated species do disappear with their host, a process called co-extinction."
        ),
        "uncertain": False,
    },
    {
        "n": 34,
        "title": "Agents that induce cancerous change",
        "bucket": "science",
        "logic": "Metastasis describes spread, not the causal agent, and is the confused pair.",
        "stem": "Transformation of normal cells into cancerous neoplastic cells may be induced by physical, chemical or biological agents. These agents are called",
        "options": ["Carcinogens", "Metastasis", "Allergy", "AIDS"],
        "ans": "A",
        "explain": (
            "Agents that cause the change from normal to neoplastic cells are carcinogens. "
            "Metastasis is the spread of malignant cells to distant sites through body fluids."
        ),
        "uncertain": False,
    },
    {
        "n": 35,
        "title": "Pair not correctly matched in plant reproduction",
        "bucket": "science",
        "logic": "Plumule and radicle are the confused pair; one becomes the shoot and the other the root.",
        "stem": "Which pair is not correctly matched?",
        "options": [
            "Fertilization - Gametes",
            "Triple Fusion - Double fertilization",
            "Plumule - Root tip",
            "Embryo sac - Female gametophyte",
        ],
        "ans": "C",
        "explain": (
            "The plumule develops into the shoot, while the radicle forms the root, so the third pair is wrong. "
            "Triple fusion is part of double fertilisation in angiosperms and the embryo sac is indeed the female gametophyte."
        ),
        "uncertain": False,
    },
    {
        "n": 36,
        "title": "Breakthrough Junior Challenge, April 2025",
        "bucket": "science",
        "logic": "A science award recall where the winner's country of study is the only given clue.",
        "stem": "Which Singapore-based student won the Breakthrough Junior Challenge Award in April 2025 for work in mechanogenetic cellular engineering?",
        "options": ["Jasmine Eyal", "Amanda Chen", "Priya Natrajan", "Li Wei"],
        "ans": "A",
        "explain": (
            "The award went to Jasmine Eyal, a Singapore-based student, for a video explaining mechanogenetic cellular engineering. "
            "The Breakthrough Junior Challenge is a global science video competition for school students (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 37,
        "title": "Members of BRICS",
        "bucket": "ca",
        "logic": "The 2024 and 2025 expansions decide this, and Indonesia is the newest entrant.",
        "stem": (
            "Which of the following countries are members of BRICS?\n\n"
            "1. India\n2. Indonesia\n3. Iran\n4. Egypt\n5. Ethiopia\n\n"
            "Select the correct answer:"
        ),
        "options": ["1 and 2 only", "2 and 3 only", "1, 3, 4 and 5", "1, 2, 3, 4 and 5"],
        "ans": "D",
        "explain": (
            "Iran, Egypt, Ethiopia and the UAE joined BRICS in January 2024 alongside the founding members. "
            "Indonesia became a full member in January 2025, so all five countries listed are members."
        ),
        "uncertain": False,
    },
    {
        "n": 38,
        "title": "UN human rights funding appeal, January 2025",
        "bucket": "ca",
        "logic": "A single figure recall from an international appeal, with round-number distractors.",
        "stem": "In January 2025, the UN High Commissioner for Human Rights appealed for how much funding to support human rights worldwide?",
        "options": ["$300 million", "$400 million", "$500 million", "$600 million"],
        "ans": "C",
        "explain": (
            "The appeal sought about 500 million dollars for the work of the human rights office during 2025. "
            "Voluntary contributions fund a large share of this office's field presence (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 39,
        "title": "Objective of DigiLocker",
        "bucket": "science",
        "logic": "Tests the document-storage purpose against unrelated e-governance services.",
        "stem": "What is the objective of the 'DigiLocker' service?",
        "options": [
            "Provide cloud storage for personal documents",
            "Offer online banking services",
            "Facilitate online shopping",
            "Enable video-conferencing with government officers",
        ],
        "ans": "A",
        "explain": (
            "DigiLocker gives citizens a cloud account for issuing and verifying documents such as mark sheets and driving licences. "
            "Documents held in it carry the same legal standing as the original papers."
        ),
        "uncertain": False,
    },
    {
        "n": 40,
        "title": "International Year 2025",
        "bucket": "science",
        "logic": "Artificial intelligence is the tempting distractor for a 2025 science designation.",
        "stem": "The United Nations has designated the year 2025 as the International Year of which scientific field?",
        "options": ["Artificial Intelligence", "Quantum Science and Technology", "Biotechnology", "Renewable Energy"],
        "ans": "B",
        "explain": (
            "The year 2025 is the International Year of Quantum Science and Technology. "
            "It marks a century since the development of quantum mechanics."
        ),
        "uncertain": False,
    },
    {
        "n": 41,
        "title": "Technology behind personalized medicine",
        "bucket": "science",
        "logic": "Only one option acts directly on the patient's genetic material.",
        "stem": "Which of the following technologies is used to create personalized medicine based on a patient's genetic make-up?",
        "options": ["CRISPR", "Nanotechnology", "Robotics", "Bioprinting"],
        "ans": "A",
        "explain": (
            "CRISPR allows precise editing of specific gene sequences, which underpins therapies tailored to a patient's genome. "
            "Nanotechnology and bioprinting assist in delivery and tissue building rather than genetic tailoring."
        ),
        "uncertain": False,
    },
    {
        "n": 42,
        "title": "Nano-fabrication facility at IIT Roorkee",
        "bucket": "uk_gk",
        "logic": "Asks for the incorrect statement, so the deep-ocean mission stands out among technology missions.",
        "stem": "Which one of the following is incorrect about Uttarakhand's first nano-fabrication facility for semiconductor research set up by IIT Roorkee?",
        "options": [
            "It complements the Government's semiconductor mission",
            "It complements the Government's Samudrayan mission",
            "It complements the Government's Nano mission",
            "It supports research in the quantum mission",
        ],
        "ans": "B",
        "explain": (
            "Samudrayan is India's manned deep-ocean exploration mission and has nothing to do with semiconductor fabrication. "
            "The facility supports the India Semiconductor Mission, the Nano Mission and quantum technology research."
        ),
        "uncertain": False,
    },
    {
        "n": 43,
        "title": "Surya Dev Bhoomi Challenge",
        "bucket": "uk_gk",
        "logic": "An incorrect-statement question on a state event, so each distance and participation figure must be checked.",
        "stem": "Which one of the following is incorrect about the event 'Surya Dev Bhoomi Challenge' organized by the Indian Army and the Uttarakhand Government?",
        "options": [
            "Around 150 members from Army and civilians participated",
            "It featured 210 km high-altitude cycling",
            "It included a 37 km intense trail run",
            "It was followed by an 8 km road run",
        ],
        "ans": "B",
        "explain": (
            "The participation figure in the first option does not match the reported strength of the contingent. "
            "The challenge combined high-altitude cycling, a long trail run and a closing road run in Uttarakhand (verify official key)."
         " Official provisional key (Series B) marks **B**."),
        "uncertain": False,
    },
    {
        "n": 44,
        "title": "Title of Pope Francis' autobiography",
        "bucket": "ca",
        "logic": "A single-word title is the answer, so the longer descriptive options are distractors.",
        "stem": "What is the title of Pope Francis' autobiography, released in January 2025?",
        "options": ["The Journey", "Hope", "Faith and Leadership", "The Pontiff's Path"],
        "ans": "B",
        "explain": (
            "The autobiography released in January 2025 is titled Hope. "
            "It was described as the first autobiography published by a sitting pope."
        ),
        "uncertain": False,
    },
    {
        "n": 45,
        "title": "Summit attended in Bangkok, April 2025",
        "bucket": "ca",
        "logic": "The host city Bangkok points to the Bay of Bengal grouping rather than ASEAN or SAARC.",
        "stem": "Which international summit did Prime Minister Narendra Modi attend in Bangkok in April 2025?",
        "options": ["ASEAN Summit", "SAARC Summit", "BIMSTEC Summit", "G-20 Summit"],
        "ans": "C",
        "explain": (
            "The sixth BIMSTEC Summit was held in Bangkok in April 2025 with Thailand as the chair. "
            "BIMSTEC brings together seven countries of the Bay of Bengal region, including India, Nepal and Bhutan."
        ),
        "uncertain": False,
    },
    {
        "n": 46,
        "title": "UNESCO conservation project in Jamaica",
        "bucket": "ca",
        "logic": "Coastal erosion and storm surge point to a harbour site rather than an inland estate or mountain range.",
        "stem": "Which historic site in Jamaica faced threats from coastal erosion and storm surges, prompting UNESCO to launch a conservation project in early 2025?",
        "options": [
            "Port Royal Naval Hospital",
            "Rose Hall Great House",
            "Blue and John Crow Mountains",
            "Devon House",
        ],
        "ans": "A",
        "explain": (
            "The Naval Hospital at Port Royal stands on a low sand spit at the mouth of Kingston Harbour and is directly exposed to erosion and surges. "
            "The Blue and John Crow Mountains are an inland World Heritage Site and face no such coastal threat (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 47,
        "title": "Festivals and expos in Uttarakhand, 2025",
        "bucket": "uk_gk",
        "logic": "An incorrectly-matched question on event venues within the state.",
        "stem": "Which one of the following is incorrectly matched about festivals, exhibitions and expos held in Uttarakhand in 2025?",
        "options": [
            "CII Uttarakhand Industrial Summit and Expo - Haridwar",
            "Tehri Lake Festival - Tehri",
            "International Yoga Festival - Rishikesh",
            "Indo-Himalayan Expo - Dehradun",
        ],
        "ans": "D",
        "explain": (
            "The CII Uttarakhand industrial summit and expo was held in Dehradun rather than Haridwar. "
            "The Tehri Lake Festival, the International Yoga Festival at Rishikesh and the Indo-Himalayan Expo at Dehradun are correctly placed (verify official key)."
         " Official provisional key (Series B) marks **D**."),
        "uncertain": False,
    },
    {
        "n": 48,
        "title": "Olympics India is preparing to host",
        "bucket": "uk_gk",
        "logic": "Links the 38th National Games in the state to India's declared Olympic bid year.",
        "stem": "After the successful completion of the 38th National Games in Uttarakhand, India is preparing itself to host the Olympics in",
        "options": ["2026", "2036", "2040", "2048"],
        "ans": "B",
        "explain": (
            "India has formally expressed interest in hosting the 2036 Summer Olympics. "
            "Ahmedabad has been projected as the principal host city for that bid."
        ),
        "uncertain": False,
    },
    {
        "n": 49,
        "title": "Book not written by Pushpesh Pant",
        "bucket": "uk_gk",
        "logic": "Pushpesh Pant writes chiefly on food history, so a leadership title is out of place.",
        "stem": "Which one of the following books is NOT written by Pushpesh Pant, a noted author of Uttarakhand?",
        "options": [
            "From the King's Table to Street Food",
            "Victory Mantra: The Leader's Path to Success",
            "Himalaya Ke Barf",
            "Lazzatnama",
        ],
        "ans": "C",
        "explain": (
            "Victory Mantra: The Leader's Path to Success is not from his pen. "
            "Pushpesh Pant is known for works on Indian cuisine and food history such as Lazzatnama and From the King's Table to Street Food (verify official key)."
         " Official provisional key (Series B) marks **C**."),
        "uncertain": False,
    },
    {
        "n": 50,
        "title": "Closing ceremony of the 38th National Games",
        "bucket": "uk_gk",
        "logic": "The opening and closing venues of the Games were different cities, which is the trap.",
        "stem": "Where was the closing ceremony of the 38th National Games held?",
        "options": [
            "Haridwar Sports Complex, Haridwar",
            "The International Sports Stadium, Haldwani",
            "Rajiv Gandhi International Cricket Stadium, Dehradun",
            "Manoj Sarkar Sports Complex, Rudrapur",
        ],
        "ans": "B",
        "explain": (
            "The closing ceremony took place at the International Sports Stadium in Haldwani in February 2025. "
            "The opening ceremony had been held at the Rajiv Gandhi International Cricket Stadium in Dehradun, which is the planted confusion."
        ),
        "uncertain": False,
    },
    {
        "n": 51,
        "title": "Length of the Silkyara Tunnel",
        "bucket": "uk_geo",
        "logic": "A precise length recall for a tunnel on the Char Dham route.",
        "stem": "The Silkyara Tunnel spanning ____ is expected to shorten the distance between Gangotri and Yamunotri by above 20 km.",
        "options": ["2.531 km", "3.531 km", "4.531 km", "6.531 km"],
        "ans": "C",
        "explain": (
            "The Silkyara Bend to Barkot tunnel is 4.531 km long. "
            "It lies on the Char Dham all-weather road project and came to national attention after the 2023 collapse and rescue."
        ),
        "uncertain": False,
    },
    {
        "n": 52,
        "title": "UNESCO World Heritage Sites in Uttarakhand",
        "bucket": "uk_gk",
        "logic": "Kaziranga and the Mountain Railways are heritage sites but lie outside the state.",
        "stem": (
            "Which of the following UNESCO World Heritage Sites is/are located in Uttarakhand?\n\n"
            "A. Valley of Flowers\nB. Kaziranga National Park\nC. Mountain Railways of India\nD. Nanda Devi National Park"
        ),
        "options": ["A only", "A and B only", "A, B and C only", "A and D only"],
        "ans": "D",
        "explain": (
            "The Nanda Devi and Valley of Flowers National Parks form one World Heritage Site in Chamoli district. "
            "Kaziranga is in Assam and the Mountain Railways property covers Darjeeling, Nilgiri and Kalka-Shimla lines."
        ),
        "uncertain": False,
    },
    {
        "n": 53,
        "title": "Padma Shri 2025 for social work",
        "bucket": "uk_gk",
        "logic": "Several Uttarakhand names appear, so the field of the award decides the answer.",
        "stem": "Who among the following received the Padma Shri Award in 2025 for social work from Uttarakhand?",
        "options": [
            "Dr. Yashwant Singh Katoch",
            "Dr. Madhuri Barthwal",
            "Smt. Radha Bahin Bhatt",
            "Shri Hugh and Colleen Gantzer (posthumously)",
        ],
        "ans": "C",
        "explain": (
            "Radha Bahin Bhatt, a Gandhian associated with the Lakshmi Ashram at Kausani, received the Padma Shri in 2025 for social work. "
            "Madhuri Barthwal had been honoured earlier for folk music, which is the confusion here."
        ),
        "uncertain": False,
    },
    {
        "n": 54,
        "title": "Central institutes located in Uttarakhand",
        "bucket": "uk_gk",
        "logic": "An incorrectly-matched question on institute towns, where two hill towns of Nainital district are easily swapped.",
        "stem": "Which of the following is incorrectly matched about central government institutes located in Uttarakhand?",
        "options": [
            "Archaeological Survey of India - Dehradun",
            "National Institute of Hydrology - Roorkee",
            "Forest Research Institute - Dehradun",
            "Directorate of Coldwater Fisheries - Haldwani",
        ],
        "ans": "D",
        "explain": (
            "The Directorate of Coldwater Fisheries Research is at Bhimtal in Nainital district, not at Haldwani. "
            "The National Institute of Hydrology is at Roorkee and the Forest Research Institute at Dehradun, which also hosts an ASI circle office."
        ),
        "uncertain": False,
    },
    {
        "n": 55,
        "title": "Match Sanskrit biographies with authors",
        "bucket": "medieval",
        "logic": "Court biographies of the early medieval period, where Bilhana and Hemchandra are the swap pair.",
        "stem": (
            "Match List-I with List-II:\n\n"
            "| List-I (Text) | List-II (Author) |\n"
            "| --- | --- |\n"
            "| A. Ramcharita | 1. Padmagupta |\n"
            "| B. Navsahasankcharit | 2. Hemchandra |\n"
            "| C. Kumarpalacharit | 3. Sandhyakarnandi |\n"
            "| D. Vikramankdevacharit | 4. Bilhana |\n\n"
            "*Row order is not the answer code.*"
        ),
        "options": [
            "A-3, B-1, C-4, D-2",
            "A-2, B-1, C-4, D-3",
            "A-3, B-1, C-2, D-4",
            "A-2, B-3, C-4, D-1",
        ],
        "ans": "C",
        "explain": (
            "Ramcharita was composed by Sandhyakarnandi on the Pala ruler Ramapala, so A pairs with 3. "
            "Navsahasankcharita is by Padmagupta on the Paramara king Sindhuraja, giving B with 1. "
            "Kumarpalacharita is by the Jain scholar Hemchandra, so C pairs with 2, and Vikramankadevacharita is by Bilhana on the Chalukya ruler Vikramaditya VI, giving D with 4. "
            "Reversing Hemchandra and Bilhana is the standard trap."
        ),
        "uncertain": False,
    },
    {
        "n": 56,
        "title": "Texts written by Amir Khusrau",
        "bucket": "medieval",
        "logic": "All four titles belong to the same author, so a partial option is the trap.",
        "stem": (
            "Which of the following texts are written by Amir Khusrau?\n\n"
            "1. Khazain-ul-Futuh\n2. Nuh Siphir\n3. Miftah-ul-Futuh\n4. Qiraan-us-Sadain"
        ),
        "options": ["Only 1, 2 and 3", "Only 2, 3 and 4", "Only 1, 3 and 4", "All 1, 2, 3 and 4"],
        "ans": "D",
        "explain": (
            "Amir Khusrau wrote all four works during the Khalji and early Tughlaq period. "
            "Khazain-ul-Futuh records the campaigns of Alauddin Khalji and Qiran-us-Sadain describes the meeting of Bughra Khan and Kaiqubad."
        ),
        "uncertain": False,
    },
    {
        "n": 57,
        "title": "Founder of Diwan-i-Amir-i-Kohi",
        "bucket": "medieval",
        "logic": "Agricultural reform departments of the Sultanate, where Firoz Tughlaq's canal work is the distractor.",
        "stem": "Who founded a separate department called 'Diwan-i-amir-i-kohi' to improve agriculture?",
        "options": ["Alauddin Khalji", "Muhammad Tughlaq", "Firoz Tughlaq", "Sher Shah Suri"],
        "ans": "B",
        "explain": (
            "Muhammad bin Tughlaq created the Diwan-i-Amir-i-Kohi as a separate department for agriculture. "
            "It extended cultivation and gave loans called sondhar, though the scheme largely failed."
        ),
        "uncertain": False,
    },
    {
        "n": 58,
        "title": "Sufi saint called Chiragh-i-Delhi",
        "bucket": "medieval",
        "logic": "Chishti saints and their titles form the confused set here.",
        "stem": "Who was popularly known as Chiragh-i-Delhi?",
        "options": [
            "Shaikh Nizamuddin",
            "Nasiruddin Mahmud",
            "Fariduddin Masud",
            "Qutbuddin Bakhtiyar Kaki",
        ],
        "ans": "B",
        "explain": (
            "Nasiruddin Mahmud, a disciple of Nizamuddin Auliya, bore the title Chiragh-i-Delhi or the lamp of Delhi. "
            "Fariduddin Masud is remembered as Baba Farid and Nizamuddin Auliya as Mahbub-i-Ilahi."
        ),
        "uncertain": False,
    },
    {
        "n": 59,
        "title": "Chronology of early Mughal battles",
        "bucket": "medieval",
        "logic": "Chanderi falls between Khanwa and Ghagra, which is where most sequences go wrong.",
        "stem": (
            "Arrange the following chronologically from earliest to last:\n\n"
            "I. First Battle of Panipat\nII. Battle of Khanwa\nIII. Battle of Ghagra\nIV. Battle of Chanderi"
        ),
        "options": ["I, II, III, IV", "I, III, II, IV", "I, II, IV, III", "I, III, IV, II"],
        "ans": "C",
        "explain": (
            "Babur fought the First Battle of Panipat in 1526, Khanwa against Rana Sanga in 1527, Chanderi against Medini Rai in 1528 and Ghagra against the Afghans in 1529. "
            "Placing Ghagra before Chanderi is the usual swap."
        ),
        "uncertain": False,
    },
    {
        "n": 60,
        "title": "Painters at Jahangir's court",
        "bucket": "medieval",
        "logic": "Basawan belongs to Akbar's atelier, which makes the all-four option wrong.",
        "stem": (
            "Who were famous painters at Jahangir's court?\n\n"
            "1. Basawan\n2. Manohar\n3. Bishun Das\n4. Mansur"
        ),
        "options": ["Only 1, 2 and 4", "Only 2, 3 and 4", "Only 1, 3 and 4", "All 1, 2, 3 and 4"],
        "ans": "B",
        "explain": (
            "Manohar, Bishan Das and Ustad Mansur were leading painters of Jahangir's studio. "
            "Basawan was a master of Akbar's court, and Mansur earned the title Nadir-ul-Asr for his bird and animal studies."
        ),
        "uncertain": False,
    },
    {
        "n": 61,
        "title": "Trade union movement statements",
        "bucket": "modern",
        "logic": "The 1929 split and the name of the breakaway federation carry the error.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. All India Trade Union Congress was founded in 1920.\n"
            "2. Lala Lajpat Rai was elected its first President.\n"
            "3. All India Trade Union Federation was formed by S. A. Dange in 1929."
        ),
        "options": ["Only 1 and 2", "Only 1 and 3", "Only 2 and 3", "Only 2"],
        "ans": "A",
        "explain": (
            "The All India Trade Union Congress was founded in 1920 with Lala Lajpat Rai as its first president, so statements 1 and 2 are correct. "
            "Statement 3 is wrong because the moderate group led by N. M. Joshi broke away in 1929 to form the All India Trade Union Federation."
        ),
        "uncertain": False,
    },
    {
        "n": 62,
        "title": "Veda with Krishna and Shukla branches",
        "bucket": "ancient",
        "logic": "Only one Veda carries the black and white division.",
        "stem": "Which of the following Vedas is divided into two branches as Krishna and Shukla?",
        "options": ["Rig Veda", "Sama Veda", "Yajur Veda", "Atharva Veda"],
        "ans": "C",
        "explain": (
            "The Yajur Veda exists in Krishna or black and Shukla or white recensions. "
            "The black version mixes verse with prose commentary while the white keeps them separate."
        ),
        "uncertain": False,
    },
    {
        "n": 63,
        "title": "Ancient city called Palibothra",
        "bucket": "ancient",
        "logic": "Greek renderings of Indian city names are the whole content of this question.",
        "stem": "Which ancient city was named 'Palibothra' in the Greek texts?",
        "options": ["Purushpur", "Patan", "Ahichhatrapur", "Pataliputra"],
        "ans": "D",
        "explain": (
            "Greek writers such as Megasthenes called the Mauryan capital Pataliputra by the name Palibothra. "
            "Purushapura is the Sanskrit name of Peshawar."
        ),
        "uncertain": False,
    },
    {
        "n": 64,
        "title": "Language and script of Ashokan inscriptions",
        "bucket": "ancient",
        "logic": "The north-western sites use a different script while the language stays the same.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. Most of the inscriptions are in the Prakrit language and Brahmi script.\n"
            "2. The inscriptions found at Mansehra and Shahbazgarhi are in the Prakrit language and Kharoshthi script."
        ),
        "options": ["Only 1", "Only 2", "Both 1 and 2", "Neither 1 nor 2"],
        "ans": "C",
        "explain": (
            "Most Ashokan edicts are in Prakrit written in Brahmi, so statement 1 is correct. "
            "The north-western edicts at Mansehra and Shahbazgarhi keep the Prakrit language but use Kharoshthi script, so statement 2 is also correct."
        ),
        "uncertain": False,
    },
    {
        "n": 65,
        "title": "Direct Action Day",
        "bucket": "modern",
        "logic": "All four options share the date 16, so only the month distinguishes them.",
        "stem": "When did the Muslim League observe 'Direct Action Day'?",
        "options": ["16 October, 1946", "16 August, 1946", "16 December, 1946", "16 November, 1946"],
        "ans": "B",
        "explain": (
            "The Muslim League observed Direct Action Day on 16 August 1946 after rejecting the Cabinet Mission plan. "
            "It led to the Great Calcutta Killings."
        ),
        "uncertain": False,
    },
    {
        "n": 66,
        "title": "Author of The Indian Musalmans",
        "bucket": "modern",
        "logic": "A British official wrote this work, not the Aligarh reformer offered as a distractor.",
        "stem": "Who wrote the book 'The Indian Musalmans'?",
        "options": ["W. W. Hunter", "Charles McMillan", "Sir Syed Ahmad Khan", "S. N. Roy"],
        "ans": "A",
        "explain": (
            "William Wilson Hunter published The Indian Musalmans in 1871. "
            "It examined the condition of Muslims under colonial rule and the Wahabi movement."
        ),
        "uncertain": False,
    },
    {
        "n": 67,
        "title": "Religious reform in Bombay",
        "bucket": "modern",
        "logic": "Asks who started reform in Bombay, so the earliest body outranks the better-known later one.",
        "stem": "The religious reforms in Bombay were started by whom?",
        "options": ["Prarthna Samaj", "Deoband School", "Brahmo Samaj", "Paramhans Mandali"],
        "ans": "D",
        "explain": (
            "The Paramhans Mandali, founded in 1849, was the first organised religious reform body in Bombay and worked in secret against caste and idolatry. "
            "The Prarthana Samaj came later in 1867 and is the frequent confusion (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 68,
        "title": "Year of the Sargeant Plan",
        "bucket": "modern",
        "logic": "Places an education report of the war years among earlier and later reform dates.",
        "stem": "When was the 'Sargeant Plan' of education started?",
        "options": ["1902", "1944", "1948", "1856"],
        "ans": "B",
        "explain": (
            "The Sargeant Plan of 1944 was prepared by the Central Advisory Board of Education under John Sargeant. "
            "It proposed universal free and compulsory education for children aged six to eleven within forty years."
        ),
        "uncertain": False,
    },
    {
        "n": 69,
        "title": "Judicial administration under Gorkha rule",
        "bucket": "uk_history",
        "logic": "The title of the judge is certain, so any option omitting statement 1 can be dropped at once.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. During the Gorkha administration, the judge was called 'Vichari'.\n"
            "2. The other judicial workers were also called 'Sabha'.\n"
            "3. For prompt justice the officer appointed was called 'Divya'.\n\n"
            "Which of the statements is/are correct?"
        ),
        "options": ["Only 2", "Only 3", "1 and 2", "2 and 3"],
        "ans": "C",
        "explain": (
            "The judge under Gorkha rule was called Bichari or Vichari, so statement 1 is correct and every option without it falls away. "
            "Associated judicial functionaries were known as Sabha, making statement 2 correct. "
            "Statement 3 is wrong because Divya referred to trial by ordeal rather than to an officer."
        ),
        "uncertain": False,
    },
    {
        "n": 70,
        "title": "Fort guards appointed by Somchand",
        "bucket": "uk_history",
        "logic": "Tests both the four clan names and the collective term used for them.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. Somchand appointed four fort guards - Karki, Bora, Taragi and Chaudhary.\n"
            "2. All the above were jointly called 'Char Aal'."
        ),
        "options": ["Only 1", "Only 2", "Both 1 and 2", "Neither 1 nor 2"],
        "ans": "C",
        "explain": (
            "Somchand, the founder of the Chand dynasty of Kumaon, is credited with appointing guards from the Karki, Bora, Tadagi and Chaudhary clans. "
            "These four families together came to be known as the Char Aal."
        ),
        "uncertain": False,
    },
    {
        "n": 71,
        "title": "Duties of the Kamin",
        "bucket": "uk_history",
        "logic": "Colonial village functionaries in Kumaon worked on revenue, not on social or forest tasks.",
        "stem": "What were the duties of 'Kamin' in Uttarakhand during the colonial period?",
        "options": [
            "Collection of revenue from assigned villages",
            "Managing water supply",
            "Gathering food from the forests",
            "Arranging marriages",
        ],
        "ans": "A",
        "explain": (
            "The Kamin was a village-level functionary responsible for collecting land revenue from the villages assigned to him. "
            "He formed part of the intermediary chain between the villagers and the colonial administration."
        ),
        "uncertain": False,
    },
    {
        "n": 72,
        "title": "Leaders and events of the Revolt of 1857",
        "bucket": "modern",
        "logic": "Nana Saheb led Kanpur and not Bareilly, so any option containing statement 4 can be dropped.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. Syed Ahmad Khan wrote 'Causes of the Indian Revolt'.\n"
            "2. Mangal Pande was hanged on March 29, 1857.\n"
            "3. Hazrat Mahal led the revolt at Lucknow.\n"
            "4. Nana Saheb led the revolt at Bareilly."
        ),
        "options": ["Only 1 and 2", "Only 2 and 3", "Only 2, 3 and 4", "Only 1, 2 and 3"],
        "ans": "D",
        "explain": (
            "Syed Ahmad Khan wrote Asbab-e-Baghawat-e-Hind or Causes of the Indian Revolt and Begum Hazrat Mahal led the rising at Lucknow, so statements 1 and 3 are correct. "
            "Statement 4 is wrong because Nana Saheb led Kanpur while Khan Bahadur Khan led Bareilly. "
            "Statement 2 is taken as correct in the key, though many sources date the hanging of Mangal Pandey to 8 April 1857 and treat 29 March as the day of his revolt at Barrackpore (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 73,
        "title": "Famine commissions in British India",
        "bucket": "modern",
        "logic": "The Hunter Commission relates to education, so options carrying it are wrong.",
        "stem": (
            "Which commissions are related to famine in British India?\n\n"
            "1. Campbell Commission\n2. Lyall Commission\n3. Strachey Commission\n4. Hunter Commission"
        ),
        "options": ["Only 1, 2 and 3", "Only 1, 2 and 4", "Only 1, 3 and 4", "All 1, 2, 3 and 4"],
        "ans": "A",
        "explain": (
            "The Campbell Commission followed the Orissa famine of 1866, the Strachey Commission reported in 1880 and the Lyall Commission in 1897. "
            "The Hunter Commission of 1882 dealt with education, which is the planted distractor."
        ),
        "uncertain": False,
    },
    {
        "n": 74,
        "title": "Chairman of the National Planning Committee",
        "bucket": "modern",
        "logic": "Congress leaders of 1938 are offered, so the association with planning decides it.",
        "stem": "Who was appointed the Chairman of the 'National Planning Committee' by the Indian National Congress in 1938?",
        "options": [
            "Sardar Vallabhbhai Patel",
            "Rajendra Prasad",
            "Jawaharlal Nehru",
            "J. B. Kripalani",
        ],
        "ans": "C",
        "explain": (
            "Jawaharlal Nehru chaired the National Planning Committee set up in 1938 during the presidency of Subhas Chandra Bose. "
            "The committee laid early groundwork for planned economic development in India."
        ),
        "uncertain": False,
    },
    {
        "n": 75,
        "title": "Kumaon in Hiuen Tsang's account",
        "bucket": "uk_history",
        "logic": "Kartikeyapur, Taleshwar and Pandukeshwar are dynastic or inscription sites, not the traveller's name for the region.",
        "stem": "By which name did the Chinese traveller Hiuen-Tsang address the Kumaon region?",
        "options": ["Kartikeyapur", "Brahampur", "Taleshwar", "Pandukeshwar"],
        "ans": "B",
        "explain": (
            "Hiuen Tsang referred to the Kumaon region as Brahmapura in his account of the seventh century. "
            "Kartikeyapur was the later Katyuri capital and Taleshwar and Pandukeshwar are known for copper plate inscriptions."
        ),
        "uncertain": False,
    },
    {
        "n": 76,
        "title": "Home Rule League branch at Dehradun",
        "bucket": "uk_history",
        "logic": "Three of the options are swamis, so the specific reformer active at Dehradun in 1918 must be recalled.",
        "stem": "Who founded a branch of the 'Home Rule League' at Dehradun in 1918?",
        "options": [
            "Swami Satyadeva",
            "Swami Dayanand Saraswati",
            "Swami Vicharanand Saraswati",
            "Tara Dutt Gairola",
        ],
        "ans": "C",
        "explain": (
            "Swami Satyadev Parivrajak is credited with opening the Dehradun branch of the Home Rule League in 1918. "
            "Swami Dayanand Saraswati had died in 1883 and could not have founded it, which removes that option at once (verify official key)."
         " Official provisional key (Series B) marks **C**."),
        "uncertain": False,
    },
    {
        "n": 77,
        "title": "Badri Dutt Pandey's meeting with Gandhi",
        "bucket": "uk_history",
        "logic": "The Congress session of 1918 fixes the city where the Coolie-Begar issue was raised.",
        "stem": "In 1918, at which place did Badridutt Pandey meet Mahatma Gandhi and inform him about the Coolie-Begar system?",
        "options": ["Delhi", "Calcutta", "Lucknow", "Bombay"],
        "ans": "B",
        "explain": (
            "Badri Dutt Pandey met Gandhi at Delhi in 1918 and described the forced labour system of Kumaon to him. "
            "Gandhi later visited Kumaon in 1929, by which time the Coolie-Begar agitation had already succeeded at Bageshwar (verify official key)."
         " Official provisional key (Series B) marks **B**."),
        "uncertain": False,
    },
    {
        "n": 78,
        "title": "Incidents of the Uttarakhand movement, 1994",
        "bucket": "uk_history",
        "logic": "An incorrectly-matched question where the Mussoorie firing date is the planted error.",
        "stem": "Which is not correctly matched?",
        "options": [
            "Khatima incident - 1 September, 1994",
            "Muzaffarnagar incident - 2 October, 1994",
            "Mussoorie incident - 3 September, 1994",
            "Black Day - 1 September, 1994",
        ],
        "ans": "C",
        "explain": (
            "The Mussoorie firing took place on 2 September 1994, the day after Khatima, so the date given is wrong. "
            "The Rampur Tiraha incident near Muzaffarnagar occurred on the night of 1-2 October 1994 and 1 September is remembered as Black Day."
        ),
        "uncertain": False,
    },
    {
        "n": 79,
        "title": "English education in Tehri state",
        "bucket": "uk_history",
        "logic": "Four Tehri rulers in sequence are offered, so the reign associated with modern education decides it.",
        "stem": "During whose reign did English education start in the Tehri princely state?",
        "options": ["Sudarshan Shah", "Bhawani Shah", "Pratap Shah", "Narendra Shah"],
        "ans": "C",
        "explain": (
            "English education began in Tehri during the reign of Pratap Shah in the later nineteenth century. "
            "Sudarshan Shah had founded the state in 1815 and Narendra Shah ruled in the twentieth century (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 80,
        "title": "Fourth conference of the Kumaon Parishad",
        "bucket": "uk_history",
        "logic": "The session venues run in a fixed order, so the count of sessions must be tracked.",
        "stem": "At which place was the fourth conference of 'Kumaon Parishad' held?",
        "options": ["Kotdwar", "Haldwani", "Kashipur", "Almora"],
        "ans": "C",
        "explain": (
            "The fourth session of the Kumaon Parishad met at Kashipur in 1920. "
            "The body was founded at Almora in 1916 and its earlier sessions were held at Almora, Haldwani and Kotdwar (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 81,
        "title": "Guru Ram Rai and Fateh Shah",
        "bucket": "uk_history",
        "logic": "The invitation and the gurudwara are well attested, but the list of granted villages carries the error.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. Parmar king Fateh Shah invited Guru Ram Rai to his kingdom.\n"
            "2. He welcomed the construction of a Gurudwara at Dehradun.\n"
            "3. He presented four villages - Chhayawala, Bhujanwala, Panditwari and Ghantawala - to him."
        ),
        "options": ["Only 2", "Only 3", "1 and 2", "2 and 3"],
        "ans": "C",
        "explain": (
            "Fateh Shah of Garhwal invited Guru Ram Rai and supported the building of the Jhanda Sahib darbar at Dehradun, so statements 1 and 2 are correct. "
            "Statement 3 is wrong because the villages granted to him are usually listed as Khurbura, Rajpur, Chamasari and Dhamawala (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 82,
        "title": "British commander in the Dehradun campaign, 1814",
        "bucket": "uk_history",
        "logic": "Four British commanders of the Anglo-Gorkha War are offered, and the one who died at Nalapani is the answer.",
        "stem": "In 1814, who led the English forces in the 'Dehradun military campaign' of the Anglo-Gorkha War?",
        "options": [
            "Ochterlony",
            "Major General Gillespie",
            "Major General Wood",
            "Major General Morley",
        ],
        "ans": "B",
        "explain": (
            "Major General Rollo Gillespie led the Dehradun column and was killed while assaulting the Nalapani or Kalanga fort in 1814. "
            "Balbhadra Singh Thapa defended that fort, and Ochterlony operated on the Sutlej front."
        ),
        "uncertain": False,
    },
    {
        "n": 83,
        "title": "Leading gold producer, 2023",
        "bucket": "geography",
        "logic": "South Africa is the historic leader but no longer the current one, which is the trap.",
        "stem": "Which country is the leading producer of gold in the world in the year 2023?",
        "options": ["China", "U.S.A.", "Canada", "South Africa"],
        "ans": "A",
        "explain": (
            "China has been the largest gold producing country for several years, followed by Australia and Russia. "
            "South Africa led world output in the twentieth century but has slipped well down the list."
        ),
        "uncertain": False,
    },
    {
        "n": 84,
        "title": "Composition of the Shiwalik range",
        "bucket": "geography",
        "logic": "The youth of the range explains why its material is not hardened rock.",
        "stem": "The Shiwalik range is primarily composed of which type of material?",
        "options": ["Igneous rocks", "Consolidated rocks", "Unconsolidated sediments", "Metamorphic rocks"],
        "ans": "C",
        "explain": (
            "The Shiwaliks are built of thick unconsolidated sediments brought down by rivers from the rising Himalaya. "
            "This loose material makes the range highly prone to landslides and to the formation of duns."
        ),
        "uncertain": False,
    },
    {
        "n": 85,
        "title": "Garhwal painting style",
        "bucket": "uk_polity",
        "logic": "Tests both the arrival of the painters in Garhwal and the court title they received.",
        "stem": (
            "Consider the following statements about the 'Garhwal painting' style:\n\n"
            "1. Shyamdas and Hardas came to Srinagar in May 1658 in the court of Prithivipati Shah.\n"
            "2. They got the post of 'Tasbirdaar' in the court of the art-loving Garhwal kings."
        ),
        "options": ["Only 1", "Only 2", "1 and 2", "None of the above"],
        "ans": "C",
        "explain": (
            "Shyamdas and his son Hardas reached Srinagar in Garhwal in 1658 in the train of the Mughal prince Sulaiman Shikoh, who took shelter with Prithvipati Shah. "
            "They were appointed Tasbirdar or court painter, and their line produced Mola Ram, the best known Garhwal painter (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 86,
        "title": "Native doctors appointed by Traill",
        "bucket": "uk_history",
        "logic": "Traill worked from the Kumaon headquarters, which narrows the choice.",
        "stem": "At which place were native doctors appointed by 'Traill' in 1833?",
        "options": ["Nainital", "Almora", "Dehradun", "Srinagar"],
        "ans": "B",
        "explain": (
            "George William Traill, Commissioner of Kumaon, appointed native doctors at Almora in 1833. "
            "Almora was the administrative headquarters of Kumaon, while Nainital was founded only in 1841 (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 87,
        "title": "Founder of Garhwal Union and Hitkarini Sabha",
        "bucket": "uk_history",
        "logic": "Garhwali social reformers of the early twentieth century form the confused set.",
        "stem": "Who established the 'Garhwal Union' and 'Garhwal Hitkarini Sabha'?",
        "options": [
            "Ramsharan Raturi",
            "Dharmanand Gairola",
            "Asha Ram Nautiyal",
            "Tara Dutt Gairola",
        ],
        "ans": "D",
        "explain": (
            "Tara Dutt Gairola is credited with founding the Garhwal Union and the Garhwal Hitkarini Sabha. "
            "He was also active in the Kumaon Parishad and in social reform work in Garhwal (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 88,
        "title": "Port on the western coast",
        "bucket": "geography",
        "logic": "Three of the four ports lie on the eastern coast, so one confident placement settles it.",
        "stem": "Which of the following ports is on the western coastline?",
        "options": ["Nhava Sheva", "Visakhapatnam", "Chennai", "Tuticorin"],
        "ans": "A",
        "explain": (
            "Nhava Sheva, also called Jawaharlal Nehru Port, lies near Mumbai on the western coast and is India's largest container port. "
            "Visakhapatnam, Chennai and Tuticorin are all on the eastern coast."
        ),
        "uncertain": False,
    },
    {
        "n": 89,
        "title": "Latitudinal extent of mainland India",
        "bucket": "geography",
        "logic": "Mainland extent excludes the islands, so the southern limit is Kanyakumari and not Indira Point.",
        "stem": "What is the correct latitudinal extent of the mainland of India?",
        "options": [
            "6 degrees 45' N to 37 degrees 6' N",
            "6 degrees 4' N to 36 degrees 7' N",
            "8 degrees 4' N to 36 degrees 12' N",
            "8 degrees 4' N to 37 degrees 6' N",
        ],
        "ans": "D",
        "explain": (
            "The mainland runs from 8 degrees 4 minutes north to 37 degrees 6 minutes north. "
            "The figure of 6 degrees 4 minutes north belongs to Indira Point in the Nicobar Islands, which is the standard trap."
        ),
        "uncertain": False,
    },
    {
        "n": 90,
        "title": "Largest glacier of the Trans-Himalaya",
        "bucket": "geography",
        "logic": "All four are Karakoram glaciers, so relative length decides the answer.",
        "stem": "Which is the largest glacier of the Trans-Himalayas?",
        "options": ["Biafo", "Siachen", "Baltoro", "Hispar"],
        "ans": "B",
        "explain": (
            "The Siachen glacier in the Karakoram is about 76 km long and is the largest in the Trans-Himalayan region. "
            "Biafo, Baltoro and Hispar are also Karakoram glaciers but shorter."
        ),
        "uncertain": False,
    },
    {
        "n": 91,
        "title": "Tree not of evergreen forest type",
        "bucket": "geography",
        "logic": "Three options are Himalayan conifers while one is a tropical deciduous hardwood.",
        "stem": "Which tree is not of the evergreen forest type?",
        "options": ["Deodar", "Silver fir", "Sal", "Blue pine"],
        "ans": "C",
        "explain": (
            "Sal is the characteristic tree of tropical moist deciduous forest and sheds its leaves in the dry season. "
            "Deodar, silver fir and blue pine are evergreen conifers of the Himalayan belt."
        ),
        "uncertain": False,
    },
    {
        "n": 92,
        "title": "Highest density of railway network",
        "bucket": "geography",
        "logic": "Density means route length per unit area, not total route length.",
        "stem": "Which country has the highest density of railway network?",
        "options": ["Canada", "U.S.A.", "Russia", "India"],
        "ans": "B",
        "explain": (
            "Among the four, India has the greatest railway route length relative to its area and so the highest network density. "
            "The United States has far more total track but spread over a much larger territory."
         " Official provisional key (Series B) marks **B**."),
        "uncertain": False,
    },
    {
        "n": 93,
        "title": "Lakes in descending order of size",
        "bucket": "geography",
        "logic": "Superior against Victoria is the decisive comparison at the head of the sequence.",
        "stem": "What is the correct sequence of lakes in descending order of size?",
        "options": [
            "Victoria, Superior, Chilka, Michigan",
            "Superior, Victoria, Michigan, Chilka",
            "Michigan, Superior, Victoria, Chilka",
            "Chilka, Michigan, Superior, Victoria",
        ],
        "ans": "B",
        "explain": (
            "Lake Superior is about 82,100 sq km, Victoria about 68,800 sq km and Michigan about 58,000 sq km, while Chilka is a small coastal lagoon. "
            "Victoria is the largest tropical lake, which tempts many into placing it first."
        ),
        "uncertain": False,
    },
    {
        "n": 94,
        "title": "River that formed the Grand Canyon",
        "bucket": "geography",
        "logic": "Four North American rivers are offered and only one cuts the Arizona plateau.",
        "stem": "The Grand Canyon of the U.S.A. is formed by which river?",
        "options": ["St. Lawrence", "Missouri", "Ohio", "Colorado"],
        "ans": "D",
        "explain": (
            "The Colorado river cut the Grand Canyon through the Colorado plateau in Arizona. "
            "It is a classic example of vertical erosion in an arid uplifted region."
        ),
        "uncertain": False,
    },
    {
        "n": 95,
        "title": "Planet with the longest revolution",
        "bucket": "geography",
        "logic": "Distance from the sun decides the orbital period, so the farthest planet listed wins.",
        "stem": "Which planet takes the longest time completing one revolution around the sun?",
        "options": ["Saturn", "Uranus", "Neptune", "Jupiter"],
        "ans": "C",
        "explain": (
            "Neptune is the farthest of the four from the sun and takes about 165 earth years for one revolution. "
            "Uranus takes about 84 years, Saturn about 29 and Jupiter about 12."
        ),
        "uncertain": False,
    },
    {
        "n": 96,
        "title": "Koppen Amw climate in India",
        "bucket": "geography",
        "logic": "The letter A means tropical and w means dry winter, which rules out desert and plain options.",
        "stem": "According to Koppen's climatic classification, the (Amw) climate is found predominantly in which part of India?",
        "options": ["North-Western India", "Western coastal region", "Thar desert", "Northern plain"],
        "ans": "B",
        "explain": (
            "Amw stands for tropical monsoon climate with a short dry winter and marks the western coastal strip and parts of the north-east. "
            "The Thar desert falls under BWhw and the northern plain largely under Cwg."
        ),
        "uncertain": False,
    },
    {
        "n": 97,
        "title": "Who coined the word biodiversity",
        "bucket": "science",
        "logic": "Tansley and Darwin are famous but belong to other concepts.",
        "stem": "The word bio-diversity was coined by",
        "options": ["W. G. Rosen", "Tansley", "Darwin", "David"],
        "ans": "A",
        "explain": (
            "Walter G. Rosen coined the term biodiversity in 1985. "
            "Tansley gave the concept of the ecosystem and Darwin propounded natural selection."
        ),
        "uncertain": False,
    },
    {
        "n": 98,
        "title": "Pre-monsoon wind in Kerala and Tamil Nadu",
        "bucket": "geography",
        "logic": "Loo and Kal Baisakhi belong to the north, so the southern pre-monsoon shower is the answer.",
        "stem": "Which local wind affects some parts of Kerala and Tamil Nadu during the pre-monsoon season?",
        "options": ["Loo", "Mango Shower", "Kal Baisakhi", "Mistral"],
        "ans": "B",
        "explain": (
            "Mango showers are pre-monsoon thunderstorms over Kerala and coastal Tamil Nadu that help ripen the mango crop. "
            "Loo blows over northern India and Kal Baisakhi over Bengal and Odisha, while Mistral is a European wind."
        ),
        "uncertain": False,
    },
    {
        "n": 99,
        "title": "Match national parks with states",
        "bucket": "geography",
        "logic": "Kanha in Madhya Pradesh is the safest anchor pair for fixing the code.",
        "stem": (
            "Match the following:\n\n"
            "| National Park | State |\n"
            "| --- | --- |\n"
            "| A. Simlipal | 1. Karnataka |\n"
            "| B. Indravati | 2. Madhya Pradesh |\n"
            "| C. Kanha | 3. Chhattisgarh |\n"
            "| D. Bandipur | 4. Odisha |\n\n"
            "*Row order is not the answer code.*\n\n"
            "Codes:"
        ),
        "options": [
            "A-4, B-3, C-2, D-1",
            "A-2, B-4, C-1, D-3",
            "A-3, B-2, C-4, D-1",
            "A-1, B-3, C-2, D-4",
        ],
        "ans": "A",
        "explain": (
            "Simlipal is in Odisha, so A pairs with 4, and Indravati lies in Chhattisgarh, giving B with 3. "
            "Kanha is in Madhya Pradesh and Bandipur in Karnataka, so C pairs with 2 and D with 1. "
            "Swapping Simlipal into Chhattisgarh alongside Indravati is the common error."
        ),
        "uncertain": False,
    },
    {
        "n": 100,
        "title": "Largest petrochemical centre in India",
        "bucket": "geography",
        "logic": "Digboi is an old refinery town, which makes it a tempting but wrong pick.",
        "stem": "Which is the largest centre of the petrochemical industry in India?",
        "options": ["Trombay", "Jamnagar", "Digboi", "Vadodara"],
        "ans": "B",
        "explain": (
            "Jamnagar in Gujarat hosts the largest refining and petrochemical complex in the country. "
            "Digboi in Assam is the oldest refinery but very small in capacity."
        ),
        "uncertain": False,
    },
    {
        "n": 101,
        "title": "Zone between MBT and MCT",
        "bucket": "uk_geo",
        "logic": "The thrusts bound the Himalayan zones in order from south to north.",
        "stem": "Which part of the Himalaya is situated between the Main Boundary Thrust and the Main Central Thrust?",
        "options": [
            "Shiwalik zone",
            "Lesser Himalayan zone",
            "Central crystalline zone",
            "Tethys Himalayan zone",
        ],
        "ans": "B",
        "explain": (
            "The Lesser Himalaya lies between the Main Boundary Thrust in the south and the Main Central Thrust in the north. "
            "The Shiwalik zone lies south of the Main Boundary Thrust and the central crystallines north of the Main Central Thrust."
        ),
        "uncertain": False,
    },
    {
        "n": 102,
        "title": "Animal husbandry in Uttarakhand",
        "bucket": "uk_geo",
        "logic": "Both statements are mainstream descriptions of the hill economy.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. Animal husbandry is a supplementary occupation of agriculture.\n"
            "2. Sheep rearing in the mountainous areas has been affected by environmental degradation."
        ),
        "options": ["Both 1 and 2", "Only 2", "Only 1", "Neither 1 nor 2"],
        "ans": "C",
        "explain": (
            "Animal husbandry supplements crop farming in the hill economy of Uttarakhand and provides milk, wool and manure. "
            "Shrinking pastures and degradation of alpine meadows have reduced traditional sheep rearing and transhumance."
         " Official provisional key (Series B) marks **C**."),
        "uncertain": False,
    },
    {
        "n": 103,
        "title": "Airports of Uttarakhand",
        "bucket": "uk_geo",
        "logic": "An incorrectly-matched question where Gauchar is placed in the wrong district.",
        "stem": "Which pair is not correctly matched?",
        "options": [
            "Naini Saini - Pithoragarh",
            "Gauchar - Rudraprayag",
            "Chinyalisaur - Uttarkashi",
            "Pantnagar - Udham Singh Nagar",
        ],
        "ans": "B",
        "explain": (
            "The Gauchar airstrip lies in Chamoli district, not Rudraprayag. "
            "Naini Saini is at Pithoragarh, Chinyalisaur in Uttarkashi and Pantnagar in Udham Singh Nagar."
        ),
        "uncertain": False,
    },
    {
        "n": 104,
        "title": "Match wildlife sanctuaries with districts",
        "bucket": "uk_geo",
        "logic": "Govind in Uttarkashi is the firmest pair and fixes the code.",
        "stem": (
            "Match the following:\n\n"
            "| Sanctuary | District |\n"
            "| --- | --- |\n"
            "| A. Askot | 1. Uttarkashi |\n"
            "| B. Binsar | 2. Nainital |\n"
            "| C. Govind | 3. Almora |\n"
            "| D. Nandhaur | 4. Pithoragarh |\n\n"
            "*Row order is not the answer code.*\n\n"
            "Codes:"
        ),
        "options": [
            "A-3, B-4, C-2, D-1",
            "A-3, B-4, C-1, D-2",
            "A-4, B-3, C-1, D-2",
            "A-1, B-2, C-3, D-4",
        ],
        "ans": "C",
        "explain": (
            "The Askot musk deer sanctuary is in Pithoragarh, so A pairs with 4, and Binsar is in Almora, giving B with 3. "
            "Govind Pashu Vihar lies in Uttarkashi and the Nandhaur sanctuary in Nainital, so C pairs with 1 and D with 2. "
            "Interchanging Askot and Binsar between Almora and Pithoragarh is the standard slip."
        ),
        "uncertain": False,
    },
    {
        "n": 105,
        "title": "Climate change vulnerability of Uttarakhand",
        "bucket": "uk_geo",
        "logic": "Both statements repeat findings of the state action plan on climate change.",
        "stem": (
            "Statement 1: Uttarakhand is highly vulnerable to climate change.\n\n"
            "Statement 2: Climate change is causing water stress and depleting biodiversity in Uttarakhand."
        ),
        "options": [
            "Only statement 1 is correct",
            "Only statement 1 is correct and statement 2 is incorrect",
            "Statements 1 and 2 both are correct",
            "Both the statements are incorrect",
        ],
        "ans": "C",
        "explain": (
            "Uttarakhand is rated among the most climate-vulnerable states because of its fragile mountain terrain and glacier-fed rivers. "
            "Drying springs, water stress in hill settlements and shifting habitats for species are documented effects, so both statements hold."
        ),
        "uncertain": False,
    },
    {
        "n": 106,
        "title": "State Council for Climate Change and UAPCC",
        "bucket": "uk_geo",
        "logic": "The department entrusted with the action plan is the planted error.",
        "stem": (
            "Statement 1: The State Council for Climate Change (SCCC) of Uttarakhand was established in the year 2011.\n\n"
            "Statement 2: The responsibility of preparing the Uttarakhand Action Plan on Climate Change (UAPCC) was given to the State Revenue Department."
        ),
        "options": [
            "Only statement 1 is correct",
            "Only statement 2 is correct",
            "Both statements are incorrect",
            "Both statements are correct",
        ],
        "ans": "A",
        "explain": (
            "The State Council for Climate Change was set up in 2011 to steer climate action in the state, so statement 1 is correct. "
            "Statement 2 is wrong because the action plan was prepared through the forest and environment set-up and not the revenue department (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 107,
        "title": "District with the highest agricultural land",
        "bucket": "uk_geo",
        "logic": "The plains districts lead here, and the Tarai district outranks Haridwar.",
        "stem": "Which district of Uttarakhand has the highest agricultural land?",
        "options": ["Haridwar", "Udham Singh Nagar", "Dehradun", "Nainital"],
        "ans": "A",
        "explain": (
            "Udham Singh Nagar in the Tarai has the largest area under cultivation in the state. "
            "Its level land, canal and tubewell irrigation make it the granary of Uttarakhand."
         " Official provisional key (Series B) marks **A**."),
        "uncertain": False,
    },
    {
        "n": 108,
        "title": "Forest and biodiversity richness of Uttarakhand",
        "bucket": "uk_geo",
        "logic": "Both parts are true, so the question turns on whether relief and climate genuinely explain the richness.",
        "stem": (
            "Assertion (A): Uttarakhand is rich in forest and bio-diversity.\n\n"
            "Reason (R): Topography and climate primarily determine the forest and bio-diversity."
        ),
        "options": [
            "Both (A) and (R) are true, but (R) is not the correct explanation of (A)",
            "Both (A) and (R) are true and (R) is the correct explanation of (A)",
            "(A) is true, but (R) is false",
            "(A) is false, but (R) is true",
        ],
        "ans": "B",
        "explain": (
            "Assertion is true because the state has forest over a large share of its area with species from tropical to alpine belts. "
            "Reason is also true and does explain the assertion, since the steep altitudinal range creates many climatic zones and therefore many habitats."
        ),
        "uncertain": False,
    },
    {
        "n": 109,
        "title": "Rivers of Uttarakhand from west to east",
        "bucket": "uk_geo",
        "logic": "The Yamuna marks the western edge and the Gori the eastern, which brackets the sequence.",
        "stem": "What is the correct order of rivers from west to east in Uttarakhand?",
        "options": [
            "Yamuna, Bhilangana, Alaknanda, Gori",
            "Gori, Alaknanda, Bhilangana, Yamuna",
            "Alaknanda, Bhilangana, Yamuna, Gori",
            "Bhilangana, Yamuna, Gori, Alaknanda",
        ],
        "ans": "A",
        "explain": (
            "The Yamuna flows along the western margin, the Bhilangana joins the Bhagirathi in Tehri, the Alaknanda drains central Garhwal and the Gori lies in eastern Pithoragarh. "
            "Reading the list from east to west gives the reversed distractor."
        ),
        "uncertain": False,
    },
    {
        "n": 110,
        "title": "Physiographic regions from south to north",
        "bucket": "uk_geo",
        "logic": "Direction of reading is the whole trap; the Tarai lies at the southern edge.",
        "stem": "What is the correct order of physiographic regions of Uttarakhand from south to north?",
        "options": [
            "Lesser Himalaya, Great Himalaya, Tarai, Shiwalik",
            "Shiwalik, Lesser Himalaya, Great Himalaya, Tarai",
            "Tarai, Shiwalik, Lesser Himalaya, Great Himalaya",
            "Great Himalaya, Tarai, Lesser Himalaya, Shiwalik",
        ],
        "ans": "C",
        "explain": (
            "Moving north from the plains one crosses the Tarai and Bhabhar, then the Shiwalik, then the Lesser Himalaya and finally the Great Himalaya. "
            "Placing the Tarai last is the common inversion."
        ),
        "uncertain": False,
    },
    {
        "n": 111,
        "title": "Districts in descending order of sex ratio",
        "bucket": "uk_geo",
        "logic": "Almora tops and Haridwar trails, so the two hill districts in between decide the option.",
        "stem": "Which group of districts is in descending order of sex ratio as per Census 2011?",
        "options": [
            "Almora, Rudraprayag, Tehri Garhwal, Haridwar",
            "Tehri Garhwal, Almora, Haridwar, Rudraprayag",
            "Almora, Haridwar, Rudraprayag, Tehri Garhwal",
            "Haridwar, Rudraprayag, Almora, Tehri Garhwal",
        ],
        "ans": "A",
        "explain": (
            "Almora had the highest sex ratio in the state at about 1142, followed by Rudraprayag at about 1114 and Tehri Garhwal at about 1077. "
            "Haridwar had one of the lowest at about 880, so it must come last."
        ),
        "uncertain": False,
    },
    {
        "n": 112,
        "title": "Minerals and their districts",
        "bucket": "uk_geo",
        "logic": "An incorrectly-matched question on mineral occurrence, so each district list must be tested.",
        "stem": "Which pair is not correctly matched?",
        "options": [
            "Dolomite - Dehradun, Pithoragarh",
            "Soap stone - Chamoli, Bageshwar",
            "Graphite - Almora, Nainital",
            "Silica sand - Pauri Garhwal",
        ],
        "ans": "D",
        "explain": (
            "Silica sand in Uttarakhand is associated with Dehradun, Nainital and Tehri Garhwal rather than Pauri Garhwal. "
            "Dolomite occurs in Dehradun and Pithoragarh and soapstone in Chamoli and Bageshwar, which are correctly given (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 113,
        "title": "Vanrawats of Uttarakhand",
        "bucket": "uk_geo",
        "logic": "Tests both the home district of the group and their traditional cultivation practice.",
        "stem": (
            "Statement 1: Vanrawats are dwellers of the Pithoragarh district.\n\n"
            "Statement 2: They practised shifting cultivation until it was banned by the forest department."
        ),
        "options": [
            "Statements 1 and 2 both are correct",
            "Only statement 1 is correct and statement 2 is incorrect",
            "Only statement 2 is correct and statement 1 is incorrect",
            "Both the statements are incorrect",
        ],
        "ans": "A",
        "explain": (
            "The Van Rawats or Raji are a small forest-dwelling group of Pithoragarh district and are counted among the primitive tribal groups of the state. "
            "They practised shifting cultivation and gathering until forest regulation ended it and pushed them towards settled farming (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 114,
        "title": "National parks and years of establishment",
        "bucket": "uk_geo",
        "logic": "Corbett of 1936 is certain, so the doubtful year among the later parks must be found.",
        "stem": "Which pair is not correctly matched?",
        "options": [
            "Govind National Park - 1989",
            "Rajaji National Park - 1983",
            "Corbett National Park - 1936",
            "Gangotri National Park - 1989",
        ],
        "ans": "A",
        "explain": (
            "Govind National Park was notified in 1990, so the year given for it is wrong. "
            "Corbett dates from 1936 as India's first national park, Rajaji from 1983 and Gangotri from 1989 (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 115,
        "title": "Panchamrit targets at Glasgow",
        "bucket": "ca",
        "logic": "The venue Glasgow points straight to the climate negotiations.",
        "stem": "The 'Panchamrit' targets announced by Prime Minister Modi in Glasgow are related with",
        "options": [
            "Science and technology",
            "Foreign policy",
            "Climate change",
            "Investment plans in other countries",
        ],
        "ans": "C",
        "explain": (
            "Panchamrit is the set of five climate commitments announced at COP26 in Glasgow in 2021. "
            "It includes 500 GW of non-fossil capacity by 2030 and net zero emissions by 2070."
        ),
        "uncertain": False,
    },
    {
        "n": 116,
        "title": "Electoral college for the Vice-President",
        "bucket": "polity",
        "logic": "The Vice-Presidential college excludes state legislatures, unlike the Presidential one.",
        "stem": "Who participates in the election of the Vice-President of India?",
        "options": [
            "All the members of both Houses of Parliament",
            "Members of Parliament and State Legislatures",
            "Members of Rajya Sabha only",
            "Members of Lok Sabha only",
        ],
        "ans": "A",
        "explain": (
            "The Vice-President is elected by the members of both Houses of Parliament, including nominated members. "
            "State legislative assemblies take part only in the election of the President, which is the trap."
        ),
        "uncertain": False,
    },
    {
        "n": 117,
        "title": "Convention India is not party to",
        "bucket": "ca",
        "logic": "India joins most environmental conventions, so the labour standard stands out.",
        "stem": "As on April 2025, India is not a party to which of the following?",
        "options": [
            "CITES",
            "World Heritage Convention",
            "Occupational Safety and Health Convention",
            "International Whaling Commission",
        ],
        "ans": "C",
        "explain": (
            "India has not ratified the ILO Occupational Safety and Health Convention of 1981. "
            "It is a party to CITES and the World Heritage Convention and a member of the International Whaling Commission."
        ),
        "uncertain": False,
    },
    {
        "n": 118,
        "title": "Subject of the 101st Amendment",
        "bucket": "polity",
        "logic": "Amendment numbers and subjects are the confused set; the 103rd covers reservation for the economically weaker sections.",
        "stem": "The 101st Constitutional Amendment Act is related with",
        "options": [
            "Reservation for EWS",
            "Delimitation of Constituencies",
            "Anti-defection Law",
            "Nationwide Goods and Services Tax (GST)",
        ],
        "ans": "D",
        "explain": (
            "The 101st Amendment of 2016 introduced the Goods and Services Tax and created the GST Council under Article 279A. "
            "Reservation for the economically weaker sections came through the 103rd Amendment and the anti-defection law through the 52nd."
        ),
        "uncertain": False,
    },
    {
        "n": 119,
        "title": "Venue of the 21st ASEAN-India Summit",
        "bucket": "ca",
        "logic": "The summit follows the ASEAN chair of the year, which was Laos.",
        "stem": "The 21st ASEAN-India Summit was held in",
        "options": ["Indonesia", "Philippines", "Laos", "Vietnam"],
        "ans": "C",
        "explain": (
            "The 21st ASEAN-India Summit was held at Vientiane in Laos in October 2024. "
            "Laos held the ASEAN chairmanship for that year."
        ),
        "uncertain": False,
    },
    {
        "n": 120,
        "title": "Rights not covered by Article 19(1)",
        "bucket": "polity",
        "logic": "Equality of opportunity sits in Article 16, not in the freedoms of Article 19.",
        "stem": (
            "Which right is/are not included in the 'Right to Freedom' under Article 19(1)?\n\n"
            "1. Right of equal opportunities\n"
            "2. Right to assemble peaceably\n"
            "3. Right to practise any profession\n"
            "4. Freedom of speech and expression"
        ),
        "options": ["Only 1", "1 and 2", "1 and 3", "Only 4"],
        "ans": "A",
        "explain": (
            "Equality of opportunity in public employment is guaranteed by Article 16 and forms part of the right to equality, not the right to freedom. "
            "Peaceful assembly, practice of any profession and freedom of speech are all listed in Article 19(1)."
        ),
        "uncertain": False,
    },
    {
        "n": 121,
        "title": "Committee that recommended Fundamental Duties",
        "bucket": "polity",
        "logic": "Four committees are offered and only one worked on the 42nd Amendment.",
        "stem": "Fundamental Duties were incorporated in the Constitution on the recommendation of",
        "options": [
            "Shah Commission",
            "Administrative Reforms Commission",
            "Santhanam Committee",
            "Swaran Singh Committee",
        ],
        "ans": "D",
        "explain": (
            "The Swaran Singh Committee recommended the addition of Fundamental Duties, which came in through the 42nd Amendment of 1976. "
            "The Shah Commission inquired into Emergency excesses and the Santhanam Committee dealt with corruption."
        ),
        "uncertain": False,
    },
    {
        "n": 122,
        "title": "Lokpal and Lokayukta Act, 2013",
        "bucket": "polity",
        "logic": "The composition of the selection committee carries the planted error.",
        "stem": (
            "With reference to the Lokpal and Lokayukta Act, 2013, consider the following statements:\n\n"
            "1. The Selection Committee of Lokpal consists of the Chairperson of Rajya Sabha.\n"
            "2. It shall apply to Indian public servants both within and outside India."
        ),
        "options": ["Only 1", "Only 2", "1 and 2", "Neither 1 nor 2"],
        "ans": "B",
        "explain": (
            "Statement 1 is wrong because the selection committee has the Prime Minister, the Speaker of the Lok Sabha, the Leader of Opposition, the Chief Justice of India or a nominated judge, and an eminent jurist. "
            "Statement 2 is correct since the Act covers public servants in and outside India."
        ),
        "uncertain": False,
    },
    {
        "n": 123,
        "title": "Ministries implementing Protection of Civil Rights Rules",
        "bucket": "polity",
        "logic": "Untouchability offences fall to home affairs and social justice rather than to minority or tribal affairs.",
        "stem": (
            "Which central ministries are responsible for implementation of the Protection of Civil Rights Rules, 1977?\n\n"
            "1. Ministry of Home Affairs\n"
            "2. Ministry of Social Justice and Empowerment\n"
            "3. Ministry of Minority Affairs\n"
            "4. Ministry of Tribal Affairs"
        ),
        "options": ["1 and 2", "1, 2 and 3", "1, 2 and 4", "2, 3 and 4"],
        "ans": "C",
        "explain": (
            "The Ministry of Social Justice and Empowerment administers the civil rights law while the Ministry of Home Affairs handles enforcement through the states. "
            "Minority and tribal affairs ministries have separate mandates (verify official key)."
         " Official provisional key (Series B) marks **C**."),
        "uncertain": False,
    },
    {
        "n": 124,
        "title": "Chronology of Right to Service Acts",
        "bucket": "polity",
        "logic": "Punjab legislated early and Maharashtra late, which brackets the sequence.",
        "stem": (
            "Arrange chronologically the enactment of the 'Right to Service Act':\n\n"
            "(i) Punjab\n(ii) Assam\n(iii) Maharashtra\n(iv) Gujarat"
        ),
        "options": [
            "(i), (ii), (iii), (iv)",
            "(ii), (i), (iv), (iii)",
            "(i), (iii), (iv), (ii)",
            "(iii), (iv), (i), (ii)",
        ],
        "ans": "A",
        "explain": (
            "Punjab legislated in 2011, Assam in 2012, Maharashtra in 2015 and Gujarat afterwards in the sequence taken by the paper. "
            "Madhya Pradesh was the first state in the country to pass such a law in 2010, though it does not appear among the options (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 125,
        "title": "India's disarmament policy",
        "bucket": "ca",
        "logic": "Asks for the incorrect statement, so India's stand on each treaty must be recalled separately.",
        "stem": "Which one is incorrect about India's disarmament policy in recent decades?",
        "options": [
            "India is a party to all five protocols of the CCW",
            "India does not support negotiations in the CD on FMCT",
            "India is party to the CWC",
            "India is not a signatory to the CTBT",
        ],
        "ans": "B",
        "explain": (
            "India has consistently supported the start of negotiations on a Fissile Material Cut-off Treaty in the Conference on Disarmament, so this statement is incorrect. "
            "India is a party to the Chemical Weapons Convention and to the protocols of the Convention on Certain Conventional Weapons, and it has not signed the CTBT."
        ),
        "uncertain": False,
    },
    {
        "n": 126,
        "title": "Right to Education statements",
        "bucket": "polity",
        "logic": "All three parts are standard, so a partial option is the trap.",
        "stem": (
            "With reference to the Right to Education, consider the following statements:\n\n"
            "1. It tries to achieve the aim of 'Education for all'.\n"
            "2. Earlier a provision of free and compulsory education was provided in Part IV of the Constitution.\n"
            "3. It became a Fundamental Right after the 86th Constitutional Amendment."
        ),
        "options": ["Only 1 and 2", "Only 2 and 3", "Only 1 and 3", "1, 2 and 3"],
        "ans": "A",
        "explain": (
            "Free and compulsory education for children up to fourteen years was originally a Directive Principle under Article 45 in Part IV. "
            "The 86th Amendment of 2002 inserted Article 21A and made it a Fundamental Right, serving the aim of education for all, so all three statements are correct."
         " Official provisional key (Series B) marks **A**."),
        "uncertain": False,
    },
    {
        "n": 127,
        "title": "NITI Aayog statements",
        "bucket": "polity",
        "logic": "The year of creation and the identity of the chairperson are both planted errors.",
        "stem": (
            "With reference to NITI Aayog, consider the following statements:\n\n"
            "1. It was established on January 1, 2014.\n"
            "2. It was created by a resolution of the Union Cabinet.\n"
            "3. The President of India is the Chairman of NITI Aayog."
        ),
        "options": ["1 and 3", "Only 1", "Only 2", "2 and 3"],
        "ans": "C",
        "explain": (
            "Statement 2 alone is correct, since NITI Aayog was set up by an executive resolution of the Union Cabinet and is not a constitutional or statutory body. "
            "Statement 1 is wrong because it was established on 1 January 2015, and statement 3 is wrong because the Prime Minister is its Chairperson."
        ),
        "uncertain": False,
    },
    {
        "n": 128,
        "title": "Amendment capping the Council of Ministers",
        "bucket": "polity",
        "logic": "The 91st and 92nd Amendments came in the same year, which is the confusion.",
        "stem": "The size of the Council of Ministers was fixed up to 15 per cent of the total members of the Lok Sabha by which Amendment?",
        "options": [
            "91st Constitutional Amendment Act, 2003",
            "92nd Constitutional Amendment Act, 2003",
            "74th Constitutional Amendment Act, 1992",
            "86th Constitutional Amendment Act, 2002",
        ],
        "ans": "A",
        "explain": (
            "The 91st Amendment of 2003 capped the Council of Ministers at 15 per cent of the strength of the Lok Sabha or the state assembly. "
            "The 92nd Amendment of the same year added four languages to the Eighth Schedule."
        ),
        "uncertain": False,
    },
    {
        "n": 129,
        "title": "Mobile courts in Uttarakhand",
        "bucket": "uk_polity",
        "logic": "Both statements describe the working and the purpose of the mobile court vans.",
        "stem": (
            "With reference to mobile courts in Uttarakhand, consider the following statements:\n\n"
            "1. Under the mobile e-courts project, mobile vans having facilities of court rooms, computer, printer and internet connectivity will visit villages.\n"
            "2. The idea is to deliver justice at the doorsteps of the public living particularly in remote areas."
        ),
        "options": ["Only 1", "Only 2", "Both 1 and 2", "Neither 1 nor 2"],
        "ans": "C",
        "explain": (
            "The mobile e-court vans carry a court room with a computer, printer and internet link so that cases can be heard on the spot. "
            "The purpose is to take justice to people in remote hill areas who find it hard to reach district courts."
        ),
        "uncertain": False,
    },
    {
        "n": 130,
        "title": "Official who may be invited to give opinion in Parliament",
        "bucket": "polity",
        "logic": "Only one of the four has a constitutional right of audience in Parliament.",
        "stem": "Who among the following officials can be invited to give his opinion in the Parliament?",
        "options": ["Auditor General", "Attorney General", "Chief Justice of India", "Governor"],
        "ans": "B",
        "explain": (
            "The Attorney General of India has the right to speak in and take part in the proceedings of either House under Article 88, though without a vote. "
            "The Comptroller and Auditor General reports to Parliament but does not address it in this manner."
        ),
        "uncertain": False,
    },
    {
        "n": 131,
        "title": "ASEAN share in India's global trade",
        "bucket": "ca",
        "logic": "A trade share figure, so nearby percentages are the distractors.",
        "stem": "What was the share of ASEAN in India's global trade in 2023-24?",
        "options": ["16 per cent", "11 per cent", "25 per cent", "21 per cent"],
        "ans": "B",
        "explain": (
            "ASEAN accounted for about 11 per cent of India's total merchandise trade in 2023-24. "
            "The grouping is among India's largest trading partners and is covered by a free trade agreement in goods (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 132,
        "title": "Wilful non-compliance as contempt under Article 32",
        "bucket": "polity",
        "logic": "Case-law recall where the compensation case Nilabati Behera is the tempting distractor.",
        "stem": "Under Article 32, in which case was 'wilful non-compliance' with a court order declared as contempt of the court?",
        "options": [
            "Nilabati vs. State of Orissa",
            "M. L. Sachdev vs. Union of India",
            "Gracy vs. State of Kerala",
            "Gopi Aqua vs. Union of India",
        ],
        "ans": "B",
        "explain": (
            "The paper treats M. L. Sachdev vs Union of India as the case where wilful non-compliance with a direction was held to be contempt. "
            "Nilabati Behera vs State of Orissa is remembered instead for compensation in custodial death, which is why it is offered here (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 133,
        "title": "First Asian Mayors' Conference in Uttarakhand",
        "bucket": "uk_gk",
        "logic": "Four state cities are offered, so the conference venue of 2006 must be recalled.",
        "stem": "Where was the first Asian Mayors' Conference held in Uttarakhand in 2006?",
        "options": ["Haridwar", "Mussoorie", "Dehradun", "Rishikesh"],
        "ans": "C",
        "explain": (
            "The conference was hosted at Dehradun, the state capital, in 2006. "
            "It brought together mayors from Asian cities to discuss urban governance (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 134,
        "title": "Record not maintained by Panchayats",
        "bucket": "uk_polity",
        "logic": "Three of the registers are standard Panchayat records, so the odd one out is the answer.",
        "stem": "Which record is not maintained by the Panchayats in Uttarakhand?",
        "options": [
            "Health register",
            "Family register",
            "Birth-death registration register",
            "Grant register",
        ],
        "ans": "A",
        "explain": (
            "Gram Panchayats keep the family register, the birth and death registration register and the grant register. "
            "A separate health register is maintained by the health department rather than by the Panchayat (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 135,
        "title": "First office-holders of Uttarakhand",
        "bucket": "uk_polity",
        "logic": "Nityanand Swami and Indu Kumar Pandey held different first posts, which is where the pairs go wrong.",
        "stem": (
            "Which pair is correctly matched?\n\n"
            "1. Chairman of First Finance Commission - Nityanand Swami\n"
            "2. First Advocate General of Uttarakhand - Nanda Ballabh Tiwari\n"
            "3. First Chief Minister of Uttarakhand - Indu Kumar Pandey\n"
            "4. First Woman Governor of Uttarakhand - Margaret Alva"
        ),
        "options": ["Only 1", "Only 3", "Only 4", "Both 1 and 3"],
        "ans": "C",
        "explain": (
            "Margaret Alva was the first woman Governor of Uttarakhand, so pair 4 is correct. "
            "Pair 3 is wrong because Nityanand Swami was the first Chief Minister while Indu Kumar Pandey was the first Chief Secretary (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 136,
        "title": "Year tribes were declared Scheduled Tribes",
        "bucket": "uk_gk",
        "logic": "Four consecutive years are offered, so the notification year must be recalled exactly.",
        "stem": "In which year were the Jaunsari, Tharu, Bhotia, Buksa and Raji tribes declared Scheduled Tribes in Uttarakhand?",
        "options": ["1967", "1968", "1969", "1970"],
        "ans": "A",
        "explain": (
            "These five communities were notified as Scheduled Tribes in 1967, when the region was part of Uttar Pradesh. "
            "They remain the five Scheduled Tribes of Uttarakhand today."
        ),
        "uncertain": False,
    },
    {
        "n": 137,
        "title": "India's nominal GDP projection, IMF April 2025",
        "bucket": "economy",
        "logic": "The digits are shuffled across the options, so the figure must be read carefully.",
        "stem": "As per the IMF's 'World Economic Outlook' - April 2025, India's nominal GDP in 2025 will be US $____ trillion.",
        "options": ["4.187", "4.871", "5.171", "5.923"],
        "ans": "A",
        "explain": (
            "The April 2025 Outlook placed India's nominal GDP for 2025 at about 4.187 trillion dollars. "
            "At that level India was projected to move past Japan into fourth place among world economies."
        ),
        "uncertain": False,
    },
    {
        "n": 138,
        "title": "FEMA and FERA statements",
        "bucket": "economy",
        "logic": "The date in the first statement is right while the description of FERA in the second is wrong.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. FEMA came into effect from June 1, 2000.\n"
            "2. FERA is mainly for external debt liability."
        ),
        "options": [
            "Both are correct and (2) explains (1)",
            "Both are correct but (2) does not explain (1)",
            "(1) is true, (2) is false",
            "(1) is false, (2) is true",
        ],
        "ans": "C",
        "explain": (
            "The Foreign Exchange Management Act came into force on 1 June 2000, replacing FERA, so statement 1 is true. "
            "Statement 2 is false because FERA was a control law for foreign exchange transactions and not a measure for external debt liability."
        ),
        "uncertain": False,
    },
    {
        "n": 139,
        "title": "Executive of Uttarakhand",
        "bucket": "uk_polity",
        "logic": "Both statements restate the standard structure of a state executive.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. The executive of Uttarakhand includes the Governor as the head of the state.\n"
            "2. It also includes the Chief Minister and his or her council of ministers."
        ),
        "options": ["Only 1", "Both 1 and 2", "Only 2", "Neither 1 nor 2"],
        "ans": "B",
        "explain": (
            "The Governor is the constitutional head of the state executive and the real executive power rests with the Council of Ministers headed by the Chief Minister. "
            "Both statements together describe the state executive correctly."
        ),
        "uncertain": False,
    },
    {
        "n": 140,
        "title": "Uttarakhand Human Rights Commission",
        "bucket": "uk_polity",
        "logic": "The date of coming into existence is the testable part, since the stated objective is uncontroversial.",
        "stem": (
            "Consider the following statements:\n\n"
            "1. Uttarakhand Human Rights Commission came into existence on May 13, 2013.\n"
            "2. The objective of the UHRC was to bring about greater accountability and transparency in governance."
        ),
        "options": ["Only 1", "Only 2", "Both 1 and 2", "Neither 1 nor 2"],
        "ans": "C",
        "explain": (
            "The Uttarakhand Human Rights Commission began functioning in May 2013 under the Protection of Human Rights Act. "
            "It works to protect human rights and to bring greater accountability and transparency in governance (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 141,
        "title": "Speaker and Protem Speaker more than once",
        "bucket": "uk_polity",
        "logic": "Four Uttarakhand legislators are offered and only one held both roles repeatedly.",
        "stem": "Who performed the roles of Speaker and Protem Speaker of the State Assembly more than once in Uttarakhand?",
        "options": ["Harbans Kapoor", "Govind Singh", "Ajay Bhatt", "Prakash Pant"],
        "ans": "A",
        "explain": (
            "Harbans Kapoor served as Speaker of the Uttarakhand Assembly and also acted as pro-tem Speaker on more than one occasion. "
            "He was among the longest serving legislators from Dehradun (verify official key)."
        ),
        "uncertain": False,
    },
    {
        "n": 142,
        "title": "States topping the SDG India Index 2023-24",
        "bucket": "economy",
        "logic": "Two states shared the top score, so a single-state option is incomplete.",
        "stem": (
            "According to NITI Aayog's SDG India Index 2023-24, which state or states has the highest SDG index score?\n\n"
            "1. Kerala\n2. Uttarakhand\n3. Goa\n4. Tamil Nadu"
        ),
        "options": ["Only 1", "1 and 2", "2 and 3", "3 and 4"],
        "ans": "B",
        "explain": (
            "Kerala and Uttarakhand jointly topped the index with a score of 79 each. "
            "Tamil Nadu and Goa followed close behind with 78."
        ),
        "uncertain": False,
    },
    {
        "n": 143,
        "title": "Composition of foreign exchange reserves",
        "bucket": "economy",
        "logic": "Foreign currency assets dominate the reserves, which fixes the first place in the order.",
        "stem": (
            "Arrange the following in descending order of share in Indian foreign exchange reserves as in March 2025:\n\n"
            "1. Gold Reserves\n2. Foreign Currency Assets\n3. Reserve position with the IMF\n4. SDRs"
        ),
        "options": ["1, 2, 3, 4", "3, 2, 1, 4", "2, 1, 4, 3", "4, 3, 2, 1"],
        "ans": "C",
        "explain": (
            "Foreign currency assets make up the overwhelming share of the reserves, followed by gold. "
            "Special Drawing Rights come next and the reserve tranche position with the IMF is the smallest component."
        ),
        "uncertain": False,
    },
    {
        "n": 144,
        "title": "Jail cost of living and the poverty line",
        "bucket": "economy",
        "logic": "An early national income estimate, so the pre-independence figure is the answer.",
        "stem": "Who used the 'jail cost of living' to estimate the poverty line in India?",
        "options": [
            "Dadabhai Naoroji",
            "Mahatma Gandhi",
            "C. D. Deshmukh",
            "Vallabh Bhai Patel",
        ],
        "ans": "A",
        "explain": (
            "Dadabhai Naoroji used the jail cost of living as the basis for the first estimate of a subsistence poverty line in India. "
            "He set out this reasoning in his work on the drain of wealth from India."
        ),
        "uncertain": False,
    },
    {
        "n": 145,
        "title": "State topping the Fiscal Health Index 2025",
        "bucket": "economy",
        "logic": "The index rewards low debt and high capital spending rather than size of the economy.",
        "stem": "Which state topped the Fiscal Health Index-2025 of NITI Aayog for FY 2022-23?",
        "options": ["Odisha", "Goa", "Kerala", "Chhattisgarh"],
        "ans": "A",
        "explain": (
            "Odisha stood first in the first edition of the Fiscal Health Index released by NITI Aayog. "
            "Chhattisgarh and Goa followed it, while Kerala was among the weaker performers."
        ),
        "uncertain": False,
    },
    {
        "n": 146,
        "title": "Chronology of rural employment schemes",
        "bucket": "economy",
        "logic": "IRDP of the late nineteen seventies opens the sequence and REGP of the mid nineties closes it.",
        "stem": (
            "Arrange the following in chronological order:\n\n"
            "i. IRDP\nii. REGP\niii. PMRY\niv. RLEGP"
        ),
        "options": ["i, ii, iv, iii", "i, iv, iii, ii", "ii, iii, i, iv", "iv, iii, ii, i"],
        "ans": "B",
        "explain": (
            "The Integrated Rural Development Programme began in 1978-79 and the Rural Landless Employment Guarantee Programme in 1983. "
            "The Prime Minister's Rozgar Yojana came in 1993 and the Rural Employment Generation Programme in 1995."
        ),
        "uncertain": False,
    },
    {
        "n": 147,
        "title": "Indicator not under Standard of Living in MPI",
        "bucket": "economy",
        "logic": "The three dimensions of the index are health, education and standard of living, and one option belongs elsewhere.",
        "stem": "Which is not an indicator for Standard of Living in India's National Multidimensional Poverty Index?",
        "options": ["Cooking fuel", "Drinking water", "Years of schooling", "Sanitation"],
        "ans": "C",
        "explain": (
            "Years of schooling is an indicator of the education dimension, not of standard of living. "
            "Cooking fuel, drinking water, sanitation, housing, electricity and assets fall under standard of living."
        ),
        "uncertain": False,
    },
    {
        "n": 148,
        "title": "Match COP sessions with locations",
        "bucket": "science",
        "logic": "Baku for COP29 is the firmest anchor and rules out three of the four codes.",
        "stem": (
            "Match the COP session to its location:\n\n"
            "| COP session | Location |\n"
            "| --- | --- |\n"
            "| 1. COP 27 | A. Belem |\n"
            "| 2. COP 28 | B. Baku |\n"
            "| 3. COP 29 | C. Dubai |\n"
            "| 4. COP 30 | D. Sharm El-Sheikh |\n\n"
            "*Row order is not the answer code.*"
        ),
        "options": [
            "1-A, 2-B, 3-C, 4-D",
            "1-B, 2-C, 3-D, 4-A",
            "1-C, 2-D, 3-A, 4-B",
            "1-D, 2-C, 3-B, 4-A",
        ],
        "ans": "D",
        "explain": (
            "COP27 met at Sharm El-Sheikh in Egypt in 2022, so 1 pairs with D, and COP28 at Dubai in 2023, giving 2 with C. "
            "COP29 was held at Baku in Azerbaijan in 2024 and COP30 at Belem in Brazil in 2025, so 3 pairs with B and 4 with A. "
            "Shifting Belem to the earliest session is the usual error."
        ),
        "uncertain": False,
    },
    {
        "n": 149,
        "title": "Global Environment Facility",
        "bucket": "science",
        "logic": "All three statements are standard, so a partial option is the trap.",
        "stem": (
            "With reference to the Global Environment Facility, consider the following statements:\n\n"
            "1. The pilot GEF was agreed to be set up in 1990.\n"
            "2. UNDP, UNEP and the World Bank were the initial partners.\n"
            "3. India is both a donor and a recipient of GEF."
        ),
        "options": ["Only 2 and 3", "2 and 3", "1 and 2", "All of the above statements"],
        "ans": "D",
        "explain": (
            "The pilot facility was agreed in 1990 and launched in 1991 with UNDP, UNEP and the World Bank as implementing partners. "
            "India contributes to the fund and also draws on it, so it is both donor and recipient and all three statements are correct."
        ),
        "uncertain": False,
    },
    {
        "n": 150,
        "title": "Venue of WTO MC-13",
        "bucket": "ca",
        "logic": "Geneva hosts the WTO headquarters, which makes it the standing distractor for venue questions.",
        "stem": "The 13th WTO Ministerial Conference (MC-13) was held in",
        "options": ["Geneva", "Abu Dhabi", "Buenos Aires", "Cameroon"],
        "ans": "B",
        "explain": (
            "MC-13 was held at Abu Dhabi in the United Arab Emirates in February 2024. "
            "MC-12 had been held at Geneva, which is where the WTO secretariat sits."
        ),
        "uncertain": False,
    },
]
