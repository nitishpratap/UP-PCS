/**
 * UP-PCS / UKPCS Study Tracker & Interactive In-Chapter Test Engine
 * Connects MkDocs Material notes to MongoDB Atlas + LocalStorage Fallback.
 * Features:
 * 1. Read Counter with 1-Click "+1 Mark Read" button on each chapter note.
 * 2. In-Chapter Practice Test Engine:
 *    - Extracts PYQs and Practice Zone MCQs directly from the chapter notes.
 *    - Interactive Quiz UI (Exam mode with 1/3 negative marking or Practice mode with instant logic).
 *    - Wrong areas & focus traps review.
 * 3. In-Chapter Past Test Scores History & Progress Curve.
 * 4. Central Dashboard & Chapter Priority Tracker Integration.
 */
(() => {
  // Live Render production server URL
  const PROD_API_URL = 'https://up-pcs.onrender.com/api';

  function resolveApiBase() {
    try {
      const custom = localStorage.getItem('uppcs_api_base');
      if (custom) return custom;
      if (typeof window !== 'undefined' && window.location) {
        const hostname = window.location.hostname;
        // If on GitHub Pages and PROD_API_URL is configured
        if (hostname.endsWith('github.io') && PROD_API_URL) {
          return PROD_API_URL;
        }
        // If running directly on port 5000 (local dev)
        if (window.location.port === '5000') {
          return `${window.location.protocol}//${window.location.host}/api`;
        }
        // Only if accessed via private Wi-Fi / LAN IP (e.g. 192.168.x.x)
        const isLan = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname);
        if (isLan) {
          return `http://${hostname}:5000/api`;
        }
        // If PROD_API_URL is set, use it on any other domain
        if (PROD_API_URL) {
          return PROD_API_URL;
        }
      }
    } catch {}
    return 'http://localhost:5000/api';
  }
  const API_BASE = resolveApiBase();
  const LOCAL_STORAGE_KEY = 'uppcs_study_logs_v1';
  const LOCAL_TESTS_KEY = 'uppcs_chapter_tests_v1';
  const AUTH_STORAGE_KEY = 'uppcs_vault_auth_token_v1';
  const LOCAL_PLANNER_KEY = 'uppcs_daily_planner_v1';

  // -------------------------------------------------------------
  // CHAPTER PRIORITY TRACKER & TARGET ACCURACY SYSTEM
  // Synced from /chapter-tracker/#chapter-priority-tracker
  // Highly Important -> 100% Target | Medium -> 90% Target | Least -> 80% Target
  // -------------------------------------------------------------
  const HIGH_PRIORITY_CHAPTERS = new Set([
    "ancient history:::04_Religious_Movements",
    "ancient history:::07_Mauryan_Empire",
    "ancient history:::02_Indus_Valley_Civilization",
    "ancient history:::03_Vedic_Civilization",
    "ancient history:::08_Post_Mauryan_India",
    "ancient history:::13_Archaeology",
    "ancient history:::uttarakhand/03_Kuninda_and_Yaudheya",
    "ancient history:::uttarakhand/04_Kartikepur_Dynasty",
    "medieval india:::02_Turkish_Invasions_Delhi_Sultanate",
    "medieval india:::12_Later_Medieval_India",
    "medieval india:::04_Bhakti_Sufi_Movements",
    "medieval india:::03_Regional_Kingdoms",
    "medieval india:::07_Mughal_Empire",
    "medieval india:::05_Medieval_Literature",
    "medieval india:::08_Sher_Shah_Suri",
    "medieval india:::uttarakhand/02_Parmar_Dynasty_of_Garhwal",
    "mordern india:::10_Books_and_Authors",
    "mordern india:::02_East_India_Company_Expansion",
    "mordern india:::03_Governors_General_and_Viceroys",
    "mordern india:::15_Post_Independence_India",
    "mordern india:::13_Gandhian_Era",
    "mordern india:::08_Peasant_Tribal_Labour_Movements",
    "mordern india:::14_Final_Phase_of_Freedom_Struggle",
    "mordern india:::11_Swadeshi_and_Revolutionary_Movement",
    "mordern india:::05_Revolt_of_1857",
    "mordern india:::09_Rise_of_Nationalism",
    "mordern india:::uttarakhand/04_Freedom_Movement_in_Uttarakhand",
    "mordern india:::uttarakhand/01_Gorkha_Invasion_and_Rule",
    "mordern india:::01_Gorkha_Invasion_and_Rule",
    "mordern india:::uttarakhand/02_British_Rule_in_Uttarakhand",
    "art and culture:::03_Indian_Architecture",
    "art and culture:::08_Indian_Languages_and_Literature",
    "art and culture:::11_Medieval_Indian_Cultural_History",
    "art and culture:::02_Religious_and_Philosophical_Traditions",
    "art and culture:::10_Ancient_Indian_History_Related_to_Culture",
    "art and culture:::15_Archaeology",
    "art and culture:::05_Indian_Music",
    "art and culture:::uttarakhand/03_Heritage_and_Cultural_Institutes",
    "art and culture:::uttarakhand/02_Dances_Music_and_Fairs",
    "geography:::23_Political_Map_Geography",
    "geography:::04_Lakes_Waterfalls_Water_Resources",
    "geography:::18_World_Landforms",
    "geography:::14_Earth_and_Universe",
    "geography:::16_Oceans",
    "geography:::07_Natural_Vegetation_Biodiversity",
    "geography:::08_Minerals_Energy_Industry",
    "geography:::21_World_Minerals_Energy",
    "geography:::17_World_Rivers_and_Lakes",
    "geography:::03_Drainage_System",
    "geography:::02_Climate_of_India",
    "geography:::01_Indian_Physical_Geography_Mountains_Hills",
    "geography:::19_World_Regional_Geography",
    "geography:::uttarakhand/07_Transport_Tourism_Natural_Hazards",
    "geography:::uttarakhand/03_Vegetation_and_Wildlife",
    "geography:::03_Vegetation_and_Wildlife",
    "environments & ecology:::01_Environment_Basics",
    "environments & ecology:::02_Ecology_and_Ecosystem",
    "environments & ecology:::22_Renewable_Energy",
    "environments & ecology:::38_Pollution_Advanced",
    "environments & ecology:::06_Protected_Areas_and_Conservation",
    "environments & ecology:::32_National_Parks_and_Protected_Areas_Advanced",
    "environments & ecology:::36_Ozone_Layer",
    "environments & ecology:::37_Greenhouse_Gases",
    "environments & ecology:::18_International_Environmental_Agreements_and_Conferences",
    "environments & ecology:::21_Species_and_Ecology",
    "environments & ecology:::04_Biodiversity",
    "environments & ecology:::15_Sustainable_Development_and_Environmental_Governance",
    "environments & ecology:::25_Global_Environmental_Geography",
    "environments & ecology:::27_Renewable_and_Non_Renewable_Energy",
    "environments & ecology:::08_Forests_and_Forest_Management",
    "environments & ecology:::09_Pollution_and_Waste_Management",
    "environments & ecology:::34_Climate_Change_Advanced",
    "environments & ecology:::07_Wildlife_Conservation",
    "environments & ecology:::10_Climate_Change",
    "environments & ecology:::uttarakhand/02_Biodiversity_and_Protected_Areas",
    "environments & ecology:::02_Biodiversity_and_Protected_Areas",
    "polity:::05_Fundamental_Rights_and_Duties",
    "polity:::10_Local_Government",
    "polity:::02_Features_of_the_Constitution",
    "polity:::09_Judiciary",
    "polity:::06_Union_Executive",
    "polity:::01_Constitutional_Development",
    "polity:::07_Parliament",
    "polity:::13_Statutory_and_Non_Constitutional_Bodies",
    "polity:::12_Constitutional_Bodies",
    "polity:::uttarakhand/01_Constitutional_Framework_of_Uttarakhand",
    "polity:::uttarakhand/06_Local_Government_Panchayati_Raj"
  ]);

  const MEDIUM_PRIORITY_CHAPTERS = new Set([
    "ancient history:::01_Stone_Age",
    "ancient history:::05_Sixth_Century_BCE",
    "ancient history:::14_Ancient_India_Miscellaneous",
    "ancient history:::06_Foreign_Invasions",
    "ancient history:::09_Gupta_Age",
    "medieval india:::11_Marathas",
    "medieval india:::10_Sikhism",
    "medieval india:::09_Rajputs",
    "medieval india:::uttarakhand/03_Chand_Dynasty_of_Kumaon",
    "mordern india:::04_British_Administration_and_Economy",
    "mordern india:::06_Socio_Religious_Reform_Movements",
    "art and culture:::01_Institutions_Related_to_Indian_Culture",
    "art and culture:::16_Awards_Personalities_GI",
    "art and culture:::14_Cultural_Heritage",
    "art and culture:::04_Indian_Painting",
    "geography:::20_World_Agriculture",
    "geography:::uttar pradesh/24_Geography_of_Uttar_Pradesh",
    "geography:::15_Geomorphology_and_Landform_Processes",
    "geography:::06_Agriculture",
    "geography:::09_Transport_Communication",
    "geography:::05_Soils",
    "geography:::uttarakhand/01_Location_Relief_Structure",
    "geography:::01_Location_Relief_Structure",
    "geography:::uttarakhand/05_Agriculture_Animal_Husbandry_Irrigation",
    "geography:::05_Agriculture_Animal_Husbandry_Irrigation",
    "geography:::uttarakhand/06_Population_SC_ST_Settlements",
    "environments & ecology:::26_Water_Resources_and_Water_Conservation",
    "environments & ecology:::35_Atmosphere",
    "environments & ecology:::23_Disaster_and_Environment",
    "environments & ecology:::42_International_Environmental_Organizations",
    "environments & ecology:::05_Habitat_Flora_and_Fauna",
    "environments & ecology:::11_Ozone_Layer",
    "environments & ecology:::24_Current_Environmental_Issues",
    "environments & ecology:::33_Biosphere_Reserves",
    "environments & ecology:::41_Environmental_Monitoring",
    "environments & ecology:::44_Current_Environmental_Issues",
    "environments & ecology:::uttarakhand/03_Climate_Vulnerability_and_Governance",
    "environments & ecology:::03_Climate_Vulnerability_and_Governance",
    "polity:::16_Constitutional_Amendments",
    "polity:::03_Parts_Articles_and_Schedules",
    "polity:::14_Elections",
    "polity:::04_Union_and_Territory",
    "polity:::19_Acts_and_Governance",
    "polity:::17_Language_and_Special_Provisions",
    "polity:::11_Centre_State_Relations",
    "polity:::08_State_Government",
    "polity:::25_UP_Special",
    "polity:::uttarakhand/03_High_Court_and_Jurisdiction",
    "polity:::03_High_Court_and_Jurisdiction",
    "polity:::uttarakhand/04_SC_ST_Minorities_Official_Language",
    "polity:::04_SC_ST_Minorities_Official_Language",
    "polity:::uttarakhand/07_Governance_and_Rights_Schemes"
  ]);

  function getChapterPriority(subject, topic) {
    if (!subject || !topic) {
      return { group: 'least', targetAccuracy: 80, label: 'Baseline Priority', badgeText: 'Target: 80% (Baseline)', badgeClass: 'st-badge-target-least' };
    }
    const s = subject.toLowerCase().trim();
    const t = topic.trim();
    const key = `${s}:::${t}`;

    if (HIGH_PRIORITY_CHAPTERS.has(key)) {
      return { group: 'high', targetAccuracy: 100, label: 'Highly Important', badgeText: 'Target: 100% (High Priority)', badgeClass: 'st-badge-target-high' };
    }
    if (MEDIUM_PRIORITY_CHAPTERS.has(key)) {
      return { group: 'medium', targetAccuracy: 90, label: 'Medium Priority', badgeText: 'Target: 90% (Medium Priority)', badgeClass: 'st-badge-target-medium' };
    }

    // Try fuzzy match on topic slug
    for (const h of HIGH_PRIORITY_CHAPTERS) {
      if (h.startsWith(s + ':::') && (h.includes(t) || t.includes(h.split(':::')[1]))) {
        return { group: 'high', targetAccuracy: 100, label: 'Highly Important', badgeText: 'Target: 100% (High Priority)', badgeClass: 'st-badge-target-high' };
      }
    }
    for (const m of MEDIUM_PRIORITY_CHAPTERS) {
      if (m.startsWith(s + ':::') && (m.includes(t) || t.includes(m.split(':::')[1]))) {
        return { group: 'medium', targetAccuracy: 90, label: 'Medium Priority', badgeText: 'Target: 90% (Medium Priority)', badgeClass: 'st-badge-target-medium' };
      }
    }

    return { group: 'least', targetAccuracy: 80, label: 'Least Important', badgeText: 'Target: 80% (Least Priority)', badgeClass: 'st-badge-target-least' };
  }

  // -------------------------------------------------------------
  // BASIC AUTH & SECURITY VAULT CONTROLLER
  // -------------------------------------------------------------
  const DEFAULT_VAULT_TOKEN = (typeof btoa !== 'undefined') ? btoa('admin:uppcs2026') : 'YWRtaW46dXBwY3MyMDI2';

  function getStoredAuthToken() {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY) || DEFAULT_VAULT_TOKEN;
  }

  function setStoredAuthToken(token, persist) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, token);
    if (persist) {
      localStorage.setItem(AUTH_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  function clearStoredAuthToken() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  async function authFetch(url, options = {}) {
    const token = getStoredAuthToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Basic ${token}`);
    }
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      showAuthVaultModal();
    }
    return res;
  }

  function showAuthVaultModal() {
    if (document.getElementById('st-auth-vault-overlay')) return;

    document.body.classList.add('st-vault-locked');

    const overlay = document.createElement('div');
    overlay.className = 'st-auth-overlay';
    overlay.id = 'st-auth-vault-overlay';

    overlay.innerHTML = `
      <div class="st-auth-card">
        <div class="st-auth-icon-wrap">🔒</div>
        <h3 class="st-auth-title">UP-PCS Study Vault</h3>
        <p class="st-auth-sub">Confidential Notes, Revision Logs & Live CBT Test Engine.<br>Authentication required to access.</p>
        <form class="st-auth-form" id="st-auth-form">
          <div class="st-auth-field">
            <label for="st-auth-user">Username</label>
            <input type="text" id="st-auth-user" class="st-auth-input" placeholder="admin" value="admin" autocomplete="username" required />
          </div>
          <div class="st-auth-field">
            <label for="st-auth-pass">Password</label>
            <input type="password" id="st-auth-pass" class="st-auth-input" placeholder="Enter password" autocomplete="current-password" required />
          </div>
          <label class="st-auth-remember">
            <input type="checkbox" id="st-auth-remember" checked />
            Remember this browser
          </label>
          <div class="st-auth-error" id="st-auth-error">⚠️ Invalid username or password</div>
          <button type="submit" class="st-auth-submit-btn" id="st-auth-submit-btn">
            <span>🛡️ Unlock Library</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const passInput = document.getElementById('st-auth-pass');
    passInput?.focus();

    const form = document.getElementById('st-auth-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = document.getElementById('st-auth-user').value.trim();
      const pass = document.getElementById('st-auth-pass').value;
      const remember = document.getElementById('st-auth-remember').checked;
      const errorBox = document.getElementById('st-auth-error');
      const submitBtn = document.getElementById('st-auth-submit-btn');

      if (!user || !pass) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Verifying...</span>';
      errorBox.style.display = 'none';

      const token = btoa(`${user}:${pass}`);

      try {
        const verifyRes = await fetch(`${API_BASE}/auth/verify`, {
          headers: { 'Authorization': `Basic ${token}` }
        });

        if (verifyRes.ok) {
          setStoredAuthToken(token, remember);
          document.body.classList.remove('st-vault-locked');
          overlay.remove();
          boot();
          return;
        } else {
          errorBox.textContent = '⚠️ Invalid credentials. Please check your username and password.';
          errorBox.style.display = 'block';
        }
      } catch (err) {
        // Fallback if offline/network error
        if (user === 'admin' && pass === 'uppcs2026') {
          setStoredAuthToken(token, remember);
          document.body.classList.remove('st-vault-locked');
          overlay.remove();
          boot();
          return;
        }
        errorBox.textContent = '⚠️ Connection error. Ensure tracker-server is running on port 5000.';
        errorBox.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🛡️ Unlock Library</span>';
      }
    });
  }

  function injectHeaderLockBtn() {
    const headerInner = document.querySelector('.md-header__inner');
    if (!headerInner || document.getElementById('st-header-lock-btn')) return;

    const lockBtn = document.createElement('button');
    lockBtn.id = 'st-header-lock-btn';
    lockBtn.className = 'st-header-lock-btn';
    lockBtn.innerHTML = `🔒 Lock Vault`;
    lockBtn.title = 'Lock study library session';

    lockBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearStoredAuthToken();
      showAuthVaultModal();
    });

    headerInner.appendChild(lockBtn);
  }

  // -------------------------------------------------------------
  // LOCAL STORAGE HELPERS
  // -------------------------------------------------------------
  function getLocalLogs() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function getLocalTests() {
    try {
      const data = localStorage.getItem(LOCAL_TESTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function saveLocalTestAttempt(subject, topic, attempt) {
    const all = getLocalTests();
    const key = `${subject.toLowerCase().trim()}:::${topic.trim()}`;
    if (!all[key]) all[key] = [];
    all[key].unshift(attempt);
    try {
      localStorage.setItem(LOCAL_TESTS_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return all[key];
  }

  function getLocalTopicTests(subject, topic) {
    const all = getLocalTests();
    const key = `${subject.toLowerCase().trim()}:::${topic.trim()}`;
    return all[key] || [];
  }

  function saveLocalLog(subject, topic, entry) {
    const logs = getLocalLogs();
    const key = `${subject.toLowerCase().trim()}:::${topic.trim()}`;
    if (!logs[key]) {
      logs[key] = {
        subject: subject.toLowerCase().trim(),
        topic: topic.trim(),
        topic_title: entry.topic_title || topic.trim(),
        read_count: 0,
        logs: [],
        pyqs: []
      };
    }
    logs[key].read_count += 1;
    logs[key].logs.unshift({
      id: Date.now().toString(),
      date: entry.date || new Date().toISOString(),
      stage: entry.stage || 'Revision',
      confidence: Number(entry.confidence) || 3,
      notes: (entry.notes || '').trim(),
      read_number: logs[key].read_count
    });

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return logs[key];
  }

  function getLocalTopicData(subject, topic) {
    const logs = getLocalLogs();
    const key = `${subject.toLowerCase().trim()}:::${topic.trim()}`;
    return logs[key] || null;
  }

  // -------------------------------------------------------------
  // DAILY TARGET PLANNER & TASKS HELPERS
  // -------------------------------------------------------------
  function getTodayISODate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  let activePlannerDate = getTodayISODate();
  let activePlannerFilter = 'all';
  let activePlannerSubject = 'polity';

  // COMPLETE CHAPTER CATALOG FOR MULTI-SELECT PICKER
  const CHAPTER_CATALOG = {"ancient history":[{"slug":"01_Stone_Age","title":"Stone Age (Prehistoric India)"},{"slug":"02_Indus_Valley_Civilization","title":"Indus Valley Civilization (Harappan Civilization)"},{"slug":"03_Vedic_Civilization","title":"Vedic Civilization"},{"slug":"04_Religious_Movements","title":"Religious Movements"},{"slug":"05_Sixth_Century_BCE","title":"Sixth Century BCE"},{"slug":"06_Foreign_Invasions","title":"Foreign Invasions"},{"slug":"07_Mauryan_Empire","title":"Mauryan Empire"},{"slug":"08_Post_Mauryan_India","title":"Post-Mauryan India"},{"slug":"09_Gupta_Age","title":"Gupta Age"},{"slug":"10_Post_Gupta_Period","title":"Post-Gupta Period"},{"slug":"11_Ancient_Indian_Administration","title":"Ancient Indian Administration"},{"slug":"12_Ancient_Indian_Economy","title":"Ancient Indian Economy"},{"slug":"13_Archaeology","title":"Archaeology"},{"slug":"14_Ancient_India_Miscellaneous","title":"Ancient India Miscellaneous"},{"slug":"uttarakhand/01_Prehistoric_and_Protohistoric_Uttarakhand","title":"Prehistoric and Protohistoric Uttarakhand"},{"slug":"uttarakhand/02_Ancient_Tribes_of_Uttarakhand","title":"Ancient Tribes & Modern Scheduled Tribes of Uttarakhand"},{"slug":"uttarakhand/03_Kuninda_and_Yaudheya","title":"Kuninda, Yaudheya & Early Historic Polities of Uttarakhand"},{"slug":"uttarakhand/04_Kartikepur_Dynasty","title":"Kartikepur (Katyuri) Dynasty"},{"slug":"00_Chronology_Year_Wise_Events","title":"Chronology — Year-Wise Major Events (Ancient India)"},{"slug":"00_Daily_Revision_Facts","title":"Daily Read — High-Yield Revision Facts (Ancient India)"},{"slug":"00_Prelims_Analysis","title":"Ancient History — Prelims Analysis"},{"slug":"00_Syllabus","title":"Ancient India (UPPCS + UKPCS Prelims Knowledge Base)"},{"slug":"uttarakhand/00_Syllabus","title":"History & Culture of Uttarakhand — Ancient slice (UKPCS)"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Ancient","title":"UKPCS PYQ Bank — Ancient History (national + UK)"}],"art and culture":[{"slug":"01_Institutions_Related_to_Indian_Culture","title":"Institutions Related to Indian Culture"},{"slug":"02_Religious_and_Philosophical_Traditions","title":"Religious and Philosophical Traditions"},{"slug":"03_Indian_Architecture","title":"Indian Architecture"},{"slug":"04_Indian_Painting","title":"Indian Painting"},{"slug":"05_Indian_Music","title":"Indian Music"},{"slug":"06_Indian_Dance","title":"Indian Dance"},{"slug":"07_Indian_Theatre_and_Performing_Arts","title":"Indian Theatre & Performing Arts"},{"slug":"08_Indian_Languages_and_Literature","title":"Indian Languages & Literature"},{"slug":"09_Indian_Festivals_and_Fairs","title":"Indian Festivals & Fairs"},{"slug":"10_Ancient_Indian_History_Related_to_Culture","title":"Ancient Indian History Related to Culture"},{"slug":"11_Medieval_Indian_Cultural_History","title":"Medieval Indian Cultural History (इतिहास)"},{"slug":"12_Sculpture","title":"Sculpture"},{"slug":"13_Folk_Culture","title":"Folk (लोक) Culture"},{"slug":"14_Cultural_Heritage","title":"Cultural Heritage"},{"slug":"15_Archaeology","title":"Archaeology (पुरातत्व)"},{"slug":"16_Awards_Personalities_GI","title":"Essentials: Awards, Personalities & GI Tags"},{"slug":"uttar pradesh/17_UP_Art_Culture_Demographics","title":"UP Art, Culture, Demographics & Master Institute Directory (UPPCS Special)"},{"slug":"uttarakhand/01_Folk_Culture_of_Uttarakhand","title":"Folk (लोक) Culture, Aipan (ऐपण), Jagar (जागर) & Ritual (कर्मकाण्ड) Heritage of Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/02_Dances_Music_and_Fairs","title":"Dances, Music, Fairs, Festivals & State Symbols of Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/03_Heritage_and_Cultural_Institutes","title":"Heritage, Art Traditions & Master Institute Directory (Uttarakhand (उत्तराखंड))"},{"slug":"uttarakhand/04_Personalities_Literature_and_Press","title":"Personalities, Sobriquets, Literature, Press & Sports of Uttarakhand (उत्तराखंड)"},{"slug":"00_Daily_Revision_Facts","title":"Daily Read — High-Yield Revision Facts (Indian Art & Culture)"},{"slug":"00_Prelims_Analysis","title":"Art and Culture — Prelims Analysis"},{"slug":"00_Syllabus","title":"Indian Art & Culture (UPPCS + UKPCS Prelims)"},{"slug":"uttarakhand/00_Syllabus","title":"Art & Culture of Uttarakhand (UKPCS)"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Art_Culture","title":"UKPCS PYQ Bank — Art & Culture (national + UK)"}],"census and urbanisation":[{"slug":"01_Census_and_Population_Data","title":"Census and Population Data"},{"slug":"02_Population_Growth_Demographic_Transition_Theories","title":"Population Growth, Demographic Transition and Theories"},{"slug":"03_Population_Composition_Demographic_Characteristics","title":"Population Composition and Demographic Characteristics"},{"slug":"04_Fertility_Mortality_Health_Population_Policies","title":"Fertility, Mortality, Health and Population Policies"},{"slug":"05_Migration_and_Population_Distribution","title":"Migration and Population Distribution"},{"slug":"06_Urbanisation_and_Urban_Development","title":"Urbanisation and Urban Development"},{"slug":"07_World_Population_and_Demographic_Misc","title":"World Population and Demographic Miscellaneous"},{"slug":"00_Syllabus","title":"Census and Urbanisation (UPPCS + UKPCS Knowledge Base)"},{"slug":"01_Census_Urbanisation_Syllabus","title":"Census and Urbanisation — 7 master chapters (chapter map)"}],"economy":[{"slug":"01_Indian_Economy_Basics_Planning","title":"Indian Economy Basics Planning"},{"slug":"02_Public_Finance_Budget_Taxation","title":"Public Finance, Budget, Taxation and Fiscal Policy"},{"slug":"03_Money_Banking_RBI_Financial_System","title":"Money, Banking, RBI and Financial System"},{"slug":"04_Inflation_Prices_Savings_Investment_Markets","title":"Inflation, Prices, Savings, Investment and Financial Markets"},{"slug":"05_Agriculture_Indian_Agricultural_Economy","title":"Agriculture and Indian Agricultural Economy"},{"slug":"06_Agricultural_Policies_Schemes_MSP_Revolutions","title":"Agricultural Policies, Schemes, MSP and Revolutions"},{"slug":"07_Industry_MSME_Infrastructure","title":"Industry, Manufacturing, MSME and Infrastructure"},{"slug":"08_Employment_Poverty_Human_Capital","title":"Employment, Poverty, Human Capital and Social Economy"},{"slug":"09_External_Sector_Foreign_Trade","title":"External Sector, Foreign Trade and Global Economy"},{"slug":"10_International_Institutions_Groupings","title":"International Financial Institutions, Economic Groupings and Global Summits"},{"slug":"11_Services_Cooperatives_Regulators","title":"Service Sector, Cooperatives, Companies and Regulatory Institutions"},{"slug":"12_Economic_Laws_Reports_Rankings_Misc","title":"Economic Laws, Reports, Rankings and Miscellaneous"},{"slug":"00_Syllabus","title":"Economy (UPPCS + UKPCS Knowledge Base)"},{"slug":"01_Economics_Syllabus","title":"Economy — 12 master chapters (chapter map)"},{"slug":"uttarakhand/00_Syllabus","title":"Economy of Uttarakhand (UKPCS)"}],"environments & ecology":[{"slug":"01_Environment_Basics","title":"Environment (पर्यावरण) Basics"},{"slug":"02_Ecology_and_Ecosystem","title":"Ecology (पारिस्थितिकी) & Ecosystem (पारिस्थितिकी तंत्र)"},{"slug":"03_Food_Chain_and_Energy_Flow","title":"Food Chain (खाद्य श्रृंखला) & Energy Flow"},{"slug":"04_Biodiversity","title":"Biodiversity"},{"slug":"05_Habitat_Flora_and_Fauna","title":"Habitat (वास स्थान), Flora (वनस्पति) & Fauna (प्राणीजात)"},{"slug":"06_Protected_Areas_and_Conservation","title":"Protected Areas & Conservation"},{"slug":"07_Wildlife_Conservation","title":"Wildlife Conservation (वन्यजीव संरक्षण)"},{"slug":"08_Forests_and_Forest_Management","title":"Forests & Forest Management"},{"slug":"09_Pollution_and_Waste_Management","title":"Pollution & Waste Management"},{"slug":"10_Climate_Change","title":"Climate Change (जलवायु परिवर्तन)"},{"slug":"11_Ozone_Layer","title":"Ozone Layer"},{"slug":"12_Acid_Rain","title":"Acid Rain (अम्ल वर्षा)"},{"slug":"13_Desertification_and_Land_Degradation","title":"Desertification (मरुस्थलीकरण) & Land Degradation (भू-क्षरण)"},{"slug":"14_Environmental_Impact_Assessment","title":"Environmental Impact Assessment"},{"slug":"15_Sustainable_Development_and_Environmental_Governance","title":"Sustainable Development & Environmental Governance"},{"slug":"16_Environmental_Organizations_India","title":"Environmental Organizations (India)"},{"slug":"17_Environmental_Laws_and_Policies","title":"Environmental Laws & Policies"},{"slug":"18_International_Environmental_Agreements_and_Conferences","title":"International Environmental Agreements & Conferences"},{"slug":"19_Climate_and_Environmental_Institutions","title":"Climate & Environmental Institutions"},{"slug":"20_Biodiversity_Conservation_Methods","title":"Biodiversity Conservation Methods"},{"slug":"21_Species_and_Ecology","title":"Species & Ecology (पारिस्थितिकी)"},{"slug":"22_Renewable_Energy","title":"Renewable Energy (नवीकरणीय ऊर्जा)"},{"slug":"23_Disaster_and_Environment","title":"Disaster & Environment (पर्यावरण)"},{"slug":"24_Current_Environmental_Issues","title":"Current Environmental Issues"},{"slug":"25_Global_Environmental_Geography","title":"Global Environmental Geography"},{"slug":"26_Water_Resources_and_Water_Conservation","title":"Water Resources & Water Conservation"},{"slug":"27_Renewable_and_Non_Renewable_Energy","title":"Renewable & Non-Renewable Energy (अनवीकरणीय ऊर्जा)"},{"slug":"28_Environmental_Research_and_Institutions","title":"Environmental Research & Institutions"},{"slug":"29_Indian_Environmental_Movements","title":"Indian Environmental Movements"},{"slug":"30_Environmental_Literature_and_Awareness","title":"Environmental Literature & Awareness"},{"slug":"31_Environmental_Days","title":"Environmental Days"},{"slug":"32_National_Parks_and_Protected_Areas_Advanced","title":"National Parks & Protected Areas (Advanced)"},{"slug":"33_Biosphere_Reserves","title":"Biosphere Reserves (जैवमंडल आरक्षित क्षेत्र)"},{"slug":"34_Climate_Change_Advanced","title":"Climate Change (जलवायु परिवर्तन) (Advanced)"},{"slug":"35_Atmosphere","title":"Atmosphere"},{"slug":"36_Ozone_Layer","title":"Ozone Layer"},{"slug":"37_Greenhouse_Gases","title":"Greenhouse Gases"},{"slug":"38_Pollution_Advanced","title":"Pollution (Advanced)"},{"slug":"39_Acid_Rain","title":"Acid Rain (अम्ल वर्षा)"},{"slug":"40_Desertification","title":"Desertification (मरुस्थलीकरण)"},{"slug":"41_Environmental_Monitoring","title":"Environmental Monitoring (पर्यावरणीय निगरानी)"},{"slug":"42_International_Environmental_Organizations","title":"International Environmental Organizations"},{"slug":"43_International_Environmental_Agreements","title":"International Environmental Agreements"},{"slug":"44_Current_Environmental_Issues","title":"Current Environmental Issues"},{"slug":"45_Environment_PYQ_Trend_Analysis","title":"Environment (पर्यावरण) PYQ Trend Analysis"},{"slug":"uttarakhand/01_Natural_Resources_and_Climate_Contribution","title":"Natural Resources of Uttarakhand (उत्तराखंड) & Climate Contribution"},{"slug":"uttarakhand/02_Biodiversity_and_Protected_Areas","title":"Biodiversity & Protected Areas (Uttarakhand (उत्तराखंड))"},{"slug":"uttarakhand/03_Climate_Vulnerability_and_Governance","title":"Climate Contribution, Vulnerability & Governance"},{"slug":"uttarakhand/04_National_Parks_Sanctuaries","title":"National Parks, Sanctuaries & Conservation Reserves of Uttarakhand (उत्तराखंड)"},{"slug":"00_Daily_Revision_Facts","title":"Daily Read — High-Yield Revision Facts (Environment & Ecology)"},{"slug":"00_Prelims_Analysis","title":"Environment and Ecology — Prelims Analysis"},{"slug":"00_Syllabus","title":"Environment & Ecology"},{"slug":"uttarakhand/00_Syllabus","title":"Natural Resources & Environment of Uttarakhand (UKPCS)"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Environment","title":"UKPCS PYQ Bank — Environment (national + UK)"}],"geography":[{"slug":"01_Indian_Physical_Geography_Mountains_Hills","title":"Indian Physical Geography: Mountains & Hills"},{"slug":"02_Climate_of_India","title":"Climate of India"},{"slug":"03_Drainage_System","title":"Drainage System"},{"slug":"04_Lakes_Waterfalls_Water_Resources","title":"Lakes, Waterfalls & Water Resources"},{"slug":"05_Soils","title":"Soils"},{"slug":"06_Agriculture","title":"Agriculture"},{"slug":"07_Natural_Vegetation_Biodiversity","title":"Natural Vegetation & Biodiversity Geography"},{"slug":"08_Minerals_Energy_Industry","title":"Minerals, Energy & Industry"},{"slug":"09_Transport_Communication","title":"Transport & Communication"},{"slug":"10_Tribes_Institutions","title":"Tribes & Institutions"},{"slug":"11_Population_Geography","title":"Population (जनसंख्या) Geography"},{"slug":"12_Human_Geography","title":"Human Geography (Settlements)"},{"slug":"13_Disaster_Geography","title":"Disaster Geography"},{"slug":"14_Earth_and_Universe","title":"Earth & Universe"},{"slug":"15_Geomorphology_and_Landform_Processes","title":"Geomorphology & Landform Processes"},{"slug":"16_Oceans","title":"Oceans"},{"slug":"17_World_Rivers_and_Lakes","title":"World Rivers & Lakes"},{"slug":"18_World_Landforms","title":"World Landforms"},{"slug":"19_World_Regional_Geography","title":"World Regional Geography"},{"slug":"20_World_Agriculture","title":"World Agriculture"},{"slug":"21_World_Minerals_Energy","title":"World Minerals & Energy"},{"slug":"22_World_Industries","title":"World Industries"},{"slug":"23_Political_Map_Geography","title":"Political & Map-Based Geography"},{"slug":"25_Census_and_Demographics","title":"Census and Demographics (UPPCS & UKPCS Ratta)"},{"slug":"26_Agriculture_Minerals_Ranks","title":"Agriculture & Minerals Ranks (Data Fact-Locks)"},{"slug":"uttar pradesh/24_Geography_of_Uttar_Pradesh","title":"Geography of Uttar Pradesh (उत्तर प्रदेश)"},{"slug":"uttarakhand/01_Location_Relief_Structure","title":"Location, Relief & Structure"},{"slug":"uttarakhand/02_Climate_and_Drainage","title":"Climate, Drainage & Glaciology of Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/03_Vegetation_and_Wildlife","title":"Vegetation & Wildlife"},{"slug":"uttarakhand/04_Minerals_Power_Industry","title":"Minerals, Power & Industry"},{"slug":"uttarakhand/05_Agriculture_Animal_Husbandry_Irrigation","title":"Agriculture, Animal Husbandry & Irrigation"},{"slug":"uttarakhand/06_Population_SC_ST_Settlements","title":"Population (जनसंख्या), Demographics & SC/ST Settlements of Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/07_Transport_Tourism_Natural_Hazards","title":"Transport, Tourism, Passes, Bugyals & Natural Hazards of Uttarakhand (उत्तराखंड)"},{"slug":"00_Daily_Revision_Facts","title":"Daily Read — High-Yield Revision Facts (Geography)"},{"slug":"00_Prelims_Analysis","title":"Geography — Prelims Analysis"},{"slug":"00_Syllabus","title":"Geography (UPPCS + UKPCS Prelims Knowledge Base)"},{"slug":"uttarakhand/00_Syllabus","title":"Geography of Uttarakhand (UKPCS)"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Geography","title":"UKPCS PYQ Bank — Geography (national + UK)"}],"medieval india":[{"slug":"01_Early_Medieval_India_Regional_Kingdoms","title":"Early Medieval (प्रारंभिक मध्यकाल) India (Regional Kingdoms)"},{"slug":"02_Turkish_Invasions_Delhi_Sultanate","title":"Turkish Invasions & Delhi Sultanate (दिल्ली सल्तनत)"},{"slug":"03_Regional_Kingdoms","title":"Regional Kingdoms (Sharqi (शर्की), Kashmir, Vijayanagara (विजयनगर), Bahmani & Deccan (दक्कन))"},{"slug":"04_Bhakti_Sufi_Movements","title":"Bhakti (भक्ति) & Sufi (सूफी) Movements"},{"slug":"05_Medieval_Literature","title":"Medieval Literature"},{"slug":"06_Medieval_Music_Culture","title":"Medieval Music & Culture"},{"slug":"07_Mughal_Empire","title":"Mughal (मुग़ल) Empire"},{"slug":"08_Sher_Shah_Suri","title":"Sher Shah (शेरशाह) Suri"},{"slug":"09_Rajputs","title":"Rajputs"},{"slug":"10_Sikhism","title":"Sikhism"},{"slug":"11_Marathas","title":"Marathas"},{"slug":"12_Later_Medieval_India","title":"Later Medieval India"},{"slug":"uttarakhand/01_Kattyuri_Dynasty","title":"Kattyuri (Katyuri) Dynasty of Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/02_Parmar_Dynasty_of_Garhwal","title":"Parmar (Panwar) Dynasty of Garhwal (गढ़वाल)"},{"slug":"uttarakhand/03_Chand_Dynasty_of_Kumaon","title":"Chand Dynasty of Kumaon (कुमाऊँ)"},{"slug":"00_Chronology_Year_Wise_Events","title":"Chronology — Year-Wise Major Events (Medieval India)"},{"slug":"00_Daily_Revision_Facts","title":"Daily Read — High-Yield Revision Facts (Medieval India)"},{"slug":"00_Prelims_Analysis","title":"Medieval India — Prelims Analysis"},{"slug":"00_Syllabus","title":"Medieval India (UPPCS + UKPCS Prelims Knowledge Base)"},{"slug":"uttarakhand/00_Syllabus","title":"History & Culture of Uttarakhand — Medieval slice (UKPCS)"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Medieval","title":"UKPCS PYQ Bank — Medieval India (national + UK)"}],"mordern india":[{"slug":"01_Advent_of_Europeans","title":"Advent of Europeans"},{"slug":"02_East_India_Company_Expansion","title":"East India Company (कंपनी) Expansion"},{"slug":"03_Governors_General_and_Viceroys","title":"Governors-General & Viceroys"},{"slug":"04_British_Administration_and_Economy","title":"British Administration & Economy"},{"slug":"05_Revolt_of_1857","title":"Revolt of 1857"},{"slug":"06_Socio_Religious_Reform_Movements","title":"Socio-Religious Reform Movements"},{"slug":"07_Education_and_Press","title":"Education & Press"},{"slug":"08_Peasant_Tribal_Labour_Movements","title":"Peasant, Tribal (आदिवासी) & Labour Movements"},{"slug":"09_Rise_of_Nationalism","title":"Rise of Nationalism"},{"slug":"10_Books_and_Authors","title":"Books & Authors"},{"slug":"11_Swadeshi_and_Revolutionary_Movement","title":"Swadeshi (स्वदेशी) & Revolutionary (क्रांतिकारी) Movement"},{"slug":"12_Home_Rule_and_Labour_Politics","title":"Home Rule (होम रूल) & Labour Politics"},{"slug":"13_Gandhian_Era","title":"Gandhian Era"},{"slug":"14_Final_Phase_of_Freedom_Struggle","title":"Final Phase of Freedom Struggle"},{"slug":"15_Post_Independence_India","title":"Post-Independence India"},{"slug":"16_Miscellaneous_UPPCS_Frequently_Asked","title":"Miscellaneous (Frequently Asked by UPPCS)"},{"slug":"uttar pradesh/17_UP_History_and_Freedom_Struggle","title":"History (इतिहास) & Freedom Struggle of Uttar Pradesh (उत्तर प्रदेश) (UPPCS Special)"},{"slug":"uttarakhand/01_Gorkha_Invasion_and_Rule","title":"Gorkha Invasion and Rule"},{"slug":"uttarakhand/02_British_Rule_in_Uttarakhand","title":"British Rule in Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/03_Tehri_Estate","title":"Tehri (टिहरी) Estate (Tehri Princely State)"},{"slug":"uttarakhand/04_Freedom_Movement_in_Uttarakhand","title":"Freedom Movement in Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/05_Peoples_Movements_of_Uttarakhand","title":"People’s Movements of Uttarakhand (उत्तराखंड)"},{"slug":"00_Chronology_Year_Wise_Events","title":"Chronology — Year-Wise Major Events"},{"slug":"00_Daily_Revision_Facts","title":"Daily Read — High-Yield Revision Facts (Modern India)"},{"slug":"00_Prelims_Analysis","title":"Modern India — Prelims Analysis"},{"slug":"00_Syllabus","title":"Modern India (UPPCS + UKPCS Prelims Knowledge Base)"},{"slug":"uttarakhand/00_Syllabus","title":"History & Culture of Uttarakhand — Modern slice (UKPCS)"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Modern","title":"UKPCS PYQ Bank — Modern India (national + UK)"}],"polity":[{"slug":"01_Constitutional_Development","title":"Constitutional Development"},{"slug":"02_Features_of_the_Constitution","title":"Features of the Constitution"},{"slug":"03_Parts_Articles_and_Schedules","title":"Parts, Articles & Schedules"},{"slug":"04_Union_and_Territory","title":"Union & Territory"},{"slug":"05_Fundamental_Rights_and_Duties","title":"Fundamental Rights (मौलिक अधिकार) & Duties"},{"slug":"06_Union_Executive","title":"Union Executive"},{"slug":"07_Parliament","title":"Parliament"},{"slug":"08_State_Government","title":"State Government"},{"slug":"09_Judiciary","title":"Judiciary"},{"slug":"10_Local_Government","title":"Local Government"},{"slug":"11_Centre_State_Relations","title":"Centre–State Relations"},{"slug":"12_Constitutional_Bodies","title":"Constitutional Bodies"},{"slug":"13_Statutory_and_Non_Constitutional_Bodies","title":"Statutory & Non-Constitutional Bodies"},{"slug":"14_Elections","title":"Elections"},{"slug":"15_Emergency_Provisions","title":"Emergency Provisions"},{"slug":"16_Constitutional_Amendments","title":"Constitutional Amendments"},{"slug":"17_Language_and_Special_Provisions","title":"Language & Special Provisions"},{"slug":"18_Political_Parties_and_Pressure_Groups","title":"Political Parties & Pressure Groups"},{"slug":"19_Acts_and_Governance","title":"Acts & Governance"},{"slug":"20_Internal_Security","title":"Internal Security"},{"slug":"21_International_Relations","title":"International Relations"},{"slug":"22_Constitutional_Philosophy","title":"Constitutional Philosophy"},{"slug":"23_Constitutional_and_Legal_Offices","title":"Constitutional & Legal Offices"},{"slug":"24_Important_Supreme_Court_Judgments","title":"Important Supreme Court Judgments"},{"slug":"25_UP_Special","title":"UP Special"},{"slug":"26_One_Liner_Revision","title":"One-Liner Revision"},{"slug":"27_Committees_and_Commissions","title":"Important Committees and Commissions (Fact-Lock)"},{"slug":"uttarakhand/01_Constitutional_Framework_of_Uttarakhand","title":"Constitutional Framework & First Dignitaries of Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/02_Public_Services_PSC_Auditing","title":"Public Services, PSC & Auditing"},{"slug":"uttarakhand/03_High_Court_and_Jurisdiction","title":"High Court & Jurisdiction"},{"slug":"uttarakhand/04_SC_ST_Minorities_Official_Language","title":"SC/ST, Minorities & Official Language"},{"slug":"uttarakhand/05_Funds_Parties_Elections","title":"Funds, Parties & Elections"},{"slug":"uttarakhand/06_Local_Government_Panchayati_Raj","title":"Local Government, Panchayati Raj (पंचायती राज) & Van Panchayats of Uttarakhand (उत्तराखंड)"},{"slug":"uttarakhand/07_Governance_and_Rights_Schemes","title":"Governance, Rights, UCC & Citizen Charters of Uttarakhand (उत्तराखंड)"},{"slug":"00_Daily_Revision_Facts","title":"Daily Read — High-Yield Revision Facts (Indian Polity & Governance)"},{"slug":"00_Prelims_Analysis","title":"Polity — Prelims Analysis"},{"slug":"00_Syllabus","title":"Indian Polity & Governance (UPPCS + UKPCS Prelims Knowledge Base)"},{"slug":"uttarakhand/00_Syllabus","title":"Political System of Uttarakhand (UKPCS)"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Polity","title":"UKPCS PYQ Bank — Polity (national + UK)"}],"science and technology":[{"slug":"01_Cell_Genetics_and_Biotechnology","title":"Living World, Cell, Genetics and Biotechnology"},{"slug":"02_Animal_Biology_and_Husbandry","title":"Animal Biology and Husbandry"},{"slug":"03_Nutrition_Diseases_and_Medicine","title":"Nutrition, Vitamins, Diseases and Medicine"},{"slug":"04_Digestion_Respiration_and_Excretion","title":"Digestion, Respiration and Excretion"},{"slug":"05_Blood_Heart_and_Circulation","title":"Blood, Heart, Circulation and Lymph"},{"slug":"06_Control_Reproduction_and_Support","title":"Nervous System, Hormones, Reproduction and Support"},{"slug":"07_Plants_Agriculture_and_Diseases","title":"Plants, Agriculture and Plant Diseases"},{"slug":"08_Microbiology_Environment_and_Applied","title":"Microbiology, Environment and Applied Science"},{"slug":"09_Physics_Fundamentals_and_Measurement","title":"Physics Fundamentals, Measurement and Instruments"},{"slug":"10_Mechanics_and_Properties_of_Matter","title":"Mechanics, Gravitation and Physical Properties of Matter"},{"slug":"11_Energy_Heat_and_Thermal","title":"Energy, Heat and Thermal Science"},{"slug":"12_Light_Optics_and_Laser","title":"Light, Optics and Laser Technology"},{"slug":"13_Sound_and_Wave_Motion","title":"Sound and Wave Motion"},{"slug":"14_Electricity_and_Magnetism","title":"Electricity, Magnetism and Electromagnetism"},{"slug":"15_Electronics_Semiconductors_and_Computers","title":"Electronics, Semiconductors and Computer Technology"},{"slug":"16_Nuclear_and_Atomic_Physics","title":"Nuclear and Atomic Physics"},{"slug":"17_Scientists_Discoveries_and_Applications","title":"Scientists, Discoveries, Defence & Space Technology, and Applications of Physics"},{"slug":"18_Atomic_Structure_and_Periodic_Table","title":"Atomic Structure and Periodic Classification"},{"slug":"19_Matter_Solutions_and_Purification","title":"Matter, Solutions and Purification"},{"slug":"20_Metals_and_Chemical_Reactions","title":"Metals, Non-Metals and Chemical Reactions"},{"slug":"21_Acids_Bases_Salts_and_Sucrose","title":"Acids, Bases, Salts and Carbohydrates"},{"slug":"22_Carbon_Organic_and_Polymers","title":"Carbon, Organic Compounds, Polymers and Fibres"},{"slug":"23_Gases_Fuels_and_Energy","title":"Gases, Fuels, Energy and Combustion"},{"slug":"24_Chemistry_Daily_Life_and_Agriculture","title":"Chemistry in Daily Life, Industry and Agriculture"},{"slug":"25_Radiation_Nuclear_and_Environment_Chem","title":"Nuclear Chemistry, Explosives and Environment"},{"slug":"26_Chemistry_Discoveries_and_Miscellaneous","title":"Discoveries, Scientists and Miscellaneous Chemistry"},{"slug":"00_Syllabus","title":"Science & Technology (UPPCS + UKPCS Knowledge Base)"},{"slug":"01_Biology_Syllabus","title":"Science Part 1 — Biology (chapter map)"},{"slug":"02_Physics_Syllabus","title":"Science Part 2 — Physics (chapter map)"},{"slug":"03_Chemistry_Syllabus","title":"Science Part 3 — Chemistry (chapter map)"},{"slug":"uttarakhand/00_Syllabus","title":"Science & Technology — Uttarakhand (UKPCS)"}],"up special":[{"slug":"01_Geography_Location_Physical_Features","title":"Geography, Location, Boundaries, Physical Features, Climate, Soil and Drainage System"},{"slug":"02_History_Culture_Art_Heritage","title":"History, Culture, Art and Heritage of Uttar Pradesh"},{"slug":"03_Polity_Administration_Local_Government","title":"Polity, Constitutional Framework, Administration and Local Governance"},{"slug":"04_Economy_Industry_Infrastructure","title":"Economy, Industrial Policy, Mineral Resources, Infrastructure and ODOP"},{"slug":"05_Agriculture_Irrigation_Rural_Economy","title":"Agriculture, Agro-Climatic Zones, Irrigation Networks, Rural Economy and Research Institutes"},{"slug":"06_Society_Population_Education_Social","title":"Society, Demographics, Tribes, Education System and Social Development"},{"slug":"07_Transport_Tourism_Environment_Disaster","title":"Transport, Tourism Circuits, Forests, Protected Areas, Wetlands and Disaster Management"},{"slug":"08_Current_Affairs_Schemes_Miscellaneous","title":"Government Schemes, State Policies, State Symbols, Honors and Miscellaneous Facts"},{"slug":"00_Syllabus","title":"UP Special (UPPCS Knowledge Base)"},{"slug":"01_UP_Special_Syllabus","title":"UP Special — 8 master chapters (chapter map)"}]};

  function getMidnightRemainingStr() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const diffMs = midnight - now;
    if (diffMs <= 0) return 'Midnight checkpoint reached';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left till Midnight Checkpoint`;
  }

  function formatPlannerDateDisplay(isoDateStr) {
    if (!isoDateStr) return '';
    try {
      const parts = isoDateStr.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const today = getTodayISODate();
      const isToday = isoDateStr === today;
      const formatted = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      return isToday ? `Today (${formatted})` : formatted;
    } catch {
      return isoDateStr;
    }
  }

  function getLocalDailyPlanner(date) {
    const targetDate = date || activePlannerDate;
    try {
      const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
      const all = raw ? JSON.parse(raw) : {};
      if (!all[targetDate]) {
        all[targetDate] = { date: targetDate, reading_topics: [], daily_tasks: [] };
      }
      return all[targetDate];
    } catch {
      return { date: targetDate, reading_topics: [], daily_tasks: [] };
    }
  }

  function saveLocalDailyPlanner(date, plannerData) {
    const targetDate = date || activePlannerDate;
    try {
      const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[targetDate] = {
        date: targetDate,
        reading_topics: plannerData.reading_topics || [],
        daily_tasks: plannerData.daily_tasks || []
      };
      localStorage.setItem(LOCAL_PLANNER_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('LocalStorage error saving planner:', e);
    }
  }

  async function fetchPlannerData(date) {
    const targetDate = date || activePlannerDate;
    try {
      const res = await authFetch(`${API_BASE}/daily-planner?date=${encodeURIComponent(targetDate)}`);
      if (res && res.ok) {
        const data = await res.json();
        saveLocalDailyPlanner(targetDate, data);
        return data;
      }
    } catch (e) {
      // offline fallback
    }
    return getLocalDailyPlanner(targetDate);
  }

  // 9-Day Calendar Strip generator (7 past days, today, tomorrow)
  function getCalendarDaysList(activeDate) {
    const todayStr = getTodayISODate();
    const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
    const allData = raw ? (JSON.parse(raw) || {}) : {};
    const days = [];
    for (let offset = -7; offset <= 1; offset++) {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;

      const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase();
      const dayNum = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      const isPast = dateStr < todayStr;
      const dayData = allData[dateStr] || { reading_topics: [] };
      const topics = dayData.reading_topics || [];
      const plannedCount = topics.length;
      const achievedCount = topics.filter(t => t.status === 'achieved').length;
      // Only past days have backlogs for incomplete topics! Today is actively in progress.
      const backlogCount = isPast ? topics.filter(t => t.status !== 'achieved').length : 0;

      days.push({
        dateStr,
        dayName: dateStr === todayStr ? 'TODAY' : dayName,
        dayNum,
        isToday: dateStr === todayStr,
        isPast,
        isActive: dateStr === activeDate,
        plannedCount,
        achievedCount,
        backlogCount
      });
    }
    return days;
  }

  // Cumulative overall backlog scanner across all stored dates (past dates or explicitly flagged pending)
  function getOverallBacklogFromLocal() {
    const todayStr = getTodayISODate();
    const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
    if (!raw) return [];
    try {
      const all = JSON.parse(raw);
      const backlog = [];
      Object.keys(all).forEach(d => {
        const isPastDate = d < todayStr;
        const dayData = all[d];
        if (dayData && Array.isArray(dayData.reading_topics)) {
          dayData.reading_topics.forEach(t => {
            // An item is backlog IF:
            // 1. It was planned on a past date (d < todayStr) and is not achieved
            // OR 2. It was explicitly moved to pending backlog (t.slot === 'pending' || t.missed_midnight || t.missed_12pm)
            const isBacklog = (isPastDate && t.status !== 'achieved') || (!isPastDate && t.status !== 'achieved' && (t.slot === 'pending' || t.missed_midnight || t.missed_12pm));
            if (isBacklog) {
              let daysOverdue = 0;
              try {
                const d1 = new Date(d);
                const d2 = new Date(todayStr);
                daysOverdue = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
              } catch {}
              backlog.push({
                ...t,
                planned_date: d,
                days_overdue: daysOverdue,
                is_today: d === todayStr
              });
            }
          });
        }
      });
      backlog.sort((a, b) => (a.planned_date > b.planned_date ? 1 : -1));
      return backlog;
    } catch (e) {
      return [];
    }
  }

  // Fuzzy topic normalization & matching helpers
  function normalizeTopicName(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/^topic\s*\d+\s*[-–—:]*\s*/i, '')
      .replace(/^[0-9\.\s\-_]+/, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function isTopicMatch(sub1, top1, sub2, top2) {
    if (!sub1 || !sub2 || !top1 || !top2) return false;
    const s1 = String(sub1).toLowerCase().trim();
    const s2 = String(sub2).toLowerCase().trim();
    const subMatch = (s1 === s2 || s1.includes(s2) || s2.includes(s1));
    if (!subMatch) return false;

    const clean1 = normalizeTopicName(top1);
    const clean2 = normalizeTopicName(top2);
    if (!clean1 || !clean2) return false;

    return clean1 === clean2 || clean1.includes(clean2) || clean2.includes(clean1);
  }

  // Resolve matching topic in localStorage across all dates and on backend
  async function apiResolveTopicEverywhere(subject, topic) {
    if (!subject || !topic) return;
    const normSub = (subject || '').toLowerCase().trim();
    const normTopic = (topic || '').trim();

    try {
      const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        let changed = false;
        Object.keys(all).forEach(d => {
          const dayData = all[d];
          if (dayData && Array.isArray(dayData.reading_topics)) {
            dayData.reading_topics.forEach(t => {
              const match = isTopicMatch(t.subject, t.topic, normSub, normTopic);
              if (match && t.status !== 'achieved') {
                t.status = 'achieved';
                t.achieved_at = new Date().toISOString();
                t.cleared_by = 'mastery_exam';
                changed = true;
              }
            });
          }
        });
        if (changed) {
          localStorage.setItem(LOCAL_PLANNER_KEY, JSON.stringify(all));
        }
      }
    } catch (e) {
      console.warn('Error resolving topic locally:', e);
    }

    try {
      await authFetch(`${API_BASE}/daily-planner/resolve-by-topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: normSub, topic: normTopic })
      });
    } catch (e) {
      console.warn('Backend resolve deferred:', e);
    }
  }

  // Detect whether a chapter is on Today's reading list or in Backlog
  function getChapterReadingPlanStatus(subject, topicSlug) {
    if (!subject || !topicSlug) return null;
    const normSub = subject.toLowerCase().trim();
    const normTopic = topicSlug.trim();
    const todayStr = getTodayISODate();

    const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
    if (!raw) return null;
    try {
      const all = JSON.parse(raw);
      // 1. Check today
      const todayData = all[todayStr];
      if (todayData && Array.isArray(todayData.reading_topics)) {
        const match = todayData.reading_topics.find(t => isTopicMatch(t.subject, t.topic, normSub, normTopic));
        if (match) {
          return {
            status: 'today',
            isAchieved: match.status === 'achieved',
            plannedDate: todayStr,
            slot: match.slot,
            topicItem: match
          };
        }
      }

      // 2. Check past dates for backlog
      const pastDates = Object.keys(all).sort().reverse();
      for (const d of pastDates) {
        if (d >= todayStr) continue;
        const dayData = all[d];
        if (dayData && Array.isArray(dayData.reading_topics)) {
          const match = dayData.reading_topics.find(t => isTopicMatch(t.subject, t.topic, normSub, normTopic));
          if (match && match.status !== 'achieved') {
            const d1 = new Date(d);
            const d2 = new Date(todayStr);
            const daysOverdue = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
            return {
              status: 'backlog',
              isAchieved: false,
              plannedDate: d,
              daysOverdue,
              topicItem: match
            };
          }
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  async function apiAddPlannerTopic(date, subject, topic, slot, notes) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    if (!local.reading_topics) local.reading_topics = [];
    const pendingCount = local.reading_topics.filter(t => t.status !== 'achieved').length;

    if (pendingCount >= 10) {
      alert(`🛑 Active Chapter Limit Reached (10/10 Chapters)!\n\nYou already have ${pendingCount} active pending chapters in your Prep Tracker.\n\nPlease read these first and mark +1 Read count (pass the qualifying exam) before adding more!`);
      throw new Error('Chapter limit reached (10/10)');
    }

    const newTopic = {
      id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      subject: subject.toLowerCase().trim(),
      topic: topic.trim(),
      slot: slot || 'midnight_slot',
      notes: (notes || '').trim(),
      status: 'pending',
      achieved_by_12pm: false,
      missed_12pm: false,
      created_at: new Date().toISOString(),
      achieved_at: null
    };
    local.reading_topics.push(newTopic);
    saveLocalDailyPlanner(targetDate, local);

    try {
      const res = await authFetch(`${API_BASE}/daily-planner/topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate, subject, topic, slot, notes })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.limit_reached) {
          alert(`🛑 ${errJson.error}`);
        }
      }
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }
    return newTopic;
  }

  // Batch add multiple selected chapters (Enforces strict 10-chapter maximum)
  async function apiAddPlannerTopicsBatch(date, subject, topicsList, slot, notes) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    if (!local.reading_topics) local.reading_topics = [];
    const pendingCount = local.reading_topics.filter(t => t.status !== 'achieved').length;

    if (pendingCount >= 10) {
      alert(`🛑 Active Chapter Limit Reached (10/10 Chapters)!\n\nYou currently have ${pendingCount} active chapters in your Prep Tracker.\n\nUnder your preparation rules, you must read these first and mark +1 Read count before adding more!`);
      return [];
    }

    const availableSlots = 10 - pendingCount;
    if (topicsList.length > availableSlots) {
      alert(`⚠️ Capacity Alert:\nYou selected ${topicsList.length} chapters, but only ${availableSlots} slot(s) remain before reaching the 10-chapter maximum.\n\nOnly the first ${availableSlots} chapter(s) will be added. Read and conquer these with +1 Read count to unlock more!`);
    }

    const allowedList = topicsList.slice(0, availableSlots);
    const created = [];
    for (const tName of allowedList) {
      if (!tName || !tName.trim()) continue;
      const newTopic = {
        id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        subject: subject.toLowerCase().trim(),
        topic: tName.trim(),
        slot: slot || 'midnight_slot',
        notes: (notes || '').trim(),
        status: 'pending',
        achieved_by_12pm: false,
        missed_12pm: false,
        created_at: new Date().toISOString(),
        achieved_at: null
      };
      local.reading_topics.push(newTopic);
      created.push(newTopic);

      // Async push to server
      authFetch(`${API_BASE}/daily-planner/topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate, subject, topic: tName.trim(), slot, notes })
      }).catch(err => console.warn('Topic batch sync error:', err));
    }

    saveLocalDailyPlanner(targetDate, local);
    return created;
  }

  async function apiUpdatePlannerTopic(date, id, updates) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    const t = (local.reading_topics || []).find(item => item.id === id);
    if (t) {
      Object.assign(t, updates);
      if (updates.status === 'achieved') {
        t.achieved_at = new Date().toISOString();
      }
      saveLocalDailyPlanner(targetDate, local);
    }

    try {
      await authFetch(`${API_BASE}/daily-planner/topic/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate, ...updates })
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }
  }

  // Safe DELETE for reading topic: sends both query param and JSON body
  async function apiDeletePlannerTopic(date, id) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    local.reading_topics = (local.reading_topics || []).filter(item => item.id !== id);
    saveLocalDailyPlanner(targetDate, local);

    try {
      await authFetch(`${API_BASE}/daily-planner/topic/${encodeURIComponent(id)}?date=${encodeURIComponent(targetDate)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate })
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }
  }

  async function apiAddPlannerTask(date, text, priority, time_est) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      text: text.trim(),
      priority: priority || 'normal',
      time_est: (time_est || '').trim(),
      completed: false,
      created_at: new Date().toISOString(),
      completed_at: null
    };
    if (!local.daily_tasks) local.daily_tasks = [];
    local.daily_tasks.push(newTask);
    saveLocalDailyPlanner(targetDate, local);

    try {
      await authFetch(`${API_BASE}/daily-planner/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate, text, priority, time_est })
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }
    return newTask;
  }

  async function apiUpdatePlannerTask(date, id, updates) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    const task = (local.daily_tasks || []).find(item => item.id === id);
    if (task) {
      Object.assign(task, updates);
      if (updates.completed !== undefined) {
        task.completed_at = updates.completed ? new Date().toISOString() : null;
      }
      saveLocalDailyPlanner(targetDate, local);
    }

    try {
      await authFetch(`${API_BASE}/daily-planner/task/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate, ...updates })
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }
  }

  // Safe DELETE for daily task: sends both query param and JSON body to eliminate 500 error
  async function apiDeletePlannerTask(date, id) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    local.daily_tasks = (local.daily_tasks || []).filter(item => item.id !== id);
    saveLocalDailyPlanner(targetDate, local);

    try {
      await authFetch(`${API_BASE}/daily-planner/task/${encodeURIComponent(id)}?date=${encodeURIComponent(targetDate)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate })
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }
  }

  // Midnight / End-of-Day Audit Checkpoint
  async function apiEvaluateMidnightPlanner(date) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    let count = 0;
    (local.reading_topics || []).forEach(t => {
      if (t.status !== 'achieved') {
        t.missed_12pm = true;
        t.missed_midnight = true;
        count++;
      }
    });
    saveLocalDailyPlanner(targetDate, local);

    try {
      await authFetch(`${API_BASE}/daily-planner/evaluate-midnight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate })
      });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
    return count;
  }

  async function apiEvaluate12pmPlanner(date) {
    return apiEvaluateMidnightPlanner(date);
  }

  async function apiRolloverPlanner(fromDate, toDate) {
    let sourceDate = fromDate;
    if (!sourceDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const y = yesterday.getFullYear();
      const m = String(yesterday.getMonth() + 1).padStart(2, '0');
      const d = String(yesterday.getDate()).padStart(2, '0');
      sourceDate = `${y}-${m}-${d}`;
    }
    const targetDate = toDate || activePlannerDate;
    const source = getLocalDailyPlanner(sourceDate);
    const target = getLocalDailyPlanner(targetDate);

    const pendingTopics = (source.reading_topics || [])
      .filter(t => t.status !== 'achieved')
      .map(t => ({
        id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        subject: t.subject,
        topic: t.topic,
        slot: 'midnight_slot',
        notes: (t.notes ? t.notes + ' ' : '') + `(Rolled from ${sourceDate})`,
        status: 'pending',
        achieved_by_12pm: false,
        missed_12pm: false,
        created_at: new Date().toISOString(),
        achieved_at: null
      }));

    const incompleteTasks = (source.daily_tasks || [])
      .filter(t => !t.completed)
      .map(t => ({
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        text: t.text,
        priority: t.priority || 'normal',
        time_est: t.time_est || '',
        completed: false,
        created_at: new Date().toISOString(),
        completed_at: null
      }));

    if (!target.reading_topics) target.reading_topics = [];
    if (!target.daily_tasks) target.daily_tasks = [];
    target.reading_topics.push(...pendingTopics);
    target.daily_tasks.push(...incompleteTasks);
    saveLocalDailyPlanner(targetDate, target);

    try {
      await authFetch(`${API_BASE}/daily-planner/rollover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_date: sourceDate, to_date: targetDate })
      });
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
    return { topics: pendingTopics.length, tasks: incompleteTasks.length };
  }


  // -------------------------------------------------------------
  // URL & PATH HELPERS
  // -------------------------------------------------------------
  function getCurrentTopicInfo() {
    const rawPath = decodeURIComponent(location.pathname);
    const match = rawPath.match(/\/subjects\/([^\/]+)\/([^\/]+)/i);
    if (!match) return null;

    const subject = match[1].replace(/%20/g, ' ').trim();
    const topicSlug = match[2].trim();

    if (topicSlug === 'index.html' || topicSlug === 'index' || topicSlug === '' || topicSlug === 'prompt') {
      return null;
    }

    const heading = document.querySelector('.md-content__inner h1');
    const title = heading ? heading.textContent.replace(/¶/g, '').trim() : topicSlug.replace(/_/g, ' ');

    return { subject, topic: topicSlug, title };
  }

  function getTopicInfo() {
    return getCurrentTopicInfo();
  }

  function getSiteBasePath() {
    if (location.pathname.startsWith('/UP-PCS/')) {
      return '/UP-PCS/';
    }
    return '/';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(d) {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatDateTime(d) {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDuration(sec) {
    if (!sec || sec <= 0) return '—';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  }

  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('st-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'st-toast-container';
      container.className = 'st-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `st-toast st-toast-${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : 'ℹ️'));
    toast.innerHTML = `<span class="st-toast-icon">${icon}</span><span class="st-toast-msg">${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function timeAgo(d) {
    if (!d) return 'Never';
    const diffMs = Date.now() - new Date(d).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(d);
  }

  // -------------------------------------------------------------
  // CHAPTER MCQ & PYQ PARSER
  // Automatically extracts practice questions from the note page!
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // MULTI-FORMAT STEM & OPTIONS EXTRACTOR
  // Handles standard multi-line, inline pipe, codes, and match formats
  // -------------------------------------------------------------
  function scoreOptionSet(options) {
    const vals = ['A', 'B', 'C', 'D'].map((k) => String((options && options[k]) || '').trim());
    if (vals.some((v) => !v)) return -1000;
    let score = 0;
    for (const v of vals) {
      const compact = v.replace(/\s+/g, ' ');
      if (/^(?:\d+\s*[-\u2013\u2014]\s*){2,}\d+$/.test(compact)) score += 6;
      else if (/^(?:\d+\s+){2,}\d+$/.test(compact)) score += 6;
      else if (/^[A-D]\s*-\s*\d+/i.test(compact)) score += 6;
      else if (/^only\b/i.test(compact)) score += 5;
      else if (/both\s*\(A\)|\(A\)\s+is\s+(true|false)/i.test(compact)) score += 5;
      else if (/^(?:neither|all)\b/i.test(compact)) score += 4;
      if (/\|\s*\d+\./.test(v)) score -= 10;
      if (/row order is not/i.test(v)) score -= 10;
      if (/\n\s*[A-D][\.\)]/.test(v)) score -= 8;
      if (compact.length > 140) score -= 3;
      if (compact.length < 55) score += 1;
    }
    return score;
  }

  function optionsHaveText(options) {
    return !!(
      options &&
      typeof options === 'object' &&
      options.A && String(options.A).trim() &&
      options.B && String(options.B).trim() &&
      options.C && String(options.C).trim() &&
      options.D && String(options.D).trim()
    );
  }

  function optionsLookLikeListRows(options) {
    if (!options || typeof options !== 'object') return false;
    const joined = ['A', 'B', 'C', 'D'].map((k) => String(options[k] || '')).join('\n');
    return /\|\s*\d+\./.test(joined) || /row order is not/i.test(joined);
  }

  function repairQuestionOptions(q) {
    if (!q || typeof q !== 'object') return q;
    let stem = q.stem || '';
    let options = q.options;
    const needsRepair =
      !optionsHaveText(options) ||
      optionsLookLikeListRows(options) ||
      /Options\s*:\s*[A-D]\./i.test(stem) ||
      /A\.[^\|\n]+\|\s*B\./i.test(stem) ||
      (/[A-D]\.\s+[^\n]+\|\s*[A-D]\./i.test(stem) && !optionsHaveText(options));

    if (needsRepair) {
      const parsed = extractStemAndOptions(stem);
      if (optionsHaveText(parsed.options) && scoreOptionSet(parsed.options) > scoreOptionSet(options || {})) {
        options = parsed.options;
        stem = parsed.stem;
      } else if (!optionsHaveText(options) && optionsHaveText(parsed.options)) {
        options = parsed.options;
        stem = parsed.stem;
      }
    }

    if (!optionsHaveText(options)) {
      options = {
        A: (options && options.A) || 'Option A',
        B: (options && options.B) || 'Option B',
        C: (options && options.C) || 'Option C',
        D: (options && options.D) || 'Option D'
      };
    }

    return { ...q, stem, options };
  }

  function extractStemAndOptions(rawBlock) {
    let text = (rawBlock || '').replace(/\r/g, '').trim();
    let stem = text;
    let options = { A: '', B: '', C: '', D: '' };

    // 1. Explicit Options / Codes label
    const labelMatch = text.match(/\n?\s*(?:Options|Codes|Code)\s*:\s*([\s\S]+)$/i);
    if (labelMatch) {
      const candidateStem = text.substring(0, labelMatch.index).trim();
      const optChunk = labelMatch[1].trim();
      const delim = /(?:^|[\s\|\n]+)(?:\(?([A-D])[\.\)]|\b([A-D])[\.\)])\s*/gi;
      let matches = [...optChunk.matchAll(delim)];
      if (matches.length >= 4) {
        const labeled = { A: '', B: '', C: '', D: '' };
        for (let i = 0; i < matches.length; i++) {
          const letter = (matches[i][1] || matches[i][2]).toUpperCase();
          const start = matches[i].index + matches[i][0].length;
          const end = i + 1 < matches.length ? matches[i+1].index : optChunk.length;
          const val = optChunk.substring(start, end).replace(/^[\|\s]+|[\|\s]+$/g, '').trim();
          if (['A','B','C','D'].includes(letter)) labeled[letter] = val;
        }
        if (optionsHaveText(labeled)) {
          return { stem: candidateStem, options: labeled };
        }
      }
    }

    // 2. Sequential A, B, C, D search — collect all viable sets, pick best score
    const delim = /(?:^|\n\s*|\s*\|\s*|(?<=[\?\.\:\!])\s+|\s{2,}|\s+)(?:\(([A-D])\)|([A-D])[\.\)])\s+/gi;
    const allMatches = [...text.matchAll(delim)];
    const aMatches = allMatches.filter(m => (m[1]||m[2]).toUpperCase() === 'A');
    let best = null;

    for (let a of aMatches) {
      const afterA = text.substring(a.index);
      const subMatches = [...afterA.matchAll(delim)];
      const seq = subMatches.map(m => (m[1]||m[2]).toUpperCase());
      const aIdx = seq.indexOf('A');
      const bIdx = seq.indexOf('B', aIdx + 1);
      const cIdx = seq.indexOf('C', bIdx + 1);
      const dIdx = seq.indexOf('D', cIdx + 1);

      if (aIdx !== -1 && bIdx !== -1 && cIdx !== -1 && dIdx !== -1) {
        const mA = subMatches[aIdx];
        const mB = subMatches[bIdx];
        const mC = subMatches[cIdx];
        const mD = subMatches[dIdx];

        const candidateStem = text.substring(0, a.index + mA.index).replace(/\n?\s*(?:Options|Codes|Code)\s*:?\s*$/i, '').trim();

        const posA = a.index + mA.index + mA[0].length;
        const posB = a.index + mB.index;
        const posC = a.index + mC.index;
        const posD = a.index + mD.index;
        const endD = text.length;

        const optA = text.substring(posA, posB).replace(/^[\|\s]+|[\|\s]+$/g, '').trim();
        const optB = text.substring(posB + mB[0].length, posC).replace(/^[\|\s]+|[\|\s]+$/g, '').trim();
        const optC = text.substring(posC + mC[0].length, posD).replace(/^[\|\s]+|[\|\s]+$/g, '').trim();
        const optD = text.substring(posD + mD[0].length, endD).replace(/^[\|\s]+|[\|\s]+$/g, '').trim();

        if (optA && optB && optC && optD) {
          const candidate = {
            stem: candidateStem,
            options: { A: optA, B: optB, C: optC, D: optD }
          };
          const score = scoreOptionSet(candidate.options);
          if (!best || score >= best.score) {
            best = { ...candidate, score };
          }
        }
      }
    }

    if (best && best.score > -50) {
      return { stem: best.stem, options: best.options };
    }

    // 3. Fallback: line-by-line check
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    lines.forEach(line => {
      const m = line.match(/^([A-D])\.\s*(.+)$/i);
      if (m) {
        options[m[1].toUpperCase()] = m[2].trim();
      }
    });

    return { stem, options };
  }

  function wrapArithmatex(s) {
    if (!s) return s;
    if (s.indexOf("$") === -1 && s.indexOf("\\(") === -1 && s.indexOf("\\[") === -1) return s;
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, '<span class="arithmatex">$$$1$$</span>');
    s = s.replace(/\\\[([\s\S]+?)\\\]/g, '<span class="arithmatex">\\[$1\\]</span>');
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, '<span class="arithmatex">\\($1\\)</span>');
    s = s.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, '<span class="arithmatex">\\($1\\)</span>');
    return s;
  }

  function renderInlineMd(text) {
    if (!text) return '';
    let s = String(text);
    if (!/<(?:strong|em|span|div|code|a|p|table)\b/i.test(s)) {
      s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    // Math before underscore-italic so $D_2O$ / $10^5$ stay intact for MathJax.
    s = wrapArithmatex(s);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    s = s.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
  }

  function typesetQuizMath(root) {
    const el = root || document.querySelector('.st-quiz-container') || document.querySelector('.st-modal-body');
    if (!el || !window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;
    const run = () => window.MathJax.typesetPromise([el]).catch(() => {});
    if (window.MathJax.startup && window.MathJax.startup.promise) {
      window.MathJax.startup.promise.then(run).catch(() => {});
    } else {
      run();
    }
  }

  function renderStemToHtml(rawStem) {
    if (!rawStem) return '';
    let text = String(rawStem).trim();

    // 1. Markdown tables to styled HTML table
    const tableRegex = /(?:^|\n)(\|[^\n]+\|\r?\n\|[-:\s\|]+\|\r?\n(?:\|[^\n]+\|\r?\n?)+)/g;
    text = text.replace(tableRegex, (match, tableBlock) => {
      const lines = tableBlock.trim().split(/\r?\n/).map(l => l.trim());
      if (lines.length < 3) return match;

      const parseRow = line => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      const headers = parseRow(lines[0]);
      const rows = lines.slice(2).map(parseRow);

      let html = '<div class="st-match-table-card"><table class="st-match-table">';
      if (headers.length > 0) {
        html += '<thead><tr>' + headers.map(h => '<th>' + renderInlineMd(h) + '</th>').join('') + '</tr></thead>';
      }
      html += '<tbody>';
      rows.forEach(r => {
        html += '<tr>' + r.map(c => {
          let cell = renderInlineMd(c);
          cell = cell.replace(/^([A-D])[\.\)]\s*/i, '<span class="st-match-chip-letter">$1</span> ');
          cell = cell.replace(/^(\d+)[\.\)]\s*/i, '<span class="st-match-chip-num">$1</span> ');
          return '<td>' + cell + '</td>';
        }).join('') + '</tr>';
      });
      html += '</tbody></table></div>';
      return '\n\n' + html + '\n\n';
    });

    // 1b. Condensed List-I / List-II lines (Science ingest style)
    // Match List-I with List-II:
    // List-I: A. Stethoscope, B. Sphygmomanometer, C. Caratometer, D. Luxmeter
    // List-II: 1. Intensity of light, 2. Purity of gold, 3. Hear heart sound, 4. Measure blood pressure
    const listLabeledRe = /((?:Match[^\n]*?)?)\s*List-I\s*:\s*A\.\s*([^,]+),\s*B\.\s*([^,]+),\s*C\.\s*([^,]+),\s*D\.\s*([^\n]+?)\s*List-II\s*:\s*1\.\s*([^,]+),\s*2\.\s*([^,]+),\s*3\.\s*([^,]+),\s*4\.\s*([^\n]+)/i;
    const listLabeled = text.match(listLabeledRe);
    if (listLabeled) {
      const introRaw = (listLabeled[1] || '').trim().replace(/:+$/, '');
      const intro = introRaw || 'Match List-I with List-II';
      const listI = [listLabeled[2], listLabeled[3], listLabeled[4], listLabeled[5]].map(s => s.trim());
      const listII = [listLabeled[6], listLabeled[7], listLabeled[8], listLabeled[9]].map(s => s.trim());
      const letters = ['A', 'B', 'C', 'D'];
      let tableHtml = '<div class="st-stem-intro">' + renderInlineMd(intro) + ':</div>';
      tableHtml += '<div class="st-match-table-card"><table class="st-match-table"><thead><tr><th>List-I</th><th>List-II</th></tr></thead><tbody>';
      for (let i = 0; i < 4; i++) {
        tableHtml += '<tr><td><span class="st-match-chip-letter">' + letters[i] + '</span> ' + renderInlineMd(listI[i]) + '</td><td><span class="st-match-chip-num">' + (i + 1) + '</span> ' + renderInlineMd(listII[i]) + '</td></tr>';
      }
      tableHtml += '</tbody></table></div>';
      text = text.replace(listLabeled[0], tableHtml);
    }

    // 2. Condensed inline Match questions (e.g. Match: A. ... B. ... with 1. ... 2. ...)
    const inlineMatchRe = /(Match(?:\s+List-[I1V]+(?:\s*\([^)]*\))?\s+with\s+List-[I1V]+(?:\s*\([^)]*\))?|:)\s*:?)\s*A\.\s*([^B]+)\s+B\.\s*([^C]+)\s+C\.\s*([^D]+)\s+D\.\s*([^w]+)\s+with\s+1\.\s*([^2]+)\s+2\.\s*([^3]+)\s+3\.\s*([^4]+)\s+4\.\s*([\s\S]+?)(?=\s*(?:\n\s*(?:Options|Codes|Code):|$))/i;
    const mMatch = text.match(inlineMatchRe);
    if (mMatch) {
      const intro = mMatch[1].replace(/:+$/, '').trim() || 'Match List-I with List-II';
      const listI = [mMatch[2].trim(), mMatch[3].trim(), mMatch[4].trim(), mMatch[5].trim()];
      const listII = [mMatch[6].trim(), mMatch[7].trim(), mMatch[8].trim(), mMatch[9].trim()];
      const letters = ['A', 'B', 'C', 'D'];

      let tableHtml = '<div class="st-stem-intro">' + renderInlineMd(intro) + ':</div>';
      tableHtml += '<div class="st-match-table-card"><table class="st-match-table"><thead><tr><th>List-I</th><th>List-II</th></tr></thead><tbody>';
      for (let i = 0; i < 4; i++) {
        tableHtml += '<tr><td><span class="st-match-chip-letter">' + letters[i] + '</span> ' + renderInlineMd(listI[i]) + '</td><td><span class="st-match-chip-num">' + (i+1) + '</span> ' + renderInlineMd(listII[i]) + '</td></tr>';
      }
      tableHtml += '</tbody></table></div>';
      text = text.replace(mMatch[0], tableHtml);
    }

    // 3. Condensed inline Arrange questions
    const arrangeRe = /(Arrange[^\:]*:\s*)1\.\s*([^2]+)\s+2\.\s*([^3]+)\s+3\.\s*([^4]+)\s+4\.\s*([\s\S]+?)(?=\s*(?:\n\s*(?:Options|Codes|Code):|$))/i;
    const aMatch = text.match(arrangeRe);
    if (aMatch) {
      const intro = aMatch[1].replace(/:+$/, '').trim() || 'Arrange in order';
      const items = [aMatch[2].trim(), aMatch[3].trim(), aMatch[4].trim(), aMatch[5].trim()];
      let listHtml = '<div class="st-stem-intro">' + renderInlineMd(intro) + ':</div><div class="st-arrange-card"><ol class="st-arrange-list">';
      items.forEach((it, idx) => {
        listHtml += '<li><span class="st-arrange-badge">' + (idx + 1) + '</span><span class="st-arrange-text">' + renderInlineMd(it) + '</span></li>';
      });
      listHtml += '</ol></div>';
      text = text.replace(aMatch[0], listHtml);
    }

    // Format paragraphs and line breaks
    const blocks = text.split(/\n{2,}/);
    return blocks.map(b => {
      b = b.trim();
      if (!b) return '';
      if (b.startsWith('<div class="st-match-table-card"') || b.startsWith('<div class="st-arrange-card"') || b.startsWith('<div class="st-stem-intro"')) {
        return b;
      }
      if (/^\d+\.\s+/.test(b)) {
        const items = b.split(/\n(?=\d+\.\s+)/);
        return '<ol class="st-stem-numbered-list">' + items.map(it => '<li>' + renderInlineMd(it.replace(/^\d+\.\s*/, '')) + '</li>').join('') + '</ol>';
      }
      return '<p class="st-stem-para">' + renderInlineMd(b).replace(/\n/g, '<br/>') + '</p>';
    }).filter(Boolean).join('');
  }

  function formatQuizOptionText(optText) {
    if (!optText) return '';
    const trimmed = String(optText).trim();
    if (/^\d\s*[-–—\s]\s*\d\s*[-–—\s]\s*\d\s*[-–—\s]\s*\d$/.test(trimmed)) {
      const nums = trimmed.split(/[-–—\s]+/).filter(Boolean);
      return `<span class="st-match-code-wrap">${nums.map(n => `<span class="st-match-code-num">${n}</span>`).join('<span class="st-match-code-sep">—</span>')}</span>`;
    }
    if (/^[A-D]\s*[-–—:]\s*\d/.test(trimmed)) {
      const pairs = trimmed.split(/[,\s]+/).filter(Boolean);
      return `<span class="st-match-pairs-wrap">${pairs.map(p => `<span class="st-match-pair-chip">${p}</span>`).join(' ')}</span>`;
    }
    return renderInlineMd(trimmed);
  }

  function extractChapterQuestions() {
    const container = document.querySelector('.md-content__inner');
    if (!container) return [];

    const detailsList = container.querySelectorAll('details');
    const questions = [];

    detailsList.forEach((details, index) => {
      const summaryText = details.querySelector('summary')?.textContent || '';
      // Only parse details that are answer reveal blocks
      if (!/show answer|answer|solution|view logic/i.test(summaryText)) return;

      const answerBody = details.innerHTML;
      // Extract correct answer letter: Ans: B, Correct Answer: D, etc.
      const ansMatch = answerBody.match(/(?:Ans|Correct Answer|Answer)\s*:\s*\*?\*?([A-D])\*?\*?/i) ||
                       answerBody.match(/\*?\*?([A-D])\*?\*?\s*(?:is correct|only)/i);
      const correctLetter = ansMatch ? ansMatch[1].toUpperCase() : null;
      if (!correctLetter) return; // Skip if no clear answer letter

      // Extract question and options by looking at preceding elements
      let curr = details.previousElementSibling;
      const questionBlocks = [];
      let foundOptions = false;
      let countBack = 0;

      while (curr && countBack < 8) {
        // Stop if we hit previous details or an H2/H3
        if (curr.tagName === 'DETAILS' || /^H[1-3]$/.test(curr.tagName) || curr.tagName === 'HR') break;

        const text = curr.textContent || '';
        questionBlocks.unshift(curr);

        if (/\b[A-D]\.\s+/.test(text)) {
          foundOptions = true;
        }

        curr = curr.previousElementSibling;
        countBack++;
      }

      if (!questionBlocks.length) return;

      // Extract question text and options
      let combinedHtml = questionBlocks.map(el => el.outerHTML).join('');
      let rawText = questionBlocks.map(el => el.textContent).join('\n');

      // Parse options A, B, C, D and question stem robustly
      const parsedData = extractStemAndOptions(rawText);
      const options = parsedData.options;
      let stem = parsedData.stem;

      // Find preceding section heading (H2/H3/H4)
      let secHeading = '';
      let walk = details.previousElementSibling;
      while (walk) {
        if (/^H[1-4]$/i.test(walk.tagName)) {
          secHeading = walk.textContent.replace(/¶/g, '').trim();
          break;
        }
        walk = walk.previousElementSibling;
      }

      let category = 'pyqs';
      const secLower = secHeading.toLowerCase();
      if (secLower.includes('practice zone') || secLower.includes('format drill') || secLower.includes('practice drill')) {
        category = 'practice';
      } else if (secLower.includes('ghatnachakra') || secLower.includes('purvavlokan')) {
        category = 'ghatnachakra';
      } else if (secLower.includes('pyq') || secLower.includes('prelims')) {
        category = 'pyqs';
      }

      questions.push({
        id: `q_${index + 1}`,
        q_num: qNum,
        q_header: category === 'practice' ? `Practice Zone — Q${qNum}` : (category === 'ghatnachakra' ? `Ghatnachakra — Q${qNum}` : `Question ${qNum}`),
        section_title: secHeading,
        category: category,
        stem: stem,
        options: options,
        correct_answer: correctLetter,
        explanation_html: answerBody,
        raw_html: combinedHtml
      });
    });

    if (questions.length === 0) {
      // Fallback: Parse inline questions from content text (e.g. Q1... A. B. C. D. Answer: C)
      const fullText = container.innerText || '';
      const inlineRegex = /(?:^|\n)\s*(?:\*\*)?(?:Q|Question)\s*(\d+)[^\n]*\n([\s\S]*?)(?:\*Answer:\*|\*\*Answer:\*\*|\*Ans:\*|\*\*Ans:\*\*|Answer:|Ans:)\s*\*?\*?([A-D])\*?\*?([^\n]*)/gi;
      let inM;
      while ((inM = inlineRegex.exec(fullText)) !== null) {
        const qNum = inM[1];
        const body = inM[2].trim();
        const correctAns = inM[3].toUpperCase();
        const expl = inM[4].trim();

        const options = { A: '', B: '', C: '', D: '' };
        const optRegex = /(?:^|\n)\s*([A-D])[\.\)]\s+([^\n\r]+)/g;
        let optM;
        let firstOptIdx = -1;
        while ((optM = optRegex.exec(body)) !== null) {
          if (firstOptIdx === -1) firstOptIdx = optM.index;
          options[optM[1].toUpperCase()] = optM[2].trim();
        }

        let stem = body;
        if (firstOptIdx !== -1) {
          stem = body.substring(0, firstOptIdx).trim();
        }

        questions.push({
          id: `q_${questions.length + 1}`,
          q_num: Number(qNum) || (questions.length + 1),
          q_header: `Question ${qNum}`,
          section_title: 'Practice Questions',
          category: 'practice',
          stem: stem,
          options: options,
          correct_answer: correctAns,
          explanation_html: expl ? `<p>${expl}</p>` : `Correct Answer: ${correctAns}`,
          raw_html: ''
        });
      }
    }

    return questions;
  }

  // -------------------------------------------------------------
  // DAILY READING TIME TRACKER & MULTI-TAB SESSION SYNC
  // -------------------------------------------------------------
  const LOCAL_DAILY_TIME_KEY = 'uppcs_daily_study_time';
  const ACTIVE_TAB_KEY = 'uppcs_active_study_tab';
  const CURRENT_TAB_ID = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

  // Claim active study tab leadership (only the tab user is actively reading ticks)
  function claimActiveTabFocus(topic) {
    if (document.hidden) return;
    try {
      const payload = {
        tabId: CURRENT_TAB_ID,
        subject: topic?.subject || '',
        topic: topic?.topic || '',
        lastHeartbeat: Date.now()
      };
      localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify(payload));
    } catch {}
  }

  // Check if this tab is the active tab leader or if another tab has focus
  function isThisTabActiveLeader() {
    if (document.hidden) return false;
    try {
      const raw = localStorage.getItem(ACTIVE_TAB_KEY);
      if (!raw) return true;
      const info = JSON.parse(raw);
      // If another tab claimed leadership in the last 4 seconds and has a different tab ID:
      if (info && info.tabId && info.tabId !== CURRENT_TAB_ID && (Date.now() - info.lastHeartbeat < 4500)) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }

  // Read study record for a date from localStorage
  function getDailyStudyTimeRecord(dateStr = getTodayISODate()) {
    try {
      const raw = localStorage.getItem(LOCAL_DAILY_TIME_KEY);
      const all = raw ? JSON.parse(raw) : {};
      if (!all[dateStr]) {
        all[dateStr] = { date: dateStr, chapters: {}, totalSeconds: 0 };
      }
      return all[dateStr];
    } catch {
      return { date: dateStr, chapters: {}, totalSeconds: 0 };
    }
  }

  // Get cumulative seconds read today for this chapter
  function getTodayChapterStudySeconds(subject, topicSlug, dateStr = getTodayISODate()) {
    if (!subject || !topicSlug) return 0;
    const rec = getDailyStudyTimeRecord(dateStr);
    const key = `${String(subject).toLowerCase().trim()}__${String(topicSlug).trim()}`;
    return (rec.chapters && rec.chapters[key] && rec.chapters[key].seconds) ? rec.chapters[key].seconds : 0;
  }

  // Format seconds into human duration (e.g. 45m or 1h 20m)
  function formatDurationDisplay(sec) {
    if (!sec || sec < 60) return sec > 0 ? `${sec}s` : '0m';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  }

  // Save/accumulate chapter study seconds for today
  function saveTodayChapterStudySeconds(subject, topicSlug, title, seconds, dateStr = getTodayISODate()) {
    if (!subject || !topicSlug) return;
    try {
      const raw = localStorage.getItem(LOCAL_DAILY_TIME_KEY);
      const all = raw ? JSON.parse(raw) : {};
      if (!all[dateStr]) {
        all[dateStr] = { date: dateStr, chapters: {}, totalSeconds: 0 };
      }
      const key = `${String(subject).toLowerCase().trim()}__${String(topicSlug).trim()}`;
      const prev = (all[dateStr].chapters[key] && all[dateStr].chapters[key].seconds) || 0;
      const finalSec = Math.max(prev, seconds);

      all[dateStr].chapters[key] = {
        subject: String(subject).toLowerCase().trim(),
        topic: String(topicSlug).trim(),
        title: title || topicSlug,
        seconds: finalSec,
        lastActive: Date.now()
      };

      let sum = 0;
      Object.values(all[dateStr].chapters).forEach(c => {
        sum += (c.seconds || 0);
      });
      all[dateStr].totalSeconds = sum;

      localStorage.setItem(LOCAL_DAILY_TIME_KEY, JSON.stringify(all));

      // Also sync to local daily planner topic item if present for this date
      const localPlanner = getLocalDailyPlanner(dateStr);
      let updatedPlanner = false;
      (localPlanner.reading_topics || []).forEach(t => {
        if (t.subject?.toLowerCase().trim() === String(subject).toLowerCase().trim() && t.topic?.trim() === String(topicSlug).trim()) {
          t.study_seconds = Math.max(t.study_seconds || 0, finalSec);
          updatedPlanner = true;
        }
      });
      if (updatedPlanner) {
        saveLocalDailyPlanner(dateStr, localPlanner);
      }

      // Sync to MongoDB backend
      const token = getStoredAuthToken();
      fetch(`${API_BASE}/daily-planner/study-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Basic ${token}` } : {})
        },
        body: JSON.stringify({
          date: dateStr,
          subject: String(subject).toLowerCase().trim(),
          topic: String(topicSlug).trim(),
          title: title || topicSlug,
          seconds: finalSec
        })
      }).catch(() => {});
    } catch (err) {
      console.warn('Error saving study time:', err);
    }
  }

  // Cross-device sync with MongoDB Atlas (merges phone + PC reading sessions)
  async function syncDailyStudyTimeWithServer(dateStr = getTodayISODate()) {
    try {
      const token = getStoredAuthToken();
      const headers = token ? { 'Authorization': `Basic ${token}` } : {};
      const res = await fetch(`${API_BASE}/daily-planner/study-time?date=${encodeURIComponent(dateStr)}`, { headers });
      if (!res.ok) return getDailyStudyTimeRecord(dateStr);

      const data = await res.json();
      if (!data || !data.chapters) return getDailyStudyTimeRecord(dateStr);

      const raw = localStorage.getItem(LOCAL_DAILY_TIME_KEY);
      const all = raw ? JSON.parse(raw) : {};
      if (!all[dateStr]) {
        all[dateStr] = { date: dateStr, chapters: {}, totalSeconds: 0 };
      }

      const localChaps = all[dateStr].chapters || {};
      const pushQueue = [];

      // Merge server records into local
      Object.keys(data.chapters).forEach(key => {
        const s = data.chapters[key];
        const l = localChaps[key];
        const sSec = s.seconds || 0;
        const lSec = l ? (l.seconds || 0) : 0;

        if (sSec >= lSec) {
          localChaps[key] = {
            subject: s.subject,
            topic: s.topic,
            title: s.title || s.topic,
            seconds: sSec,
            lastActive: s.lastActive || Date.now()
          };
        } else if (l && lSec > sSec) {
          pushQueue.push(l);
        }
      });

      // Also check local chapters that server might not have yet
      Object.keys(localChaps).forEach(key => {
        if (!data.chapters[key]) {
          pushQueue.push(localChaps[key]);
        }
      });

      // Recalculate total seconds
      let sum = 0;
      Object.values(localChaps).forEach(c => {
        sum += (c.seconds || 0);
      });
      all[dateStr].chapters = localChaps;
      all[dateStr].totalSeconds = sum;
      localStorage.setItem(LOCAL_DAILY_TIME_KEY, JSON.stringify(all));

      // Push any chapters where local was ahead to server so other devices get it
      if (pushQueue.length > 0) {
        pushQueue.forEach(c => {
          fetch(`${API_BASE}/daily-planner/study-time`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Basic ${token}` } : {})
            },
            body: JSON.stringify({
              date: dateStr,
              subject: c.subject,
              topic: c.topic,
              title: c.title,
              seconds: c.seconds
            })
          }).catch(() => {});
        });
      }

      return all[dateStr];
    } catch (e) {
      console.warn('Study time cross-device sync deferred:', e);
      return getDailyStudyTimeRecord(dateStr);
    }
  }

  // -------------------------------------------------------------
  // FLOATING IN-CHAPTER READING CLOCK & STOPWATCH
  // -------------------------------------------------------------
  let readingClockInterval = null;
  let readingClockSeconds = 0;
  let readingClockTopic = null;
  let readingClockIdleTimer = null;
  let isReadingClockIdle = false;
  let readingClockHandlersAttached = false;
  const IDLE_TIMEOUT_MS = 180000; // 3 minutes without mouse/keyboard/scroll pauses timer to avoid counting lost/idle time

  // Cleanup reading clock completely (used when leaving chapter notes or navigating to dashboard)
  function cleanupChapterReadingClock() {
    try {
      const raw = localStorage.getItem(ACTIVE_TAB_KEY);
      if (raw) {
        const info = JSON.parse(raw);
        if (info.tabId === CURRENT_TAB_ID) {
          localStorage.removeItem(ACTIVE_TAB_KEY);
        }
      }
    } catch {}
    if (readingClockInterval) {
      clearInterval(readingClockInterval);
      readingClockInterval = null;
    }
    if (readingClockIdleTimer) {
      clearTimeout(readingClockIdleTimer);
      readingClockIdleTimer = null;
    }
    if (readingClockTopic && readingClockSeconds > 0) {
      saveTodayChapterStudySeconds(
        readingClockTopic.subject,
        readingClockTopic.topic,
        readingClockTopic.title,
        readingClockSeconds
      );
    }
    const existing = document.getElementById('st-reading-clock-widget');
    if (existing) {
      existing.remove();
    }
    readingClockTopic = null;
    readingClockSeconds = 0;
    isReadingClockIdle = false;
  }

  function initChapterReadingClock(topicInfo) {
    if (!topicInfo) {
      cleanupChapterReadingClock();
      return;
    }

    // Clean up any previous session before binding current chapter
    cleanupChapterReadingClock();

    readingClockTopic = topicInfo;
    const todayStr = getTodayISODate();

    // 1. Resume from previous time spent TODAY on this chapter (accumulates across reloads, closes, new tabs till 11:59:59 PM)
    readingClockSeconds = getTodayChapterStudySeconds(topicInfo.subject, topicInfo.topic, todayStr);
    isReadingClockIdle = false;

    // Cross-device sync: pull latest study time from MongoDB Atlas (e.g. if read on mobile)
    syncDailyStudyTimeWithServer(todayStr).then(rec => {
      if (readingClockTopic && rec && rec.chapters) {
        const key = `${String(readingClockTopic.subject).toLowerCase().trim()}__${String(readingClockTopic.topic).trim()}`;
        if (rec.chapters[key] && rec.chapters[key].seconds > readingClockSeconds) {
          readingClockSeconds = rec.chapters[key].seconds;
          updateClockDisplay();
        }
        const curDayTot = rec.totalSeconds || 0;
        const dayPill = widget.querySelector('#st-clock-day-pill');
        if (dayPill) dayPill.textContent = 'Day: ' + formatDurationDisplay(curDayTot);
        const dayTimeEl = widget.querySelector('#st-hud-day-time');
        if (dayTimeEl) dayTimeEl.textContent = formatDurationDisplay(curDayTot);
      }
    }).catch(() => {});

    function formatClockTime(sec) {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      if (h > 0) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    const widget = document.createElement('div');
    widget.className = 'st-reading-clock-widget';
    widget.id = 'st-reading-clock-widget';
    widget.title = `Today's reading time for ${topicInfo.title || topicInfo.topic}. Accumulates till midnight.`;
    const todayTotalStudySec = getDailyStudyTimeRecord(todayStr).totalSeconds || 0;
    const initialPlan = getLocalDailyPlanner(todayStr);
    const initialTopics = initialPlan.reading_topics || [];
    const todayPlannedCount = initialTopics.length;
    const todayAchievedCount = initialTopics.filter(t => t.status === 'achieved').length;
    const todayPendingCount = initialTopics.filter(t => t.status !== 'achieved').length;
    const initialTasks = initialPlan.daily_tasks || [];
    const todayTasksCount = initialTasks.length;
    const todayTasksDone = initialTasks.filter(t => t.completed).length;
    widget.innerHTML = `
      <div class="st-clock-icon-wrap" id="st-clock-icon-btn" title="Click for Focus & Time Radar HUD">
        <span>⏱️</span>
        <span class="st-clock-pulse-dot" id="st-clock-pulse"></span>
      </div>
      <div class="st-clock-info">
        <div class="st-clock-topic-tag" title="${escapeHtml(topicInfo.title || topicInfo.topic)}">
          ${escapeHtml(topicInfo.title || topicInfo.topic)}
        </div>
        <div class="st-clock-digits-row">
          <span class="st-clock-time-val" id="st-clock-time-val">${formatClockTime(readingClockSeconds)}</span>
          <span class="st-clock-day-pill" id="st-clock-day-pill" title="Total active reading tracked across all notes today">Day: ${formatDurationDisplay(todayTotalStudySec)}</span>
        </div>
        <span class="st-clock-label" id="st-clock-label">Reading Notes</span>
      </div>
      <div class="st-clock-actions">
        <button type="button" class="st-clock-btn st-clock-zen-btn" id="st-clock-zen-btn" title="Toggle Zen / Focus Mode (Distraction-free reading)">🧘</button>
        <button type="button" class="st-clock-btn st-clock-hud-btn" id="st-clock-hud-btn" title="Open Time & Focus Analytics HUD">📊</button>
        <button type="button" class="st-clock-btn" id="st-clock-min-btn" title="Minimize / Expand">🗕</button>
      </div>

      <!-- Attached Mini Focus HUD Popover -->
      <div class="st-clock-hud-popover" id="st-clock-hud-popover" style="display:none;">
        <div class="st-hud-head">
          <div>
            <div class="st-hud-title">⚡ Focus & Time Radar</div>
            <div class="st-hud-sub">${escapeHtml(topicInfo.subject)} &bull; ${escapeHtml(topicInfo.title || topicInfo.topic)}</div>
          </div>
          <button type="button" class="st-hud-close" id="st-hud-close-btn">&times;</button>
        </div>
        <div class="st-hud-stats-grid">
          <div class="st-hud-stat-box" title="Active time spent reading THIS chapter today (accumulates till 11:59 PM)">
            <span class="st-hud-stat-num" id="st-hud-chap-time">${formatDurationDisplay(readingClockSeconds)}</span>
            <span class="st-hud-stat-lbl">This Chapter</span>
          </div>
          <div class="st-hud-stat-box" title="Combined reading time spent across ALL chapters & notes today">
            <span class="st-hud-stat-num" id="st-hud-day-time">${formatDurationDisplay(todayTotalStudySec)}</span>
            <span class="st-hud-stat-lbl">All Chapters Today</span>
          </div>
          <div class="st-hud-stat-box">
            <span class="st-hud-stat-num" id="st-hud-targets-count">${todayAchievedCount}/${todayPlannedCount}</span>
            <span class="st-hud-stat-lbl">Targets Conquered</span>
          </div>
          <div class="st-hud-stat-box">
            <span class="st-hud-stat-num" id="st-hud-tasks-count">${todayTasksDone}/${todayTasksCount}</span>
            <span class="st-hud-stat-lbl">Tasks Done</span>
          </div>
        </div>

        <div style="font-size:0.7rem; color:var(--md-default-fg-color--light); background:rgba(39,60,117,0.04); border-radius:6px; padding:0.3rem 0.5rem; margin-top:0.35rem; text-align:center;">
          💡 Chapters are logged in the <strong>Velocity Log</strong> once read for at least <strong>5 minutes</strong>.
        </div>

        <!-- Today's Plan Summary -->
        <div class="st-hud-plan-banner">
          <div class="st-hud-plan-title">
            <span>🎯 Today's Study Plan</span>
            <span class="st-hud-plan-badge" id="st-hud-plan-badge">${todayPendingCount} Remaining</span>
          </div>
          <div class="st-hud-plan-sub" id="st-hud-plan-summary">
            ${todayPlannedCount} Chapters Planned &bull; ${todayPendingCount} Pending till 11:59 PM
          </div>
        </div>

        <div class="st-hud-actions-row" style="margin-top:0.4rem;">
          <a href="${getSiteBasePath()}tracker-dashboard/" class="st-hud-action-btn is-ghost" id="st-hud-open-dash" style="width:100%; text-align:center; padding:0.45rem;">
            📊 Open Prep Tracker Dashboard
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(widget);

    const timeValEl = widget.querySelector('#st-clock-time-val');
    const labelEl = widget.querySelector('#st-clock-label');
    const minBtn = widget.querySelector('#st-clock-min-btn');

    function updateClockDisplay() {
      if (timeValEl) timeValEl.textContent = formatClockTime(readingClockSeconds);
      if (labelEl) {
        if (isReadingClockIdle) {
          labelEl.textContent = '💤 Inactive (Paused)';
        } else if (document.hidden) {
          labelEl.textContent = 'Tab Hidden';
        } else {
          const mins = Math.floor(readingClockSeconds / 60);
          labelEl.textContent = mins > 0 ? `Reading Notes • ${mins}m` : 'Reading Notes';
          if (dayPillEl) {
            const curDayTot = (getDailyStudyTimeRecord(todayStr).totalSeconds || 0);
            dayPillEl.textContent = 'Day: ' + formatDurationDisplay(curDayTot);
          }
        }
      }
    }

    // Idle Detection: stops clock when user walks away or leaves page inactive
    function resetIdleTimer() {
      if (isReadingClockIdle) {
        isReadingClockIdle = false;
        widget.classList.remove('is-idle');
        updateClockDisplay();
      }
      if (readingClockIdleTimer) clearTimeout(readingClockIdleTimer);
      readingClockIdleTimer = setTimeout(() => {
        isReadingClockIdle = true;
        widget.classList.add('is-idle');
        updateClockDisplay();
        if (readingClockTopic && readingClockSeconds > 0) {
          saveTodayChapterStudySeconds(
            readingClockTopic.subject,
            readingClockTopic.topic,
            readingClockTopic.title,
            readingClockSeconds
          );
        }
      }, IDLE_TIMEOUT_MS);
    }

    resetIdleTimer();

    // Attach global window listeners only once
    if (!readingClockHandlersAttached) {
      readingClockHandlersAttached = true;

      ['mousemove', 'scroll', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, () => {
          if (readingClockTopic) {
            claimActiveTabFocus(readingClockTopic);
            resetIdleTimer();
          }
        }, { passive: true });
      });

      // Claim leadership on tab focus or direct interaction
      window.addEventListener('focus', () => {
        if (readingClockTopic) {
          claimActiveTabFocus(readingClockTopic);
          const latestSec = getTodayChapterStudySeconds(readingClockTopic.subject, readingClockTopic.topic);
          if (latestSec > readingClockSeconds) {
            readingClockSeconds = latestSec;
          }
          resetIdleTimer();
          updateClockDisplay();
        }
      });

      // Multi-tab synchronization: when another tab updates study time or claims focus
      window.addEventListener('storage', (e) => {
        if (e.key === LOCAL_DAILY_TIME_KEY && readingClockTopic) {
          const latestSec = getTodayChapterStudySeconds(readingClockTopic.subject, readingClockTopic.topic);
          if (latestSec > readingClockSeconds) {
            readingClockSeconds = latestSec;
          }
          updateClockDisplay();
        } else if (e.key === ACTIVE_TAB_KEY) {
          updateClockDisplay();
        }
      });

      // Tab visibility: pauses timer when tab is hidden to not falsely count background time
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (readingClockTopic && readingClockSeconds > 0) {
            saveTodayChapterStudySeconds(
              readingClockTopic.subject,
              readingClockTopic.topic,
              readingClockTopic.title,
              readingClockSeconds
            );
          }
          updateClockDisplay();
        } else {
          if (readingClockTopic) {
            const latestSec = getTodayChapterStudySeconds(readingClockTopic.subject, readingClockTopic.topic);
            if (latestSec > readingClockSeconds) {
              readingClockSeconds = latestSec;
            }
            resetIdleTimer();
            updateClockDisplay();
          }
        }
      });

      window.addEventListener('pagehide', () => {
        if (readingClockTopic && readingClockSeconds > 0) {
          saveTodayChapterStudySeconds(
            readingClockTopic.subject,
            readingClockTopic.topic,
            readingClockTopic.title,
            readingClockSeconds
          );
        }
      });
    }

    // Ticking interval: strictly prevents double counting when multiple tabs are open simultaneously
    readingClockInterval = setInterval(() => {
      const isLeader = isThisTabActiveLeader();
      if (!document.hidden && !isReadingClockIdle && isLeader) {
        readingClockSeconds++;
        updateClockDisplay();

        // Heartbeat every 2 seconds to maintain active tab leadership
        if (readingClockSeconds % 2 === 0) {
          claimActiveTabFocus(topicInfo);
        }

        // Periodically persist every 4 seconds to localStorage (atomic write)
        if (readingClockSeconds % 4 === 0) {
          saveTodayChapterStudySeconds(
            topicInfo.subject,
            topicInfo.topic,
            topicInfo.title,
            readingClockSeconds
          );
        }
      } else if (!isLeader && !document.hidden && !isReadingClockIdle) {
        // Tab is visible but another tab is currently active
        if (labelEl) {
          labelEl.textContent = 'Active in another tab';
        }
      }
    }, 1000);

    let isMinimized = false;
    minBtn?.addEventListener('click', () => {
      isMinimized = !isMinimized;
      widget.classList.toggle('is-minimized', isMinimized);
      if (minBtn) {
        minBtn.textContent = isMinimized ? '🗖' : '🗕';
        minBtn.title = isMinimized ? 'Expand Timer' : 'Minimize Timer';
      }
      if (isMinimized && hudPopover) {
        hudPopover.style.display = 'none';
      }
    });

    const zenBtn = widget.querySelector('#st-clock-zen-btn');
    const hudBtn = widget.querySelector('#st-clock-hud-btn');
    const iconBtn = widget.querySelector('#st-clock-icon-btn');
    const hudPopover = widget.querySelector('#st-clock-hud-popover');
    const hudCloseBtn = widget.querySelector('#st-hud-close-btn');
    const hudMarkReadBtn = widget.querySelector('#st-hud-mark-read-btn');
    const dayPillEl = widget.querySelector('#st-clock-day-pill');

    // Zen Mode Toggle (distraction-free notes reading)
    function toggleZenMode() {
      const active = document.body.classList.toggle('st-zen-focus-active');
      if (zenBtn) {
        zenBtn.textContent = active ? '✨' : '🧘';
        zenBtn.title = active ? 'Exit Zen Mode (ESC)' : 'Toggle Zen / Focus Mode';
      }
    }

    zenBtn?.addEventListener('click', toggleZenMode);

    // ESC key to exit Zen Mode
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('st-zen-focus-active')) {
        toggleZenMode();
      }
    });

    // Toggle HUD Popover
    function toggleHud() {
      if (!hudPopover) return;
      const isVisible = hudPopover.style.display === 'block';
      hudPopover.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        // Refresh numbers in popover
        const curSec = readingClockSeconds;
        const totSec = (getDailyStudyTimeRecord(todayStr).totalSeconds || 0);
        const chapTimeEl = widget.querySelector('#st-hud-chap-time');
        const dayTimeEl = widget.querySelector('#st-hud-day-time');
        if (chapTimeEl) chapTimeEl.textContent = formatDurationDisplay(curSec);
        if (dayTimeEl) dayTimeEl.textContent = formatDurationDisplay(totSec);

        // Refresh plan counts on HUD open
        const freshPlan = getLocalDailyPlanner(todayStr);
        const freshTopics = freshPlan.reading_topics || [];
        const freshPlannedCount = freshTopics.length;
        const freshAchievedCount = freshTopics.filter(t => t.status === 'achieved').length;
        const freshPendingCount = freshTopics.filter(t => t.status !== 'achieved').length;
        const freshTasks = freshPlan.daily_tasks || [];
        const freshTasksCount = freshTasks.length;
        const freshTasksDone = freshTasks.filter(t => t.completed).length;

        const targetsCountEl = widget.querySelector('#st-hud-targets-count');
        const tasksCountEl = widget.querySelector('#st-hud-tasks-count');
        const planBadgeEl = widget.querySelector('#st-hud-plan-badge');
        const planSummaryEl = widget.querySelector('#st-hud-plan-summary');

        if (targetsCountEl) targetsCountEl.textContent = `${freshAchievedCount}/${freshPlannedCount}`;
        if (tasksCountEl) tasksCountEl.textContent = `${freshTasksDone}/${freshTasksCount}`;
        if (planBadgeEl) planBadgeEl.textContent = `${freshPendingCount} Remaining`;
        if (planSummaryEl) {
          planSummaryEl.textContent = `${freshPlannedCount} Chapters Planned • ${freshPendingCount} Pending till 11:59 PM`;
        }
      }
    }

    hudBtn?.addEventListener('click', toggleHud);
    iconBtn?.addEventListener('click', toggleHud);
    hudCloseBtn?.addEventListener('click', () => {
      if (hudPopover) hudPopover.style.display = 'none';
    });

    // Mark +1 Read right from HUD popover
    
  }

  // -------------------------------------------------------------
  // 1. INJECT IN-CHAPTER TRACKER BAR & QUICK CONTROLS
  // ---------------------------------------------------------------
  async function injectSubjectNoteWidget() {
    const topicInfo = getCurrentTopicInfo();
    if (!topicInfo) {
      // Clean up clock widget and stop timers immediately when navigating to non-note routes (like tracker-dashboard/)
      cleanupChapterReadingClock();
      return;
    }

    // Initialize floating in-chapter reading clock stopwatch
    initChapterReadingClock(topicInfo);

    const priorityInfo = getChapterPriority(topicInfo.subject, topicInfo.topic);

    if (document.getElementById('study-topic-read-button-bar')) return;

    const contentInner = document.querySelector('.md-content__inner');
    if (!contentInner) return;

    const h1 = contentInner.querySelector('h1');
    if (!h1) return;

    // Create the prominent Executive KPI Cards Deck right under H1
    const deck = document.createElement('div');
    deck.id = 'study-topic-read-button-bar';
    deck.className = 'st-chapter-kpi-deck';
    deck.innerHTML = `
      <!-- KPI Card 1: Reading Status -->
      <div class="st-kpi-card" id="st-kpi-reads">
        <div class="st-kpi-header">
          <div class="st-kpi-title-wrap">
            <span class="st-kpi-icon">📖</span>
            <span class="st-kpi-label">Reading Status</span>
          </div>
          <span class="st-kpi-badge st-badge-due" id="st-kpi-due-badge" style="display:none;">⚠️ DUE TODAY</span>
        </div>
        <div class="st-kpi-val" id="st-kpi-read-val">0 Reads</div>
        <div class="st-kpi-sub" id="st-kpi-read-sub">Not yet read</div>
        <div class="st-kpi-actions">
          <button type="button" class="st-kpi-btn st-kpi-btn-primary" id="st-btn-plus-one" title="Click to increment reading count by 1!">
            Mark +1 Read
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-quick-update" title="View all logs & notes">
            Logs
          </button>
        </div>
      </div>

      <!-- KPI Card 2: Live Test Performance -->
      <div class="st-kpi-card" id="st-kpi-test">
        <div class="st-kpi-header">
          <div class="st-kpi-title-wrap">
            <span class="st-kpi-icon">🎯</span>
            <span class="st-kpi-label">Live Test Score</span>
          </div>
          <span class="st-kpi-badge st-badge-neutral" id="st-kpi-attempts-badge">0 Attempts</span>
        </div>
        <div class="st-kpi-val" id="st-kpi-score-val">—</div>
        <div class="st-kpi-sub" id="st-kpi-score-sub">Latest attempt · take first live test</div>
        <div class="st-kpi-actions">
          <button type="button" class="st-kpi-btn st-kpi-btn-accent" id="st-btn-start-test">
            Live Test
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-view-scores" title="View past scores history">
            Past Scores <span class="st-score-pill" id="st-scores-badge">0</span>
          </button>
        </div>
      </div>

      <!-- KPI Card 3: Question Bank Size -->
      <div class="st-kpi-card" id="st-kpi-bank">
        <div class="st-kpi-header">
          <div class="st-kpi-title-wrap">
            <span class="st-kpi-icon">📚</span>
            <span class="st-kpi-label">Question Bank</span>
          </div>
          <span class="st-kpi-badge st-badge-green" id="st-kpi-bank-status">MongoDB Live</span>
        </div>
        <div class="st-kpi-val" id="st-kpi-bank-val">… Qs</div>
        <div class="st-kpi-sub" id="st-kpi-bank-sub">Mapped PYQs &amp; Ghatnachakra</div>
        <div class="st-kpi-actions">
          <button type="button" class="st-kpi-btn st-kpi-btn-outline" id="st-btn-quick-10" title="Launch a quick 10-question drill">
            Quick 10
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-all-questions" title="Start full chapter exam (all questions)">
            Full Exam
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost st-kpi-btn-compact" id="st-btn-sync-questions" title="Sync newly added questions from this chapter note to MongoDB Atlas">
            Sync
          </button>
        </div>
      </div>

      <!-- KPI Card 4: Accuracy & Trap Radar (Expanded Hero Card) -->
      <div class="st-kpi-card st-kpi-card-radar-hero" id="st-kpi-radar">
        <div class="st-kpi-header">
          <div class="st-kpi-title-wrap">
            <span class="st-kpi-icon">🧠</span>
            <span class="st-kpi-label" style="font-weight:700;">Avg Accuracy</span>
          </div>
          <div class="st-kpi-header-right">
            <span class="st-kpi-badge ${priorityInfo.badgeClass}" id="st-kpi-acc-badge" title="Target accuracy set based on UPPCS Chapter Priority Tracker">${priorityInfo.badgeText}</span>
            <span class="st-mongo-status is-connected" id="st-mongo-status" title="MongoDB Connection Status">● Atlas</span>
          </div>
        </div>
        <div class="st-kpi-hero-val-wrap">
          <div class="st-kpi-val" id="st-kpi-acc-val">—%</div>
          <div class="st-kpi-target-indicator" id="st-kpi-target-gap">Target: ${priorityInfo.targetAccuracy}%</div>
        </div>
        <div class="st-kpi-sub st-kpi-sub-interactive" id="st-kpi-acc-sub" title="Click to view all detected recurring trap questions and explanations">
          +1.33 / −0.44 marking · open Trap Radar
        </div>
        <div class="st-kpi-actions">
          <button type="button" class="st-kpi-btn st-btn-trap-radar" id="st-btn-view-mistakes" title="Inspect recurring trap areas & wrong questions">
            Trap Radar <span class="st-trap-counter-badge" id="st-trap-counter" style="display:none;">0</span>
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-outline" id="st-btn-toggle-weak" title="Map or unmap this chapter as a Weak Topic">
            Flag Weak
          </button>
        </div>
      </div>
    `;

    // Dynamic Chapter Study Plan / Backlog Banner
    function updateChapterPlanBanner() {
      let banner = document.getElementById('st-chapter-plan-banner');
      const planStatus = getChapterReadingPlanStatus(topicInfo.subject, topicInfo.topic);

      if (!planStatus) {
        if (banner) banner.remove();
        return;
      }

      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'st-chapter-plan-banner';
        h1.insertAdjacentElement('afterend', banner);
      }

      if (planStatus.status === 'today') {
        if (planStatus.isAchieved) {
          banner.className = 'st-chapter-plan-banner is-cleared';
          banner.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%; flex-wrap:wrap; gap:0.5rem;">
              <span>🏆 <strong>Completed in Today's Study Plan</strong> (${formatPlannerDateDisplay(planStatus.plannedDate)}) &bull; Certified +1 Read</span>
              <span style="background:#10b981; color:#fff; font-size:0.72rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:9999px;">Achieved</span>
            </div>
          `;
        } else {
          banner.className = 'st-chapter-plan-banner is-today';
          banner.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%; flex-wrap:wrap; gap:0.5rem;">
              <span>🎯 <strong>Scheduled in Today's Reading Plan</strong> &bull; Target: Till Midnight 11:59 PM (Requires 50-Q Test &ge;80% to Finish)</span>
              <button type="button" class="st-act-btn is-success" id="st-banner-mark-read" style="padding:0.35rem 0.75rem; font-size:0.78rem; font-weight:700;">
                ⚔️ Qualify Target &amp; Mark +1 Read (50-Q Exam)
              </button>
            </div>
          `;
        }
      } else if (planStatus.status === 'backlog') {
        banner.className = 'st-chapter-plan-banner is-backlog';
        banner.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:space-between; width:100%; flex-wrap:wrap; gap:0.5rem;">
            <span>⚠️ <strong>In Your Overdue Study Backlog</strong> &bull; Planned on ${planStatus.plannedDate} (${planStatus.daysOverdue} day${planStatus.daysOverdue === 1 ? '' : 's'} overdue)</span>
            <button type="button" class="st-act-btn is-success" id="st-banner-mark-read" style="padding:0.35rem 0.75rem; font-size:0.78rem; font-weight:700;">
              ⚔️ Clear from Backlog &amp; Mark +1 Read (50-Q Exam)
            </button>
          </div>
        `;
      }

      banner.querySelector('#st-banner-mark-read')?.addEventListener('click', (e) => {
        e.preventDefault();
        promptChapterMasteryGate(topicInfo, () => {
          updateChapterPlanBanner();
        });
      });
    }

    updateChapterPlanBanner();
    // Asynchronously pull latest planner from MongoDB to ensure cross-device consistency
    fetchPlannerData(getTodayISODate()).then(() => {
      updateChapterPlanBanner();
    }).catch(() => {});

    h1.insertAdjacentElement('afterend', deck);

    // Automatic Chapter Subtopics Ribbon (populated dynamically from live test performance)
    const subtopicsBar = document.createElement('div');
    subtopicsBar.className = 'st-subtopics-bar';
    subtopicsBar.id = 'st-chapter-subtopics-bar';
    subtopicsBar.style.display = 'none';
    subtopicsBar.innerHTML = `
      <div class="st-subtopics-bar-label">
        <span>🎯 Auto-Mapped Weak Subtopics (Action Areas):</span>
        <small>Identified from your live test errors. Click any subtopic to jump directly to section in notes.</small>
      </div>
      <div class="st-subtopics-chips" id="st-chapter-subtopics-chips"></div>
    `;
    deck.insertAdjacentElement('afterend', subtopicsBar);

    // Event listeners
    document.getElementById('st-btn-plus-one')?.addEventListener('click', () => handleQuickPlusOne(topicInfo));
    document.getElementById('st-btn-quick-update')?.addEventListener('click', () => openChapterLogsModal(topicInfo));
    document.getElementById('st-btn-start-test')?.addEventListener('click', () => openTestEngineModal(topicInfo));
    document.getElementById('st-btn-all-questions')?.addEventListener('click', () => openTestEngineModal(topicInfo, { autoStartCount: 'all', testMode: 'exam' }));
    document.getElementById('st-btn-quick-10')?.addEventListener('click', () => openTestEngineModal(topicInfo, { autoStartCount: 10 }));
    document.getElementById('st-btn-view-scores')?.addEventListener('click', () => openPastScoresModal(topicInfo));
    document.getElementById('st-btn-view-mistakes')?.addEventListener('click', () => openTrapRadarModal(topicInfo));
    document.getElementById('st-kpi-acc-sub')?.addEventListener('click', () => openTrapRadarModal(topicInfo));

    // Weak Topic Toggle Listener
    const weakBtn = document.getElementById('st-btn-toggle-weak');
    const accBadge = document.getElementById('st-kpi-acc-badge');
    let currentWeakItem = null;

    // Check if this chapter is already a weak topic
    authFetch(`${API_BASE}/weak-topics`)
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        const item = list.find(w => w.subject === topicInfo.subject && w.topic === topicInfo.topic);
        if (item && weakBtn) {
          currentWeakItem = item;
          weakBtn.textContent = item.auto_flagged ? 'Weak (Auto)' : 'Weak (Mapped)';
          weakBtn.classList.add('is-active');
          // Keep priority target badge intact — weak state lives on the button only
        }
      }).catch(() => {});

    function openWeakAreaDialog(topicInfo, weakItem) {
      const isAuto = weakItem?.auto_flagged;
      const reason = weakItem?.reason || 'Identified for high-priority revision';
      const acc = weakItem?.accuracy_pct !== undefined ? `${weakItem.accuracy_pct}%` : 'Below 75%';
      const mistakes = weakItem?.mistakes_count !== undefined ? `${weakItem.mistakes_count} misses` : 'Multiple errors detected';

      const dialogHtml = `
        <div class="st-weak-dialog-content">
          <div class="st-weak-meta-card" style="padding: 1rem 1.15rem; background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.35); border-radius: 0.75rem; margin-bottom: 1.25rem;">
            <div style="display:flex; align-items:center; gap:0.6rem; font-size:1rem; font-weight:700; color:#dc2626; margin-bottom:0.4rem;">
              <span>${isAuto ? '🚩 Auto-Flagged Weak Topic' : '📌 Manually Mapped Focus Area'}</span>
            </div>
            <div style="font-size:0.86rem; color:var(--md-default-fg-color); line-height:1.45;">
              ${escapeHtml(reason)}
            </div>
            <div style="display:flex; gap:1.25rem; margin-top:0.65rem; font-size:0.82rem; color:var(--md-default-fg-color--light);">
              <span>Recent Test Accuracy: <strong style="color:#ef4444;">${acc}</strong></span>
              <span>Errors Recorded: <strong style="color:#ef4444;">${mistakes}</strong></span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            <button type="button" class="st-btn st-btn-primary" id="st-weak-action-practice" style="justify-content: center;">
              🎯 Practice 10 Drill Questions on this Chapter
            </button>
            <button type="button" class="st-btn st-btn-outline" id="st-weak-action-history" style="justify-content: center;">
              📜 Review Past Test Mistakes & Question Details
            </button>
            <button type="button" class="st-btn st-btn-ghost" id="st-weak-action-unmap" style="justify-content: center; color: #10b981; border: 1px solid rgba(16, 185, 129, 0.35); margin-top: 0.5rem;">
              ✅ Mark as Mastered (Remove from Weak Topics)
            </button>
          </div>
        </div>
      `;

      showModal(`Chapter Focus Radar: ${topicInfo.title}`, dialogHtml);

      document.getElementById('st-weak-action-practice')?.addEventListener('click', () => {
        closeModal();
        openTestEngineModal(topicInfo, { autoStartCount: 10 });
      });

      document.getElementById('st-weak-action-history')?.addEventListener('click', () => {
        closeModal();
        openPastScoresModal(topicInfo);
      });

      document.getElementById('st-weak-action-unmap')?.addEventListener('click', async () => {
        try {
          await authFetch(`${API_BASE}/weak-topics`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: topicInfo.subject, topic: topicInfo.topic })
          });
          currentWeakItem = null;
          weakBtn.textContent = 'Flag Weak';
          weakBtn.classList.remove('is-active');
          if (accBadge) {
            // Restore chapter priority target — never hardcode 80%
            accBadge.textContent = priorityInfo.badgeText;
            accBadge.className = `st-kpi-badge ${priorityInfo.badgeClass}`;
            accBadge.style.background = '';
            accBadge.style.color = '';
          }
          closeModal();
          showToast(`Marked "${topicInfo.title}" as Mastered and cleared from Focus Radar.`, 'success');
        } catch (err) {
          showToast('Failed to update status: ' + err.message, 'error');
        }
      });
    }

    weakBtn?.addEventListener('click', async () => {
      const isCurrentlyWeak = weakBtn.classList.contains('is-active');
      if (isCurrentlyWeak) {
        // Open interactive focus dialog instead of jarring alert
        openWeakAreaDialog(topicInfo, currentWeakItem);
      } else {
        // Map as weak topic
        weakBtn.disabled = true;
        try {
          await authFetch(`${API_BASE}/weak-topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: topicInfo.subject,
              topic: topicInfo.topic,
              topic_title: topicInfo.title,
              reason: 'Manually flagged as focus / weak area'
            })
          });
          currentWeakItem = {
            subject: topicInfo.subject,
            topic: topicInfo.topic,
            topic_title: topicInfo.title,
            reason: 'Manually flagged as focus / weak area',
            auto_flagged: false
          };
          weakBtn.textContent = 'Weak (Mapped)';
          weakBtn.classList.add('is-active');
          showToast(`Mapped "${topicInfo.title}" to Focus Radar & Weak Topics.`, 'warning');
        } catch (e) {
          showToast('Failed to save weak topic status.', 'error');
        }
        weakBtn.disabled = false;
      }
    });

    // Sync DB button listener
    document.getElementById('st-btn-sync-questions')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Syncing…';
      try {
        const res = await authFetch(`${API_BASE}/sync-questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: topicInfo.subject, chapter: topicInfo.topic })
        });
        const data = await res.json();
        if (res.ok) {
          alert(`Synced! ${data.count || 0} questions saved to MongoDB Atlas for ${topicInfo.title}`);
          refreshChapterQuestionCount(topicInfo);
        } else {
          alert(`Sync notice: ${data.error || 'Failed to sync'}`);
        }
      } catch (err) {
        alert(`Sync error: ${err.message}`);
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    });

    // Refresh displays
    refreshTopicReadData(topicInfo);
    refreshPastScoresBadge(topicInfo);
    refreshChapterQuestionCount(topicInfo);
  }

  // Refresh question count on the Question Bank KPI card
  async function refreshChapterQuestionCount(topicInfo) {
    const bankVal = document.getElementById('st-kpi-bank-val');
    const bankSub = document.getElementById('st-kpi-bank-sub');
    if (!bankVal) return;

    try {
      const res = await authFetch(`${API_BASE}/chapter-questions?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.total_available > 0) {
          bankVal.textContent = `${data.total_available} Questions`;
          if (bankSub) bankSub.textContent = `Mapped PYQs & Ghatnachakra`;
          return;
        }
      }
    } catch {}

    // Fallback to DOM questions
    const domQs = extractChapterQuestions();
    if (domQs.length > 0) {
      bankVal.textContent = `${domQs.length} Questions`;
      if (bankSub) bankSub.textContent = `Extracted from Chapter Note`;
    } else {
      bankVal.textContent = `0 Questions`;
    }
  }

  // Helper to resolve topic slug or title to catalog topic info
  function resolveTopicInfo(subject, topic) {
    const normSub = (subject || '').toLowerCase().trim();
    const cat = CHAPTER_CATALOG[normSub] || [];
    const cleanTopic = (topic || '').trim();
    const normClean = cleanTopic.toLowerCase().replace(/^topic\s*\d+\s*[-–—:]*\s*/i, '').replace(/^[0-9\s._-]+/, '').replace(/[-_ ]/g, '');
    const found = cat.find(c => {
      if (c.slug === cleanTopic || c.title === cleanTopic) return true;
      if (c.slug.toLowerCase() === cleanTopic.toLowerCase()) return true;
      if (c.title && c.title.toLowerCase() === cleanTopic.toLowerCase()) return true;
      const cNormSlug = c.slug.toLowerCase().replace(/^[0-9\s._-]+/, '').replace(/[-_ ]/g, '');
      const cNormTitle = (c.title || '').toLowerCase().replace(/^topic\s*\d+\s*[-–—:]*\s*/i, '').replace(/^[0-9\s._-]+/, '').replace(/[-_ ]/g, '');
      return Boolean(normClean && (cNormSlug === normClean || cNormTitle === normClean || c.slug.toLowerCase().endsWith(normClean)));
    });
    return {
      subject: normSub,
      topic: found ? found.slug : cleanTopic,
      slug: found ? found.slug : cleanTopic,
      title: found ? found.title : cleanTopic
    };
  }

  // Officially conquer chapter upon passing the 80% Mastery Exam
  async function officiallyConquerChapter(topicInfo, scorecard) {
    const accuracy = scorecard?.accuracy_pct || 80;
    const scorePct = scorecard?.score_pct != null ? scorecard.score_pct : (scorecard?.max_marks > 0 ? Number(((scorecard.net_marks / scorecard.max_marks) * 100).toFixed(1)) : 80);
    const netMarks = scorecard?.net_marks || 0;
    const maxMarks = scorecard?.max_marks || 0;
    const totalQs = scorecard?.total_questions || 50;
    const correct = scorecard?.correct || 0;
    const incorrect = scorecard?.incorrect || 0;
    const unattempted = scorecard?.unattempted ?? Math.max(0, totalQs - (correct + incorrect));
    const timeSpentSec = scorecard?.time_spent_seconds || readingClockSeconds || 0;
    const timeSpentMsg = timeSpentSec > 0 ? ` (⏱️ ${Math.floor(timeSpentSec / 60)}m ${timeSpentSec % 60}s)` : '';

    const isRedemption = Boolean(scorecard?.is_mastery_redemption || scorecard?.redemption_passed || (scorecard?.test_mode && scorecard.test_mode.includes('Redemption')));
    const stageTitle = isRedemption ? '⚡ Chapter Conquered (100% Redemption Drill)' : '🏆 Chapter Mastery Exam Passed';
    const detailedNotes = isRedemption
      ? `⚡ Chapter Conquered via 100% Mastery Redemption Drill • 100% Accuracy (${correct}/${totalQs} Correct, 0 Mistakes) • All Previous Weak Areas Eliminated${timeSpentMsg}`
      : `🏆 Chapter Mastery Exam Passed • Total Score: ${scorePct}% (${netMarks > 0 ? '+' : ''}${netMarks}/${maxMarks} marks) • Accuracy: ${accuracy}% (${correct}/${totalQs} Correct, ${incorrect} Incorrect, ${unattempted} Unattempted)${timeSpentMsg}`;

    // 1. Update local cache with complete test score breakdown
    saveLocalLog(topicInfo.subject, topicInfo.topic, {
      topic_title: topicInfo.title,
      stage: stageTitle,
      confidence: 5,
      notes: detailedNotes,
      score_pct: scorePct,
      net_marks: netMarks,
      max_marks: maxMarks,
      accuracy_pct: accuracy,
      total_questions: totalQs,
      correct: correct,
      incorrect: incorrect,
      unattempted: unattempted,
      time_spent_seconds: timeSpentSec,
      test_id: scorecard?._id || scorecard?.test_id || null
    });

    const clockLbl = document.getElementById('st-clock-label');
    if (clockLbl) clockLbl.textContent = '🏆 Chapter Conquered';

    // 2. Call backend MongoDB API if online
    try {
      await authFetch(`${API_BASE}/quick-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: topicInfo.subject,
          topic: topicInfo.topic,
          topic_title: topicInfo.title,
          confidence: 5,
          stage: stageTitle,
          notes: detailedNotes,
          score_pct: scorePct,
          net_marks: netMarks,
          max_marks: maxMarks,
          accuracy_pct: accuracy,
          total_questions: totalQs,
          correct: correct,
          incorrect: incorrect,
          unattempted: unattempted,
          time_spent_seconds: timeSpentSec,
          test_id: scorecard?._id || scorecard?.test_id || null
        })
      });
    } catch (e) {
      console.warn('Backend sync deferred:', e);
    }

    // 3. Auto-clear from Today's Reading Plan and Backlog
    try {
      await apiResolveTopicEverywhere(topicInfo.subject, topicInfo.topic);
      const banner = document.getElementById('st-chapter-plan-banner');
      if (banner) {
        banner.className = 'st-chapter-plan-banner is-cleared';
        banner.innerHTML = `<span>🏆 <strong>Mastered & Conquered!</strong> Cleared from today's plan & overall backlog (${accuracy}% score).</span>`;
      }
    } catch (e) {
      console.warn('Planner resolve deferred:', e);
    }

    // 4. Refresh UI
    refreshTopicReadData(topicInfo);
    const plusBtn = document.getElementById('st-btn-plus-one');
    if (plusBtn) {
      plusBtn.textContent = '🏆 Mastered (+1 Read)';
      plusBtn.classList.add('is-mastered');
    }
  }

  // Chapter Mastery Gate: Prompts either a Fast-Track 100% Redemption Drill or a 50-question qualifying exam
  async function promptChapterMasteryGate(topicInfo, onPassedCallback) {
    if (!topicInfo || !topicInfo.subject || !topicInfo.topic) return;
    const cleanInfo = resolveTopicInfo(topicInfo.subject, topicInfo.topic);
    const title = cleanInfo.title || cleanInfo.topic;
    const sub = cleanInfo.subject.toUpperCase();

    // Show initial modal with loading indicator while checking past test attempts
    showModal('⚔️ Chapter Mastery Gate', `
      <div class="st-mastery-gate-modal">
        <div class="st-mastery-hero">
          <div class="st-mastery-icon-badge">⚔️</div>
          <h3 style="margin:0.25rem 0 0.5rem; font-size:1.3rem; font-weight:800; color:var(--md-primary-fg-color, #273c75);">
            Chapter Mastery Qualifying Gate
          </h3>
          <p style="margin:0; font-size:0.9rem; color:var(--md-default-fg-color--light);">
            Target: <strong>${escapeHtml(title)}</strong> &bull; <span style="text-transform:uppercase; font-weight:700;">${escapeHtml(sub)}</span>
          </p>
        </div>
        <div class="st-loading-spinner" style="padding: 2rem 1rem; text-align:center;">
          <div class="st-spinner"></div>
          <p style="margin-top:0.75rem; font-size:0.85rem;"><strong>Scanning test history & past mistakes...</strong></p>
        </div>
      </div>
    `);
    const box = document.getElementById('st-modal-box');
    if (box) box.classList.add('st-modal-wide');

    // 1. Gather past test mistakes from MongoDB and local storage
    let pastAttempts = [];
    let pastTraps = [];
    let allChapterQs = [];

    try {
      let pastData = window.__TOPIC_PAST_TESTS__;
      const promises = [];

      if (!pastData || (pastData.topic && pastData.topic !== cleanInfo.topic)) {
        promises.push(
          authFetch(`${API_BASE}/chapter-tests?subject=${encodeURIComponent(cleanInfo.subject)}&topic=${encodeURIComponent(cleanInfo.topic)}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) { pastData = d; window.__TOPIC_PAST_TESTS__ = d; } })
            .catch(() => {})
        );
      }

      promises.push(
        authFetch(`${API_BASE}/chapter-questions?subject=${encodeURIComponent(cleanInfo.subject)}&topic=${encodeURIComponent(cleanInfo.topic)}`)
          .then(r => r.ok ? r.json() : null)
          .then(d => { if (d?.questions) allChapterQs = d.questions; })
          .catch(() => {})
      );

      await Promise.all(promises);

      if (pastData) {
        pastAttempts = pastData.attempts || [];
        pastTraps = pastData.summary?.trap_questions || [];
      }
    } catch (e) {
      console.warn('Mastery gate past tests query deferred:', e);
    }

    const localAttempts = getLocalTopicTests(cleanInfo.subject, cleanInfo.topic);

    // 2. Identify unique missed questions (M)
    const wrongMap = new Map();
    if (pastAttempts.length > 0) {
      const latest = pastAttempts[0];
      (latest.wrong_questions || []).forEach(w => {
        const key = w.q_id || (w.stem ? w.stem.substring(0, 80) : `q_${w.q_num}`);
        if (!wrongMap.has(key)) wrongMap.set(key, w);
      });
    }
    pastTraps.forEach(w => {
      const key = w.q_id || (w.stem ? w.stem.substring(0, 80) : `q_${w.q_num}`);
      if (!wrongMap.has(key)) wrongMap.set(key, w);
    });
    localAttempts.forEach(t => {
      (t.wrong_questions || []).forEach(w => {
        const key = w.q_id || (w.stem ? w.stem.substring(0, 80) : `q_${w.q_num}`);
        if (!wrongMap.has(key)) wrongMap.set(key, w);
      });
    });

    const uniqueMistakes = Array.from(wrongMap.values());
    const M = uniqueMistakes.length;

    // 3. Prepare Question Bank mapping for clean option enrichment
    if (allChapterQs.length === 0) {
      allChapterQs = getLocalTopicQuestions(cleanInfo.subject, cleanInfo.topic) || [];
    }
    const qMap = new Map(allChapterQs.map(q => [q.q_id, q]));

    const enrichedMistakes = uniqueMistakes.map(m => {
      if (m.q_id && qMap.has(m.q_id)) {
        const fullQ = qMap.get(m.q_id);
        return { ...fullQ, user_answer: m.user_answer, original_wrong: true };
      }
      return repairQuestionOptions(m);
    });

    // 4. Calculate Fast-Track Redemption Pool: N = min(totalQs, max(15, 2 * M))
    const totalAvail = allChapterQs.length > 0 ? allChapterQs.length : Math.max(15, 2 * M);
    const N = Math.min(totalAvail, Math.max(15, 2 * M));
    const neededReinforcement = Math.max(0, N - M);

    const missedIdSet = new Set(enrichedMistakes.map(m => m.q_id).filter(Boolean));
    const nonMissedQs = allChapterQs.filter(q => !missedIdSet.has(q.q_id));
    const shuffledReinforcement = [...nonMissedQs].sort(() => 0.5 - Math.random()).slice(0, neededReinforcement);

    let redemptionPool = [...enrichedMistakes, ...shuffledReinforcement].sort(() => 0.5 - Math.random());
    if (redemptionPool.length < N && allChapterQs.length >= N) {
      redemptionPool = allChapterQs.slice(0, N);
    }
    redemptionPool = redemptionPool.map(q => repairQuestionOptions(q));

    const hasRedemption = (M > 0 && redemptionPool.length >= 5);

    let modalHtml = '';

    if (hasRedemption) {
      modalHtml = `
        <div class="st-mastery-gate-modal">
          <div class="st-mastery-hero">
            <div class="st-mastery-icon-badge" style="background:rgba(239, 68, 68, 0.15); color:#dc2626;">⚡</div>
            <h3 style="margin:0.25rem 0 0.5rem; font-size:1.3rem; font-weight:800; color:var(--md-primary-fg-color, #273c75);">
              Chapter Mastery Qualifying Gate
            </h3>
            <p style="margin:0; font-size:0.9rem; color:var(--md-default-fg-color--light);">
              Target: <strong>${escapeHtml(title)}</strong> &bull; <span style="text-transform:uppercase; font-weight:700;">${escapeHtml(sub)}</span>
            </p>
          </div>

          <!-- FAST-TRACK REDEMPTION CARD -->
          <div class="st-mastery-redemption-card" style="margin: 0.85rem 0; border: 2px solid #ef4444; background: rgba(239, 68, 68, 0.05); border-radius: 12px; padding: 1.1rem 1.25rem; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.1);">
            <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem;">
              <span style="font-size:1.4rem;">⚡</span>
              <div>
                <h4 style="margin:0; font-size:1.05rem; font-weight:800; color:#dc2626;">
                  Fast-Track 100% Redemption Drill Available!
                </h4>
                <small style="color:var(--md-default-fg-color--light);">Based on your previous test attempt (${M} mistake${M > 1 ? 's' : ''} detected)</small>
              </div>
            </div>
            <p style="margin:0.25rem 0 0.75rem; font-size:0.85rem; line-height:1.45; color:var(--md-default-fg-color);">
              You do <strong>not</strong> have to solve all 50 questions again! Prove your mastery on this targeted <strong>${redemptionPool.length}-Question Fast-Track Drill</strong> (${M} previous mistake${M > 1 ? 's' : ''} + ${redemptionPool.length - M} randomized reinforcement questions).
            </p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.9rem; font-size:0.78rem;">
              <span style="background:rgba(239, 68, 68, 0.12); color:#dc2626; font-weight:700; padding:0.22rem 0.6rem; border-radius:9999px;">
                🎯 Strict 100% Accuracy Required (${redemptionPool.length}/${redemptionPool.length} Correct)
              </span>
              <span style="background:rgba(16, 185, 129, 0.12); color:#059669; font-weight:700; padding:0.22rem 0.6rem; border-radius:9999px;">
                🏆 Instant +1 Read & Clears Daily Plan
              </span>
            </div>
            <button type="button" class="st-btn st-btn-primary" id="st-btn-mastery-redemption-start" style="width:100%; font-weight:800; background:linear-gradient(135deg, #dc2626, #ea580c); border:none; color:#fff; padding:0.7rem 1.2rem; font-size:0.95rem; border-radius:8px; cursor:pointer; box-shadow:0 4px 14px rgba(220, 38, 38, 0.35);">
              ⚡ Start ${redemptionPool.length}-Q Fast-Track Drill (100% Target)
            </button>
          </div>

          <div style="text-align:center; margin:0.85rem 0 0.6rem; font-size:0.75rem; font-weight:700; letter-spacing:0.05em; color:var(--md-default-fg-color--light);">
            — OR RETAKE THE STANDARD FULL EXAM —
          </div>

          <!-- STANDARD 50-Q EXAM CARD -->
          <div class="st-mastery-rules-card" style="margin-top:0;">
            <div class="st-mrule-title">🛡️ Standard 50-Q Qualifying Exam:</div>
            <p style="margin:0.2rem 0 0.5rem; font-size:0.82rem; color:var(--md-default-fg-color--light); line-height:1.4;">
              50 randomized questions. Requires <strong>&ge;80% accuracy/marks</strong> (+1.33 / -0.44 marking) to qualify.
            </p>
            <div style="display:flex; justify-content:space-between; gap:0.5rem; flex-wrap:wrap; margin-top:0.6rem;">
              <button type="button" class="st-btn st-btn-outline" id="st-btn-mastery-cancel" style="padding:0.55rem 1.1rem; font-size:0.85rem;">
                📖 Keep Reading
              </button>
              <button type="button" class="st-btn st-btn-secondary" id="st-btn-mastery-start" style="padding:0.55rem 1.3rem; font-weight:700; font-size:0.85rem;">
                🚀 Start Full 50-Q Exam (80% Target)
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      modalHtml = `
        <div class="st-mastery-gate-modal">
          <div class="st-mastery-hero">
            <div class="st-mastery-icon-badge">⚔️</div>
            <h3 style="margin:0.25rem 0 0.5rem; font-size:1.3rem; font-weight:800; color:var(--md-primary-fg-color, #273c75);">
              Chapter Mastery Qualifying Exam
            </h3>
            <p style="margin:0; font-size:0.9rem; color:var(--md-default-fg-color--light);">
              Target: <strong>${escapeHtml(title)}</strong> &bull; <span style="text-transform:uppercase; font-weight:700;">${escapeHtml(sub)}</span>
            </p>
          </div>

          <div class="st-mastery-rules-card">
            <div class="st-mrule-title">🛡️ Strict Preparation Rule Enforced:</div>
            <p style="margin:0.35rem 0 0.75rem; font-size:0.83rem; line-height:1.45; color:var(--md-default-fg-color);">
              You cannot say a chapter is read or finished without proving genuine examination recall.
            </p>
            <ul class="st-mrules-list">
              <li><strong>50 Randomized Questions:</strong> A rigorous 50-question mock test pulled at random from UPPCS PYQs, Ghatnachakra, and chapter drills (or all available if &lt;50).</li>
              <li><strong>80% Qualifying Score:</strong> You must score <strong>at least 80% accuracy/marks</strong> to officially unlock "+1 Read" status and clear the chapter from your daily plan/backlog.</li>
              <li><strong>Official Negative Marking:</strong> Real exam conditions: <strong>+1.33</strong> per correct answer, <strong>-0.44</strong> (1/3rd) penalty for incorrect answers.</li>
              <li><strong>Fast-Track Redemption:</strong> If you score under 80%, you unlock a Fast-Track 100% Redemption Drill (2&times; missed, min 15) to clear the chapter quickly.</li>
            </ul>
          </div>

          <div class="st-mastery-actions">
            <button type="button" class="st-btn st-btn-outline" id="st-btn-mastery-cancel" style="padding:0.6rem 1.2rem;">
              📖 Keep Reading (Not Ready Yet)
            </button>
            <button type="button" class="st-btn st-btn-primary" id="st-btn-mastery-start" style="padding:0.6rem 1.4rem; font-weight:700; background:linear-gradient(135deg, #2563eb, #7c3aed); border:none; color:#fff;">
              🚀 Start 50-Q Mastery Exam
            </button>
          </div>
        </div>
      `;
    }

    const modalBody = document.getElementById('st-modal-body');
    if (modalBody) {
      modalBody.innerHTML = modalHtml;
    } else {
      showModal('⚔️ Chapter Mastery Gate', modalHtml);
    }

    document.getElementById('st-btn-mastery-cancel')?.addEventListener('click', closeModal);

    document.getElementById('st-btn-mastery-redemption-start')?.addEventListener('click', () => {
      closeModal();
      openTestEngineModal(cleanInfo, {
        isMasteryGate: false,
        isMasteryRedemption: true,
        customQuestions: redemptionPool,
        targetAccuracy: 100,
        testMode: 'exam',
        onMasteryPassed: async (sc) => {
          await officiallyConquerChapter(cleanInfo, sc);
          if (typeof onPassedCallback === 'function') {
            await onPassedCallback(sc);
          }
        }
      });
    });

    document.getElementById('st-btn-mastery-start')?.addEventListener('click', () => {
      closeModal();
      openTestEngineModal(cleanInfo, {
        isMasteryGate: true,
        isMasteryRedemption: false,
        targetAccuracy: 80,
        questionCount: 50,
        testMode: 'exam',
        onMasteryPassed: async (sc) => {
          await officiallyConquerChapter(cleanInfo, sc);
          if (typeof onPassedCallback === 'function') {
            await onPassedCallback(sc);
          }
        }
      });
    });
  }

  // Quick +1 Read handler — Enforces Chapter Mastery Gate
  async function handleQuickPlusOne(topicInfo) {
    promptChapterMasteryGate(topicInfo);
  }

  async function handleLegacyQuickPlusOne(topicInfo) {
    const btn = document.getElementById('st-btn-plus-one');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Saving...';
    }

    // 1. Update local cache immediately with time spent
    const timeSpentMsg = readingClockSeconds > 0 ? ` (⏱️ Read time: ${Math.max(1, Math.round(readingClockSeconds / 60))}m)` : '';
    saveLocalLog(topicInfo.subject, topicInfo.topic, {
      topic_title: topicInfo.title,
      stage: 'Revision',
      confidence: 4,
      notes: `Quick read marked (+1) on ${formatDate(new Date())}${timeSpentMsg}`
    });
    const clockLbl = document.getElementById('st-clock-label');
    if (clockLbl) clockLbl.textContent = '🎉 Read Recorded';

    // 2. Call backend MongoDB API
    try {
      await authFetch(`${API_BASE}/quick-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: topicInfo.subject,
          topic: topicInfo.topic,
          topic_title: topicInfo.title
        })
      });
    } catch (e) {
      console.warn('Backend sync deferred:', e);
    }

    // 3. Auto-clear from Today's Reading Plan and Backlog
    try {
      await apiResolveTopicEverywhere(topicInfo.subject, topicInfo.topic);
      const banner = document.getElementById('st-chapter-plan-banner');
      if (banner) {
        banner.className = 'st-chapter-plan-banner is-cleared';
        banner.innerHTML = `<span>🎉 <strong>Smashed!</strong> Cleared from today's plan & overall backlog.</span>`;
      }
    } catch (e) {
      console.warn('Planner resolve deferred:', e);
    }

    // Refresh UI
    refreshTopicReadData(topicInfo);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Read Marked';
      setTimeout(() => {
        btn.textContent = 'Mark +1 Read';
      }, 1800);
    }
  }

  // Refresh read count UI
  async function refreshTopicReadData(topicInfo) {
    const valEl = document.getElementById('st-kpi-read-val');
    const subEl = document.getElementById('st-kpi-read-sub');
    const dueBadge = document.getElementById('st-kpi-due-badge');
    const mongoStatus = document.getElementById('st-mongo-status');

    // Local data check
    const localData = getLocalTopicData(topicInfo.subject, topicInfo.topic);
    let count = localData ? localData.read_count : 0;
    let lastDate = localData && localData.logs && localData.logs[0] ? localData.logs[0].date : null;

    if (valEl) {
      valEl.textContent = count > 0 ? `${count} Read${count > 1 ? 's' : ''}` : `0 Reads`;
    }
    if (subEl) {
      subEl.textContent = count > 0 ? `Last read: ${timeAgo(lastDate)}` : `Not read yet`;
    }

    // Fetch from MongoDB
    try {
      const res = await authFetch(`${API_BASE}/topic-status?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`, {
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        const data = await res.json();
        if (mongoStatus) {
          mongoStatus.className = 'st-mongo-status is-connected';
          mongoStatus.title = 'MongoDB Atlas Connected';
          mongoStatus.textContent = '● Atlas Live';
        }

        const remoteCount = data.revision_count || 0;
        const finalCount = Math.max(count, remoteCount);

        if (valEl) {
          valEl.textContent = finalCount > 0 ? `${finalCount} Read${finalCount > 1 ? 's' : ''}` : `0 Reads`;
        }
        if (subEl) {
          const dt = data.last_revision?.date || lastDate;
          subEl.textContent = finalCount > 0 ? `Last read: ${timeAgo(dt)}` : `Not read yet`;
        }

        if (dueBadge) {
          dueBadge.style.display = data.is_due ? 'inline-block' : 'none';
        }
        window.__TOPIC_LIVE_DATA__ = data;
      }
    } catch {
      if (mongoStatus) {
        mongoStatus.className = 'st-mongo-status is-disconnected';
        mongoStatus.title = 'MongoDB Server offline (Local cache active)';
        mongoStatus.textContent = '○ Offline';
      }
    }
  }

  // Format latest net marks for KPI (UPPCS +1.33 / −0.44)
  function formatNetMarksHtml(latest) {
    const net = Number(latest.net_marks);
    const max = Number(latest.max_marks || (latest.total_questions || 0) * 1.33);
    const netStr = Number.isFinite(net) ? (net > 0 ? `+${net.toFixed(2)}` : net.toFixed(2)) : '—';
    const maxStr = Number.isFinite(max) ? max.toFixed(2) : '—';
    const tone = !Number.isFinite(net) ? '' : (net > 0 ? 'is-pos' : (net < 0 ? 'is-neg' : 'is-zero'));
    return `<span class="st-net-marks ${tone}">${netStr}</span> <small class="st-net-max">/ ${maxStr}</small>`;
  }

  // Apply priority / target-gap state without clobbering weak-button UX
  function applyAccuracyTargetUi(avgAccuracy, priorityInfo) {
    const accBadge = document.getElementById('st-kpi-acc-badge');
    const targetGapEl = document.getElementById('st-kpi-target-gap');
    if (!Number.isFinite(avgAccuracy)) return;

    if (avgAccuracy >= priorityInfo.targetAccuracy) {
      if (accBadge) {
        accBadge.textContent = `Target Met`;
        accBadge.className = 'st-kpi-badge st-badge-green';
        accBadge.title = `${avgAccuracy}% ≥ ${priorityInfo.targetAccuracy}% (${priorityInfo.label})`;
      }
      if (targetGapEl) {
        targetGapEl.innerHTML = `<span class="st-gap-met">${avgAccuracy}% / ${priorityInfo.targetAccuracy}%</span>`;
      }
    } else {
      const gap = (priorityInfo.targetAccuracy - avgAccuracy).toFixed(1);
      if (accBadge) {
        // Keep syllabus priority visible — gap lives beside the % value
        accBadge.textContent = priorityInfo.badgeText;
        accBadge.className = `st-kpi-badge ${priorityInfo.badgeClass}`;
        accBadge.title = `${avgAccuracy}% avg · need ${priorityInfo.targetAccuracy}% (${priorityInfo.label})`;
      }
      if (targetGapEl) {
        targetGapEl.innerHTML = `<span class="st-gap-miss">−${gap}% to ${priorityInfo.targetAccuracy}%</span>`;
      }
    }
  }

  // Refresh past scores & accuracy KPI card
  async function refreshPastScoresBadge(topicInfo) {
    const badge = document.getElementById('st-scores-badge');
    const attemptsBadge = document.getElementById('st-kpi-attempts-badge');
    const scoreVal = document.getElementById('st-kpi-score-val');
    const scoreSub = document.getElementById('st-kpi-score-sub');
    const accVal = document.getElementById('st-kpi-acc-val');
    const accSub = document.getElementById('st-kpi-acc-sub');
    const trapBadge = document.getElementById('st-trap-counter');

    const priorityInfo = getChapterPriority(topicInfo.subject, topicInfo.topic);

    // Check local tests
    const localTests = getLocalTopicTests(topicInfo.subject, topicInfo.topic);
    let attempts = localTests;
    let avgAccuracy = 0;
    let totalAttempts = localTests.length;
    let frequentWrongCount = 0;

    if (badge) badge.textContent = totalAttempts.toString();
    if (attemptsBadge) attemptsBadge.textContent = `${totalAttempts} Attempt${totalAttempts === 1 ? '' : 's'}`;

    if (localTests.length > 0) {
      const latest = localTests[0];
      if (scoreVal) scoreVal.innerHTML = formatNetMarksHtml(latest);
      if (scoreSub) {
        scoreSub.textContent = `Latest · ${latest.accuracy_pct}% (${latest.correct}✔ / ${latest.incorrect}✖)`;
      }
      avgAccuracy = Number((localTests.reduce((acc, t) => acc + (Number(t.accuracy_pct) || 0), 0) / localTests.length).toFixed(1));
      if (accVal) accVal.textContent = `${avgAccuracy}%`;
      applyAccuracyTargetUi(avgAccuracy, priorityInfo);
    }

    // Check MongoDB API
    try {
      const res = await authFetch(`${API_BASE}/chapter-tests?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.attempts && data.attempts.length > 0) {
          attempts = data.attempts;
          totalAttempts = Math.max(localTests.length, data.summary?.total_tests || 0);
          if (badge) badge.textContent = totalAttempts.toString();
          if (attemptsBadge) attemptsBadge.textContent = `${totalAttempts} Attempt${totalAttempts === 1 ? '' : 's'}`;

          const latest = attempts[0];
          if (scoreVal) scoreVal.innerHTML = formatNetMarksHtml(latest);
          if (scoreSub) {
            scoreSub.textContent = `Latest · ${latest.accuracy_pct}% (${latest.correct}✔ / ${latest.incorrect}✖)`;
          }

          avgAccuracy = Number(data.summary?.avg_accuracy || (attempts.reduce((acc, t) => acc + (t.accuracy_pct || 0), 0) / attempts.length).toFixed(1));
          if (accVal) accVal.textContent = `${avgAccuracy}%`;
          applyAccuracyTargetUi(avgAccuracy, priorityInfo);

          const trapList = data.summary?.trap_questions || [];
          frequentWrongCount = trapList.length || Object.keys(data.summary?.frequent_wrong_questions || {}).length;

          if (accSub) {
            accSub.innerHTML = frequentWrongCount > 0
              ? `<strong>${frequentWrongCount} recurring trap${frequentWrongCount > 1 ? 's' : ''}</strong> · click to drill`
              : 'No recurring traps · +1.33 / −0.44 marking';
          }

          if (trapBadge) {
            if (frequentWrongCount > 0) {
              trapBadge.textContent = frequentWrongCount.toString();
              trapBadge.style.display = 'inline-block';
            } else {
              trapBadge.style.display = 'none';
            }
          }

          window.__TOPIC_PAST_TESTS__ = data;

          // Render Automatic Weak Subtopics Bar & In-Note Annotations
          const weakList = data.summary?.weak_subtopics || [];
          renderChapterWeakSubtopicsBar(weakList);
          annotateNoteHeadingsWithWeakness(weakList);
        }
      }
    } catch {}

    // Fallback if offline or only local test attempts exist
    if ((!attempts || attempts.length === 0) && localTests.length > 0) {
      const subMistakes = {};
      localTests.forEach(t => {
        (t.wrong_questions || []).forEach(w => {
          const sec = w.section_title || 'General Notes';
          subMistakes[sec] = (subMistakes[sec] || 0) + 1;
        });
      });
      const localWeak = Object.entries(subMistakes)
        .map(([subtopic, total_mistakes]) => ({ subtopic, total_mistakes }))
        .sort((a, b) => b.total_mistakes - a.total_mistakes);
      renderChapterWeakSubtopicsBar(localWeak);
      annotateNoteHeadingsWithWeakness(localWeak);
    }
  }

  // Retrieve past wrong questions matching a section/subtopic name
  function getMistakesForSubtopic(subtopicName) {
    const norm = (s) => (s || '')
      .toLowerCase()
      .replace(/¶/g, '')
      .replace(/⚠️.*$/g, '')
      .replace(/🔍.*$/g, '')
      .replace(/focus area.*$/i, '')
      .replace(/^[0-9\.\s\-\:]+/, '')
      .replace(/[—–\-]/g, ' ')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const cleanTarget = norm(subtopicName);
    const mistakes = [];
    const seen = new Set();

    function addIfMatch(w) {
      if (!w) return;
      const key = w.q_id || (w.stem ? w.stem.substring(0, 80) : '');
      if (key && seen.has(key)) return;
      const sec = norm(w.section_title);
      const head = norm(w.q_header);
      const stem = norm(w.stem);

      const matchesSec = cleanTarget.length > 2 && (sec.includes(cleanTarget) || cleanTarget.includes(sec));
      const matchesContent = cleanTarget.length > 4 && (head.includes(cleanTarget) || stem.includes(cleanTarget));

      if (matchesSec || (sec.includes('general') && matchesContent)) {
        seen.add(key);
        mistakes.push(repairQuestionOptions(w));
      }
    }

    // 1. From server response stored in window.__TOPIC_PAST_TESTS__
    if (window.__TOPIC_PAST_TESTS__) {
      const traps = window.__TOPIC_PAST_TESTS__.summary?.trap_questions || [];
      traps.forEach(addIfMatch);
      const attempts = window.__TOPIC_PAST_TESTS__.attempts || [];
      attempts.forEach(att => (att.wrong_questions || []).forEach(addIfMatch));
    }

    // 2. From LocalStorage test attempts
    try {
      const topicInfo = getCurrentTopicInfo();
      if (topicInfo) {
        const localAttempts = getLocalTopicTests(topicInfo.subject, topicInfo.topic);
        localAttempts.forEach(att => (att.wrong_questions || []).forEach(addIfMatch));
      }
    } catch {}

    // Fallback: If no exact section match, check if any mistake has section words matching heading words
    if (mistakes.length === 0 && cleanTarget.length > 3) {
      const words = cleanTarget.split(/\s+/).filter(w => w.length > 3);
      if (words.length > 0) {
        function addWordMatch(w) {
          if (!w) return;
          const key = w.q_id || (w.stem ? w.stem.substring(0, 80) : '');
          if (key && seen.has(key)) return;
          const sec = norm(w.section_title);
          const stem = norm(w.stem);
          const wordHit = words.some(word => sec.includes(word) || stem.includes(word));
          if (wordHit) {
            seen.add(key);
            mistakes.push(repairQuestionOptions(w));
          }
        }
        if (window.__TOPIC_PAST_TESTS__) {
          (window.__TOPIC_PAST_TESTS__.summary?.trap_questions || []).forEach(addWordMatch);
          (window.__TOPIC_PAST_TESTS__.attempts || []).forEach(att => (att.wrong_questions || []).forEach(addWordMatch));
        }
      }
    }

    return mistakes;
  }

  // Interactive modal to review mistake details for a specific Focus Area
  async function openFocusAreaMistakesModal(subtopicTitle, mistakes, mistakesCount) {
    const topicInfo = getCurrentTopicInfo();
    let currentMistakes = (Array.isArray(mistakes) && mistakes.length > 0) ? [...mistakes] : [];

    // If no mistakes found in memory, try fetching tests asynchronously
    if (currentMistakes.length === 0 && topicInfo) {
      if (!window.__TOPIC_PAST_TESTS__) {
        try {
          const res = await authFetch(`${API_BASE}/chapter-tests?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`);
          if (res.ok) {
            window.__TOPIC_PAST_TESTS__ = await res.json();
          }
        } catch (e) {}
      }
      currentMistakes = getMistakesForSubtopic(subtopicTitle);
    }

    const count = currentMistakes.length > 0 ? currentMistakes.length : (mistakesCount || 1);

    let mistakesHtml = '';
    if (currentMistakes.length > 0) {
      mistakesHtml = currentMistakes.map((rawM, idx) => {
        const m = repairQuestionOptions(rawM);
        const header = m.q_header || `Mistake #${idx + 1}`;
        const stemHtml = escapeHtml(m.stem || 'Question details unavailable').replace(/\n/g, '<br>');

        let optionsHtml = '';
        if (m.options && typeof m.options === 'object') {
          const optEntries = Object.entries(m.options).filter(([k, v]) => v && String(v).trim());
          if (optEntries.length > 0) {
            optionsHtml = `
              <div class="st-mistake-options-grid" style="margin: 0.75rem 0; display: grid; gap: 0.4rem;">
                ${optEntries.map(([letter, text]) => {
                  const isUser = (m.user_answer || '').toUpperCase() === letter;
                  const isCorrect = (m.correct_answer || '').toUpperCase() === letter;
                  let optClass = 'st-mistake-opt';
                  let badgeTag = '';
                  if (isCorrect) {
                    optClass += ' is-correct-opt';
                    badgeTag = '<span style="color: #10b981; font-weight: 800; font-size: 0.72rem; margin-left: 0.5rem;">✔ Correct Answer</span>';
                  } else if (isUser) {
                    optClass += ' is-user-wrong-opt';
                    badgeTag = '<span style="color: #ef4444; font-weight: 800; font-size: 0.72rem; margin-left: 0.5rem;">✖ Your Choice</span>';
                  }
                  return `
                    <div class="${optClass}" style="padding: 0.45rem 0.75rem; border-radius: 6px; font-size: 0.85rem; border: 1px solid ${isCorrect ? '#10b981' : (isUser ? '#ef4444' : 'var(--md-default-fg-color--lightest)')}; background: ${isCorrect ? 'rgba(16, 185, 129, 0.08)' : (isUser ? 'rgba(239, 68, 68, 0.08)' : 'transparent')};">
                      <strong>${letter}.</strong> ${escapeHtml(text)} ${badgeTag}
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          }
        }

        if (!optionsHtml) {
          optionsHtml = `
            <div style="margin: 0.5rem 0; font-size: 0.85rem; display: flex; gap: 1rem; flex-wrap: wrap;">
              <span style="color: #ef4444; font-weight: 700;">✖ Your Answer: ${escapeHtml(m.user_answer || 'Unattempted')}</span>
              <span style="color: #10b981; font-weight: 700;">✔ Correct Answer: ${escapeHtml(m.correct_answer || '—')}</span>
            </div>
          `;
        }

        let explanationHtml = '';
        if (m.explanation) {
          explanationHtml = `
            <div class="st-mistake-explanation-box" style="margin-top: 0.75rem; padding: 0.75rem 1rem; border-radius: 8px; background: rgba(59, 130, 246, 0.08); border-left: 4px solid #3b82f6; font-size: 0.85rem; line-height: 1.55;">
              <div style="font-weight: 800; color: #2563eb; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                💡 Explanation & Key Exam Takeaway
              </div>
              <div>${escapeHtml(m.explanation).replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
            </div>
          `;
        }

        return `
          <div class="st-mistake-card" style="margin-bottom: 1.25rem; padding: 1rem 1.15rem; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.25); background: var(--md-code-bg-color, rgba(0,0,0,0.02));">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.35rem;">
              <span style="font-size: 0.75rem; font-weight: 800; color: #ef4444; background: rgba(239, 68, 68, 0.12); padding: 0.15rem 0.5rem; border-radius: 9999px;">
                ⚠️ Question ${idx + 1} of ${currentMistakes.length}
              </span>
              <span style="font-size: 0.75rem; color: var(--md-default-fg-color--light); font-weight: 600;">
                ${escapeHtml(header)}
              </span>
            </div>
            <div style="font-size: 0.95rem; font-weight: 600; line-height: 1.45; margin-bottom: 0.5rem; color: var(--md-default-fg-color);">
              ${stemHtml}
            </div>
            ${optionsHtml}
            ${explanationHtml}
            <div style="margin-top: 0.75rem; display: flex; justify-content: flex-end;">
              <button type="button" class="st-btn st-btn-sm st-btn-outline st-btn-retry-single-q" data-qindex="${idx}" style="font-size: 0.78rem; padding: 0.3rem 0.75rem;">
                🎯 Re-test This Question Now
              </button>
            </div>
          </div>
        `;
      }).join('');
    } else {
      mistakesHtml = `
        <div style="padding: 2rem 1rem; text-align: center;">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🎯</div>
          <h4 style="margin: 0.25rem 0;">Focus Area Recorded</h4>
          <p style="color: var(--md-default-fg-color--light); font-size: 0.9rem; max-width: 440px; margin: 0.5rem auto 1.25rem; line-height: 1.5;">
            You recorded <strong>${count} mistake(s)</strong> in <em>${escapeHtml(subtopicTitle)}</em> in previous test sessions. Practice active recall on this section to clear the weak area.
          </p>
        </div>
      `;
    }

    const modalHtml = `
      <div class="st-focus-review-modal" style="max-height: 75vh; overflow-y: auto; padding-right: 0.25rem;">
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
          <div>
            <div style="font-size: 0.88rem; font-weight: 800; color: #ef4444;">
              ⚠️ Focus Area Analysis: ${escapeHtml(subtopicTitle)}
            </div>
            <div style="font-size: 0.78rem; color: var(--md-default-fg-color--light); margin-top: 2px;">
              Review your past wrong choices and key exam traps to turn this into a high-scoring mastery zone.
            </div>
          </div>
          <span style="background: #ef4444; color: #fff; font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; white-space: nowrap;">
            ${count} Mistake${count > 1 ? 's' : ''}
          </span>
        </div>

        ${mistakesHtml}

        <div class="st-form-actions" style="margin-top: 1.25rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <button type="button" class="st-btn st-btn-secondary" id="st-btn-close-focus-modal">
            Close & Continue Reading
          </button>
          ${currentMistakes.length > 0 ? `
            <button type="button" class="st-btn st-btn-primary" id="st-btn-drill-all-focus-mistakes" style="background: #ef4444; border-color: #ef4444;">
              🎯 Re-test All ${currentMistakes.length} Mistake${currentMistakes.length > 1 ? 's' : ''} Now
            </button>
          ` : `
            <button type="button" class="st-btn st-btn-primary" id="st-btn-launch-focus-test">
              ⚔️ Test This Chapter Now
            </button>
          `}
        </div>
      </div>
    `;

    showModal(`Focus Area Review — ${subtopicTitle}`, modalHtml);

    document.getElementById('st-btn-close-focus-modal')?.addEventListener('click', closeModal);

    document.getElementById('st-btn-drill-all-focus-mistakes')?.addEventListener('click', () => {
      closeModal();
      if (topicInfo && currentMistakes.length > 0) {
        openTestEngineModal(topicInfo, { customQuestions: currentMistakes, testMode: 'practice' });
      }
    });

    document.getElementById('st-btn-launch-focus-test')?.addEventListener('click', () => {
      closeModal();
      if (topicInfo) {
        openTestEngineModal(topicInfo, { testMode: 'practice' });
      }
    });

    document.querySelectorAll('.st-btn-retry-single-q').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qIdx = parseInt(e.currentTarget.getAttribute('data-qindex') || '0', 10);
        const targetQ = currentMistakes[qIdx];
        closeModal();
        if (topicInfo && targetQ) {
          openTestEngineModal(topicInfo, { customQuestions: [targetQ], testMode: 'practice' });
        }
      });
    });
  }

  // Smooth scroll to chapter heading matching subtopic name
  function scrollToSubtopicHeading(subtopicName) {
    if (!subtopicName) return;
    const cleanTarget = subtopicName.toLowerCase().replace(/^[0-9\.\s\-\:]+/, '').trim();
    const headings = document.querySelectorAll('.md-content__inner h2, .md-content__inner h3, .md-content__inner h4, article h2, article h3, article h4');
    
    for (const h of headings) {
      const hText = h.textContent.replace(/¶/g, '').trim().toLowerCase();
      if (hText.includes(cleanTarget) || cleanTarget.includes(hText)) {
        h.scrollIntoView({ behavior: 'smooth', block: 'center' });
        h.classList.add('st-highlight-flash');
        setTimeout(() => h.classList.remove('st-highlight-flash'), 2500);
        return;
      }
    }
  }

  // Annotate in-note H2/H3/H4 headings with automatic weakness indicators
  function annotateNoteHeadingsWithWeakness(weakSubtopics) {
    if (!weakSubtopics || !Array.isArray(weakSubtopics)) return;
    const headings = document.querySelectorAll('.md-content__inner h2, .md-content__inner h3, .md-content__inner h4, article h2, article h3, article h4');
    
    headings.forEach(h => {
      const oldBadge = h.querySelector('.st-subtopic-in-note-badge');
      if (oldBadge) oldBadge.remove();
      h.classList.remove('st-weak-section-heading');

      const hText = h.textContent.replace(/¶/g, '').replace(/⚠️.*$/g, '').trim().toLowerCase();
      
      const match = weakSubtopics.find(ws => {
        const count = ws.total_mistakes !== undefined ? ws.total_mistakes : (ws.mistakes || 0);
        if (count <= 0 || !ws.subtopic) return false;
        const cleanSub = ws.subtopic.toLowerCase().replace(/^[0-9\.\s\-\:]+/, '').trim();
        return cleanSub.length > 2 && (hText.includes(cleanSub) || cleanSub.includes(hText));
      });

      if (match) {
        const mistakesCount = match.total_mistakes !== undefined ? match.total_mistakes : match.mistakes;
        const badge = document.createElement('span');
        badge.className = 'st-subtopic-in-note-badge';
        badge.title = `Automatic Weak Area: You made ${mistakesCount} mistake(s) here in recent tests. Click to review questions & exam traps!`;
        badge.innerHTML = `⚠️ Focus Area (${mistakesCount} Mistake${mistakesCount > 1 ? 's' : ''}) <span style="font-size: 0.65rem; opacity: 0.85; margin-left: 3px;">🔍 View</span>`;
        
        badge.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            const targetSubtopic = match.subtopic || h.textContent.replace(/¶/g, '').replace(/⚠️.*$/g, '').trim();
            const mistakes = getMistakesForSubtopic(targetSubtopic);
            openFocusAreaMistakesModal(targetSubtopic, mistakes, mistakesCount);
          } catch (err) {
            console.error('Failed to open focus area modal:', err);
          }
        });

        h.appendChild(badge);
        h.classList.add('st-weak-section-heading');
      }
    });
  }

  // Update the Weak Subtopics Chips Bar in the chapter deck
  function renderChapterWeakSubtopicsBar(weakSubtopics) {
    const bar = document.getElementById('st-chapter-subtopics-bar');
    const chipsContainer = document.getElementById('st-chapter-subtopics-chips');
    if (!bar || !chipsContainer) return;

    try {
      if (!weakSubtopics || !Array.isArray(weakSubtopics) || weakSubtopics.length === 0) {
        bar.style.display = 'none';
        return;
      }

      const activeWeak = weakSubtopics.filter(ws => {
        const count = ws.total_mistakes !== undefined ? ws.total_mistakes : (ws.mistakes || 0);
        return count > 0;
      }).slice(0, 6);

      if (activeWeak.length === 0) {
        bar.style.display = 'none';
        return;
      }

      chipsContainer.innerHTML = activeWeak.map(ws => {
        const count = ws.total_mistakes !== undefined ? ws.total_mistakes : (ws.mistakes || 0);
        const displayName = (ws.subtopic || 'General Notes').replace(/^Ghatnachakra Extra Drill\s*[-–—]\s*/i, 'Drill: ');
        return `
          <button type="button" class="st-subtopic-tag" data-subtopic="${encodeURIComponent(ws.subtopic)}" title="Click to review mistakes in ${escapeHtml(displayName)}">
            ⚠️ ${escapeHtml(displayName)} <strong>(${count} Miss${count > 1 ? 'es' : ''})</strong> 🔍
          </button>
        `;
      }).join('');

      chipsContainer.querySelectorAll('.st-subtopic-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
          const sub = decodeURIComponent(e.currentTarget.getAttribute('data-subtopic') || '');
          const mistakes = getMistakesForSubtopic(sub);
          if (mistakes.length > 0) {
            openFocusAreaMistakesModal(sub, mistakes, mistakes.length);
          } else {
            scrollToSubtopicHeading(sub);
          }
        });
      });

      bar.style.display = 'flex';
    } catch (err) {
      console.warn('renderChapterWeakSubtopicsBar error:', err);
      bar.style.display = 'none';
    }
  }

  // -------------------------------------------------------------
  // 2. INTERACTIVE IN-CHAPTER LIVE PRACTICE TEST ENGINE (CBT)
  // -------------------------------------------------------------
  async function openTestEngineModal(topicInfo, testOptions = {}) {
    showModal(`Live Practice Test: ${topicInfo.title}`, `
      <div class="st-loading-spinner">
        <div class="st-spinner"></div>
        <p><strong>Loading real questions from MongoDB Atlas...</strong></p>
        <small style="color: var(--md-default-fg-color--light);">Fetching mapped PYQs & Ghatnachakra questions</small>
      </div>
    `);

    let loadedQuestions = [];
    if (testOptions.customQuestions && testOptions.customQuestions.length > 0) {
      loadedQuestions = testOptions.customQuestions.map((q, idx) => ({
        ...q,
        q_num: idx + 1,
        display_num: idx + 1,
        options: (q.options && typeof q.options === 'object') ? q.options : { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' }
      }));
    } else {
      try {
        const queryParams = new URLSearchParams({
          subject: topicInfo.subject,
          topic: topicInfo.slug || topicInfo.topic,
          chapter: topicInfo.slug || topicInfo.topic,
          title: topicInfo.title || '',
          shuffle: 'true'
        });
        const res = await authFetch(`${API_BASE}/chapter-questions?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            loadedQuestions = data.questions;
          }
        }
      } catch (e) {
        console.warn('Backend questions fetch failed:', e);
      }

      // Fallback to DOM questions if database returned 0
      if (loadedQuestions.length === 0) {
        const domQuestions = extractChapterQuestions();
        if (domQuestions.length > 0) {
          loadedQuestions = domQuestions.map((q, idx) => ({
            q_id: `${topicInfo.subject}_${topicInfo.topic}_${idx + 1}`.replace(/[^a-z0-9_]/gi, '_').toLowerCase(),
            q_num: idx + 1,
            q_header: q.q_header || `Question ${idx + 1}`,
            category: q.category || 'practice',
            section_title: q.section_title || '',
            stem: q.stem,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation_html
          }));
        }
      }
    }

    // Question Normalizer: guarantees all questions have valid options and clean stems
    loadedQuestions = loadedQuestions.map((q) => repairQuestionOptions(q));

    if (loadedQuestions.length === 0) {
      showModal(`Live Test: ${topicInfo.title}`, `
        <div class="st-empty-state" style="padding: 2rem 1rem;">
          <h3>⚠️ No Practice Questions Found</h3>
          <p>No questions are currently mapped for <strong>${topicInfo.title}</strong>.</p>
          <div class="st-form-actions" style="margin-top: 1rem; justify-content: center;">
            <button type="button" class="st-btn st-btn-primary" id="st-btn-close-empty">Back to Reading</button>
          </div>
        </div>
      `);
      document.getElementById('st-btn-close-empty')?.addEventListener('click', closeModal);
      return;
    }

    let currentQuestionIndex = 0;
    let selectedAnswers = {};   // { [q_id]: 'A' | 'B' | 'C' | 'D' }
    let flaggedQuestions = {};  // { [q_id]: true }
    let visitedQuestions = {};  // { [q_id]: true }
    let testMode = testOptions.testMode || 'exam'; // 'exam' or 'practice'
    let questionSubset = [...loadedQuestions];
    let testStartTime = Date.now();
    let timerInterval = null;

    const isMasteryGate = !!testOptions.isMasteryGate;
    const isMasteryRedemption = !!testOptions.isMasteryRedemption;

    // Check if an uncompleted test session backup exists for this chapter
    const sessionBackup = getQuizSessionBackup();
    const hasValidBackup = sessionBackup &&
      sessionBackup.subject === topicInfo.subject &&
      sessionBackup.topic === (topicInfo.slug || topicInfo.topic) &&
      Array.isArray(sessionBackup.questionSubset) &&
      sessionBackup.questionSubset.length > 0;

    // Direct launch if Fast-Track Mastery Redemption Drill
    if (isMasteryRedemption) {
      if (testOptions.customQuestions && testOptions.customQuestions.length > 0) {
        questionSubset = testOptions.customQuestions;
      }
      testMode = 'exam';
      startActiveQuiz();
      return;
    }

    // Direct launch if Mastery Gate Qualifying Exam (50 questions, exam mode)
    if (isMasteryGate) {
      if (hasValidBackup && sessionBackup.isMasteryGate) {
        const savedAnsCount = Object.keys(sessionBackup.selectedAnswers || {}).length;
        const savedTotal = sessionBackup.questionSubset.length;
        if (confirm(`🔄 In-Progress Qualifying Exam Found!\n\nYou answered ${savedAnsCount} of ${savedTotal} questions earlier.\n\nDo you want to RESUME from Question ${(sessionBackup.currentQuestionIndex || 0) + 1}?`)) {
          questionSubset = sessionBackup.questionSubset;
          currentQuestionIndex = Math.min(sessionBackup.currentQuestionIndex || 0, questionSubset.length - 1);
          selectedAnswers = sessionBackup.selectedAnswers || {};
          flaggedQuestions = sessionBackup.flaggedQuestions || {};
          visitedQuestions = sessionBackup.visitedQuestions || {};
          testMode = sessionBackup.testMode || 'exam';
          testStartTime = sessionBackup.testStartTime || Date.now();
          startActiveQuiz(true);
          return;
        } else {
          clearQuizSessionBackup();
        }
      }

      if (loadedQuestions.length < 5) {
        showModal(`⚔️ Mastery Gate: ${topicInfo.title}`, `
          <div class="st-empty-state" style="padding: 2rem 1rem; text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
            <h3 style="color: #ef4444; font-weight: 800; margin: 0.5rem 0;">Mastery Qualifying Exam Unavailable</h3>
            <p style="max-width: 480px; margin: 0.5rem auto 1.5rem; color: var(--md-default-fg-color--light); font-size: 0.95rem; line-height: 1.5;">
              Only <strong>${loadedQuestions.length}</strong> question(s) found for this topic. Under strict preparation rules, a chapter cannot be officially marked read without a genuine 50-Question Qualifying Exam.
            </p>
            <div class="st-form-actions" style="margin-top: 1rem; justify-content: center;">
              <button type="button" class="st-btn st-btn-primary" id="st-btn-close-empty">Back to Reading Notes</button>
            </div>
          </div>
        `);
        document.getElementById('st-btn-close-empty')?.addEventListener('click', closeModal);
        return;
      }
      const shuffled = [...loadedQuestions].sort(() => 0.5 - Math.random());
      const targetCount = Math.min(50, shuffled.length);
      questionSubset = shuffled.slice(0, targetCount);
      testMode = 'exam';
      startActiveQuiz();
      return;
    }

    // Direct launch if custom trap questions drill
    if (testOptions.customQuestions && testOptions.customQuestions.length > 0) {
      questionSubset = loadedQuestions;
      testMode = 'practice';
      startActiveQuiz();
      return;
    }

    // Question Categorization Helper
    function categorizeQuestion(q) {
      if (q.category) return q.category;
      const header = (q.q_header || '').toLowerCase();
      const stem = (q.stem || '').toLowerCase();
      const sec = (q.section_title || '').toLowerCase();

      // Practice Zone / in-note drills
      if (sec.includes('practice') || header.includes('practice') || stem.includes('practice zone') || header.includes('drill') || header.includes('exercise')) {
        return 'practice';
      }
      // Official UPPCS & State PSC past year questions
      if ((sec.includes('pyq') && !sec.includes('ghatnachakra')) || header.includes('inline pyq') || header.includes('uppcs') || header.includes('ukpcs') || header.includes('ro/aro') || (header.includes('pyq') && !header.includes('gc'))) {
        return 'pyqs';
      }
      // Ghatnachakra question bank & all state PSCs
      if (sec.includes('ghatnachakra') || header.includes('gc') || header.includes('ghatna') || header.match(/\bq\s*[-–—]?\s*(?:gc)?\s*\d+/i) || header.match(/(ias|bpsc|mppcs|cgpcs|ras|jpsc|upsc)/i)) {
        return 'ghatnachakra';
      }
      return 'practice';
    }

    // Launcher Screen
    function renderLauncher() {
      const totalQs = loadedQuestions.length;

      // Group questions by source
      const pyqList = loadedQuestions.filter(q => categorizeQuestion(q) === 'pyqs');
      const gcList = loadedQuestions.filter(q => categorizeQuestion(q) === 'ghatnachakra');
      let practiceList = loadedQuestions.filter(q => categorizeQuestion(q) === 'practice');
      const otherList = loadedQuestions.filter(q => categorizeQuestion(q) === 'other');

      // If practiceList is 0 but otherList has items, treat other as practice
      if (practiceList.length === 0 && otherList.length > 0) {
        practiceList = otherList;
      }

      let activeCategory = 'all';
      let activePool = [...loadedQuestions];

      const existingBackup = getQuizSessionBackup();
      const canResume = existingBackup &&
        existingBackup.subject === topicInfo.subject &&
        existingBackup.topic === (topicInfo.slug || topicInfo.topic) &&
        Array.isArray(existingBackup.questionSubset) &&
        existingBackup.questionSubset.length > 0;

      const html = `
        <div class="st-test-launcher">
          <div class="st-launcher-hero">
            <h3>🎯 Chapter Live Practice Test</h3>
            <p>Topic: <strong>${topicInfo.title}</strong> (${topicInfo.subject.toUpperCase()})</p>
            <div class="st-launcher-stats">
              <span>📚 <strong>${totalQs}</strong> Questions in Database</span>
              <span>⚖️ <strong>+1.33</strong> Correct / <strong>-0.44</strong> (1/3rd Negative)</span>
            </div>
          </div>

          ${canResume ? `
            <div class="st-resume-test-banner" id="st-resume-test-banner">
              <div class="st-resume-info">
                <span class="st-resume-badge">🔄 In-Progress Test Detected</span>
                <p>You have an unfinished test with <strong>${Object.keys(existingBackup.selectedAnswers || {}).length} answered</strong> out of <strong>${existingBackup.questionSubset.length} questions</strong> from this session.</p>
              </div>
              <div class="st-resume-actions">
                <button type="button" class="st-btn st-btn-primary st-btn-sm" id="st-btn-resume-quiz">
                  ⏩ Resume from Question ${(existingBackup.currentQuestionIndex || 0) + 1}
                </button>
                <button type="button" class="st-btn st-btn-outline st-btn-sm" id="st-btn-discard-quiz">
                  🗑️ Discard &amp; Start Fresh
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Dropdown: Select Question Source -->
          <div class="st-form-group">
            <label class="st-launcher-label" for="st-q-source-select">
              <strong>🎯 Select Practice Category / Source:</strong>
            </label>
            <div class="st-select-wrapper">
              <select class="st-select" id="st-q-source-select">
                <option value="all" selected>All Available Questions (${totalQs} Total)</option>
                <option value="pyqs">🏛️ UPPCS & State PSC PYQs (${pyqList.length} Questions)</option>
                <option value="ghatnachakra">📖 Ghatnachakra Purvavlokan Bank (${gcList.length} Questions)</option>
                <option value="practice">🎯 Practice Zone / Topic Drills (${practiceList.length} Questions)</option>
              </select>
              <div class="st-category-hint" id="st-category-hint">
                Showing all <strong>${totalQs}</strong> questions from PYQs, Ghatnachakra and Practice Zone.
              </div>
            </div>
          </div>

          <!-- Select Question Count -->
          <div class="st-form-group">
            <label class="st-launcher-label"><strong>🔢 Select Question Count:</strong></label>
            <div class="st-mode-buttons" id="st-q-count-selector">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- Select Test Mode -->
          <div class="st-form-group">
            <label class="st-launcher-label"><strong>⚙️ Select Test Mode:</strong></label>
            <div class="st-test-mode-grid" id="st-test-mode-selector">
              <div class="st-test-mode-card is-selected" data-mode="exam">
                <div class="st-tm-title">⏱️ Real Exam CBT Mode</div>
                <div class="st-tm-desc">Official timer, question palette, 1/3rd negative marking (-0.44), scorecard & mistake radar</div>
              </div>
              <div class="st-test-mode-card" data-mode="practice">
                <div class="st-tm-title">💡 Practice Drill Mode</div>
                <div class="st-tm-desc">Instant answer verification & explanation logic shown immediately upon clicking an option</div>
              </div>
            </div>
          </div>

          <div class="st-form-actions st-launcher-actions">
            <button type="button" class="st-btn st-btn-outline" id="st-cancel-test-launch">Cancel</button>
            <button type="button" class="st-btn st-btn-primary" id="st-btn-begin-test">
              🚀 Start Live Test
            </button>
          </div>
        </div>
      `;

      showModal(`Live Test: ${topicInfo.title}`, html);

      if (canResume) {
        document.getElementById('st-btn-resume-quiz')?.addEventListener('click', () => {
          questionSubset = existingBackup.questionSubset;
          currentQuestionIndex = Math.min(existingBackup.currentQuestionIndex || 0, questionSubset.length - 1);
          selectedAnswers = existingBackup.selectedAnswers || {};
          flaggedQuestions = existingBackup.flaggedQuestions || {};
          visitedQuestions = existingBackup.visitedQuestions || {};
          testMode = existingBackup.testMode || testMode;
          testStartTime = existingBackup.testStartTime || Date.now();
          startActiveQuiz(true);
        });

        document.getElementById('st-btn-discard-quiz')?.addEventListener('click', () => {
          clearQuizSessionBackup();
          document.getElementById('st-resume-test-banner')?.remove();
        });
      }

      // Helper to update count pills based on active pool
      function refreshCountPills(pool) {
        const countSelector = document.getElementById('st-q-count-selector');
        if (!countSelector) return;

        const n = pool.length;
        if (n === 0) {
          countSelector.innerHTML = `<div style="grid-column: 1/-1; color: var(--md-default-fg-color--light); font-size: 0.85rem; padding: 0.5rem 0;">No questions found in this specific category for this chapter. Please select "All Questions".</div>`;
          questionSubset = [];
          return;
        }

        let pillsHtml = `<button type="button" class="st-mode-btn is-selected" data-count="${n}">All (${n} Qs)</button>`;
        if (n >= 10) pillsHtml += `<button type="button" class="st-mode-btn" data-count="10">⚡ Quick 10</button>`;
        if (n >= 25) pillsHtml += `<button type="button" class="st-mode-btn" data-count="25">🎯 Standard 25</button>`;
        if (n >= 50) pillsHtml += `<button type="button" class="st-mode-btn" data-count="50">📚 Comprehensive 50</button>`;

        countSelector.innerHTML = pillsHtml;

        // Default question subset selection
        if (testOptions.autoStartCount && n >= testOptions.autoStartCount) {
          questionSubset = pool.slice(0, testOptions.autoStartCount);
          countSelector.querySelectorAll('.st-mode-btn').forEach(b => {
            if (Number(b.dataset.count) === testOptions.autoStartCount) {
              b.classList.add('is-selected');
            } else {
              b.classList.remove('is-selected');
            }
          });
        } else {
          questionSubset = pool.slice(0, n);
        }

        // Attach listeners to count buttons
        countSelector.querySelectorAll('.st-mode-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            countSelector.querySelectorAll('.st-mode-btn').forEach(b => b.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            const count = Number(btn.dataset.count);
            questionSubset = pool.slice(0, count);
          });
        });
      }

      // Initial count pills rendering
      refreshCountPills(activePool);

      // Dropdown category change listener
      const sourceSelect = document.getElementById('st-q-source-select');
      const categoryHint = document.getElementById('st-category-hint');

      sourceSelect?.addEventListener('change', (e) => {
        activeCategory = e.target.value;

        if (activeCategory === 'pyqs') {
          activePool = pyqList.length > 0 ? pyqList : [...loadedQuestions];
          if (categoryHint) {
            categoryHint.innerHTML = pyqList.length > 0 
              ? `Filtered to <strong>${pyqList.length}</strong> official UPPCS & State PSC Past Year Questions.`
              : `Note: 0 standalone PYQs tagged in this chapter note. Loaded all ${totalQs} questions.`;
          }
        } else if (activeCategory === 'ghatnachakra') {
          activePool = gcList.length > 0 ? gcList : [...loadedQuestions];
          if (categoryHint) {
            categoryHint.innerHTML = gcList.length > 0 
              ? `Filtered to <strong>${gcList.length}</strong> Ghatnachakra Purvavlokan series questions.`
              : `Note: 0 Ghatnachakra questions tagged. Loaded all ${totalQs} questions.`;
          }
        } else if (activeCategory === 'practice') {
          activePool = practiceList.length > 0 ? practiceList : [...loadedQuestions];
          if (categoryHint) {
            categoryHint.innerHTML = practiceList.length > 0 
              ? `Filtered to <strong>${practiceList.length}</strong> in-note Practice Zone exercises.`
              : `Note: No specific Practice Zone tagged in this note. Loaded all ${totalQs} questions.`;
          }
        } else {
          activePool = [...loadedQuestions];
          if (categoryHint) {
            categoryHint.innerHTML = `Showing all <strong>${totalQs}</strong> questions from PYQs, Ghatnachakra and Practice Zone.`;
          }
        }

        refreshCountPills(activePool);
      });

      // Test Mode selector cards
      document.querySelectorAll('#st-test-mode-selector .st-test-mode-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('#st-test-mode-selector .st-test-mode-card').forEach(c => c.classList.remove('is-selected'));
          card.classList.add('is-selected');
          testMode = card.dataset.mode;
        });
      });

      document.getElementById('st-cancel-test-launch')?.addEventListener('click', closeModal);
      document.getElementById('st-btn-begin-test')?.addEventListener('click', () => {
        if (questionSubset.length === 0) {
          alert('Please select at least 1 question to start the test.');
          return;
        }
        startActiveQuiz();
      });
    }

    // Active Quiz Screen
    function persistCurrentQuizState() {
      if (!activeQuizSession || !activeQuizSession.isActive) return;
      setQuizSessionBackup({
        subject: topicInfo.subject,
        topic: topicInfo.slug || topicInfo.topic,
        topicTitle: topicInfo.title,
        questionSubset,
        currentQuestionIndex,
        selectedAnswers,
        flaggedQuestions,
        visitedQuestions,
        testMode,
        isMasteryGate,
        testStartTime
      });
    }

    function startActiveQuiz(isResuming = false) {
      if (!isResuming) {
        testStartTime = Date.now();
        currentQuestionIndex = 0;
        selectedAnswers = {};
        flaggedQuestions = {};
        visitedQuestions = {};
      }

      activeQuizSession = {
        isActive: true,
        topicInfo,
        questionSubset,
        get currentQuestionIndex() { return currentQuestionIndex; },
        get selectedAnswers() { return selectedAnswers; },
        get flaggedQuestions() { return flaggedQuestions; },
        get visitedQuestions() { return visitedQuestions; },
        testMode,
        isMasteryGate,
        testStartTime,
        timerInterval,
        abortQuiz: () => {
          if (timerInterval) clearInterval(timerInterval);
          activeQuizSession.isActive = false;
          activeQuizSession = null;
          clearQuizSessionBackup();
          closeModal(true);
        }
      };

      persistCurrentQuizState();

      const modalBox = document.getElementById('st-modal-box');
      if (modalBox) modalBox.classList.add('st-modal-wide');

      startTimer();
      renderQuestionView();
    }

    function startTimer() {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        const timerEl = document.getElementById('st-quiz-timer');
        if (!timerEl) {
          clearInterval(timerInterval);
          return;
        }
        const elapsedSec = Math.floor((Date.now() - testStartTime) / 1000);
        const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
        const secs = String(elapsedSec % 60).padStart(2, '0');
        timerEl.textContent = `⏱️ ${mins}:${secs}`;
      }, 1000);
    }

    function renderQuestionView() {
      const q = questionSubset[currentQuestionIndex];
      const total = questionSubset.length;
      visitedQuestions[q.q_id] = true;
      const userChoice = selectedAnswers[q.q_id];
      const isFlagged = Boolean(flaggedQuestions[q.q_id]);

      // Summary counts for palette
      const answeredCount = Object.keys(selectedAnswers).length;
      const flaggedCount = Object.keys(flaggedQuestions).length;

      const html = `
        <div class="st-quiz-container">
          ${isMasteryGate ? `
            <div class="st-mastery-test-strip">
              <span>⚔️ <strong>Chapter Mastery Qualifying Exam:</strong> ${total} Questions &bull; <strong>Must Score &ge;80% to Mark Chapter as Read</strong></span>
            </div>
          ` : (isMasteryRedemption ? `
            <div class="st-mastery-test-strip st-redemption-test-strip">
              <span>⚡ <strong>Fast-Track Mastery Redemption Drill:</strong> ${total} Questions &bull; <strong>Must Score 100% Accuracy (${total}/${total} Correct) to Conquer Chapter</strong></span>
            </div>
          ` : '')}
          <!-- Quiz Top Bar -->
          <div class="st-quiz-topbar">
            <div class="st-quiz-progress-text">
              Question <strong>${currentQuestionIndex + 1}</strong> of <strong>${total}</strong>
            </div>
            <div class="st-quiz-timer" id="st-quiz-timer">⏱️ 00:00</div>
            <button type="button" class="st-btn st-btn-primary st-btn-sm" id="st-quiz-finish-early">
              🏁 Submit Test
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="st-progress-bar-bg">
            <div class="st-progress-bar-fill" style="width: ${((currentQuestionIndex + 1) / total) * 100}%"></div>
          </div>

          <!-- CBT 2-Column Layout -->
          <div class="st-cbt-layout">
            <!-- Main Question Area -->
            <div class="st-cbt-main">
              <div class="st-quiz-stem-card">
                ${q.q_header ? `<div class="st-q-source-tag">${q.q_header}</div>` : ''}
                <div class="st-q-number-tag">Question ${currentQuestionIndex + 1} of ${total}</div>
                <div class="st-q-stem-text">${renderStemToHtml(q.stem)}</div>
              </div>

              <!-- Options -->
              <div class="st-quiz-options">
                ${['A', 'B', 'C', 'D'].map(opt => {
                  const optText = q.options ? q.options[opt] : '';
                  if (!optText) return '';
                  const isSelected = userChoice === opt;
                  let extraClass = '';

                  if (testMode === 'practice' && userChoice) {
                    if (opt === q.correct_answer) extraClass = 'is-correct-reveal';
                    else if (isSelected) extraClass = 'is-wrong-reveal';
                  } else if (isSelected) {
                    extraClass = 'is-selected';
                  }

                  return `
                    <button type="button" class="st-quiz-opt-btn ${extraClass}" data-opt="${opt}">
                      <span class="st-opt-letter">${opt}</span>
                      <span class="st-opt-text">${formatQuizOptionText(optText)}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Practice Mode Instant Explanation -->
              ${testMode === 'practice' && userChoice ? `
                <div class="st-practice-explanation">
                  <h4>${userChoice === q.correct_answer ? '🟢 Correct Answer!' : '🔴 Incorrect!'}</h4>
                  <div class="st-practice-expl-content">${typeof window.formatStudyExplanation === 'function' ? window.formatStudyExplanation(q.explanation || ('Correct Answer: ' + q.correct_answer)) : (q.explanation || ('Answer: ' + q.correct_answer))}</div>
                </div>
              ` : ''}

              <!-- Bottom Controls -->
              <div class="st-quiz-nav">
                <button type="button" class="st-btn st-btn-outline" id="st-quiz-prev" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                  ◀ Previous
                </button>

                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button type="button" class="st-btn-clear" id="st-btn-clear-choice" ${!userChoice ? 'style="display:none;"' : ''}>
                    Clear Choice
                  </button>
                  <button type="button" class="st-btn-flag ${isFlagged ? 'is-active' : ''}" id="st-btn-toggle-flag">
                    ${isFlagged ? '🔖 Flagged' : '🏳️ Flag for Review'}
                  </button>
                </div>

                ${currentQuestionIndex === total - 1 ? `
                  <button type="button" class="st-btn st-btn-primary" id="st-quiz-submit-btn">
                    🏁 Submit Test
                  </button>
                ` : `
                  <button type="button" class="st-btn st-btn-primary" id="st-quiz-next">
                    Next ▶
                  </button>
                `}
              </div>
            </div>

            <!-- Question Palette Sidebar -->
            <div class="st-cbt-sidebar">
              <div class="st-palette-title">Question Palette (${answeredCount}/${total})</div>
              <div class="st-palette-grid">
                ${questionSubset.map((item, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAns = Boolean(selectedAnswers[item.q_id]);
                  const isFlg = Boolean(flaggedQuestions[item.q_id]);
                  const isVst = Boolean(visitedQuestions[item.q_id]);

                  let stateClass = '';
                  if (isAns) stateClass = 'is-answered';
                  else if (isFlg) stateClass = 'is-flagged';
                  else if (isVst) stateClass = 'is-viewed';

                  return `
                    <button type="button" class="st-palette-item ${stateClass} ${isCurrent ? 'is-current' : ''}" data-idx="${idx}">
                      ${idx + 1}
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Legend -->
              <div class="st-palette-legend">
                <div class="st-legend-item">
                  <div class="st-legend-dot is-answered"></div> Answered (${answeredCount})
                </div>
                <div class="st-legend-item">
                  <div class="st-legend-dot is-flagged"></div> Flagged (${flaggedCount})
                </div>
                <div class="st-legend-item">
                  <div class="st-legend-dot is-viewed"></div> Not Answered (${Object.keys(visitedQuestions).length - answeredCount})
                </div>
                <div class="st-legend-item">
                  <div class="st-legend-dot is-empty"></div> Not Visited (${total - Object.keys(visitedQuestions).length})
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      showModal(`Live Test: ${topicInfo.title}`, html);

      // Bind Option Clicks
      document.querySelectorAll('.st-quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const opt = btn.dataset.opt;
          selectedAnswers[q.q_id] = opt;
          persistCurrentQuizState();
          renderQuestionView();
        });
      });

      // Clear Choice
      document.getElementById('st-btn-clear-choice')?.addEventListener('click', () => {
        delete selectedAnswers[q.q_id];
        persistCurrentQuizState();
        renderQuestionView();
      });

      // Toggle Flag
      document.getElementById('st-btn-toggle-flag')?.addEventListener('click', () => {
        if (flaggedQuestions[q.q_id]) {
          delete flaggedQuestions[q.q_id];
        } else {
          flaggedQuestions[q.q_id] = true;
        }
        persistCurrentQuizState();
        renderQuestionView();
      });

      // Palette Jump Clicks
      document.querySelectorAll('.st-palette-item').forEach(btn => {
        btn.addEventListener('click', () => {
          currentQuestionIndex = Number(btn.dataset.idx);
          persistCurrentQuizState();
          renderQuestionView();
        });
      });

      // Navigation
      document.getElementById('st-quiz-prev')?.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          persistCurrentQuizState();
          renderQuestionView();
        }
      });

      document.getElementById('st-quiz-next')?.addEventListener('click', () => {
        if (currentQuestionIndex < total - 1) {
          currentQuestionIndex++;
          persistCurrentQuizState();
          renderQuestionView();
        }
      });

      document.getElementById('st-quiz-finish-early')?.addEventListener('click', confirmAndSubmitTest);
      document.getElementById('st-quiz-submit-btn')?.addEventListener('click', confirmAndSubmitTest);
    }

    // Confirmation dialog before evaluation
    function confirmAndSubmitTest() {
      const total = questionSubset.length;
      const answered = Object.keys(selectedAnswers).length;
      const unattempted = total - answered;

      if (!confirm(`You have answered ${answered} of ${total} questions (${unattempted} unattempted).\n\nDo you want to submit your test for official evaluation?`)) {
        return;
      }

      finishAndEvaluateTest();
    }

    // Official Evaluation with Backend API
    async function finishAndEvaluateTest() {
      if (timerInterval) clearInterval(timerInterval);
      if (activeQuizSession) {
        activeQuizSession.isActive = false;
        activeQuizSession = null;
      }
      clearQuizSessionBackup();

      const totalTimeSec = Math.floor((Date.now() - testStartTime) / 1000);

      showModal(`Evaluating Test...`, `
        <div class="st-loading-spinner">
          <div class="st-spinner"></div>
          <p><strong>Evaluating your responses against Answer Key...</strong></p>
          <small>Calculating UPPCS 1/3rd Negative Marking score</small>
        </div>
      `);

      let evaluationData = null;

      try {
        const res = await authFetch(`${API_BASE}/chapter-test/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: topicInfo.subject,
            topic: topicInfo.slug || topicInfo.topic,
            topic_title: topicInfo.title,
            time_spent_seconds: totalTimeSec,
            test_mode: isMasteryGate ? 'Chapter Mastery Exam' : (isMasteryRedemption ? 'Mastery Redemption Drill' : (testMode === 'exam' ? 'Live Exam CBT' : 'Practice Drill')),
            question_ids: questionSubset.map(q => q.q_id),
            total_questions: questionSubset.length,
            answers: selectedAnswers,
            is_mastery_gate: isMasteryGate,
            is_mastery_redemption: isMasteryRedemption,
            // Send option shuffle maps so the server can de-map user answers
            // back to canonical letters before scoring against the DB
            option_maps: questionSubset.reduce((acc, q) => {
              if (q._option_map) acc[q.q_id] = q._option_map;
              return acc;
            }, {})
          })
        });

        if (res.ok) {
          evaluationData = await res.json();
        }
      } catch (err) {
        console.warn('Backend evaluation call failed:', err);
      }

      // If backend evaluation failed (e.g. offline), evaluate locally as fallback
      if (!evaluationData || !evaluationData.scorecard) {
        let cor = 0;
        let inc = 0;
        let unatt = 0;
        const wrongList = [];

        questionSubset.forEach((q, idx) => {
          const uAns = selectedAnswers[q.q_id];
          if (!uAns) {
            unatt++;
          } else if (uAns === q.correct_answer) {
            cor++;
          } else {
            inc++;
            wrongList.push({
              q_id: q.q_id,
              q_num: idx + 1,
              q_header: q.q_header,
              section_title: q.section_title || 'General Notes',
              stem: q.stem,
              options: q.options,
              user_answer: uAns,
              correct_answer: q.correct_answer,
              explanation: q.explanation
            });
          }
        });

        const total = questionSubset.length;
        const att = cor + inc;
        const netMarks = Number(((cor * 1.333333) - (inc * 0.444444)).toFixed(2));
        const maxMarks = Number((total * 1.333333).toFixed(2));
        const accuracy = att > 0 ? Number(((cor / att) * 100).toFixed(1)) : 0;
        const scorePct = maxMarks > 0 ? Number(Math.max(0, ((netMarks / maxMarks) * 100)).toFixed(1)) : 0;

        evaluationData = {
          scorecard: {
            subject: topicInfo.subject,
            topic: topicInfo.topic,
            topic_title: topicInfo.title,
            total_questions: total,
            attempted: att,
            correct: cor,
            incorrect: inc,
            unattempted: unatt,
            net_marks: netMarks,
            max_marks: maxMarks,
            accuracy_pct: accuracy,
            score_pct: scorePct,
            time_spent_seconds: totalTimeSec,
            wrong_questions: wrongList,
            date: new Date().toISOString()
          }
        };
      }

      const sc = evaluationData.scorecard;
      if (sc.score_pct == null && sc.max_marks > 0) {
        sc.score_pct = Number(Math.max(0, ((sc.net_marks / sc.max_marks) * 100)).toFixed(1));
      }
      if (evaluationData.detailed_review && evaluationData.detailed_review.length > 0) {
        sc.detailed_review = evaluationData.detailed_review;
      }
      saveLocalTestAttempt(topicInfo.subject, topicInfo.topic, sc);
      refreshPastScoresBadge(topicInfo);

      const isMasteryPassed = isMasteryGate && (sc.total_questions >= 5) && (sc.score_pct >= 80) && (sc.net_marks > 0);
      const isRedemptionPassed = isMasteryRedemption && (sc.total_questions >= 5) && (sc.correct === sc.total_questions);

      if (isMasteryGate || isMasteryRedemption) {
        if (isMasteryPassed || isRedemptionPassed) {
          if (typeof testOptions.onMasteryPassed === 'function') {
            testOptions.onMasteryPassed(sc);
          }
        } else {
          if (typeof testOptions.onMasteryFailed === 'function') {
            testOptions.onMasteryFailed(sc);
          }
        }
      }

      // -------------------------------------------------------------
      // Calculate Fast-Track Redemption Drill Pool
      // Rule: 2x missed problems (minimum 15, capped at chapter pool), 100% accuracy required
      // -------------------------------------------------------------
      const missedQMap = new Map();
      (sc.wrong_questions || []).forEach(w => missedQMap.set(w.q_id, w));
      questionSubset.forEach(q => {
        const uAns = (selectedAnswers[q.q_id] || '').toUpperCase();
        const valid = q.all_correct_answers || [q.correct_answer];
        if (!uAns || !valid.includes(uAns)) {
          if (!missedQMap.has(q.q_id)) missedQMap.set(q.q_id, q);
        }
      });

      const missedQuestions = Array.from(missedQMap.values());
      const M = missedQuestions.length;
      let redemptionPool = [];

      if (M > 0) {
        const allChapterQs = (loadedQuestions && loadedQuestions.length > 0) ? loadedQuestions : questionSubset;
        const redemptionCount = Math.min(allChapterQs.length, Math.max(15, 2 * M));
        const neededReinforcement = Math.max(0, redemptionCount - M);

        const remainingPool = allChapterQs.filter(q => !missedQMap.has(q.q_id));
        const shuffledRemaining = [...remainingPool].sort(() => 0.5 - Math.random());
        const reinforcementQs = shuffledRemaining.slice(0, neededReinforcement);

        const combined = [...missedQuestions, ...reinforcementQs];
        if (combined.length < redemptionCount) {
          for (const q of allChapterQs) {
            if (!combined.some(c => c.q_id === q.q_id)) {
              combined.push(q);
              if (combined.length >= redemptionCount) break;
            }
          }
        }
        redemptionPool = [...combined].sort(() => 0.5 - Math.random());
      }

      // Automatically update the Flag Weak button on Card 4 based on test result
      // (priority/target badge is owned by refreshPastScoresBadge — do not clobber it here)
      const weakBtn = document.getElementById('st-btn-toggle-weak');
      if (evaluationData.auto_flagged || sc.auto_flagged || (sc.accuracy_pct < 75 && sc.attempted > 0)) {
        if (weakBtn) {
          weakBtn.textContent = 'Weak (Auto)';
          weakBtn.classList.add('is-active');
        }
      } else if (evaluationData.cleared_mastery || sc.cleared_mastery || (sc.accuracy_pct >= 85 && sc.attempted >= 5)) {
        if (weakBtn) {
          weakBtn.textContent = 'Flag Weak';
          weakBtn.classList.remove('is-active');
        }
      }

      const wrongList = sc.wrong_questions || [];
      const detailedReview = evaluationData.detailed_review || [];

      // Render Official Evaluation Scorecard
      const html = `
        <div class="st-scorecard">
          <div class="st-scorecard-header">
            <h3>🎉 Official Evaluation Scorecard</h3>
            <p>Topic: <strong>${topicInfo.title}</strong> (${topicInfo.subject.toUpperCase()})</p>
          </div>

          <!-- Big Marks Display -->
          <div class="st-score-hero">
            <div class="st-score-big">${sc.net_marks > 0 ? '+' : ''}${sc.net_marks} <span style="font-size: 1.5rem; font-weight: 500; color: var(--md-default-fg-color--light);">/ ${sc.max_marks}</span></div>
            <div class="st-score-label">Total Exam Score: <strong>${sc.score_pct}%</strong> (Net Score: +1.33 Correct, -0.44 Wrong)</div>
            <div class="st-score-acc">Accuracy on Attempted: <strong>${sc.accuracy_pct}%</strong> (${sc.correct} Correct, ${sc.incorrect} Incorrect)</div>
          </div>

          ${isMasteryGate ? (
            isMasteryPassed ? `
              <div class="st-mastery-pass-card">
                <div class="st-mpass-icon">🏆</div>
                <div class="st-mpass-body">
                  <h4>CHAPTER OFFICIALLY CONQUERED & FINISHED!</h4>
                  <p>You scored <strong>${sc.score_pct}% Total Exam Score</strong> (Net: <strong>${sc.net_marks}/${sc.max_marks}</strong> marks &bull; ${sc.correct}/${sc.total_questions} correct &bull; ${sc.accuracy_pct}% Accuracy), meeting the strict 80% Mastery Requirement!</p>
                  <div class="st-mpass-tag">✅ +1 Read Recorded &bull; Cleared from Daily Plan &amp; Backlog</div>
                </div>
              </div>
            ` : `
              <div class="st-mastery-fail-card">
                <div class="st-mfail-icon">🛑</div>
                <div class="st-mfail-body">
                  <h4>MASTERY NOT ACHIEVED (${sc.score_pct}% &lt; 80% Required)</h4>
                  <p>You scored <strong>${sc.score_pct}% Total Exam Score</strong> (Net: <strong>${sc.net_marks}/${sc.max_marks}</strong> marks &bull; ${sc.correct}/${sc.total_questions} correct &bull; ${sc.accuracy_pct}% Accuracy on attempted). Under your preparation rules, you must achieve <strong>at least 80% of total exam marks (${(sc.max_marks * 0.8).toFixed(1)}/${sc.max_marks})</strong> on this 50-Question Qualifying Exam to finish this chapter.</p>
                  <div class="st-mfail-tag">⚠️ Chapter Remains PENDING &bull; NOT Marked as Read</div>
                  <p class="st-mfail-sub">Review your wrong questions below, revise your notes, or activate the Fast-Track 100% Redemption Drill below!</p>
                </div>
              </div>
            `
          ) : (isMasteryRedemption ? (
            isRedemptionPassed ? `
              <div class="st-mastery-pass-card st-redemption-pass-card">
                <div class="st-mpass-icon">⚡🏆</div>
                <div class="st-mpass-body">
                  <h4>CHAPTER OFFICIALLY CONQUERED VIA 100% REDEMPTION!</h4>
                  <p>You scored a perfect <strong>${sc.correct}/${sc.total_questions} (100% Accuracy)</strong>, completely eliminating all previous missed questions and clearing your weak spots!</p>
                  <div class="st-mpass-tag">✅ +1 Read Recorded &bull; Cleared from Daily Plan &amp; Backlog</div>
                </div>
              </div>
            ` : `
              <div class="st-mastery-fail-card st-redemption-fail-card">
                <div class="st-mfail-icon">⚡🛑</div>
                <div class="st-mfail-body">
                  <h4>REDEMPTION INCOMPLETE (${sc.correct}/${sc.total_questions} Correct)</h4>
                  <p>You scored <strong>${sc.correct}/${sc.total_questions} (${sc.accuracy_pct}% Accuracy)</strong>. Fast-track redemption strictly requires <strong>100% Accuracy (all ${sc.total_questions} correct)</strong> to qualify without retaking the 50-Q exam.</p>
                  <div class="st-mfail-tag">⚠️ Chapter Remains PENDING &bull; NOT Marked as Read</div>
                  <p class="st-mfail-sub">Review your remaining misses below and launch another redemption drill, or retake the full 50-question qualifying exam.</p>
                </div>
              </div>
            `
          ) : '')}

          ${(redemptionPool.length > 0 && ((isMasteryGate && !isMasteryPassed) || (isMasteryRedemption && !isRedemptionPassed))) ? `
            <div class="st-mastery-redemption-card">
              <div class="st-mredemption-header">
                <div class="st-mredemption-icon">⚡</div>
                <div class="st-mredemption-info">
                  <div class="st-mredemption-title">⚡ Fast-Track 100% Mastery Redemption Available</div>
                  <div class="st-mredemption-sub">
                    Skip retaking all 50 questions! Prove complete mastery on a targeted <strong>${redemptionPool.length}-Question Drill</strong> (${M} missed + ${redemptionPool.length - M} random reinforcement).
                  </div>
                </div>
              </div>
              <div class="st-mredemption-bar">
                <div class="st-mredemption-target-badge">🎯 Required: <strong>100% Accuracy (${redemptionPool.length}/${redemptionPool.length} Correct)</strong></div>
                <div class="st-mredemption-reward-badge">🏆 Instant Conquer (+1 Read Recorded)</div>
              </div>
              <div class="st-mredemption-action-row">
                <button type="button" class="st-btn st-btn-primary st-btn-redemption" id="st-btn-launch-redemption">
                  ⚡ Start ${redemptionPool.length}-Q Redemption Drill (100% Target)
                </button>
              </div>
            </div>
          ` : ''}

          ${(sc.auto_flagged || evaluationData.auto_flagged || (sc.accuracy_pct < 75 && sc.attempted > 0)) ? `
            <div class="st-alert-auto-weak" style="margin-top: 1rem; padding: 0.85rem 1.15rem; background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.35); border-radius: 0.65rem; display: flex; align-items: center; gap: 0.75rem; color: #dc2626; font-size: 0.86rem; line-height: 1.4;">
              <span style="font-size: 1.4rem;">🚩</span>
              <div>
                <strong>Auto-Flagged as Weak Topic:</strong> Based on this test's accuracy (${sc.accuracy_pct}%), this chapter has been <strong>automatically added to your Focus Radar</strong> in MongoDB Atlas!
              </div>
            </div>
          ` : ((sc.cleared_mastery || evaluationData.cleared_mastery || (sc.accuracy_pct >= 85 && sc.attempted >= 5)) ? `
            <div class="st-alert-auto-clean" style="margin-top: 1rem; padding: 0.85rem 1.15rem; background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.35); border-radius: 0.65rem; display: flex; align-items: center; gap: 0.75rem; color: #059669; font-size: 0.86rem; line-height: 1.4;">
              <span style="font-size: 1.4rem;">🏆</span>
              <div>
                <strong>Mastery Cleared (${sc.accuracy_pct}% Accuracy):</strong> High accuracy achieved! This chapter has been marked mastered and cleared from your Weak Areas list.
              </div>
            </div>
          ` : '')}

          <!-- Detailed Stats Grid -->
          <div class="st-score-grid">
            <div class="st-sg-item">
              <span>Total Questions</span>
              <strong>${sc.total_questions}</strong>
            </div>
            <div class="st-sg-item">
              <span>Attempted</span>
              <strong>${sc.attempted}</strong>
            </div>
            <div class="st-sg-item" style="color: #10b981;">
              <span>Correct (+1.33)</span>
              <strong>${sc.correct}</strong>
            </div>
            <div class="st-sg-item" style="color: #ef4444;">
              <span>Incorrect (-0.44)</span>
              <strong>${sc.incorrect}</strong>
            </div>
            <div class="st-sg-item">
              <span>Unattempted (0)</span>
              <strong>${sc.unattempted}</strong>
            </div>
            <div class="st-sg-item">
              <span>Time Taken</span>
              <strong>${Math.floor(sc.time_spent_seconds / 60)}m ${sc.time_spent_seconds % 60}s</strong>
            </div>
          </div>

          ${(sc.weak_subtopics && sc.weak_subtopics.length > 0) ? `
            <div class="st-subtopics-diagnostic-card">
              <h4>🎯 Subtopic Diagnostic (Auto-Mapped)</h4>
              <p class="st-subtopics-diagnostic-sub">Real-time analysis of questions answered in this test:</p>
              <div class="st-subtopics-diag-list">
                ${sc.weak_subtopics.map(ws => `
                  <div class="st-subtopic-diag-item ${ws.mistakes > 0 ? 'is-weak' : 'is-clean'}">
                    <div class="st-subtopic-diag-title">
                      <span>${ws.mistakes > 0 ? '⚠️' : '✅'}</span>
                      <strong>${escapeHtml(ws.subtopic)}</strong>
                    </div>
                    <div class="st-subtopic-diag-meta">
                      ${ws.mistakes > 0 ? `
                        <span class="st-diag-badge is-mistakes">${ws.mistakes} Mistake${ws.mistakes > 1 ? 's' : ''}</span>
                        <span class="st-diag-badge is-pct">${ws.accuracy_pct}% Accuracy</span>
                      ` : `
                        <span class="st-diag-badge is-perfect">100% Correct</span>
                      `}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Tabs for Mistakes vs Full Review -->
          <div class="st-subtabs">
            <button type="button" class="st-subtab is-active" id="st-tab-btn-mistakes">
              ⚠️ Focus Areas & Mistakes (${wrongList.length})
            </button>
            <button type="button" class="st-subtab" id="st-tab-btn-fullreview">
              📜 Full Solution Paper (${sc.total_questions})
            </button>
          </div>

          <!-- Mistakes Content -->
          <div id="st-tab-mistakes-content">
            ${wrongList.length === 0 ? `
              <div class="st-empty-state" style="padding: 1.5rem;">
                🌟 <strong>Flawless Performance!</strong> Zero mistakes on this drill!
              </div>
            ` : `
              <div class="st-wrong-list">
                ${wrongList.map(w => `
                  <div class="st-wrong-item">
                    <div class="st-wi-stem"><strong>Q${w.q_num} ${w.section_title ? `[${escapeHtml(w.section_title)}]` : ''}:</strong> ${renderStemToHtml(w.stem)}</div>
                    <div class="st-wi-choices">
                      <span class="st-choice-wrong">Your Choice: <strong>${w.user_answer}</strong> ❌</span>
                      <span class="st-choice-correct">Correct Answer: <strong>${w.correct_answer}</strong> ✅</span>
                    </div>
                    ${w.explanation ? `<div class="st-wi-expl">${typeof window.formatStudyExplanation === 'function' ? window.formatStudyExplanation(w.explanation) : w.explanation}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Full Review Content -->
          <div id="st-tab-fullreview-content" style="display: none;">
            <div class="st-wrong-list">
              ${(detailedReview.length ? detailedReview : questionSubset).map((q, idx) => {
                const uAns = selectedAnswers[q.q_id];
                const isCor = uAns && (uAns === q.correct_answer || (q.all_correct_answers && q.all_correct_answers.includes(uAns)));
                return `
                  <div class="st-wrong-item" style="border-left-color: ${isCor ? '#10b981' : (uAns ? '#ef4444' : '#cbd5e1')}">
                    <div class="st-wi-stem"><strong>Q${idx + 1}:</strong> ${renderStemToHtml(q.stem)}</div>
                    <div class="st-wi-choices">
                      <span>Your Choice: <strong>${uAns || 'Unattempted'}</strong> ${isCor ? '✅' : (uAns ? '❌' : '⚪')}</span>
                      <span class="st-choice-correct">Correct Answer: <strong>${q.correct_answer}</strong> ✅</span>
                    </div>
                    ${q.explanation ? `<div class="st-wi-expl">${typeof window.formatStudyExplanation === 'function' ? window.formatStudyExplanation(q.explanation) : q.explanation}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Actions -->
          <div class="st-form-actions" style="margin-top: 1.5rem;">
            <button type="button" class="st-btn st-btn-outline" id="st-close-scorecard">Close & Back to Notes</button>
            ${(isMasteryGate || isMasteryRedemption) ? `
              <button type="button" class="st-btn st-btn-secondary" id="st-retake-50q-test">🔄 Retake Standard 50-Q Exam</button>
            ` : `
              <button type="button" class="st-btn st-btn-primary" id="st-retake-test">🔄 Retake Test</button>
            `}
          </div>
        </div>
      `;

      showModal(`Scorecard: ${topicInfo.title}`, html);

      const tabMistakes = document.getElementById('st-tab-btn-mistakes');
      const tabFull = document.getElementById('st-tab-btn-fullreview');
      const contMistakes = document.getElementById('st-tab-mistakes-content');
      const contFull = document.getElementById('st-tab-fullreview-content');

      tabMistakes?.addEventListener('click', () => {
        tabMistakes.classList.add('is-active');
        tabFull?.classList.remove('is-active');
        if (contMistakes) contMistakes.style.display = 'block';
        if (contFull) contFull.style.display = 'none';
      });

      tabFull?.addEventListener('click', () => {
        tabFull.classList.add('is-active');
        tabMistakes?.classList.remove('is-active');
        if (contFull) contFull.style.display = 'block';
        if (contMistakes) contMistakes.style.display = 'none';
      });

      document.getElementById('st-close-scorecard')?.addEventListener('click', closeModal);
      document.getElementById('st-retake-test')?.addEventListener('click', () => openTestEngineModal(topicInfo));

      document.getElementById('st-retake-50q-test')?.addEventListener('click', () => {
        closeModal();
        openTestEngineModal(topicInfo, {
          isMasteryGate: true,
          targetAccuracy: 80,
          questionCount: 50,
          testMode: 'exam',
          onMasteryPassed: async (newSc) => {
            await officiallyConquerChapter(topicInfo, newSc);
            if (typeof testOptions.onMasteryPassed === 'function') {
              await testOptions.onMasteryPassed(newSc);
            }
          },
          onMasteryFailed: (newSc) => {
            if (typeof testOptions.onMasteryFailed === 'function') {
              testOptions.onMasteryFailed(newSc);
            }
          }
        });
      });

      document.getElementById('st-btn-launch-redemption')?.addEventListener('click', () => {
        closeModal();
        openTestEngineModal(topicInfo, {
          isMasteryRedemption: true,
          customQuestions: redemptionPool,
          testMode: 'exam',
          onMasteryPassed: async (newSc) => {
            await officiallyConquerChapter(topicInfo, newSc);
            if (typeof testOptions.onMasteryPassed === 'function') {
              await testOptions.onMasteryPassed(newSc);
            }
          },
          onMasteryFailed: (newSc) => {
            if (typeof testOptions.onMasteryFailed === 'function') {
              testOptions.onMasteryFailed(newSc);
            }
          }
        });
      });
    }

    if (testOptions && testOptions.autoStartCount) {
      const n = loadedQuestions.length;
      const countOpt = testOptions.autoStartCount;
      const take = (countOpt === 'all' || countOpt === 'ALL')
        ? n
        : Math.min(n, Number(countOpt) || n);
      questionSubset = loadedQuestions.slice(0, take);
      if (testOptions.testMode) testMode = testOptions.testMode;
      startActiveQuiz();
    } else {
      renderLauncher();
    }
  }

  // -------------------------------------------------------------
  // 3. IN-CHAPTER PAST TEST SCORES & FOCUS AREAS MODAL
  // -------------------------------------------------------------
  async function openPastScoresModal(topicInfo) {
    const localTests = getLocalTopicTests(topicInfo.subject, topicInfo.topic);
    let attempts = localTests;
    let frequentWrong = {};

    try {
      const res = await authFetch(`${API_BASE}/chapter-tests?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.attempts && data.attempts.length > 0) {
          attempts = data.attempts;
          frequentWrong = data.summary?.frequent_wrong_questions || {};
        }
      }
    } catch {}

    function renderAttemptsList() {
      const html = `
        <div class="st-past-scores-content">
          <div class="st-modal-summary-card">
            <div class="st-summary-item">
              <span class="st-sum-lbl">Tests Given:</span>
              <span class="st-sum-val">${attempts.length} attempts</span>
            </div>
            <div class="st-summary-item">
              <span class="st-sum-lbl">Latest Score:</span>
              <span class="st-sum-val">${attempts[0] ? (attempts[0].net_marks > 0 ? '+' : '') + attempts[0].net_marks : '—'}</span>
            </div>
            <div class="st-summary-item">
              <span class="st-sum-lbl">Avg Accuracy:</span>
              <span class="st-sum-val">${attempts.length ? (attempts.reduce((a, b) => a + (Number(b.accuracy_pct) || 0), 0) / attempts.length).toFixed(1) : 0}%</span>
            </div>
          </div>

          ${attempts.length === 0 ? `
            <div class="st-empty-state">
              🎯 You haven't taken any tests for this chapter yet.<br/>
              Click <strong>🎯 Live Practice Test</strong> at the top of the chapter to take your first test!
            </div>
          ` : `
            <!-- Attempt History List -->
            <div class="st-test-history-list">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                <h4 style="margin:0;">Past Scorecard History</h4>
                <small style="color:var(--md-default-fg-color--light);">Click any attempt to inspect question-by-question review</small>
              </div>
              ${attempts.map((att, idx) => `
                <div class="st-test-history-row" data-idx="${idx}" style="cursor: pointer;" title="Click to view question review and answers for Attempt #${attempts.length - idx}">
                  <div class="st-thr-left">
                    <strong>Attempt #${attempts.length - idx}</strong>
                    <span class="st-thr-date">${formatDateTime(att.date)} (${timeAgo(att.date)})</span>
                    ${att.test_mode ? `<span style="font-size:0.72rem; color:var(--md-default-fg-color--light);">${escapeHtml(att.test_mode)} · ${formatDuration(att.time_spent_seconds)}</span>` : ''}
                  </div>
                  <div class="st-thr-stats">
                    <span class="st-thr-score">Marks: <strong>${att.net_marks > 0 ? '+' : ''}${att.net_marks}</strong></span>
                    <span class="st-thr-acc">Accuracy: <strong>${att.accuracy_pct}%</strong></span>
                    <span class="st-thr-breakdown">${att.correct} ✔ / ${att.incorrect} ✖ (${att.unattempted} left)</span>
                    <button type="button" class="st-btn st-btn-sm st-btn-outline st-thr-review-btn" data-idx="${idx}">
                      🔍 Review Details ➔
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}

          <div class="st-form-actions" style="margin-top: 1.5rem;">
            <button type="button" class="st-btn st-btn-outline" id="st-close-past-scores">Close</button>
            <button type="button" class="st-btn st-btn-primary" id="st-btn-new-test-from-scores">
              🚀 Take Another Test
            </button>
          </div>
        </div>
      `;

      showModal(`Past Test History: ${topicInfo.title}`, html);

      document.getElementById('st-close-past-scores')?.addEventListener('click', closeModal);
      document.getElementById('st-btn-new-test-from-scores')?.addEventListener('click', () => {
        openTestEngineModal(topicInfo);
      });

      document.querySelectorAll('.st-test-history-row, .st-thr-review-btn').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = Number(el.getAttribute('data-idx'));
          if (!isNaN(idx) && attempts[idx]) {
            renderAttemptDetail(attempts[idx], attempts.length - idx);
          }
        });
      });
    }

    function renderAttemptDetail(att, attemptNum) {
      const hasDetailedReview = Array.isArray(att.detailed_review) && att.detailed_review.length > 0;
      const wrongList = att.wrong_questions || [];
      const totalQ = att.total_questions || (hasDetailedReview ? att.detailed_review.length : (att.correct + att.incorrect + (att.unattempted || 0)));

      const reviewHtml = `
        <div class="st-past-attempt-detail">
          <button type="button" class="st-review-back-btn" id="st-back-to-list-top">
            ← Back to All Past Attempts
          </button>

          <div class="st-modal-summary-card" style="margin-bottom: 0.85rem;">
            <div class="st-summary-item">
              <span class="st-sum-lbl">Attempt:</span>
              <span class="st-sum-val">#${attemptNum}</span>
            </div>
            <div class="st-summary-item">
              <span class="st-sum-lbl">Date & Time:</span>
              <span class="st-sum-val" style="font-size:0.85rem;">${formatDateTime(att.date)}</span>
            </div>
            <div class="st-summary-item">
              <span class="st-sum-lbl">Net Score:</span>
              <span class="st-sum-val" style="color:${att.net_marks > 0 ? '#10b981' : '#ef4444'};">
                ${att.net_marks > 0 ? '+' : ''}${att.net_marks} <small style="font-size:0.75rem; font-weight:normal; color:var(--md-default-fg-color--light);">/ ${att.max_marks || (totalQ * 1.33).toFixed(2)}</small>
              </span>
            </div>
            <div class="st-summary-item">
              <span class="st-sum-lbl">Accuracy:</span>
              <span class="st-sum-val" style="color:${att.accuracy_pct >= 75 ? '#10b981' : (att.accuracy_pct >= 50 ? '#f59e0b' : '#ef4444')};">
                ${att.accuracy_pct}%
              </span>
            </div>
            <div class="st-summary-item">
              <span class="st-sum-lbl">Time Spent:</span>
              <span class="st-sum-val">${formatDuration(att.time_spent_seconds)}</span>
            </div>
          </div>

          <!-- Filter Pills -->
          <div class="st-filter-pills" id="st-detail-filter-pills">
            <button type="button" class="st-filter-pill is-active" data-filter="all">All (${hasDetailedReview ? att.detailed_review.length : totalQ})</button>
            <button type="button" class="st-filter-pill" data-filter="wrong">❌ Mistakes (${att.incorrect})</button>
            <button type="button" class="st-filter-pill" data-filter="correct">✅ Correct (${att.correct})</button>
            ${att.unattempted > 0 ? `<button type="button" class="st-filter-pill" data-filter="unattempted">⚪ Skipped (${att.unattempted})</button>` : ''}
          </div>

          <!-- Questions List -->
          <div class="st-detail-questions-container" id="st-detail-questions-list">
            ${hasDetailedReview ? att.detailed_review.map((q, idx) => {
              const uAns = q.user_answer;
              const isCor = q.is_correct || (uAns && (uAns === q.correct_answer || (q.all_correct_answers && q.all_correct_answers.includes(uAns))));
              const isWrong = uAns && !isCor;
              const isUnatt = !uAns;
              const statusClass = isCor ? 'is-correct' : (isWrong ? 'is-wrong' : 'is-unattempted');
              const filterType = isCor ? 'correct' : (isWrong ? 'wrong' : 'unattempted');

              return `
                <div class="st-detail-qcard ${statusClass}" data-qtype="${filterType}">
                  <div class="st-detail-qheader">
                    <div>
                      <strong>Question ${q.q_num || idx + 1}</strong>
                      ${q.section_title ? `<span class="st-qsec-badge">${escapeHtml(q.section_title)}</span>` : ''}
                      ${q.q_header ? `<small style="margin-left:0.5rem; color:var(--md-default-fg-color--light);">${escapeHtml(q.q_header)}</small>` : ''}
                    </div>
                    <span class="st-qstatus-badge ${statusClass}">
                      ${isCor ? '✅ Correct (+1.33)' : (isWrong ? '❌ Incorrect (-0.44)' : '⚪ Skipped (0.00)')}
                    </span>
                  </div>

                  <div class="st-detail-qstem">${renderStemToHtml(q.stem)}</div>

                  ${q.options && q.options.length > 0 ? `
                    <div class="st-detail-options-list">
                      ${q.options.map(opt => {
                        const optKey = (opt.key || '').toUpperCase();
                        const isUserChoice = uAns && uAns.toUpperCase() === optKey;
                        const isCorrectKey = (q.correct_answer || '').toUpperCase() === optKey || (q.all_correct_answers && q.all_correct_answers.map(k=>k.toUpperCase()).includes(optKey));
                        let optClass = '';
                        if (isUserChoice && isCorrectKey) optClass = 'is-user-correct';
                        else if (isUserChoice && !isCorrectKey) optClass = 'is-user-wrong';
                        else if (isCorrectKey) optClass = 'is-correct-target';

                        return `
                          <div class="st-detail-option-item ${optClass}">
                            <strong>${optKey})</strong>
                            <span style="flex:1;">${escapeHtml(opt.text)}</span>
                            ${isUserChoice ? `<span style="font-size:0.75rem;">${isCorrectKey ? '✅ Your Choice' : '❌ Your Choice'}</span>` : ''}
                            ${!isUserChoice && isCorrectKey ? `<span style="font-size:0.75rem; color:#10b981;">Correct Answer</span>` : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  ` : `
                    <div class="st-detail-answer-bar">
                      <span>Your Choice: <strong>${uAns || 'Unattempted'}</strong> ${isCor ? '✅' : (uAns ? '❌' : '⚪')}</span>
                      <span style="color:#10b981;">Correct Answer: <strong>${escapeHtml(q.correct_answer)}</strong> ✅</span>
                    </div>
                  `}

                  ${q.explanation ? `
                    <div class="st-detail-expl-box">
                      ${typeof window.formatStudyExplanation === 'function' ? window.formatStudyExplanation(q.explanation) : ('<strong>💡 Logic & Explanation:</strong><br/>' + escapeHtml(q.explanation).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('') : `
              <!-- Fallback for historical tests with wrong_questions list -->
              <div style="margin-bottom:1rem; padding:0.65rem 0.85rem; background:rgba(99,102,241,0.06); border-radius:0.5rem; font-size:0.84rem; color:var(--md-default-fg-color);">
                ℹ️ <strong>Test Breakdown:</strong> ${att.correct} Correct, ${att.incorrect} Incorrect, ${att.unattempted || 0} Skipped.<br/>
                <small style="color:var(--md-default-fg-color--light);">Detailed question review with all options is saved for this and future tests. Review of your recorded mistake traps for Attempt #${attemptNum} is displayed below:</small>
              </div>

              ${wrongList.length === 0 ? `
                <div class="st-empty-state" style="padding:1.5rem; color:#10b981;">
                  🎉 <strong>100% Accuracy in this attempt!</strong> No incorrect questions were recorded.
                </div>
              ` : wrongList.map((w, idx) => `
                <div class="st-detail-qcard is-wrong" data-qtype="wrong">
                  <div class="st-detail-qheader">
                    <div>
                      <strong>Question ${w.q_num || idx + 1}</strong>
                      ${w.section_title ? `<span class="st-qsec-badge">${escapeHtml(w.section_title)}</span>` : ''}
                      ${w.q_header ? `<small style="margin-left:0.5rem; color:var(--md-default-fg-color--light);">${escapeHtml(w.q_header)}</small>` : ''}
                    </div>
                    <span class="st-qstatus-badge is-wrong">❌ Incorrect (-0.44)</span>
                  </div>

                  <div class="st-detail-qstem">${renderStemToHtml(w.stem)}</div>

                  <div class="st-detail-answer-bar">
                    <span style="color:#ef4444;">Your Choice: <strong>${escapeHtml(w.user_answer || 'None')}</strong> ❌</span>
                    <span style="color:#10b981;">Correct Answer: <strong>${escapeHtml(w.correct_answer)}</strong> ✅</span>
                  </div>

                  ${w.explanation ? `
                    <div class="st-detail-expl-box">
                      ${typeof window.formatStudyExplanation === 'function' ? window.formatStudyExplanation(w.explanation) : ('<strong>💡 Logic & Solution:</strong><br/>' + escapeHtml(w.explanation).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            `}
          </div>

          <div class="st-form-actions" style="margin-top: 1.5rem;">
            <button type="button" class="st-btn st-btn-outline" id="st-back-to-list-bottom">← Back to All Attempts</button>
            <button type="button" class="st-btn st-btn-primary" id="st-retake-from-detail">🚀 Retake Test</button>
          </div>
        </div>
      `;

      showModal(`Attempt #${attemptNum} Review: ${topicInfo.title}`, reviewHtml);

      document.getElementById('st-back-to-list-top')?.addEventListener('click', renderAttemptsList);
      document.getElementById('st-back-to-list-bottom')?.addEventListener('click', renderAttemptsList);
      document.getElementById('st-retake-from-detail')?.addEventListener('click', () => {
        openTestEngineModal(topicInfo);
      });

      // Filter pills logic
      document.querySelectorAll('#st-detail-filter-pills .st-filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('#st-detail-filter-pills .st-filter-pill').forEach(p => p.classList.remove('is-active'));
          pill.classList.add('is-active');
          const filter = pill.getAttribute('data-filter');

          document.querySelectorAll('#st-detail-questions-list .st-detail-qcard').forEach(card => {
            const type = card.getAttribute('data-qtype');
            if (filter === 'all' || type === filter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    renderAttemptsList();
  }

  // -------------------------------------------------------------
  // 3b. IN-CHAPTER TRAP RADAR & MISTAKE VAULT MODAL
  // -------------------------------------------------------------
  async function openTrapRadarModal(topicInfo, testData) {
    const rawInfo = topicInfo || getCurrentTopicInfo();
    if (!rawInfo || !rawInfo.subject || !rawInfo.topic) {
      console.warn('Cannot open Trap Radar: Missing topic info');
      return;
    }
    const cleanInfo = resolveTopicInfo(rawInfo.subject, rawInfo.topic);
    const priorityInfo = getChapterPriority(cleanInfo.subject, cleanInfo.topic);

    showModal(`⚠️ Trap Radar & Mistake Vault: ${cleanInfo.title || cleanInfo.topic}`, `
      <div class="st-loading-spinner" style="padding: 2.5rem 1rem;">
        <div class="st-spinner"></div>
        <p style="margin-top:0.75rem;"><strong>Scanning recurring trap questions...</strong></p>
        <small style="color: var(--md-default-fg-color--light);">Cross-referencing your test attempts in MongoDB Atlas</small>
      </div>
    `);

    let data = testData || window.__TOPIC_PAST_TESTS__;
    if (!data) {
      try {
        const res = await authFetch(`${API_BASE}/chapter-tests?subject=${encodeURIComponent(cleanInfo.subject)}&topic=${encodeURIComponent(cleanInfo.topic)}`);
        if (res.ok) {
          data = await res.json();
          window.__TOPIC_PAST_TESTS__ = data;
        }
      } catch (err) {
        console.warn('Failed to load past test traps:', err);
      }
    }

    const localTests = getLocalTopicTests(cleanInfo.subject, cleanInfo.topic);
    let trapQuestions = data?.summary?.trap_questions || [];

    // Fallback if summary.trap_questions is empty: aggregate from attempts or local tests
    if (trapQuestions.length === 0) {
      const trapMap = new Map();
      const allAttempts = (data?.attempts && data.attempts.length > 0) ? data.attempts : localTests;
      allAttempts.forEach(t => {
        (t.wrong_questions || []).forEach(w => {
          const key = w.q_id || (w.stem ? w.stem.substring(0, 100) : `q_${w.q_num}`);
          if (trapMap.has(key)) {
            const existing = trapMap.get(key);
            existing.times_missed += 1;
            if (!existing.options && w.options) existing.options = w.options;
            if (!existing.explanation && w.explanation) existing.explanation = w.explanation;
          } else {
            trapMap.set(key, {
              q_id: w.q_id || key,
              q_num: w.q_num,
              q_header: w.q_header || `Trap Question ${w.q_num || ''}`,
              section_title: w.section_title || 'General Notes',
              stem: w.stem,
              options: w.options || null,
              user_answer: w.user_answer,
              correct_answer: w.correct_answer,
              explanation: w.explanation,
              times_missed: 1,
              test_date: t.date
            });
          }
        });
      });
      trapQuestions = Array.from(trapMap.values()).sort((a, b) => b.times_missed - a.times_missed);
    }

    // Auto-enrich traps missing/empty/mangled options from question bank + stem repair
    const missingOptionTraps = trapQuestions.filter(t => (!optionsHaveText(t.options) || optionsLookLikeListRows(t.options)) && t.q_id);
    if (missingOptionTraps.length > 0) {
      try {
        const qRes = await authFetch(`${API_BASE}/chapter-questions?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`);
        if (qRes.ok) {
          const qData = await qRes.json();
          if (qData.questions && qData.questions.length > 0) {
            const qMap = new Map(qData.questions.map(q => [q.q_id, q]));
            trapQuestions.forEach(t => {
              if (qMap.has(t.q_id)) {
                const fullQ = qMap.get(t.q_id);
                if (!optionsHaveText(t.options) || optionsLookLikeListRows(t.options)) {
                  if (optionsHaveText(fullQ.options)) t.options = fullQ.options;
                }
                if (!t.explanation && fullQ.explanation) t.explanation = fullQ.explanation;
                if (!t.correct_answer && fullQ.correct_answer) t.correct_answer = fullQ.correct_answer;
                if ((!t.stem || /[A-D]\.\s+.+\|\s*[A-D]\./i.test(t.stem)) && fullQ.stem) t.stem = fullQ.stem;
              }
            });
          }
        }
      } catch (err) {}
    }

    trapQuestions = trapQuestions.map((t) => repairQuestionOptions(t));

    if (trapQuestions.length === 0) {
      const emptyHtml = `
        <div class="st-empty-state" style="padding: 2.5rem 1.5rem; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎯</div>
          <h3 style="margin-bottom: 0.5rem;">No Recurring Traps Detected Yet!</h3>
          <p style="color: var(--md-default-fg-color--light); max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.5;">
            You haven't recorded recurring mistakes on <strong>${escapeHtml(topicInfo.title)}</strong> yet.<br/>
            Target Accuracy for this chapter is <strong>${priorityInfo.targetAccuracy}% (${priorityInfo.label})</strong>.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button type="button" class="st-btn st-btn-primary" id="st-btn-trap-start-test">
              🚀 Launch Practice Test Drill
            </button>
            <button type="button" class="st-btn st-btn-outline" id="st-btn-trap-close">
              Close
            </button>
          </div>
        </div>
      `;
      showModal(`⚠️ Trap Radar: ${topicInfo.title}`, emptyHtml);
      document.getElementById('st-btn-trap-close')?.addEventListener('click', closeModal);
      document.getElementById('st-btn-trap-start-test')?.addEventListener('click', () => {
        closeModal();
        openTestEngineModal(topicInfo);
      });
      return;
    }

    // Build the Trap Radar UI — clean card list
    const html = `
      <div class="st-trap-modal-card">
        <div class="st-trap-header-bar">
          <div class="st-trap-header-left">
            <span class="st-trap-summary-pill">⚠️ ${trapQuestions.length} traps</span>
            <span class="st-kpi-badge ${priorityInfo.badgeClass}" style="font-size:0.74rem;">
              Target ${priorityInfo.targetAccuracy}%
            </span>
            <span class="st-trap-topic-chip" title="${escapeHtml(topicInfo.title)}">${escapeHtml(topicInfo.title)}</span>
          </div>
          <button type="button" class="st-trap-drill-all-btn" id="st-btn-drill-all-traps">
            ⚡ Drill all ${trapQuestions.length}
          </button>
        </div>

        <div class="st-trap-search-bar">
          <input type="search" class="st-trap-search" id="st-trap-search-input" placeholder="Filter traps by keyword or subtopic…" autocomplete="off" />
          <span class="st-trap-count-label">Showing <strong id="st-trap-visible-count">${trapQuestions.length}</strong> / ${trapQuestions.length}</span>
        </div>

        <div class="st-trap-list" id="st-trap-cards-container">
          ${trapQuestions.map((q, idx) => {
            const hasOptionsObj = optionsHaveText(q.options);
            const userPick = (q.user_answer || '').toUpperCase().trim();
            const correctAns = (q.correct_answer || '').toUpperCase().trim();
            const missCount = q.times_missed || 1;
            const stemText = (q.stem && String(q.stem).trim())
              || (q.q_header && String(q.q_header).trim())
              || 'Stem not saved for this trap — open Practice to reload.';

            let optionsHtml = '';
            if (hasOptionsObj) {
              optionsHtml = '<div class="st-trap-options-grid">' + ['A', 'B', 'C', 'D'].map((k) => {
                const optVal = q.options[k];
                const isUserWrong = (k === userPick && userPick !== correctAns);
                const isCorrect = (k === correctAns);
                let optClass = '';
                let badge = '';
                if (isUserWrong) {
                  optClass = 'st-trap-opt-is-user-wrong';
                  badge = '<span class="st-trap-opt-badge is-wrong">Your pick ❌</span>';
                } else if (isCorrect) {
                  optClass = 'st-trap-opt-is-correct';
                  badge = '<span class="st-trap-opt-badge is-correct">Correct ✔️</span>';
                } else if (k === userPick && userPick === correctAns) {
                  optClass = 'st-trap-opt-is-correct';
                  badge = '<span class="st-trap-opt-badge is-correct">Your pick ✔️</span>';
                }
                return '<div class="st-trap-option-item ' + optClass + '">'
                  + '<div class="st-trap-opt-letter">' + k + '</div>'
                  + '<div class="st-trap-opt-text">' + escapeHtml(optVal) + '</div>'
                  + badge
                  + '</div>';
              }).join('') + '</div>';
            } else {
              optionsHtml = '<div class="st-trap-answer-row">'
                + '<span class="is-wrong">Your pick: <strong>' + escapeHtml(userPick || '—') + '</strong></span>'
                + '<span class="is-correct">Correct: <strong>' + escapeHtml(correctAns || '—') + '</strong></span>'
                + '</div>';
            }

            const explHtml = q.explanation
              ? ('<div class="st-trap-expl-card">'
                + (typeof window.formatStudyExplanation === 'function' ? window.formatStudyExplanation(q.explanation) : ('<div style="font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.04em;color:#6366f1;margin-bottom:0.35rem;">💡 Explanation</div><div>' + escapeHtml(q.explanation).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') + '</div>'))
                + '</div>')
              : '';

            const jumpBtn = q.section_title
              ? ('<button type="button" class="st-trap-action-btn st-jump-btn" data-section="' + escapeHtml(q.section_title) + '">📖 Jump to notes</button>')
              : '';

            const subtopicChip = q.section_title
              ? ('<span class="st-trap-tag-subtopic" data-section="' + escapeHtml(q.section_title) + '" title="Jump to note section">📂 ' + escapeHtml(q.section_title) + ' ↗</span>')
              : '';
            const srcChip = q.q_header
              ? ('<span class="st-trap-src" title="' + escapeHtml(q.q_header) + '">' + escapeHtml(q.q_header) + '</span>')
              : '';

            return `
              <div class="st-trap-card" data-stem="${escapeHtml((stemText + ' ' + (q.section_title || '') + ' ' + (q.q_header || '')).toLowerCase())}">
                <div class="st-trap-card-meta">
                  <div class="st-trap-meta-left">
                    <span class="st-trap-tag-num">Trap #${idx + 1}</span>
                    ${subtopicChip}
                    ${srcChip}
                  </div>
                  <span class="st-trap-miss-pill">❌ Missed ×${missCount}</span>
                </div>

                <div class="st-trap-stem">${escapeHtml(stemText)}</div>

                ${optionsHtml}

                ${explHtml}

                <div class="st-trap-actions">
                  ${jumpBtn}
                  <button type="button" class="st-trap-action-btn st-drill-single-btn is-primary" data-idx="${idx}">
                    ⚡ Practice this trap
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="st-trap-footer">
          <span class="st-trap-count-label">Total traps: <strong>${trapQuestions.length}</strong></span>
          <div class="st-trap-footer-actions" style="display:flex;gap:0.6rem;">
            <button type="button" class="st-btn st-btn-outline" id="st-trap-modal-close">Close</button>
            <button type="button" class="st-btn st-btn-primary" id="st-trap-modal-drill-bottom">
              ⚡ Drill all ${trapQuestions.length}
            </button>
          </div>
        </div>
      </div>
    `;

    showModal('Trap Radar', html);

    const modalBox = document.getElementById('st-modal-box');
    if (modalBox) modalBox.classList.add('st-modal-wide');

    document.getElementById('st-trap-modal-close')?.addEventListener('click', closeModal);

    const startDrillAll = () => {
      closeModal();
      openTestEngineModal(topicInfo, {
        customQuestions: trapQuestions,
        testMode: 'practice'
      });
    };

    document.getElementById('st-btn-drill-all-traps')?.addEventListener('click', startDrillAll);
    document.getElementById('st-trap-modal-drill-bottom')?.addEventListener('click', startDrillAll);

    document.querySelectorAll('.st-drill-single-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const singleQ = trapQuestions[idx];
        if (singleQ) {
          closeModal();
          openTestEngineModal(topicInfo, {
            customQuestions: [singleQ],
            testMode: 'practice'
          });
        }
      });
    });

    document.querySelectorAll('.st-jump-btn, .st-trap-tag-subtopic').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const sec = el.getAttribute('data-section');
        if (sec) {
          closeModal();
          scrollToSubtopicHeading(sec);
        }
      });
    });

    const searchInput = document.getElementById('st-trap-search-input');
    const counterEl = document.getElementById('st-trap-visible-count');
    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      let visible = 0;
      document.querySelectorAll('#st-trap-cards-container .st-trap-card').forEach(card => {
        const text = card.getAttribute('data-stem') || '';
        if (!q || text.includes(q)) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });
      if (counterEl) counterEl.textContent = visible.toString();
    });
  }

  // -------------------------------------------------------------
  // 4. CHAPTER LOGS & UPDATE MODAL
  // -------------------------------------------------------------
  async function openChapterLogsModal(topicInfo) {
    const localData = getLocalTopicData(topicInfo.subject, topicInfo.topic);
    let liveData = window.__TOPIC_LIVE_DATA__;
    let testsList = getLocalTopicTests(topicInfo.subject, topicInfo.topic) || [];

    // Fetch fresh topic status and test history if online
    try {
      const [statusRes, testsRes] = await Promise.all([
        authFetch(`${API_BASE}/topic-status?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`).catch(() => null),
        authFetch(`${API_BASE}/chapter-tests?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`).catch(() => null)
      ]);
      if (statusRes && statusRes.ok) {
        liveData = await statusRes.json();
      }
      if (testsRes && testsRes.ok) {
        const tData = await testsRes.json();
        if (tData.attempts && tData.attempts.length > 0) {
          testsList = tData.attempts;
        }
      }
    } catch (e) {
      console.warn('Deferred logs fetch:', e);
    }

    let logsList = [];
    if (liveData && liveData.recent_revisions && liveData.recent_revisions.length > 0) {
      logsList = liveData.recent_revisions.map((r) => ({
        date: r.date,
        stage: r.stage || `Revision #${r.revision_number}`,
        confidence: r.confidence,
        notes: r.notes,
        score_pct: r.score_pct,
        net_marks: r.net_marks,
        max_marks: r.max_marks,
        accuracy_pct: r.accuracy_pct,
        total_questions: r.total_questions,
        correct: r.correct,
        incorrect: r.incorrect,
        unattempted: r.unattempted,
        time_spent_seconds: r.time_spent_seconds
      }));
    } else if (localData && localData.logs) {
      logsList = localData.logs;
    }

    const totalRead = liveData?.revision_count || localData?.read_count || logsList.length || 0;

    // Helper to extract or parse test details for any mastery log
    function parseMasteryMetrics(log) {
      const notes = log.notes || '';
      const isMastery = Boolean(
        log.score_pct != null ||
        (log.stage && log.stage.toLowerCase().includes('mastery')) ||
        notes.toLowerCase().includes('mastery')
      );
      if (!isMastery) return null;

      let scorePct = log.score_pct;
      let netMarks = log.net_marks;
      let maxMarks = log.max_marks;
      let accuracy = log.accuracy_pct;
      let totalQs = log.total_questions;
      let correct = log.correct;
      let incorrect = log.incorrect;
      let unattempted = log.unattempted;
      let timeSec = log.time_spent_seconds;

      if (scorePct == null) {
        const scM = notes.match(/(?:Total Score|Score):\s*([0-9\.]+)%/i);
        if (scM) scorePct = Number(scM[1]);
      }
      if (netMarks == null || maxMarks == null) {
        const netM = notes.match(/Net:\s*([0-9\.\+\-]+)\/([0-9\.]+)\s*marks/i) || notes.match(/\(([0-9\.\+\-]+)\/([0-9\.]+)\s*marks\)/i);
        if (netM) {
          netMarks = Number(netM[1]);
          maxMarks = Number(netM[2]);
        }
      }
      if (accuracy == null) {
        const accM = notes.match(/([0-9\.]+)%\s*Accuracy/i);
        if (accM) accuracy = Number(accM[1]);
      }
      if (totalQs == null) {
        const qM = notes.match(/on\s*(\d+)-Q/i) || notes.match(/on\s*(\d+)\s*Qs/i) || notes.match(/(\d+)\s*Questions/i);
        if (qM) totalQs = Number(qM[1]);
      }
      if (correct == null) {
        const corM = notes.match(/(\d+)\/(\d+)\s*Correct/i) || notes.match(/(\d+)\s*Correct/i);
        if (corM) correct = Number(corM[1]);
      }
      if (incorrect == null) {
        const incM = notes.match(/(\d+)\s*Incorrect/i);
        if (incM) incorrect = Number(incM[1]);
      }
      if (unattempted == null) {
        const unattM = notes.match(/(\d+)\s*Unattempted/i);
        if (unattM) unattempted = Number(unattM[1]);
      }

      totalQs = totalQs || 50;
      if (scorePct == null && netMarks != null && maxMarks != null && maxMarks > 0) {
        scorePct = Number(((netMarks / maxMarks) * 100).toFixed(1));
      }
      if (scorePct == null && accuracy != null) {
        scorePct = accuracy;
      }

      return {
        scorePct: scorePct ?? 80,
        netMarks: netMarks != null ? (netMarks > 0 ? `+${netMarks}` : `${netMarks}`) : null,
        maxMarks: maxMarks || (totalQs ? Number((totalQs * 1.33).toFixed(2)) : null),
        accuracy: accuracy ?? 80,
        totalQs,
        correct: correct != null ? correct : Math.round(totalQs * 0.8),
        incorrect: incorrect != null ? incorrect : 0,
        unattempted: unattempted != null ? unattempted : Math.max(0, totalQs - ((correct || 0) + (incorrect || 0))),
        timeSec
      };
    }

    const html = `
      <div class="st-chapter-modal-content">
        <div class="st-modal-summary-card">
          <div class="st-summary-item">
            <span class="st-sum-lbl">Total Times Read:</span>
            <span class="st-sum-val">${totalRead} times</span>
          </div>
          <div class="st-summary-item">
            <span class="st-sum-lbl">Subject:</span>
            <span class="st-sum-val">${topicInfo.subject.toUpperCase()}</span>
          </div>
        </div>

        <div class="st-subtabs">
          <button type="button" class="st-subtab is-active" id="tab-btn-logs">📜 Reading Logs (${logsList.length})</button>
          <button type="button" class="st-subtab" id="tab-btn-tests">🎯 Test History (${testsList.length})</button>
          <button type="button" class="st-subtab" id="tab-btn-form">📝 Update Reading Form</button>
        </div>

        <!-- Tab 1: Reading Logs with Mastery Test Cards -->
        <div id="subtab-logs-content">
          ${logsList.length === 0 ? `
            <div class="st-empty-state">
              📖 No reading sessions recorded yet.<br/>
              Click <strong>➕ Mark +1 Read</strong> at the top of the chapter to take the Mastery Exam!
            </div>
          ` : `
            <div class="st-logs-timeline">
              ${logsList.map((log, idx) => {
                const masteryInfo = parseMasteryMetrics(log);
                return `
                  <div class="st-timeline-item ${masteryInfo ? 'is-mastery-log' : ''}">
                    <div class="st-tl-header">
                      <span class="st-tl-stage ${masteryInfo ? 'st-tl-mastery-pill' : ''}">
                        ${masteryInfo ? '🏆 Official Chapter Mastery Qualifying Exam' : (log.stage || `Revision #${logsList.length - idx}`)}
                      </span>
                      <span class="st-tl-stars">${'★'.repeat(log.confidence || 5)}</span>
                      <span class="st-tl-date">${formatDate(log.date)} (${timeAgo(log.date)})</span>
                    </div>

                    ${masteryInfo ? `
                      <div class="st-log-mastery-card">
                        <div class="st-lmc-top">
                          <div class="st-lmc-score">
                            <span class="st-lmc-score-val">${masteryInfo.scorePct}%</span>
                            <span class="st-lmc-score-lbl">Total Exam Score ${masteryInfo.maxMarks ? `(${masteryInfo.netMarks}/${masteryInfo.maxMarks} marks)` : ''}</span>
                          </div>
                          <div class="st-lmc-badge">🎯 Conquered &bull; &ge;80% Gate</div>
                        </div>
                        <div class="st-lmc-stats">
                          <div class="st-lmc-stat"><span>Accuracy:</span> <strong>${masteryInfo.accuracy}%</strong></div>
                          <div class="st-lmc-stat"><span>Total Qs:</span> <strong>${masteryInfo.totalQs}</strong></div>
                          <div class="st-lmc-stat" style="color:#10b981;"><span>Correct (+1.33):</span> <strong>${masteryInfo.correct}</strong></div>
                          <div class="st-lmc-stat" style="color:#ef4444;"><span>Incorrect (-0.44):</span> <strong>${masteryInfo.incorrect}</strong></div>
                          <div class="st-lmc-stat"><span>Unattempted (0):</span> <strong>${masteryInfo.unattempted}</strong></div>
                          ${masteryInfo.timeSec ? `<div class="st-lmc-stat"><span>Time:</span> <strong>${Math.floor(masteryInfo.timeSec / 60)}m ${masteryInfo.timeSec % 60}s</strong></div>` : ''}
                        </div>
                      </div>
                    ` : `
                      ${log.notes ? `<div class="st-tl-notes">"${escapeHtml(log.notes)}"</div>` : ''}
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- Tab 2: Test History -->
        <div id="subtab-tests-content" style="display:none;">
          ${testsList.length === 0 ? `
            <div class="st-empty-state">
              🎯 No practice tests or mastery exams logged for this chapter yet.
            </div>
          ` : `
            <div class="st-logs-timeline">
              ${testsList.map((t, idx) => `
                <div class="st-timeline-item" style="border-left: 3px solid ${t.score_pct >= 80 ? '#10b981' : '#f59e0b'};">
                  <div class="st-tl-header">
                    <span class="st-tl-stage" style="font-weight:700;">${t.test_mode || 'Practice Test'}</span>
                    <span class="st-tl-date">${formatDate(t.date)} (${timeAgo(t.date)})</span>
                  </div>
                  <div class="st-log-mastery-card" style="margin-top:0.4rem;">
                    <div class="st-lmc-top">
                      <div class="st-lmc-score">
                        <span class="st-lmc-score-val" style="color:${t.score_pct >= 80 ? '#10b981' : '#f59e0b'};">${t.score_pct != null ? t.score_pct : t.accuracy_pct}%</span>
                        <span class="st-lmc-score-lbl">Score: ${t.net_marks > 0 ? '+' : ''}${t.net_marks}/${t.max_marks} marks</span>
                      </div>
                      <div class="st-lmc-badge" style="background:${t.score_pct >= 80 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)'}; color:${t.score_pct >= 80 ? '#059669' : '#d97706'};">
                        ${t.score_pct >= 80 ? '🏆 Passed' : '⚠️ Practice Attempt'}
                      </div>
                    </div>
                    <div class="st-lmc-stats">
                      <div class="st-lmc-stat"><span>Accuracy:</span> <strong>${t.accuracy_pct}%</strong></div>
                      <div class="st-lmc-stat"><span>Total Qs:</span> <strong>${t.total_questions}</strong></div>
                      <div class="st-lmc-stat" style="color:#10b981;"><span>Correct:</span> <strong>${t.correct}</strong></div>
                      <div class="st-lmc-stat" style="color:#ef4444;"><span>Incorrect:</span> <strong>${t.incorrect}</strong></div>
                      <div class="st-lmc-stat"><span>Unattempted:</span> <strong>${t.unattempted != null ? t.unattempted : (t.total_questions - t.attempted)}</strong></div>
                      ${t.time_spent_seconds ? `<div class="st-lmc-stat"><span>Time:</span> <strong>${Math.floor(t.time_spent_seconds / 60)}m ${t.time_spent_seconds % 60}s</strong></div>` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Tab 3: Update Reading Form -->
        <div id="subtab-form-content" style="display:none;">
          <form id="st-chapter-update-form" class="st-form">
            <div class="st-grid-2">
              <div class="st-form-group">
                <label>Date of Reading</label>
                <input type="date" id="st-up-date" class="st-input" value="${new Date().toISOString().split('T')[0]}" required />
              </div>
              <div class="st-form-group">
                <label>Reading Stage</label>
                <select id="st-up-stage" class="st-input">
                  <option value="1st Reading (Concept Building)">1st Reading (Concept Building)</option>
                  <option value="2nd Reading (Deep Dive)">2nd Reading (Deep Dive)</option>
                  <option value="Spaced Repetition" selected>Spaced Repetition / Revision</option>
                  <option value="Pre-Exam Rapid Ratta">Pre-Exam Rapid Ratta</option>
                </select>
              </div>
            </div>

            <div class="st-form-group">
              <label>Confidence Rating</label>
              <div class="st-rating-selector" id="st-up-rating">
                <button type="button" class="st-rate-btn" data-val="1">★ 1 (Weak)</button>
                <button type="button" class="st-rate-btn" data-val="2">★ 2 (Fair)</button>
                <button type="button" class="st-rate-btn is-selected" data-val="3">★ 3 (Good)</button>
                <button type="button" class="st-rate-btn" data-val="4">★ 4 (Strong)</button>
                <button type="button" class="st-rate-btn" data-val="5">★ 5 (Mastered)</button>
              </div>
              <input type="hidden" id="st-up-conf" value="3" />
            </div>

            <div class="st-form-group">
              <label>Chapter Notes / Traps</label>
              <textarea id="st-up-notes" class="st-input" rows="3" placeholder="e.g. Remember Regulating Act 1773 created GG of Bengal, not India"></textarea>
            </div>

            <div class="st-form-actions">
              <button type="button" class="st-btn st-btn-outline" id="st-cancel-modal">Close</button>
              <button type="submit" class="st-btn st-btn-primary" id="st-submit-update">
                💾 Save to MongoDB
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    showModal(`Chapter Logs: ${topicInfo.title}`, html);

    const tabLogs = document.getElementById('tab-btn-logs');
    const tabTests = document.getElementById('tab-btn-tests');
    const tabForm = document.getElementById('tab-btn-form');
    const contentLogs = document.getElementById('subtab-logs-content');
    const contentTests = document.getElementById('subtab-tests-content');
    const contentForm = document.getElementById('subtab-form-content');

    function switchSubtab(activeTab, activeContent) {
      [tabLogs, tabTests, tabForm].forEach(t => t?.classList.remove('is-active'));
      [contentLogs, contentTests, contentForm].forEach(c => { if (c) c.style.display = 'none'; });
      activeTab?.classList.add('is-active');
      if (activeContent) activeContent.style.display = 'block';
    }

    tabLogs?.addEventListener('click', () => switchSubtab(tabLogs, contentLogs));
    tabTests?.addEventListener('click', () => switchSubtab(tabTests, contentTests));
    tabForm?.addEventListener('click', () => switchSubtab(tabForm, contentForm));

    document.querySelectorAll('#st-up-rating .st-rate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#st-up-rating .st-rate-btn').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        document.getElementById('st-up-conf').value = btn.dataset.val;
      });
    });

    document.getElementById('st-cancel-modal')?.addEventListener('click', closeModal);

    document.getElementById('st-chapter-update-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const readDate = document.getElementById('st-up-date').value;
      const stage = document.getElementById('st-up-stage').value;
      const conf = document.getElementById('st-up-conf').value;
      const notes = document.getElementById('st-up-notes').value;

      saveLocalLog(topicInfo.subject, topicInfo.topic, {
        topic_title: topicInfo.title,
        date: readDate,
        stage,
        confidence: conf,
        notes
      });

      try {
        await authFetch(`${API_BASE}/revisions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: topicInfo.subject,
            topic: topicInfo.topic,
            topic_title: topicInfo.title,
            confidence: Number(conf),
            notes: `[${stage}] ${notes}`,
            date: readDate
          })
        });
      } catch (e) {}

      closeModal();
      refreshTopicReadData(topicInfo);
      alert(`✅ Saved reading session for ${topicInfo.title}!`);
    });
  }

  // -------------------------------------------------------------
  // 5. MODAL SYSTEM & ACTIVE QUIZ DISMISSAL PROTECTION
  // -------------------------------------------------------------
  let activeQuizSession = null;

  function setQuizSessionBackup(data) {
    try {
      sessionStorage.setItem('uppcs_active_quiz_backup', JSON.stringify({
        ...data,
        savedAt: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save quiz backup', e);
    }
  }

  function getQuizSessionBackup() {
    try {
      const raw = sessionStorage.getItem('uppcs_active_quiz_backup');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - (parsed.savedAt || 0) > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem('uppcs_active_quiz_backup');
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function clearQuizSessionBackup() {
    try {
      sessionStorage.removeItem('uppcs_active_quiz_backup');
    } catch (e) {}
  }

  function handleModalDismissRequest(source) {
    if (activeQuizSession && activeQuizSession.isActive) {
      if (source === 'backdrop') {
        // Prevent accidental closing on backdrop click: pulse modal and show toast notice
        const box = document.getElementById('st-modal-box');
        if (box) {
          box.classList.remove('st-modal-pulse');
          void box.offsetWidth; // re-trigger animation
          box.classList.add('st-modal-pulse');
          setTimeout(() => box.classList.remove('st-modal-pulse'), 400);
        }
        showToast('⚠️ Exam in progress! Submit test or click [×] to exit.', 'warning', 2500);
        return;
      }

      // Explicit close button [×] or Escape key request
      const answeredCount = Object.keys(activeQuizSession.selectedAnswers || {}).length;
      const totalCount = activeQuizSession.questionSubset ? activeQuizSession.questionSubset.length : 0;
      const confirmMsg = `⚠️ Test in Progress!\n\nYou have answered ${answeredCount} of ${totalCount} question(s).\n\nAre you sure you want to abandon this test?\n(Unsaved exam progress will be lost)`;

      if (window.confirm(confirmMsg)) {
        if (typeof activeQuizSession.abortQuiz === 'function') {
          activeQuizSession.abortQuiz();
        } else {
          activeQuizSession.isActive = false;
          activeQuizSession = null;
          clearQuizSessionBackup();
          closeModal(true);
        }
      }
      return;
    }

    closeModal(true);
  }

  function getOrCreateModal() {
    let overlay = document.getElementById('st-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'st-modal-overlay';
      overlay.className = 'st-modal-overlay';
      overlay.innerHTML = `
        <div class="st-modal-box" id="st-modal-box">
          <div class="st-modal-header">
            <h3 id="st-modal-title">Log</h3>
            <button type="button" class="st-modal-close" id="st-modal-close">&times;</button>
          </div>
          <div class="st-modal-body" id="st-modal-body"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          handleModalDismissRequest('backdrop');
        }
      });
      document.getElementById('st-modal-close')?.addEventListener('click', () => {
        handleModalDismissRequest('close_button');
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display !== 'none') {
          handleModalDismissRequest('escape_key');
        }
      });

      window.addEventListener('beforeunload', (e) => {
        if (activeQuizSession && activeQuizSession.isActive) {
          e.preventDefault();
          e.returnValue = 'An exam is currently in progress. Your test progress will be lost if you leave now.';
          return e.returnValue;
        }
      });
    }
    return overlay;
  }

  function closeModal(force = false) {
    if (!force && activeQuizSession && activeQuizSession.isActive) {
      handleModalDismissRequest('programmatic');
      return false;
    }
    if (activeQuizSession && force) {
      if (activeQuizSession.timerInterval) clearInterval(activeQuizSession.timerInterval);
      activeQuizSession.isActive = false;
      activeQuizSession = null;
    }
    const overlay = document.getElementById('st-modal-overlay');
    if (overlay) overlay.style.display = 'none';
    const box = document.getElementById('st-modal-box');
    if (box) {
      box.classList.remove('st-modal-wide');
      box.classList.remove('st-modal-pulse');
    }
    return true;
  }

  function showModal(title, contentHtml) {
    const overlay = getOrCreateModal();
    document.getElementById('st-modal-title').textContent = title;
    const body = document.getElementById('st-modal-body');
    body.innerHTML = contentHtml;
    overlay.style.display = 'flex';
    typesetQuizMath(body);
  }

  // -------------------------------------------------------------
  // 6. ENHANCE CHAPTER PRIORITY TRACKER (/chapter-tracker/)
  // -------------------------------------------------------------
  function enhanceChapterPriorityTracker() {
    const rows = document.querySelectorAll('.ct-row');
    if (!rows.length) return;

    // Enhance group titles with target accuracy
    document.querySelectorAll('.ct-group-title').forEach(title => {
      if (title.getAttribute('data-target-enhanced')) return;
      title.setAttribute('data-target-enhanced', 'true');
      const text = title.textContent.trim().toLowerCase();
      if (text.includes('highly')) {
        title.innerHTML = `Highly Important <span class="ct-target-pill ct-target-high">🎯 Target Accuracy: 100%</span>`;
      } else if (text.includes('medium')) {
        title.innerHTML = `Medium Priority <span class="ct-target-pill ct-target-medium">🎯 Target Accuracy: 90%</span>`;
      } else if (text.includes('least')) {
        title.innerHTML = `Least Priority <span class="ct-target-pill ct-target-least">🎯 Target Accuracy: 80%</span>`;
      }
    });

    const localLogs = getLocalLogs();

    rows.forEach((row) => {
      // 1. Inject Target Accuracy Badge if not present
      if (!row.querySelector('.ct-target-pill')) {
        const group = row.getAttribute('data-group') || (row.closest('.ct-list--high') ? 'high' : (row.closest('.ct-list--medium') ? 'medium' : 'least'));
        const targetPct = group === 'high' ? 100 : (group === 'medium' ? 90 : 80);
        const pillsWrap = row.querySelector('.ct-pills');
        if (pillsWrap) {
          const targetBadge = document.createElement('span');
          targetBadge.className = `ct-target-pill ct-target-${group}`;
          targetBadge.innerHTML = `🎯 Target: ${targetPct}%`;
          targetBadge.title = `UPPCS Target Accuracy: ${targetPct}% (${group === 'high' ? 'Highly Important' : (group === 'medium' ? 'Medium Priority' : 'Least Important')})`;
          pillsWrap.insertAdjacentElement('afterend', targetBadge);
        }
      }

      if (row.querySelector('.ct-read-badge-inline')) return;

      const titleEl = row.querySelector('.ct-title');
      if (!titleEl) return;

      const linkEl = row.querySelector('.ct-open');
      const href = linkEl?.getAttribute('href') || '';
      const match = href.match(/subjects\/([^\/]+)\/([^\/]+)/);
      if (!match) return;

      const subject = decodeURIComponent(match[1]).trim();
      const topic = decodeURIComponent(match[2]).trim();
      const key = `${subject.toLowerCase()}:::${topic}`;
      const logData = localLogs[key];
      const count = logData ? logData.read_count : 0;

      const badge = document.createElement('button');
      badge.type = 'button';
      badge.className = 'ct-read-badge-inline';
      badge.innerHTML = count > 0 ? `📖 ${count} reads` : `📖 +1 Read`;
      badge.title = `Click to update read count for ${titleEl.textContent}`;

      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const topicInfo = {
          subject: subject,
          topic: topic,
          title: titleEl.textContent.trim()
        };
        promptChapterMasteryGate(topicInfo, () => {
          enhanceChapterPriorityTracker();
        });
      });

      titleEl.insertAdjacentElement('afterend', badge);
    });
  }

  // -------------------------------------------------------------
  // 7. PREP TRACKER & ANALYTICS DASHBOARD (/tracker-dashboard/)
  // -------------------------------------------------------------
  let activeCharts = {};

  function destroyActiveCharts() {
    Object.keys(activeCharts).forEach(key => {
      if (activeCharts[key] && typeof activeCharts[key].destroy === 'function') {
        try { activeCharts[key].destroy(); } catch (e) {}
      }
    });
    activeCharts = {};
  }

  function isDarkTheme() {
    return document.body.getAttribute('data-md-color-scheme') === 'slate' ||
      document.documentElement.getAttribute('data-md-color-scheme') === 'slate';
  }

  async function ensureChartJsLoaded() {
    if (typeof window.Chart !== 'undefined') return true;
    return new Promise((resolve) => {
      const existing = document.querySelector('script[src*="chart.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        setTimeout(() => resolve(typeof window.Chart !== 'undefined'), 1200);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
      setTimeout(() => resolve(typeof window.Chart !== 'undefined'), 1500);
    });
  }

  async function renderPrepDashboard() {
    const dashApp = document.getElementById('study-dashboard-app');
    if (!dashApp) return;

    dashApp.innerHTML = `
      <div class="st-loading-state" style="padding: 3rem 1rem; text-align: center;">
        <div class="st-spinner" style="margin: 0 auto 1rem;"></div>
        <p style="font-weight: 700; font-size: 1.1rem; color: var(--md-primary-fg-color, #273c75);">
          📊 Syncing your preparation stats with MongoDB Atlas...
        </p>
        <small style="color: var(--md-default-fg-color--light);">Fetching revisions, live tests, weak areas, and accuracy metrics</small>
      </div>
    `;

    destroyActiveCharts();

    let summary = null;
    let dueRevisions = [];
    let weakTopics = [];
    let planner = null;
    let serverBacklog = null;

    try {
      const [sumRes, dueRes, weakRes, planRes, backlogRes] = await Promise.all([
        authFetch(`${API_BASE}/dashboard/summary`).catch(() => null),
        authFetch(`${API_BASE}/revisions/due`).catch(() => null),
        authFetch(`${API_BASE}/weak-topics`).catch(() => null),
        authFetch(`${API_BASE}/daily-planner?date=${encodeURIComponent(activePlannerDate)}`).catch(() => null),
        authFetch(`${API_BASE}/daily-planner/overall-backlog`).catch(() => null),
        syncDailyStudyTimeWithServer(activePlannerDate).catch(() => null)
      ]);

      if (sumRes && sumRes.ok) summary = await sumRes.json();
      if (dueRes && dueRes.ok) dueRevisions = await dueRes.json();
      if (weakRes && weakRes.ok) weakTopics = await weakRes.json();
      if (planRes && planRes.ok) {
        planner = await planRes.json();
        saveLocalDailyPlanner(activePlannerDate, planner);
      }
      if (backlogRes && backlogRes.ok) {
        serverBacklog = await backlogRes.json();
      }
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    }

    if (!planner) {
      planner = getLocalDailyPlanner(activePlannerDate);
    }

    // Daily Planner & Tasks computation
    const readingTopics = (planner && Array.isArray(planner.reading_topics)) ? planner.reading_topics : [];
    const isCurrentDateToday = activePlannerDate === getTodayISODate();
    const dailyStudyRecord = getDailyStudyTimeRecord(activePlannerDate);
    const totalDayStudySeconds = dailyStudyRecord.totalSeconds || 0;

    // Focus Analytics computation
    const MIN_CHAPTER_LOG_SECONDS = 300; // >= 5 minutes
    const dailyStudyChapters = dailyStudyRecord.chapters || {};
    const allStudiedChapters = Object.values(dailyStudyChapters).sort((a, b) => (b.seconds || 0) - (a.seconds || 0));
    const studiedChaptersList = allStudiedChapters.filter(c => (c.seconds || 0) >= MIN_CHAPTER_LOG_SECONDS);
    const sub5mChaptersList = allStudiedChapters.filter(c => (c.seconds || 0) > 0 && (c.seconds || 0) < MIN_CHAPTER_LOG_SECONDS);
    const deepWorkChapters = studiedChaptersList.filter(c => (c.seconds || 0) >= 1500); // >= 25 mins

    // Planned chapters for active date with < 60s read
    const unopenedPlannedTargets = readingTopics.filter(t => {
      const sec = getTodayChapterStudySeconds(t.subject, t.topic, activePlannerDate);
      return sec < 60 && t.status !== 'achieved';
    });

    // Subject focus distribution map
    const subjectDistribution = {};
    allStudiedChapters.forEach(c => {
      const sub = (c.subject || 'other').toLowerCase();
      subjectDistribution[sub] = (subjectDistribution[sub] || 0) + (c.seconds || 0);
    });

    const isPastDate = activePlannerDate < getTodayISODate();

    // Active targets for active date
    const midnightTargets = readingTopics.filter(t => (t.slot === 'midnight_slot' || t.slot === 'all_day' || t.slot === 'morning_12pm' || !t.slot) && t.status !== 'achieved' && !isPastDate);
    const eveningTargets = readingTopics.filter(t => t.slot === 'evening' && t.status !== 'achieved' && !isPastDate);
    const achievedTopics = readingTopics.filter(t => t.status === 'achieved');
    const dateBacklogTopics = readingTopics.filter(t => t.status !== 'achieved' && (t.missed_12pm || t.missed_midnight || t.slot === 'pending' || isPastDate));
    const pendingChaptersCount = readingTopics.filter(t => t.status !== 'achieved').length;
    const isChapterLimitReached = pendingChaptersCount >= 10;

    // Overall Cumulative Backlog (all past unachieved topics)
    const rawOverallBacklog = (serverBacklog && Array.isArray(serverBacklog.backlog))
      ? serverBacklog.backlog
      : getOverallBacklogFromLocal();
    const overallBacklog = rawOverallBacklog.filter(t => t.status !== 'achieved');

    // Calendar navigation strip & Midnight countdown
    const calendarDays = getCalendarDaysList(activePlannerDate);
    const midnightCountdownStr = getMidnightRemainingStr();

    // Daily Tasks
    const allDailyTasks = planner.daily_tasks || [];
    const completedTasksCount = allDailyTasks.filter(t => t.completed).length;
    const totalTasksCount = allDailyTasks.length;
    const taskCompletionPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    const filteredDailyTasks = allDailyTasks.filter(t => {
      if (activePlannerFilter === 'completed') return t.completed;
      if (activePlannerFilter === 'pending') return !t.completed;
      return true;
    });

    // Helper for subject pill style
    function getSubjectPillClass(sub) {
      const s = (sub || '').toLowerCase();
      if (s.includes('polity')) return 'polity';
      if (s.includes('geography')) return 'geography';
      if (s.includes('histor') || s.includes('india')) return 'history';
      if (s.includes('econom')) return 'economy';
      if (s.includes('scien')) return 'science';
      if (s.includes('ecolog') || s.includes('environ')) return 'environment';
      return '';
    }

    // Helper to render chapter checkboxes for selected subject
    function renderChapterChecklistHtml(selectedSub, searchFilter = '') {
      const chapters = CHAPTER_CATALOG[selectedSub] || [];
      const filter = searchFilter.toLowerCase().trim();
      const filtered = chapters.filter(c => {
        if (!filter) return true;
        return c.title.toLowerCase().includes(filter) || c.slug.toLowerCase().includes(filter);
      });

      if (filtered.length === 0) {
        return `<div class="st-empty-hint" style="padding:0.5rem; grid-column: 1 / -1;">No matching chapters found in this subject. Enter a custom topic name below!</div>`;
      }

      return filtered.map(c => `
        <label class="st-chapter-chk-label" title="${escapeHtml(c.title)}">
          <input type="checkbox" class="st-chapter-select-chk" data-slug="${escapeHtml(c.slug)}" data-title="${escapeHtml(c.title)}" value="${escapeHtml(c.title)}" />
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(c.title)}</span>
        </label>
      `).join('');
    }

    // Consolidated Metrics & Fallback stats
    const isOnline = !!summary;
    const localLogs = getLocalLogs();
    const localTests = getLocalTests();
    const allLocalTests = Object.values(localTests).flat();

    const totalRevs = summary ? summary.total_revisions : Object.values(localLogs).reduce((a, b) => a + (b.read_count || 0), 0);
    const dueCount = summary ? summary.revisions_due_today : 0;
    const totalTests = summary ? summary.total_tests : allLocalTests.length;
    const avgTestScore = summary ? summary.avg_test_score : (totalTests > 0 ? (allLocalTests.reduce((a, b) => a + (b.net_marks || 0), 0) / totalTests).toFixed(2) : '0.00');
    const avgTestAccuracy = summary ? summary.avg_test_accuracy : (totalTests > 0 ? (allLocalTests.reduce((a, b) => a + (Number(b.accuracy_pct) || 0), 0) / totalTests).toFixed(1) : '0');
    const totalPyqs = summary ? summary.total_pyqs_practiced : 0;
    const pyqAccuracy = summary ? summary.overall_pyq_accuracy : 0;
    const recentTests = summary?.recent_tests || allLocalTests.slice(0, 10);
    const subjects = summary?.subject_breakdown || [];

    // Syllabus coverage metrics
    const totalCatalogChapters = Object.values(CHAPTER_CATALOG).reduce((acc, list) => acc + list.length, 0);
    const readChaptersCount = Object.keys(localLogs).filter(k => localLogs[k]?.read_count > 0).length;
    const syllabusCoveragePct = totalCatalogChapters > 0 ? Math.min(100, Math.round((readChaptersCount / totalCatalogChapters) * 100)) : 0;

    // Daily target progress
    const dailyTargetSec = 14400; // 4 Hours = 14400 seconds
    const dailyTargetPct = Math.min(100, Math.round((totalDayStudySeconds / dailyTargetSec) * 100));

    // 7-day study velocity calculation
    const velocityDays = [];
    for (let offset = -6; offset <= 0; offset++) {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      const dayLabel = offset === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' });
      const sec = getDailyStudyTimeRecord(dateStr).totalSeconds || 0;
      const hours = Number((sec / 3600).toFixed(1));
      velocityDays.push({ dateStr, label: dayLabel, seconds: sec, hours });
    }

    const html = `
      <div class="st-dash-root">
        <!-- 1. Executive Top Command Bar -->
        <div class="st-cmd-bar">
          <div class="st-cmd-bar-left">
            <span class="st-status-pill ${isOnline ? 'is-online' : 'is-offline'}">
              ${isOnline ? '🟢 MongoDB Atlas Synced' : '🔴 Local Storage Mode'}
            </span>
            <span class="st-countdown-pill" title="Daily study milestone deadline">
              🌙 Midnight Deadline: ${midnightCountdownStr}
            </span>
            <span class="st-studytime-meter-pill" title="Active focused study tracked today">
              ⏱️ Studied: <strong>${formatDurationDisplay(totalDayStudySeconds)}</strong> / 4h 00m Target (${dailyTargetPct}%)
            </span>
          </div>
          <div class="st-cmd-bar-right">
            <button type="button" class="st-btn st-btn-outline" id="st-dash-refresh" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;">
              🔄 Refresh Stats
            </button>
          </div>
        </div>

        <!-- 2. Unified 5-KPI Modern Command Deck -->
        <div class="st-kpi-deck-modern">
          <!-- Card 1: Study Time Today -->
          <div class="st-kpi-card-modern">
            <div class="st-kpi-top-row">
              <span class="st-kpi-label-text">Focused Study Today</span>
              <span class="st-kpi-icon-pill" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">⏱️</span>
            </div>
            <div class="st-kpi-main-val">${formatDurationDisplay(totalDayStudySeconds)}</div>
            <div class="st-kpi-micro-prog">
              <div class="st-kpi-micro-fill" style="width: ${dailyTargetPct}%; background: linear-gradient(90deg, #6366f1, #10b981);"></div>
            </div>
            <div class="st-kpi-meta-sub" style="margin-top: 0.4rem;">
              <span>🎯 ${dailyTargetPct}% of 4h goal</span>
              &bull;
              <span>⚡ ${deepWorkChapters.length} deep session${deepWorkChapters.length === 1 ? '' : 's'} (≥25m)</span>
            </div>
          </div>

          <!-- Card 2: Chapter Revisions -->
          <div class="st-kpi-card-modern ${dueCount > 0 ? 'is-highlight' : ''}">
            <div class="st-kpi-top-row">
              <span class="st-kpi-label-text">Revisions & Retention</span>
              <span class="st-kpi-icon-pill" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">📖</span>
            </div>
            <div class="st-kpi-main-val">${totalRevs} <small>logs</small></div>
            <div class="st-kpi-meta-sub">
              ${dueCount > 0 ? `<span style="color:#ef4444; font-weight:700;">⚠️ ${dueCount} chapter${dueCount === 1 ? '' : 's'} due today!</span>` : `<span style="color:#10b981; font-weight:700;">✅ All caught up today</span>`}
            </div>
            <div class="st-kpi-meta-sub" style="margin-top:2px;">
              <span>Forgetting curve intervals active</span>
            </div>
          </div>

          <!-- Card 3: CBT Mock Tests -->
          <div class="st-kpi-card-modern">
            <div class="st-kpi-top-row">
              <span class="st-kpi-label-text">CBT Tests Evaluated</span>
              <span class="st-kpi-icon-pill" style="background: rgba(14, 165, 233, 0.15); color: #0ea5e9;">🎯</span>
            </div>
            <div class="st-kpi-main-val">${totalTests} <small>tests</small></div>
            <div class="st-kpi-meta-sub">
              <span>Avg Marks: <strong>${avgTestScore > 0 ? '+' : ''}${avgTestScore}</strong></span>
              &bull;
              <span>Acc: <strong>${avgTestAccuracy}%</strong></span>
            </div>
            <div class="st-kpi-meta-sub" style="margin-top:2px;">
              <span>Official UPPCS marking (+1.33 / -0.44)</span>
            </div>
          </div>

          <!-- Card 4: PYQs Practiced -->
          <div class="st-kpi-card-modern">
            <div class="st-kpi-top-row">
              <span class="st-kpi-label-text">Question Bank Practiced</span>
              <span class="st-kpi-icon-pill" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">📚</span>
            </div>
            <div class="st-kpi-main-val">${totalPyqs} <small>questions</small></div>
            <div class="st-kpi-meta-sub">
              <span>Overall Accuracy: <strong style="color: ${pyqAccuracy >= 70 ? '#10b981' : (pyqAccuracy >= 50 ? '#f59e0b' : '#ef4444')};">${pyqAccuracy}%</strong></span>
            </div>
            <div class="st-kpi-meta-sub" style="margin-top:2px;">
              <span>Ghatnachakra & Chapter PYQs</span>
            </div>
          </div>

          <!-- Card 5: Target Execution -->
          <div class="st-kpi-card-modern ${overallBacklog.length > 0 ? 'is-highlight' : ''}">
            <div class="st-kpi-top-row">
              <span class="st-kpi-label-text">Daily Target Velocity</span>
              <span class="st-kpi-icon-pill" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">⚡</span>
            </div>
            <div class="st-kpi-main-val">${achievedTopics.length} <small>/ ${readingTopics.length} done</small></div>
            <div class="st-kpi-meta-sub">
              ${overallBacklog.length > 0 ? `<span style="color:#ef4444; font-weight:700;">⚠️ ${overallBacklog.length} Overdue in Backlog</span>` : `<span style="color:#10b981; font-weight:700;">🎉 Zero Backlog Overdue</span>`}
            </div>
            <div class="st-kpi-meta-sub" style="margin-top:2px;">
              <span>${readingTopics.length > 0 ? `${Math.round((achievedTopics.length / Math.max(1, readingTopics.length)) * 100)}% active targets achieved` : 'Plan targets below'}</span>
            </div>
          </div>
        </div>

        <!-- 3. Visual Analytics & Charts Studio -->
        <div class="st-analytics-studio">
          <div class="st-analytics-head">
            <div class="st-analytics-title-wrap">
              <h3>📊 Preparation Velocity & Performance Analytics</h3>
              <p>Visual trends tracking study consistency, subject weightage, live test trajectory, and syllabus coverage.</p>
            </div>
            <span class="st-focus-live-pill">⚡ Interactive Radar</span>
          </div>

          <div class="st-analytics-grid">
            <!-- Chart 1: 7-Day Study Time Velocity -->
            <div class="st-chart-card">
              <div class="st-chart-head">
                <h4><span>📊</span> 7-Day Study Velocity & Benchmark</h4>
                <span class="st-chart-pill">Goal: 4h / day</span>
              </div>
              <div class="st-chart-canvas-wrap" id="wrap-chart-velocity">
                <canvas id="chart-study-velocity"></canvas>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem; font-size:0.75rem; color:var(--md-default-fg-color--light);">
                <span>Today: <strong>${formatDurationDisplay(totalDayStudySeconds)}</strong></span>
                <span>Past 7 Days Avg: <strong>${(velocityDays.reduce((a, b) => a + b.hours, 0) / 7).toFixed(1)}h / day</strong></span>
              </div>
            </div>

            <!-- Chart 2: Subject Focus & Time Distribution -->
            <div class="st-chart-card">
              <div class="st-chart-head">
                <h4><span>🍩</span> Subject Time & Focus Distribution</h4>
                <span class="st-chart-pill">${Object.keys(subjectDistribution).length > 0 ? `${Object.keys(subjectDistribution).length} active subjects` : 'Preparation mix'}</span>
              </div>
              <div class="st-chart-canvas-wrap" id="wrap-chart-subject">
                <canvas id="chart-subject-distribution"></canvas>
              </div>
              <div style="font-size:0.74rem; color:var(--md-default-fg-color--light); margin-top:0.6rem; text-align:center;">
                ${Object.keys(subjectDistribution).length > 0 ? 'Hours spent per subject on active date' : 'Cumulative revision & question practice distribution'}
              </div>
            </div>

            <!-- Chart 3: CBT Mock Test Performance Curve -->
            <div class="st-chart-card">
              <div class="st-chart-head">
                <h4><span>📈</span> CBT Mock Test Score Trajectory</h4>
                <span class="st-chart-pill">Target Acc: 80%+</span>
              </div>
              <div class="st-chart-canvas-wrap" id="wrap-chart-tests">
                <canvas id="chart-tests-trajectory"></canvas>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem; font-size:0.75rem; color:var(--md-default-fg-color--light);">
                <span>Evaluated Tests: <strong>${recentTests.length}</strong></span>
                <span>Avg Accuracy: <strong>${avgTestAccuracy}%</strong></span>
              </div>
            </div>

            <!-- Chart 4: Syllabus Readiness & High-Yield Coverage -->
            <div class="st-chart-card">
              <div class="st-chart-head">
                <h4><span>🎯</span> Prelims Syllabus Readiness Gauge</h4>
                <span class="st-chart-pill">${readChaptersCount} / ${totalCatalogChapters} chapters</span>
              </div>
              <div class="st-gauge-meter-wrap">
                <div class="st-gauge-ring">
                  <canvas id="chart-syllabus-readiness" width="130" height="130"></canvas>
                  <div class="st-gauge-center-text">
                    <div class="st-gauge-pct-val">${syllabusCoveragePct}%</div>
                    <div class="st-gauge-pct-sub">Covered</div>
                  </div>
                </div>
                <div class="st-gauge-stats-list">
                  <div class="st-gauge-stat-item">
                    <span>Total Master Chapters</span>
                    <strong>${totalCatalogChapters}</strong>
                  </div>
                  <div class="st-gauge-stat-item">
                    <span>Chapters Read (≥1 Read)</span>
                    <strong style="color:#10b981;">${readChaptersCount}</strong>
                  </div>
                  <div class="st-gauge-stat-item">
                    <span>Revisions Due Today</span>
                    <strong style="color:${dueCount > 0 ? '#ef4444' : '#10b981'};">${dueCount}</strong>
                  </div>
                  <div class="st-gauge-stat-item">
                    <span>Cumulative Overdue Backlog</span>
                    <strong style="color:${overallBacklog.length > 0 ? '#ef4444' : '#10b981'};">${overallBacklog.length}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Chapter Reading Velocity Grid (if any chapter read today) -->
          ${studiedChaptersList.length > 0 ? `
            <div class="st-focus-chapters-panel" style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--study-hairline, rgba(226, 232, 240, 0.8));">
              <div class="st-focus-panel-head">
                <div>
                  <span style="font-size:0.88rem; font-weight:700;">📖 Today's Chapter Reading Velocity</span>
                  <div style="font-size:0.75rem; color:var(--md-default-fg-color--light); margin-top:2px;">
                    💡 Chapters studied for at least 5 minutes are logged below with exact stopwatch time.
                  </div>
                </div>
                <span style="font-size:0.75rem; color:var(--md-default-fg-color--light); font-weight:600;">${studiedChaptersList.length} chapter${studiedChaptersList.length === 1 ? '' : 's'} read</span>
              </div>
              <div class="st-focus-chapters-grid">
                ${studiedChaptersList.map(ch => `
                  <div class="st-fchap-card">
                    <div class="st-fchap-top">
                      <span class="st-sub-pill ${getSubjectPillClass(ch.subject)}">${ch.subject}</span>
                      <span class="st-fchap-velocity ${ch.seconds >= 1800 ? 'is-deep' : (ch.seconds >= 600 ? 'is-active' : 'is-quick')}">
                        ${ch.seconds >= 1800 ? '⚡ Deep Dive (>30m)' : (ch.seconds >= 600 ? '📖 Active Study (>10m)' : '⚡ Read (≥5m)')}
                      </span>
                    </div>
                    <div class="st-fchap-title">${escapeHtml(ch.title || ch.topic)}</div>
                    <div class="st-fchap-footer">
                      <div class="st-fchap-time">
                        <span class="st-fchap-clock-icon">⏱️</span>
                        <strong>${formatDurationDisplay(ch.seconds)}</strong>
                        <span class="st-fchap-pct">(${totalDayStudySeconds > 0 ? Math.round((ch.seconds / totalDayStudySeconds) * 100) : 0}%)</span>
                      </div>
                      <a href="${getSiteBasePath()}subjects/${encodeURIComponent(ch.subject)}/${encodeURIComponent(ch.topic)}/" class="st-act-btn is-primary" style="font-size:0.75rem; padding:0.25rem 0.6rem; text-decoration:none;">
                        📖 Open Notes
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Supportive Action Queue Notice (if planned chapters are unopened today) -->
          ${unopenedPlannedTargets.length > 0 ? `
            <div class="st-action-notice-card" style="margin-top: 1.15rem;">
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <span style="font-size:1.2rem;">🎯</span>
                <div>
                  <strong>Today's Focus Action Queue:</strong> You have <strong>${unopenedPlannedTargets.length}</strong> planned chapter(s) scheduled for today waiting for study:
                  <span style="font-style:italic;">${unopenedPlannedTargets.map(t => escapeHtml(t.topic)).slice(0, 3).join(', ')}${unopenedPlannedTargets.length > 3 ? ` and ${unopenedPlannedTargets.length - 3} more` : ''}</span>.
                </div>
              </div>
              <span style="font-size:0.72rem; font-weight:700; background:rgba(245,158,11,0.2); padding:0.2rem 0.55rem; border-radius:9999px; white-space:nowrap;">
                🌙 Due before 11:59 PM
              </span>
            </div>
          ` : ''}
        </div>

        <!-- 4. DAILY TARGET PLANNER & MIDNIGHT EXECUTION HUB -->
        <div class="st-planner-section" id="st-planner-root">
          <div class="st-planner-header">
            <div class="st-planner-title-group">
              <h3>🎯 Daily Study Plan & Midnight Execution Hub</h3>
              <p>Plan your subjects & chapters, conquer targets before midnight (11:59 PM), track daily date-wise backlog, and maintain your cumulative backlog.</p>
            </div>
            <div class="st-planner-actions-bar">
              <span class="st-planner-studytime-badge" title="Total active reading time tracked on this date across chapters">⏱️ Studied: ${formatDurationDisplay(totalDayStudySeconds)}</span>
              <span class="st-planner-midnight-badge" title="Daily study milestone deadline">
                🌙 Time Slot Till Midnight Active &bull; ${midnightCountdownStr}
              </span>
              <!-- Date Switcher -->
              <div style="display:inline-flex; align-items:center; gap:0.25rem;">
                <button type="button" class="st-act-btn" id="st-plan-date-prev" title="Previous Day">◀</button>
                <span style="font-size:0.8rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:0.35rem; background:var(--study-hairline, #e2e8f0);">
                  📅 ${formatPlannerDateDisplay(activePlannerDate)}
                </span>
                <button type="button" class="st-act-btn" id="st-plan-date-next" title="Next Day">▶</button>
                ${!isCurrentDateToday ? `<button type="button" class="st-act-btn" id="st-plan-date-today" style="font-weight:700; color:var(--md-primary-fg-color, #273c75);">Today</button>` : ''}
              </div>
              <!-- Checkpoint & Rollover Controls -->
              <button type="button" class="st-act-btn is-warning" id="st-btn-evaluate-midnight" title="Run Midnight audit to flag incomplete targets as Backlog">
                ⚡ Midnight Audit
              </button>
              <button type="button" class="st-act-btn" id="st-btn-rollover-yesterday" title="Rollover pending topics and incomplete tasks into today">
                🔄 Rollover Pending
              </button>
            </div>
          </div>

          <!-- Date / Calendar Strip for Date-wise Backlog & Achieved Inspection -->
          <div class="st-planner-calendar-strip" id="st-cal-strip">
            ${calendarDays.map(cd => `
              <button type="button" class="st-cal-day-btn ${cd.isActive ? 'is-active' : ''}" data-date="${cd.dateStr}" title="View plan and backlog for ${cd.dateStr}">
                <span class="st-cal-day-name">${cd.dayName}</span>
                <span class="st-cal-day-num">${cd.dayNum}</span>
                <span class="st-cal-day-indicator ${
                  cd.backlogCount > 0
                    ? 'has-backlog'
                    : (cd.plannedCount > 0 && cd.achievedCount === cd.plannedCount
                        ? 'is-done'
                        : (cd.plannedCount > 0 ? 'is-planned' : 'is-none'))
                }">
                  ${
                    cd.backlogCount > 0
                      ? `⚠️ ${cd.backlogCount} bl`
                      : (cd.plannedCount > 0 && cd.achievedCount === cd.plannedCount
                          ? `✅ ${cd.achievedCount} ok`
                          : (cd.plannedCount > 0
                              ? (cd.achievedCount > 0 ? `🎯 ${cd.achievedCount}/${cd.plannedCount}` : `🎯 ${cd.plannedCount} plan`)
                              : '—'))
                  }
                </span>
              </button>
            `).join('')}
          </div>

          <!-- Overall Cumulative Backlog Card (Across all past dates) -->
          <div class="st-overall-backlog-card" id="st-overall-backlog-root">
            <div class="st-overall-backlog-header">
              <h4>
                <span>⚠️ Overall Active Backlog (Cumulative)</span>
                <span class="st-backlog-pill-badge">${overallBacklog.length} Chapters Overdue</span>
              </h4>
              <span style="font-size:0.75rem; color:var(--md-default-fg-color--light);">
                Chapters planned in previous days that were not marked achieved
              </span>
            </div>
            ${overallBacklog.length === 0 ? `
              <div style="font-size: 0.85rem; color: #059669; font-weight: 600; padding: 0.35rem 0;">
                🎉 Zero cumulative backlog! All planned chapters across all days are fully completed.
              </div>
            ` : `
              <div class="st-overall-backlog-list">
                ${overallBacklog.map(item => `
                  <div class="st-overall-backlog-item" id="backlog-item-${item.id}">
                    <div style="display:flex; flex-direction:column; gap:0.25rem;">
                      <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                        <span class="st-sub-pill ${getSubjectPillClass(item.subject)}">${item.subject}</span>
                        <strong style="font-size:0.92rem; color:var(--md-default-fg-color);">${escapeHtml(item.topic)}</strong>
                        <span class="st-backlog-meta-tag">
                          📅 Planned: ${item.planned_date || 'Past'} &bull; ⚠️ ${item.days_overdue || 0} day${(item.days_overdue || 0) === 1 ? '' : 's'} overdue
                        </span>
                      </div>
                      ${item.notes ? `<div style="font-size:0.75rem; color:var(--md-default-fg-color--light); font-style:italic;">📝 ${escapeHtml(item.notes)}</div>` : ''}
                    </div>
                    <div style="display:flex; align-items:center; gap:0.4rem; flex-shrink:0;">
                      <button type="button" class="st-act-btn is-success st-backlog-achieve-btn" data-id="${item.id}" data-subject="${item.subject}" data-topic="${item.topic}" data-date="${item.planned_date}" title="Mark read and clear from backlog">
                        ✅ Mark Read Now
                      </button>
                      <button type="button" class="st-act-btn st-backlog-to-today-btn" data-id="${item.id}" data-date="${item.planned_date}" title="Shift into today's active midnight reading plan">
                        📅 Move to Today
                      </button>
                      <button type="button" class="st-act-btn is-danger st-backlog-del-btn" data-id="${item.id}" data-date="${item.planned_date}" title="Remove from backlog">
                        🗑️
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <div class="st-planner-grid">
            <!-- LEFT COLUMN: Subject & Topic Reading Plan for Active Date -->
            <div class="st-planner-col">
              <div class="st-planner-col-head">
                <h4>📖 Subject & Topic Reading Plan (${formatPlannerDateDisplay(activePlannerDate)})</h4>
                <span class="st-planner-col-badge">
                  ${readingTopics.length} Planned | ${achievedTopics.length} Achieved | ${dateBacklogTopics.length} Backlog
                </span>
              </div>

              <!-- Capacity Meter: Strict 10 Active Chapters Limit -->
              <div class="st-capacity-meter-box ${isChapterLimitReached ? 'is-full' : ''}" style="margin-bottom:0.85rem; padding:0.75rem 1rem; border-radius:10px; background:${isChapterLimitReached ? 'rgba(239, 68, 68, 0.08)' : 'rgba(59, 130, 246, 0.06)'}; border:1.5px solid ${isChapterLimitReached ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.25)'};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; flex-wrap:wrap; gap:0.35rem;">
                  <span style="font-weight:700; font-size:0.82rem; color:${isChapterLimitReached ? '#dc2626' : 'var(--md-default-fg-color)'};">
                    📚 Active Chapter Queue: <strong>${pendingChaptersCount} / 10 Chapters</strong>
                  </span>
                  <span style="font-size:0.75rem; font-weight:800; color:${isChapterLimitReached ? '#ef4444' : '#10b981'}; background:${isChapterLimitReached ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; padding:0.15rem 0.5rem; border-radius:9999px;">
                    ${isChapterLimitReached ? '🛑 Queue Full (10/10)' : `🟢 ${10 - pendingChaptersCount} slot${(10 - pendingChaptersCount) === 1 ? '' : 's'} available`}
                  </span>
                </div>
                <div style="height:6px; background:rgba(0,0,0,0.08); border-radius:9999px; overflow:hidden;">
                  <div style="height:100%; width:${Math.min(100, (pendingChaptersCount / 10) * 100)}%; background:${isChapterLimitReached ? '#ef4444' : (pendingChaptersCount >= 8 ? '#f59e0b' : '#3b82f6')}; transition:width 0.3s ease;"></div>
                </div>
                ${isChapterLimitReached ? `
                  <div style="margin-top:0.45rem; font-size:0.78rem; color:#dc2626; font-weight:700; line-height:1.4; display:flex; align-items:center; gap:0.4rem;">
                    <span>🛑</span>
                    <span><strong>Queue Limit Reached:</strong> Maximum 10 active chapters allowed. Read these first and mark +1 Read count to unlock new slots!</span>
                  </div>
                ` : ''}
              </div>

              <!-- Quick Add Topic Form with Subject & Multi-Select Chapter Checklist -->
              <form class="st-planner-quick-form" id="st-form-add-topic">
                <div class="st-form-row">
                  <div style="flex: 1.1; min-width: 140px;">
                    <label style="font-size:0.75rem; font-weight:700; margin-bottom:0.2rem; display:block;">Select Subject</label>
                    <select id="st-topic-subject" class="st-planner-input" style="width: 100%; font-weight:700;" required>
                      <option value="polity" ${activePlannerSubject === 'polity' ? 'selected' : ''}>Polity</option>
                      <option value="geography" ${activePlannerSubject === 'geography' ? 'selected' : ''}>Geography</option>
                      <option value="mordern india" ${activePlannerSubject === 'mordern india' ? 'selected' : ''}>Modern India</option>
                      <option value="ancient history" ${activePlannerSubject === 'ancient history' ? 'selected' : ''}>Ancient History</option>
                      <option value="medieval india" ${activePlannerSubject === 'medieval india' ? 'selected' : ''}>Medieval India</option>
                      <option value="environments & ecology" ${activePlannerSubject === 'environments & ecology' ? 'selected' : ''}>Environment & Ecology</option>
                      <option value="economy" ${activePlannerSubject === 'economy' ? 'selected' : ''}>Economy</option>
                      <option value="science and technology" ${activePlannerSubject === 'science and technology' ? 'selected' : ''}>Science & Tech</option>
                      <option value="art and culture" ${activePlannerSubject === 'art and culture' ? 'selected' : ''}>Art & Culture</option>
                      <option value="census and urbanisation" ${activePlannerSubject === 'census and urbanisation' ? 'selected' : ''}>Census & Urbanisation</option>
                      <option value="up special" ${activePlannerSubject === 'up special' ? 'selected' : ''}>UP Special</option>
                      <option value="current affairs" ${activePlannerSubject === 'current affairs' ? 'selected' : ''}>Current Affairs</option>
                      <option value="csat" ${activePlannerSubject === 'csat' ? 'selected' : ''}>CSAT</option>
                    </select>
                  </div>
                  <div style="flex: 1.4; min-width: 160px;">
                    <label style="font-size:0.75rem; font-weight:700; margin-bottom:0.2rem; display:block;">Target Time Slot</label>
                    <select id="st-topic-slot" class="st-planner-input" style="width: 100%;">
                      <option value="midnight_slot" selected>🌙 Time Slot (Till Midnight 11:59 PM)</option>
                      <option value="evening">⛅ Afternoon / Evening Slot</option>
                      <option value="all_day">🎯 All-Day Milestone</option>
                    </select>
                  </div>
                </div>

                <!-- Dynamic Multi-Select Chapter Checklist Picker -->
                <div class="st-chapter-multiselect-wrap">
                  <div class="st-multiselect-controls">
                    <input type="text" id="st-multiselect-search" class="st-multiselect-search" placeholder="🔍 Search chapters in this subject..." />
                    <button type="button" class="st-act-btn" id="st-btn-chk-all">Select All</button>
                    <button type="button" class="st-act-btn" id="st-btn-chk-none">Clear</button>
                    <span id="st-multiselect-count" style="font-size:0.78rem; font-weight:700; color:var(--md-primary-fg-color, #273c75); margin-left:auto;">0 selected</span>
                  </div>
                  <div class="st-chapter-checklist-scroll" id="st-chapter-checklist-container">
                    ${renderChapterChecklistHtml(activePlannerSubject)}
                  </div>
                </div>

                <div class="st-form-row">
                  <div style="flex: 1.8; min-width: 180px;">
                    <input type="text" id="st-topic-custom" class="st-planner-input" style="width: 100%;" placeholder="Or type custom chapter / subtopic name (optional)..." />
                  </div>
                  <div style="flex: 1.4; min-width: 140px;">
                    <input type="text" id="st-topic-notes" class="st-planner-input" style="width: 100%;" placeholder="Target notes (e.g. 20 pgs + 30 PYQs)" />
                  </div>
                  <button type="submit" class="st-btn st-btn-primary" ${isChapterLimitReached ? 'disabled style="padding: 0.45rem 1rem; font-size: 0.82rem; white-space: nowrap; opacity:0.6; cursor:not-allowed;"' : 'style="padding: 0.45rem 1rem; font-size: 0.82rem; white-space: nowrap;"'}>
                    ${isChapterLimitReached ? '🛑 Queue Full (10/10)' : '➕ Add Target(s)'}
                  </button>
                </div>
              </form>

              <!-- Topic Slot Containers for Active Date -->
              <div class="st-slot-container">
                <!-- 1. Time Slot (Till Midnight 11:59 PM) -->
                <div class="st-slot-box is-morning-slot">
                  <div class="st-slot-box-head">
                    <span>🌙 Time Slot (Till Midnight 11:59 PM)</span>
                    <span class="st-slot-badge-tag st-tag-morning">${midnightTargets.length} Planned</span>
                  </div>
                  ${midnightTargets.length === 0 ? `
                    <div class="st-empty-hint" style="padding: 0.65rem;">
                      No midnight targets scheduled for this date. Select chapters above to add to your plan!
                    </div>
                  ` : `
                    <div class="st-topic-items-list">
                      ${midnightTargets.map(t => {
                        const topicStudySec = getTodayChapterStudySeconds(t.subject, t.topic, activePlannerDate);
                        return `
                        <div class="st-topic-item" id="topic-item-${t.id}">
                          <div class="st-topic-info-main">
                            <div class="st-topic-name-row">
                              <span class="st-sub-pill ${getSubjectPillClass(t.subject)}">${t.subject}</span>
                              <strong style="font-size:0.9rem;">${escapeHtml(t.topic)}</strong>
                              <span class="st-topic-time-badge ${topicStudySec > 0 ? '' : 'is-zero'}" title="Active time spent reading this chapter on ${activePlannerDate}">⏱️ ${topicStudySec > 0 ? formatDurationDisplay(topicStudySec) : '0m'}</span>
                            </div>
                            ${t.notes ? `<div class="st-topic-note-text">📝 ${escapeHtml(t.notes)}</div>` : ''}
                          </div>
                          <div class="st-topic-btns">
                            <button type="button" class="st-act-btn is-success st-topic-achieve-midnight-btn" data-id="${t.id}" data-subject="${escapeHtml(t.subject)}" data-topic="${escapeHtml(t.topic)}" title="Take 50-Q Test (≥80%) to Conquered!">
                              ⭐ Achieved (Midnight)
                            </button>
                            <button type="button" class="st-act-btn is-warning st-topic-to-pending-btn" data-id="${t.id}" title="Move to Pending Backlog">
                              ⏳ Backlog
                            </button>
                            <button type="button" class="st-act-btn is-danger st-topic-del-btn" data-id="${t.id}" title="Delete">
                              🗑️
                            </button>
                          </div>
                        </div>
                      `;
                      }).join('')}
                    </div>
                  `}
                </div>

                <!-- 2. Afternoon / Evening Slot (if any) -->
                ${eveningTargets.length > 0 ? `
                  <div class="st-slot-box">
                    <div class="st-slot-box-head">
                      <span>⛅ Afternoon / Evening Slot</span>
                      <span class="st-slot-badge-tag" style="background:#e0e7ff; color:#3730a3;">${eveningTargets.length} Planned</span>
                    </div>
                    <div class="st-topic-items-list">
                      ${eveningTargets.map(t => {
                        const topicStudySec = getTodayChapterStudySeconds(t.subject, t.topic, activePlannerDate);
                        return `
                        <div class="st-topic-item" id="topic-item-${t.id}">
                          <div class="st-topic-info-main">
                            <div class="st-topic-name-row">
                              <span class="st-sub-pill ${getSubjectPillClass(t.subject)}">${t.subject}</span>
                              <strong style="font-size:0.9rem;">${escapeHtml(t.topic)}</strong>
                              <span class="st-topic-time-badge ${topicStudySec > 0 ? '' : 'is-zero'}" title="Active time spent reading this chapter on ${activePlannerDate}">⏱️ ${topicStudySec > 0 ? formatDurationDisplay(topicStudySec) : '0m'}</span>
                            </div>
                            ${t.notes ? `<div class="st-topic-note-text">📝 ${escapeHtml(t.notes)}</div>` : ''}
                          </div>
                          <div class="st-topic-btns">
                            <button type="button" class="st-act-btn is-success st-topic-achieve-btn" data-id="${t.id}" data-subject="${escapeHtml(t.subject)}" data-topic="${escapeHtml(t.topic)}" title="Take 50-Q Test (≥80%) to Achieve!">
                              ✅ Achieved
                            </button>
                            <button type="button" class="st-act-btn is-warning st-topic-to-pending-btn" data-id="${t.id}" title="Move to Pending Backlog">
                              ⏳ Backlog
                            </button>
                            <button type="button" class="st-act-btn is-danger st-topic-del-btn" data-id="${t.id}" title="Delete">
                              🗑️
                            </button>
                          </div>
                        </div>
                      `;
                      }).join('')}
                    </div>
                  </div>
                ` : ''}

                <!-- 3. Achieved on This Date Section -->
                <div class="st-slot-box is-achieved-slot">
                  <div class="st-slot-box-head">
                    <span>🏆 Achieved on this Day (${achievedTopics.length})</span>
                    <span class="st-slot-badge-tag st-tag-achieved">Done</span>
                  </div>
                  ${achievedTopics.length === 0 ? `
                    <div class="st-empty-hint" style="padding: 0.65rem;">
                      No reading targets marked achieved yet for this date.
                    </div>
                  ` : `
                    <div class="st-topic-items-list">
                      ${achievedTopics.map(t => {
                        const topicStudySec = getTodayChapterStudySeconds(t.subject, t.topic, activePlannerDate);
                        return `
                        <div class="st-topic-item" id="topic-item-${t.id}" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3);">
                          <div class="st-topic-info-main">
                            <div class="st-topic-name-row">
                              <span class="st-sub-pill ${getSubjectPillClass(t.subject)}">${t.subject}</span>
                              <span style="text-decoration: line-through; opacity: 0.85;">${escapeHtml(t.topic)}</span>
                              <span class="st-topic-time-badge ${topicStudySec > 0 ? '' : 'is-zero'}" title="Active time spent reading this chapter on ${activePlannerDate}">⏱️ ${topicStudySec > 0 ? formatDurationDisplay(topicStudySec) : '0m'}</span>
                              <span class="st-slot-badge-tag st-tag-achieved" style="font-size:0.65rem;">
                                ${t.cleared_by === 'read_marker' ? '📖 Marked via Chapter Note' : '✅ Completed'}
                              </span>
                            </div>
                            ${t.notes ? `<div class="st-topic-note-text">📝 ${escapeHtml(t.notes)}</div>` : ''}
                          </div>
                          <div class="st-topic-btns">
                            <button type="button" class="st-act-btn st-topic-undo-btn" data-id="${t.id}" title="Revert to Pending">
                              ↩ Undo
                            </button>
                            <button type="button" class="st-act-btn is-danger st-topic-del-btn" data-id="${t.id}" title="Delete">
                              🗑️
                            </button>
                          </div>
                        </div>
                      `;
                      }).join('')}
                    </div>
                  `}
                </div>

                <!-- 4. Date-wise Backlog Section for this Date -->
                <div class="st-slot-box is-pending-backlog">
                  <div class="st-slot-box-head" style="color: #b91c1c;">
                    <span>⚠️ Backlog for this Day (${dateBacklogTopics.length})</span>
                    <span class="st-slot-badge-tag st-tag-pending">${dateBacklogTopics.length} Incomplete</span>
                  </div>
                  ${dateBacklogTopics.length === 0 ? `
                    <div style="font-size: 0.82rem; color: #059669; font-weight: 600; padding: 0.3rem 0;">
                      🎉 Zero pending backlog for this date! All targets were accomplished.
                    </div>
                  ` : `
                    <p style="font-size: 0.76rem; color: #b91c1c; margin: 0 0 0.5rem 0;">
                      These chapters were scheduled on this date and not completed before midnight.
                    </p>
                    <div class="st-topic-items-list">
                      ${dateBacklogTopics.map(t => {
                        const topicStudySec = getTodayChapterStudySeconds(t.subject, t.topic, activePlannerDate);
                        return `
                        <div class="st-topic-item" id="topic-item-${t.id}" style="background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.35);">
                          <div class="st-topic-info-main">
                            <div class="st-topic-name-row">
                              <span class="st-sub-pill ${getSubjectPillClass(t.subject)}">${t.subject}</span>
                              <strong style="color: #b91c1c;">${escapeHtml(t.topic)}</strong>
                              <span class="st-topic-time-badge ${topicStudySec > 0 ? '' : 'is-zero'}" title="Active time spent reading this chapter on ${activePlannerDate}">⏱️ ${topicStudySec > 0 ? formatDurationDisplay(topicStudySec) : '0m'}</span>
                              <span class="st-slot-badge-tag st-tag-pending" style="font-size:0.65rem;">
                                ⚠️ Backlog
                              </span>
                            </div>
                            ${t.notes ? `<div class="st-topic-note-text" style="color:#b91c1c;">📝 ${escapeHtml(t.notes)}</div>` : ''}
                          </div>
                          <div class="st-topic-btns">
                            <button type="button" class="st-act-btn is-success st-topic-achieve-now-btn" data-id="${t.id}" data-subject="${escapeHtml(t.subject)}" data-topic="${escapeHtml(t.topic)}" title="Take 50-Q Test (≥80%) to Conquer Now!">
                              ✅ Done Now
                            </button>
                            ${!isCurrentDateToday ? `
                              <button type="button" class="st-act-btn st-topic-to-today-btn" data-id="${t.id}" title="Move to Today's Plan">
                                📅 To Today
                              </button>
                            ` : `
                              <button type="button" class="st-act-btn st-topic-to-tomorrow-btn" data-id="${t.id}" title="Push to Tomorrow">
                                📅 Tomorrow
                              </button>
                            `}
                            <button type="button" class="st-act-btn is-danger st-topic-del-btn" data-id="${t.id}" title="Delete">
                              🗑️
                            </button>
                          </div>
                        </div>
                      `;
                      }).join('')}
                    </div>
                  `}
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: Daily Tasks & Habits Section -->
            <div class="st-planner-col">
              <div class="st-planner-col-head">
                <h4>📋 Daily Tasks & Routine Checklist</h4>
                <span class="st-planner-col-badge">
                  ${completedTasksCount}/${totalTasksCount} Done (${taskCompletionPct}%)
                </span>
              </div>

              <!-- Task Progress Bar -->
              <div class="st-task-progress-wrap">
                <div class="st-task-progress-labels">
                  <span>Task Completion for ${formatPlannerDateDisplay(activePlannerDate)}</span>
                  <span><strong>${completedTasksCount}</strong> of ${totalTasksCount} done (${taskCompletionPct}%)</span>
                </div>
                <div class="st-task-progress-bar">
                  <div class="st-task-progress-fill" style="width: ${taskCompletionPct}%;"></div>
                </div>
              </div>

              <!-- Quick Preset Task Chips -->
              <div class="st-task-preset-chips">
                <span class="st-preset-chip" data-task="📰 Daily Current Affairs (45m)" data-time="45m" data-priority="high">+ 📰 Current Affairs</span>
                <span class="st-preset-chip" data-task="🎯 Solve 50 Ghatnachakra PYQs" data-time="1h" data-priority="high">+ 🎯 50 PYQs</span>
                <span class="st-preset-chip" data-task="📝 1 Mains Answer Writing Drill" data-time="30m" data-priority="normal">+ 📝 Mains Answer</span>
                <span class="st-preset-chip" data-task="🔁 Revise Weak Topics Flashcards" data-time="30m" data-priority="normal">+ 🔁 Revise Notes</span>
                <span class="st-preset-chip" data-task="🧮 CSAT Practice (30m)" data-time="30m" data-priority="normal">+ 🧮 CSAT Practice</span>
              </div>

              <!-- Quick Add Task Form -->
              <form class="st-planner-quick-form" id="st-form-add-task">
                <div class="st-form-row">
                  <div style="flex: 2; min-width: 170px;">
                    <input type="text" id="st-task-text" class="st-planner-input" style="width: 100%;" placeholder="Task name (e.g. Read Drishti Current Affairs, Revise Polity...)" required />
                  </div>
                  <div style="flex: 0.9; min-width: 90px;">
                    <select id="st-task-priority" class="st-planner-input" style="width: 100%;">
                      <option value="normal">Normal</option>
                      <option value="high">High 🔥</option>
                      <option value="urgent">Urgent 🚨</option>
                    </select>
                  </div>
                  <div style="flex: 0.8; min-width: 75px;">
                    <select id="st-task-time" class="st-planner-input" style="width: 100%;">
                      <option value="">Time</option>
                      <option value="15m">15m</option>
                      <option value="30m">30m</option>
                      <option value="45m">45m</option>
                      <option value="1h">1h</option>
                      <option value="2h">2h</option>
                    </select>
                  </div>
                  <button type="submit" class="st-btn st-btn-primary" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; white-space: nowrap;">
                    ➕ Add
                  </button>
                </div>
              </form>

              <!-- Task Filters -->
              <div class="st-task-filters">
                <button type="button" class="st-task-filter-btn ${activePlannerFilter === 'all' ? 'is-active' : ''}" data-filter="all">
                  All (${totalTasksCount})
                </button>
                <button type="button" class="st-task-filter-btn ${activePlannerFilter === 'pending' ? 'is-active' : ''}" data-filter="pending">
                  Pending (${totalTasksCount - completedTasksCount})
                </button>
                <button type="button" class="st-task-filter-btn ${activePlannerFilter === 'completed' ? 'is-active' : ''}" data-filter="completed">
                  Completed (${completedTasksCount})
                </button>
              </div>

              <!-- Task List Items -->
              <div class="st-tasks-list">
                ${filteredDailyTasks.length === 0 ? `
                  <div class="st-empty-hint">No tasks in this list. Click a preset chip above or add a task!</div>
                ` : `
                  ${filteredDailyTasks.map(task => `
                    <div class="st-task-item ${task.completed ? 'is-done' : ''}" id="task-item-${task.id}">
                      <div class="st-task-left">
                        <input type="checkbox" class="st-task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
                        <span class="st-task-text">${escapeHtml(task.text)}</span>
                      </div>
                      <div style="display:flex; align-items:center; gap:0.4rem;">
                        <span class="st-priority-badge ${task.priority || 'normal'}">${task.priority || 'normal'}</span>
                        ${task.time_est ? `<span class="st-task-time-pill">⏱️ ${task.time_est}</span>` : ''}
                        <button type="button" class="st-act-btn is-danger st-task-del-btn" data-id="${task.id}" title="Delete task" style="padding:0.15rem 0.35rem; font-size:0.68rem;">
                          ✖
                        </button>
                      </div>
                    </div>
                  `).join('')}
                `}
              </div>

              <!-- Task Action Footer -->
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.85rem; padding-top:0.75rem; border-top:1px solid var(--study-hairline, rgba(39,60,117,0.08));">
                <button type="button" class="st-act-btn" id="st-btn-clear-completed-tasks">
                  🧹 Clear Completed
                </button>
                <button type="button" class="st-act-btn" id="st-btn-rollover-tasks-tomorrow">
                  📅 Rollover Pending to Tomorrow
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Dashboard Deep-Dive Tabs -->
        <div class="st-dash-tabs" id="st-dash-tab-nav">
          <button type="button" class="st-dash-tab is-active" data-tab="tab-weak">
            ⚠️ Weak Topics & Mistake Radar (${weakTopics.length})
          </button>
          <button type="button" class="st-dash-tab" data-tab="tab-due">
            ⏱️ Due Revisions (${dueRevisions.length})
          </button>
          <button type="button" class="st-dash-tab" data-tab="tab-tests">
            🎯 Recent Live Tests (${recentTests.length})
          </button>
          <button type="button" class="st-dash-tab" data-tab="tab-subjects">
            📚 Subject Breakdown (${subjects.length})
          </button>
        </div>

        <!-- Tab 1: Weak Topics & Mistake Radar -->
        <div class="st-tab-content is-active" id="tab-weak">
          <div class="st-section-head">
            <h3>⚠️ Weak Topics & Focus Radar</h3>
            <p>Topics flagged here have lower test accuracy (&lt;60%), low confidence logs, or have been manually added by you for intensive drills.</p>
          </div>

          <!-- Quick Map New Weak Topic Form -->
          <div class="st-quick-post-card" style="margin-bottom: 1.5rem;">
            <div class="st-qp-header">
              <h4>📌 Map a New Weak Topic / Focus Area</h4>
              <span class="st-qp-sub">Add any topic or chapter you want to actively drill until mastered.</span>
            </div>
            <form id="st-form-map-weak" style="display:flex; flex-wrap:wrap; gap:0.65rem; align-items:flex-end;">
              <div style="flex: 1; min-width: 150px;">
                <label style="font-size:0.75rem; font-weight:700; display:block; margin-bottom:0.25rem;">Subject</label>
                <select id="st-map-subject" class="st-input" style="padding:0.45rem 0.65rem; font-size:0.85rem;" required>
                  <option value="polity">Polity</option>
                  <option value="geography">Geography</option>
                  <option value="ancient history">Ancient History</option>
                  <option value="medieval india">Medieval India</option>
                  <option value="mordern india">Modern India</option>
                  <option value="environments & ecology">Environments & Ecology</option>
                  <option value="economy">Economy</option>
                  <option value="science and technology">Science & Tech</option>
                  <option value="art and culture">Art & Culture</option>
                  <option value="census and urbanisation">Census & Urbanisation</option>
                  <option value="up special">UP Special</option>
                </select>
              </div>

              <div style="flex: 2; min-width: 200px;">
                <label style="font-size:0.75rem; font-weight:700; display:block; margin-bottom:0.25rem;">Topic / Chapter Name</label>
                <input type="text" id="st-map-topic" class="st-input" placeholder="e.g. 03_Regional_Kingdoms or Sharqi & Deccan" style="padding:0.45rem 0.65rem; font-size:0.85rem;" required />
              </div>

              <div style="flex: 2; min-width: 200px;">
                <label style="font-size:0.75rem; font-weight:700; display:block; margin-bottom:0.25rem;">Weak Area Note (Optional)</label>
                <input type="text" id="st-map-notes" class="st-input" placeholder="e.g. Confused in match capitals & monuments" style="padding:0.45rem 0.65rem; font-size:0.85rem;" />
              </div>

              <button type="submit" class="st-btn st-btn-primary" style="padding: 0.48rem 1rem; font-size: 0.85rem;">
                📌 Add to Radar
              </button>
            </form>
          </div>

          <!-- List of Weak Topics -->
          ${weakTopics.length === 0 ? `
            <div class="st-empty-state">
              🌟 <strong>All Clear!</strong> You currently have 0 weak areas flagged.<br/>
              When you score &lt;60% on live tests or rate a reading low confidence, it will automatically appear here!
            </div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              ${weakTopics.map(w => `
                <div class="st-test-card" style="border-left: 4px solid #ef4444;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <span class="st-pill-provider" style="background: rgba(239, 68, 68, 0.12); color: #ef4444; font-weight: 700;">
                      ${w.subject.toUpperCase()}
                    </span>
                    <span style="font-size: 0.72rem; color: var(--md-default-fg-color--light);">
                      ${timeAgo(w.date)}
                    </span>
                  </div>
                  <h4 style="margin: 0 0 0.35rem 0; font-size: 0.98rem; font-weight: 700;">
                    ${w.topic_title || w.topic}
                  </h4>
                  <div class="st-weak-pill" style="margin-bottom: 0.65rem;">
                    ⚠️ ${w.reason}
                  </div>
                  ${w.notes ? `<div style="font-size:0.8rem; font-style:italic; color:var(--md-default-fg-color--light); margin-bottom:0.75rem;">"${w.notes}"</div>` : ''}
                  <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--study-hairline, #e2e8f0);">
                    <button type="button" class="st-btn st-btn-outline st-dash-test-btn" data-subject="${w.subject}" data-topic="${w.topic}" data-title="${w.topic_title || w.topic}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                      🚀 Practice Drill
                    </button>
                    <button type="button" class="st-btn st-btn-outline st-dash-resolve-btn" data-subject="${w.subject}" data-topic="${w.topic}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; margin-left: auto;">
                      ✅ Mastered
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Tab 2: Due Revisions -->
        <div class="st-tab-content" id="tab-due">
          <div class="st-section-head">
            <h3>⏱️ Due Revisions (Spaced Repetition)</h3>
            <p>Based on your optimal forgetting curve intervals (Day 1, 3, 7, 14, 30).</p>
          </div>
          ${dueRevisions.length === 0 ? `
            <div class="st-empty-state">
              🎉 <strong>No revisions due today!</strong> Your memory retention cycle is on track.
            </div>
          ` : `
            <div class="st-due-list">
              ${dueRevisions.map(d => `
                <div class="st-due-row">
                  <div class="st-due-info">
                    <span class="st-pill-subject">${d.subject.toUpperCase()}</span>
                    <strong style="font-size: 0.95rem;">${d.topic_title || d.topic}</strong>
                    <span class="st-due-meta">Stage: <strong>Rev #${d.revision_number}</strong> | Confidence: ${'★'.repeat(d.confidence || 3)}</span>
                  </div>
                  <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <a href="${getSiteBasePath()}subjects/${encodeURIComponent(d.subject)}/${encodeURIComponent(d.topic)}/" class="st-btn st-btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; text-decoration: none;">
                      📖 Study
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Tab 3: Recent Live Tests -->
        <div class="st-tab-content" id="tab-tests">
          <div class="st-section-head">
            <h3>🎯 Recent Live Tests & Scorecards</h3>
            <p>All evaluated CBT and Practice Drill test sessions with official UPPCS scoring (+1.33 / -0.44).</p>
          </div>
          ${recentTests.length === 0 ? `
            <div class="st-empty-state">
              🎯 No live test sessions recorded yet. Launch a test from any chapter!
            </div>
          ` : `
            <div class="st-tests-list">
              ${recentTests.map(t => `
                <div class="st-test-card">
                  <div class="st-test-header">
                    <div>
                      <span class="st-pill-provider">${(t.subject || 'All Subjects').toUpperCase()}</span>
                      <strong class="st-test-name">${t.topic_title || t.title || t.topic || 'Practice Drill'}</strong>
                      <span class="st-test-type">${t.test_mode || t.provider || 'CBT Mode'}</span>
                    </div>
                    <span class="st-test-date">${formatDate(t.date)}</span>
                  </div>
                  <div class="st-test-body">
                    <div>
                      <span class="st-t-label">Net Marks</span>
                      <span class="st-t-val st-score">${t.net_marks > 0 ? '+' : ''}${t.net_marks}</span>
                    </div>
                    <div>
                      <span class="st-t-label">Accuracy</span>
                      <span class="st-t-val">${t.accuracy_pct}%</span>
                    </div>
                    <div>
                      <span class="st-t-label">Score</span>
                      <span class="st-t-val">${t.correct}✔ / ${t.incorrect}✖</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Tab 4: Subject Breakdown -->
        <div class="st-tab-content" id="tab-subjects">
          <div class="st-section-head">
            <h3>📚 Subject Mastery Breakdown</h3>
            <p>Consolidated view of question practice and revision frequency per subject.</p>
          </div>
          <div class="st-subjects-grid">
            ${subjects.map(s => `
              <div class="st-subject-card">
                <h4>${s.subject.toUpperCase()}</h4>
                <div class="st-sub-row">
                  <span>Revisions Logged:</span>
                  <strong>${s.revisions}</strong>
                </div>
                <div class="st-sub-row">
                  <span>PYQs Attempted:</span>
                  <strong>${s.pyqsAttempted}</strong>
                </div>
                <div class="st-sub-row">
                  <span>Accuracy Rate:</span>
                  <strong style="color: ${s.accuracy >= 70 ? '#10b981' : (s.accuracy >= 50 ? '#f59e0b' : '#ef4444')};">${s.accuracy}%</strong>
                </div>
                <div class="st-progress-bar-bg">
                  <div class="st-progress-bar-fill" style="width: ${Math.min(100, s.accuracy)}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    dashApp.innerHTML = html;

    // -------------------------------------------------------------
    // INITIALIZE CHART.JS & SVG FALLBACK CHARTS
    // -------------------------------------------------------------
    async function initDashboardCharts() {
      const dark = isDarkTheme();
      const textColor = dark ? '#94a3b8' : '#475569';
      const gridColor = dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
      const hasChartJs = await ensureChartJsLoaded();

      // CHART 1: 7-Day Study Time Velocity
      const velCanvas = document.getElementById('chart-study-velocity');
      if (velCanvas && hasChartJs && typeof window.Chart !== 'undefined') {
        const labels = velocityDays.map(v => v.label);
        const hoursData = velocityDays.map(v => v.hours);
        const bgColors = velocityDays.map((v, i) => i === 6 ? '#10b981' : (v.hours >= 4 ? '#6366f1' : 'rgba(99, 102, 241, 0.65)'));

        try {
          activeCharts.velocity = new window.Chart(velCanvas, {
            type: 'bar',
            data: {
              labels,
              datasets: [
                {
                  label: 'Hours Studied',
                  data: hoursData,
                  backgroundColor: bgColors,
                  borderRadius: 6,
                  maxBarThickness: 34
                },
                {
                  label: 'Target (4h)',
                  data: [4, 4, 4, 4, 4, 4, 4],
                  type: 'line',
                  borderColor: '#f59e0b',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  pointRadius: 0,
                  fill: false
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: { color: textColor, boxWidth: 12, font: { size: 11, weight: 'bold' } }
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} hrs`
                  }
                }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: textColor, font: { size: 11, weight: 'bold' } }
                },
                y: {
                  beginAtZero: true,
                  suggestedMax: 5,
                  grid: { color: gridColor },
                  ticks: { color: textColor, callback: (v) => `${v}h` }
                }
              }
            }
          });
        } catch (e) {
          console.warn('Velocity Chart.js error:', e);
        }
      }

      // CHART 2: Subject Time & Focus Distribution Donut
      const subCanvas = document.getElementById('chart-subject-distribution');
      if (subCanvas && hasChartJs && typeof window.Chart !== 'undefined') {
        let subLabels = Object.keys(subjectDistribution);
        let subSecs = Object.values(subjectDistribution);

        // If no study time logged today yet, use overall subject breakdown from summary/local
        if (subLabels.length === 0 && subjects.length > 0) {
          subLabels = subjects.map(s => s.subject);
          subSecs = subjects.map(s => s.pyqsAttempted > 0 ? s.pyqsAttempted : (s.revisions * 15));
        }
        if (subLabels.length === 0) {
          subLabels = ['Polity', 'Geography', 'Modern India', 'Environment', 'Ancient History'];
          subSecs = [35, 25, 20, 12, 8];
        }

        const colorMap = {
          'polity': '#3b82f6',
          'geography': '#10b981',
          'ancient history': '#d97706',
          'medieval india': '#b45309',
          'mordern india': '#ea580c',
          'environments & ecology': '#059669',
          'economy': '#8b5cf6',
          'science and technology': '#06b6d4',
          'art and culture': '#ec4899',
          'up special': '#6366f1',
          'census and urbanisation': '#0d9488',
          'current affairs': '#e11d48'
        };

        const chartColors = subLabels.map(s => colorMap[s.toLowerCase()] || '#6366f1');

        try {
          activeCharts.subjects = new window.Chart(subCanvas, {
            type: 'doughnut',
            data: {
              labels: subLabels.map(s => s.toUpperCase()),
              datasets: [{
                data: subSecs,
                backgroundColor: chartColors,
                borderWidth: dark ? 2 : 1,
                borderColor: dark ? '#1e293b' : '#ffffff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '68%',
              plugins: {
                legend: {
                  position: 'right',
                  labels: { color: textColor, boxWidth: 10, font: { size: 10 } }
                }
              }
            }
          });
        } catch (e) {
          console.warn('Subject Donut Chart error:', e);
        }
      }

      // CHART 3: CBT Mock Test Score Trajectory
      const testsCanvas = document.getElementById('chart-tests-trajectory');
      if (testsCanvas && hasChartJs && typeof window.Chart !== 'undefined') {
        const testsToChart = recentTests.slice(0, 8).reverse();
        const testLabels = testsToChart.length > 0
          ? testsToChart.map((t, idx) => `Test ${idx + 1}`)
          : ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'];

        const marksData = testsToChart.length > 0
          ? testsToChart.map(t => Number(t.net_marks || 0))
          : [65, 78, 85, 92, 105];

        const accData = testsToChart.length > 0
          ? testsToChart.map(t => Number(t.accuracy_pct || 0))
          : [68, 74, 81, 84, 88];

        try {
          activeCharts.tests = new window.Chart(testsCanvas, {
            type: 'line',
            data: {
              labels: testLabels,
              datasets: [
                {
                  label: 'Accuracy %',
                  data: accData,
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  yAxisID: 'y1',
                  tension: 0.35,
                  fill: true,
                  pointRadius: 4
                },
                {
                  label: 'Net Marks',
                  data: marksData,
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  yAxisID: 'y',
                  tension: 0.35,
                  fill: false,
                  pointRadius: 4
                },
                {
                  label: '80% Benchmark',
                  data: testLabels.map(() => 80),
                  borderColor: '#ef4444',
                  borderDash: [4, 4],
                  borderWidth: 1.5,
                  pointRadius: 0,
                  yAxisID: 'y1',
                  fill: false
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: textColor, boxWidth: 10, font: { size: 10, weight: 'bold' } }
                }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: textColor, font: { size: 10 } }
                },
                y: {
                  type: 'linear',
                  position: 'left',
                  grid: { color: gridColor },
                  ticks: { color: textColor, callback: (v) => `${v}m` }
                },
                y1: {
                  type: 'linear',
                  position: 'right',
                  min: 0,
                  max: 100,
                  grid: { display: false },
                  ticks: { color: textColor, callback: (v) => `${v}%` }
                }
              }
            }
          });
        } catch (e) {
          console.warn('Tests Chart error:', e);
        }
      }

      // CHART 4: Syllabus Readiness Ring
      const gaugeCanvas = document.getElementById('chart-syllabus-readiness');
      if (gaugeCanvas && hasChartJs && typeof window.Chart !== 'undefined') {
        const covered = syllabusCoveragePct;
        const remaining = Math.max(0, 100 - covered);

        try {
          activeCharts.gauge = new window.Chart(gaugeCanvas, {
            type: 'doughnut',
            data: {
              datasets: [{
                data: [covered, remaining],
                backgroundColor: ['#6366f1', dark ? '#334155' : '#e2e8f0'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '76%',
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
              }
            }
          });
        } catch (e) {
          console.warn('Gauge error:', e);
        }
      }
    }

    initDashboardCharts();

    // Tab switching
    document.querySelectorAll('#st-dash-tab-nav .st-dash-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#st-dash-tab-nav .st-dash-tab').forEach(b => b.classList.remove('is-active'));
        document.querySelectorAll('.st-dash-root .st-tab-content').forEach(c => c.classList.remove('is-active'));
        btn.classList.add('is-active');
        const tabTarget = btn.dataset.tab;
        const targetEl = document.getElementById(tabTarget);
        if (targetEl) targetEl.classList.add('is-active');
      });
    });

    // Refresh button
    document.getElementById('st-dash-refresh')?.addEventListener('click', renderPrepDashboard);

    // -------------------------------------------------------------
    // DAILY PLANNER, CALENDAR STRIP & OVERALL BACKLOG HANDLERS
    // -------------------------------------------------------------
    // Calendar Day buttons click
    document.querySelectorAll('#st-cal-strip .st-cal-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activePlannerDate = btn.dataset.date;
        renderPrepDashboard();
      });
    });

    // Prev / Next Date Navigation
    document.getElementById('st-plan-date-prev')?.addEventListener('click', () => {
      const d = new Date(activePlannerDate);
      d.setDate(d.getDate() - 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      activePlannerDate = `${y}-${m}-${day}`;
      renderPrepDashboard();
    });

    document.getElementById('st-plan-date-next')?.addEventListener('click', () => {
      const d = new Date(activePlannerDate);
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      activePlannerDate = `${y}-${m}-${day}`;
      renderPrepDashboard();
    });

    document.getElementById('st-plan-date-today')?.addEventListener('click', () => {
      activePlannerDate = getTodayISODate();
      renderPrepDashboard();
    });

    // Midnight Audit Checkpoint
    document.getElementById('st-btn-evaluate-midnight')?.addEventListener('click', async () => {
      const count = await apiEvaluateMidnightPlanner(activePlannerDate);
      alert(`⚡ Midnight Audit Complete! ${count} unachieved target(s) moved to Backlog.`);
      renderPrepDashboard();
    });

    // Rollover Pending
    document.getElementById('st-btn-rollover-yesterday')?.addEventListener('click', async () => {
      const res = await apiRolloverPlanner(null, activePlannerDate);
      alert(`🔄 Rollover Complete: Transferred ${res.topics} pending topic(s) and ${res.tasks} pending task(s) to ${activePlannerDate}.`);
      renderPrepDashboard();
    });

    // Helper to update counter of selected chapters
    function updateSelectedCount() {
      const count = document.querySelectorAll('#st-chapter-checklist-container .st-chapter-select-chk:checked').length;
      const countEl = document.getElementById('st-multiselect-count');
      if (countEl) {
        countEl.textContent = `${count} selected`;
      }
    }

    function bindChecklistEvents() {
      document.querySelectorAll('#st-chapter-checklist-container .st-chapter-select-chk').forEach(chk => {
        chk.addEventListener('change', updateSelectedCount);
      });
      updateSelectedCount();
    }
    bindChecklistEvents();

    // Subject Dropdown Change -> Re-populate Chapter Multi-select Checklist
    const subSelect = document.getElementById('st-topic-subject');
    subSelect?.addEventListener('change', () => {
      activePlannerSubject = subSelect.value;
      const container = document.getElementById('st-chapter-checklist-container');
      const searchBox = document.getElementById('st-multiselect-search');
      if (searchBox) searchBox.value = '';
      if (container) {
        container.innerHTML = renderChapterChecklistHtml(activePlannerSubject);
        bindChecklistEvents();
      }
    });

    // Multi-select Chapter Live Search
    const searchBox = document.getElementById('st-multiselect-search');
    searchBox?.addEventListener('input', () => {
      const q = searchBox.value.toLowerCase().trim();
      document.querySelectorAll('#st-chapter-checklist-container .st-chapter-chk-label').forEach(lbl => {
        const txt = lbl.textContent.toLowerCase();
        lbl.style.display = txt.includes(q) ? 'flex' : 'none';
      });
    });

    // Select All / Clear Selection
    document.getElementById('st-btn-chk-all')?.addEventListener('click', () => {
      document.querySelectorAll('#st-chapter-checklist-container .st-chapter-chk-label').forEach(lbl => {
        if (lbl.style.display !== 'none') {
          const chk = lbl.querySelector('.st-chapter-select-chk');
          if (chk) chk.checked = true;
        }
      });
      updateSelectedCount();
    });

    document.getElementById('st-btn-chk-none')?.addEventListener('click', () => {
      document.querySelectorAll('#st-chapter-checklist-container .st-chapter-select-chk').forEach(chk => {
        chk.checked = false;
      });
      updateSelectedCount();
    });

    // Add Topic Form Submit -> Batch Adds Checked Chapters
    document.getElementById('st-form-add-topic')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sub = document.getElementById('st-topic-subject').value;
      const slot = document.getElementById('st-topic-slot').value;
      const notes = document.getElementById('st-topic-notes').value.trim();
      const customTopic = document.getElementById('st-topic-custom')?.value.trim();

      const selectedChapters = [];
      document.querySelectorAll('#st-chapter-checklist-container .st-chapter-select-chk:checked').forEach(chk => {
        selectedChapters.push(chk.value || chk.dataset.title || chk.dataset.slug);
      });

      if (customTopic) {
        selectedChapters.push(customTopic);
      }

      if (selectedChapters.length === 0) {
        alert('Please select at least one chapter from the checklist or type a custom topic name.');
        return;
      }

      // Check active chapter capacity (Strict 10-chapter limit)
      const currentPlanner = getLocalDailyPlanner(activePlannerDate);
      const currentPending = (currentPlanner && currentPlanner.reading_topics)
        ? currentPlanner.reading_topics.filter(t => t.status !== 'achieved').length
        : 0;

      if (currentPending >= 10) {
        showModal('🛑 Active Chapter Limit Reached (10/10)', `
          <div style="padding: 1.5rem 1rem; text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛑</div>
            <h3 style="color: #ef4444; font-weight: 800; margin-bottom: 0.5rem;">Chapter Queue Full (10/10 Chapters)</h3>
            <p style="font-size: 0.95rem; line-height: 1.5; color: var(--md-default-fg-color); max-width: 440px; margin: 0 auto 1.25rem;">
              You already have <strong>${currentPending} active chapters</strong> in your Prep Tracker list. Under your preparation rules, you can only have at most 10 active chapters at a time.
            </p>
            <div style="padding: 0.85rem 1rem; border-radius: 8px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); font-size: 0.88rem; font-weight: 700; color: #dc2626; margin-bottom: 1.5rem;">
              📖 Read these first and mark +1 Read count (via the Qualifying Exam &ge;80% or 100% Redemption Drill) to unlock new slots!
            </div>
            <button type="button" class="st-btn st-btn-primary" id="st-btn-ack-limit" style="padding: 0.5rem 1.5rem;">
              Got it, I will finish current chapters first
            </button>
          </div>
        `);
        document.getElementById('st-btn-ack-limit')?.addEventListener('click', closeModal);
        return;
      }

      await apiAddPlannerTopicsBatch(activePlannerDate, sub, selectedChapters, slot, notes);
      renderPrepDashboard();
    });

    // Overall Backlog Item Actions — Enforces Chapter Mastery Gate
    document.querySelectorAll('.st-backlog-achieve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.dataset.subject;
        const topic = btn.dataset.topic;
        const id = btn.dataset.id;
        const date = btn.dataset.date;
        const topicInfo = resolveTopicInfo(sub, topic);
        promptChapterMasteryGate(topicInfo, async () => {
          if (date) {
            await apiUpdatePlannerTopic(date, id, { status: 'achieved', achieved_by_12pm: false });
          }
          renderPrepDashboard();
        });
      });
    });

    document.querySelectorAll('.st-backlog-to-today-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const fromDate = btn.dataset.date;
        const today = getTodayISODate();
        const todayPlanner = getLocalDailyPlanner(today);
        const todayPending = (todayPlanner && todayPlanner.reading_topics)
          ? todayPlanner.reading_topics.filter(item => item.status !== 'achieved').length
          : 0;

        if (todayPending >= 10) {
          alert(`🛑 Today's queue is already full (10/10 active chapters)!\n\nPlease read and mark +1 Read count on today's active chapters before rolling over more backlog.`);
          return;
        }

        const local = getLocalDailyPlanner(fromDate);
        const t = (local.reading_topics || []).find(item => item.id === id);
        if (t) {
          await apiAddPlannerTopic(today, t.subject, t.topic, 'midnight_slot', (t.notes ? t.notes + ' ' : '') + `(Rolled from ${fromDate})`);
          await apiDeletePlannerTopic(fromDate, id);
          alert(`📅 Shifted "${t.topic}" into Today's Midnight Reading Plan!`);
          activePlannerDate = today;
          renderPrepDashboard();
        }
      });
    });

    document.querySelectorAll('.st-backlog-del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const date = btn.dataset.date;
        await apiDeletePlannerTopic(date, id);
        renderPrepDashboard();
      });
    });

    // Active Date Topic Actions — Enforces Chapter Mastery Gate
    document.querySelectorAll('.st-topic-achieve-midnight-btn, .st-topic-achieve-12pm-btn, .st-topic-achieve-btn, .st-topic-achieve-now-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        const sub = btn.dataset.subject;
        const topic = btn.dataset.topic;
        const topicInfo = resolveTopicInfo(sub, topic);
        promptChapterMasteryGate(topicInfo, async () => {
          if (id) {
            await apiUpdatePlannerTopic(activePlannerDate, id, {
              status: 'achieved',
              achieved_by_12pm: true,
              missed_12pm: false
            });
          }
          await apiResolveTopicEverywhere(sub, topic);
          renderPrepDashboard();
        });
      });
    });

    document.querySelectorAll('.st-topic-to-pending-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await apiUpdatePlannerTopic(activePlannerDate, id, {
          missed_12pm: true,
          status: 'pending'
        });
        renderPrepDashboard();
      });
    });

    document.querySelectorAll('.st-topic-to-today-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const todayStr = getTodayISODate();
        const todayPlanner = getLocalDailyPlanner(todayStr);
        const todayPending = (todayPlanner && todayPlanner.reading_topics)
          ? todayPlanner.reading_topics.filter(item => item.status !== 'achieved').length
          : 0;

        if (todayPending >= 10) {
          alert(`🛑 Today's queue is already full (10/10 active chapters)!\n\nPlease read and mark +1 Read count on today's active chapters before moving more.`);
          return;
        }

        const local = getLocalDailyPlanner(activePlannerDate);
        const t = (local.reading_topics || []).find(item => item.id === id);
        if (t) {
          await apiAddPlannerTopic(todayStr, t.subject, t.topic, 'midnight_slot', (t.notes ? t.notes + ' ' : '') + `(Moved from ${activePlannerDate})`);
          await apiDeletePlannerTopic(activePlannerDate, id);
          activePlannerDate = todayStr;
          renderPrepDashboard();
        }
      });
    });

    document.querySelectorAll('.st-topic-to-tomorrow-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const d = new Date(activePlannerDate);
        d.setDate(d.getDate() + 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const tomorrowStr = `${y}-${m}-${day}`;

        const tomorrowPlanner = getLocalDailyPlanner(tomorrowStr);
        const tomorrowPending = (tomorrowPlanner && tomorrowPlanner.reading_topics)
          ? tomorrowPlanner.reading_topics.filter(item => item.status !== 'achieved').length
          : 0;

        if (tomorrowPending >= 10) {
          alert(`🛑 Tomorrow's queue is already at capacity (10/10 active chapters)!\n\nRead and mark +1 Read count on existing chapters first.`);
          return;
        }

        const local = getLocalDailyPlanner(activePlannerDate);
        const t = (local.reading_topics || []).find(item => item.id === id);
        if (t) {
          await apiAddPlannerTopic(tomorrowStr, t.subject, t.topic, 'midnight_slot', (t.notes ? t.notes + ' ' : '') + `(Moved from ${activePlannerDate})`);
          await apiDeletePlannerTopic(activePlannerDate, id);
          alert(`📅 Scheduled "${t.topic}" for tomorrow (${tomorrowStr})!`);
          renderPrepDashboard();
        }
      });
    });

    document.querySelectorAll('.st-topic-undo-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await apiUpdatePlannerTopic(activePlannerDate, id, {
          status: 'pending',
          achieved_by_12pm: false
        });
        renderPrepDashboard();
      });
    });

    document.querySelectorAll('.st-topic-del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await apiDeletePlannerTopic(activePlannerDate, id);
        renderPrepDashboard();
      });
    });

    // Add Task Form Submit
    document.getElementById('st-form-add-task')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = document.getElementById('st-task-text').value.trim();
      const priority = document.getElementById('st-task-priority').value;
      const timeEst = document.getElementById('st-task-time').value;
      if (!text) return;

      await apiAddPlannerTask(activePlannerDate, text, priority, timeEst);
      renderPrepDashboard();
    });

    // Preset Task Chips 1-Click Addition
    document.querySelectorAll('.st-preset-chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        const taskText = chip.dataset.task;
        const timeEst = chip.dataset.time || '';
        const priority = chip.dataset.priority || 'normal';
        if (!taskText) return;

        await apiAddPlannerTask(activePlannerDate, taskText, priority, timeEst);
        renderPrepDashboard();
      });
    });

    // Task Checkbox Toggle
    document.querySelectorAll('.st-task-checkbox').forEach(cb => {
      cb.addEventListener('change', async () => {
        const id = cb.dataset.id;
        await apiUpdatePlannerTask(activePlannerDate, id, { completed: cb.checked });
        renderPrepDashboard();
      });
    });

    // Task Delete (safe delete with date)
    document.querySelectorAll('.st-task-del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await apiDeletePlannerTask(activePlannerDate, id);
        renderPrepDashboard();
      });
    });

    // Task Filter Tabs
    document.querySelectorAll('.st-task-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activePlannerFilter = btn.dataset.filter;
        renderPrepDashboard();
      });
    });

    // Clear Completed Tasks
    document.getElementById('st-btn-clear-completed-tasks')?.addEventListener('click', async () => {
      const local = getLocalDailyPlanner(activePlannerDate);
      const toDelete = (local.daily_tasks || []).filter(t => t.completed);
      for (const t of toDelete) {
        await apiDeletePlannerTask(activePlannerDate, t.id);
      }
      renderPrepDashboard();
    });

    // Rollover Pending Tasks to Tomorrow
    document.getElementById('st-btn-rollover-tasks-tomorrow')?.addEventListener('click', async () => {
      const d = new Date(activePlannerDate);
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const tomorrowStr = `${y}-${m}-${day}`;

      const local = getLocalDailyPlanner(activePlannerDate);
      const incomplete = (local.daily_tasks || []).filter(t => !t.completed);
      for (const task of incomplete) {
        await apiAddPlannerTask(tomorrowStr, task.text, task.priority, task.time_est);
        await apiDeletePlannerTask(activePlannerDate, task.id);
      }
      alert(`📅 Rolled over ${incomplete.length} pending task(s) to tomorrow (${tomorrowStr})!`);
      renderPrepDashboard();
    });

    // Map Weak Topic Form
    document.getElementById('st-form-map-weak')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sub = document.getElementById('st-map-subject').value;
      const topic = document.getElementById('st-map-topic').value.trim();
      const notes = document.getElementById('st-map-notes').value.trim();
      if (!sub || !topic) return;

      try {
        await authFetch(`${API_BASE}/weak-topics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: sub,
            topic: topic,
            topic_title: topic.replace(/_/g, ' '),
            reason: 'Manually mapped focus area',
            notes: notes
          })
        });
        alert(`✅ Mapped "${topic}" to your Weak Topics Radar!`);
        renderPrepDashboard();
      } catch (err) {
        alert('Failed to map weak topic: ' + err.message);
      }
    });

    // Resolve / Mastered buttons
    document.querySelectorAll('.st-dash-resolve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sub = btn.dataset.subject;
        const topic = btn.dataset.topic;
        try {
          await authFetch(`${API_BASE}/weak-topics`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: sub, topic: topic })
          });
          alert(`✅ Marked "${topic}" as mastered!`);
          renderPrepDashboard();
        } catch (err) {
          alert('Failed to update status.');
        }
      });
    });

    // Test drill buttons from dashboard
    document.querySelectorAll('.st-dash-test-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.dataset.subject;
        const topic = btn.dataset.topic;
        const title = btn.dataset.title;
        openTestEngineModal({ subject: sub, topic: topic, title: title });
      });
    });
  }

  // -------------------------------------------------------------
  // 8. MkDocs Material Life-Cycle Bootstrapper
  // -------------------------------------------------------------
  const boot = () => {
    injectHeaderLockBtn();
    if (!getStoredAuthToken()) {
      showAuthVaultModal();
      return;
    }
    document.body.classList.remove('st-vault-locked');
    injectSubjectNoteWidget();
    enhanceChapterPriorityTracker();
    renderPrepDashboard();
  };

  if (typeof document$ !== 'undefined') {
    document$.subscribe(boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
