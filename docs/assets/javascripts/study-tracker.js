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
  function getStoredAuthToken() {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY) || '';
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
  const CHAPTER_CATALOG = {"ancient history":[{"slug":"01_Stone_Age","title":"Stone Age (Prehistoric India)"},{"slug":"02_Indus_Valley_Civilization","title":"Indus Valley Civilization (Harappan Civilization)"},{"slug":"03_Vedic_Civilization","title":"Vedic Civilization"},{"slug":"04_Religious_Movements","title":"Religious Movements"},{"slug":"05_Sixth_Century_BCE","title":"Sixth Century BCE"},{"slug":"06_Foreign_Invasions","title":"Foreign Invasions"},{"slug":"07_Mauryan_Empire","title":"Mauryan Empire"},{"slug":"08_Post_Mauryan_India","title":"Post-Mauryan India"},{"slug":"09_Gupta_Age","title":"Gupta Age"},{"slug":"10_Post_Gupta_Period","title":"Post-Gupta Period"},{"slug":"11_Ancient_Indian_Administration","title":"Ancient Indian Administration"},{"slug":"12_Ancient_Indian_Economy","title":"Ancient Indian Economy"},{"slug":"13_Archaeology","title":"Archaeology"},{"slug":"14_Ancient_India_Miscellaneous","title":"Ancient India Miscellaneous"},{"slug":"uttarakhand/01_Prehistoric_and_Protohistoric_Uttarakhand","title":"Prehistoric & Protohistoric UK"},{"slug":"uttarakhand/02_Ancient_Tribes_of_Uttarakhand","title":"Ancient Tribes"},{"slug":"uttarakhand/03_Kuninda_and_Yaudheya","title":"Kuninda & Yaudheya"},{"slug":"uttarakhand/04_Kartikepur_Dynasty","title":"Kartikepur Dynasty"},{"slug":"00_Chronology_Year_Wise_Events","title":"Chronology Year Wise Events"},{"slug":"00_Daily_Revision_Facts","title":"Daily Revision Facts"},{"slug":"00_Prelims_Analysis","title":"Prelims Analysis"},{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Ancient","title":"UKPCS PYQ Bank Ancient"}],"medieval india":[{"slug":"01_Early_Medieval_India_Regional_Kingdoms","title":"Early Medieval India (Regional Kingdoms)"},{"slug":"02_Turkish_Invasions_Delhi_Sultanate","title":"Turkish Invasions & Delhi Sultanate"},{"slug":"03_Regional_Kingdoms","title":"Regional Kingdoms (Sharqi, Kashmir, Vijayanagara, Bahmani & Deccan)"},{"slug":"04_Bhakti_Sufi_Movements","title":"Bhakti & Sufi Movements"},{"slug":"05_Medieval_Literature","title":"Medieval Literature"},{"slug":"07_Mughal_Empire","title":"Mughal Empire"},{"slug":"08_Sher_Shah_Suri","title":"Sher Shah Suri"},{"slug":"09_Rajputs","title":"Rajputs"},{"slug":"10_Sikhism","title":"Sikhism"},{"slug":"11_Marathas","title":"Marathas"},{"slug":"12_Later_Medieval_India","title":"Later Medieval India"},{"slug":"uttarakhand/01_Kattyuri_Dynasty","title":"Kattyuri Dynasty"},{"slug":"uttarakhand/02_Parmar_Dynasty_of_Garhwal","title":"Parmar Dynasty of Garhwal"},{"slug":"uttarakhand/03_Chand_Dynasty_of_Kumaon","title":"Chand Dynasty of Kumaon"},{"slug":"00_Chronology_Year_Wise_Events","title":"Chronology Year Wise Events"},{"slug":"00_Daily_Revision_Facts","title":"Daily Revision Facts"},{"slug":"00_Prelims_Analysis","title":"Prelims Analysis"},{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"06_Medieval_Music_Culture","title":"Medieval Music Culture"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Medieval","title":"UKPCS PYQ Bank Medieval"}],"mordern india":[{"slug":"01_Advent_of_Europeans","title":"Advent of Europeans"},{"slug":"02_East_India_Company_Expansion","title":"East India Company Expansion"},{"slug":"03_Governors_General_and_Viceroys","title":"Governors-General & Viceroys"},{"slug":"04_British_Administration_and_Economy","title":"British Administration & Economy"},{"slug":"05_Revolt_of_1857","title":"Revolt of 1857"},{"slug":"06_Socio_Religious_Reform_Movements","title":"Socio-Religious Reform Movements"},{"slug":"07_Education_and_Press","title":"Education & Press"},{"slug":"08_Peasant_Tribal_Labour_Movements","title":"Peasant, Tribal & Labour Movements"},{"slug":"09_Rise_of_Nationalism","title":"Rise of Nationalism"},{"slug":"10_Books_and_Authors","title":"Books & Authors"},{"slug":"11_Swadeshi_and_Revolutionary_Movement","title":"Swadeshi & Revolutionary Movement"},{"slug":"12_Home_Rule_and_Labour_Politics","title":"Home Rule & Labour Politics"},{"slug":"13_Gandhian_Era","title":"Gandhian Era (1915–1948)"},{"slug":"14_Final_Phase_of_Freedom_Struggle","title":"Final Phase of Freedom Struggle"},{"slug":"15_Post_Independence_India","title":"Post-Independence India"},{"slug":"16_Miscellaneous_UPPCS_Frequently_Asked","title":"Miscellaneous (Frequently Asked by UPPCS)"},{"slug":"uttar pradesh/17_UP_History_and_Freedom_Struggle","title":"UP History & Freedom Struggle"},{"slug":"uttarakhand/01_Gorkha_Invasion_and_Rule","title":"Gorkha Invasion & Rule"},{"slug":"uttarakhand/02_British_Rule_in_Uttarakhand","title":"British Rule in UK"},{"slug":"uttarakhand/03_Tehri_Estate","title":"Tehri Estate"},{"slug":"uttarakhand/04_Freedom_Movement_in_Uttarakhand","title":"Freedom Movement in UK"},{"slug":"uttarakhand/05_Peoples_Movements_of_Uttarakhand","title":"People's Movements of UK"},{"slug":"00_Chronology_Year_Wise_Events","title":"Chronology Year Wise Events"},{"slug":"00_Daily_Revision_Facts","title":"Daily Revision Facts"},{"slug":"00_Prelims_Analysis","title":"Prelims Analysis"},{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Modern","title":"UKPCS PYQ Bank Modern"}],"art and culture":[{"slug":"01_Institutions_Related_to_Indian_Culture","title":"Institutions Related to Indian Culture"},{"slug":"02_Religious_and_Philosophical_Traditions","title":"Religious and Philosophical Traditions"},{"slug":"03_Indian_Architecture","title":"Indian Architecture"},{"slug":"04_Indian_Painting","title":"Indian Painting"},{"slug":"05_Indian_Music","title":"Indian Music"},{"slug":"06_Indian_Dance","title":"Indian Dance"},{"slug":"07_Indian_Theatre_and_Performing_Arts","title":"Indian Theatre & Performing Arts"},{"slug":"08_Indian_Languages_and_Literature","title":"Indian Languages & Literature"},{"slug":"09_Indian_Festivals_and_Fairs","title":"Indian Festivals & Fairs"},{"slug":"10_Ancient_Indian_History_Related_to_Culture","title":"Ancient Indian History Related to Culture"},{"slug":"11_Medieval_Indian_Cultural_History","title":"Medieval Indian Cultural History"},{"slug":"12_Sculpture","title":"Sculpture"},{"slug":"13_Folk_Culture","title":"Folk Culture"},{"slug":"14_Cultural_Heritage","title":"Cultural Heritage"},{"slug":"15_Archaeology","title":"Archaeology"},{"slug":"16_Awards_Personalities_GI","title":"Awards, Personalities & GI Tags"},{"slug":"uttar pradesh/17_UP_Art_Culture_Demographics","title":"UP Art, Culture & Demographics"},{"slug":"uttarakhand/01_Folk_Culture_of_Uttarakhand","title":"Folk Culture of UK"},{"slug":"uttarakhand/02_Dances_Music_and_Fairs","title":"Dances, Music & Fairs"},{"slug":"uttarakhand/03_Heritage_and_Cultural_Institutes","title":"Heritage & Cultural Institutes"},{"slug":"uttarakhand/04_Personalities_Literature_and_Press","title":"Personalities, Literature & Press"},{"slug":"00_Daily_Revision_Facts","title":"Daily Revision Facts"},{"slug":"00_Prelims_Analysis","title":"Prelims Analysis"},{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Art_Culture","title":"UKPCS PYQ Bank Art Culture"}],"geography":[{"slug":"01_Indian_Physical_Geography_Mountains_Hills","title":"Indian Physical Geography: Mountains & Hills"},{"slug":"02_Climate_of_India","title":"Climate of India"},{"slug":"03_Drainage_System","title":"Drainage System"},{"slug":"04_Lakes_Waterfalls_Water_Resources","title":"Lakes, Waterfalls & Water Resources"},{"slug":"05_Soils","title":"Soils"},{"slug":"06_Agriculture","title":"Agriculture"},{"slug":"07_Natural_Vegetation_Biodiversity","title":"Natural Vegetation & Biodiversity Geography"},{"slug":"08_Minerals_Energy_Industry","title":"Minerals, Energy & Industry"},{"slug":"09_Transport_Communication","title":"Transport & Communication"},{"slug":"10_Tribes_Institutions","title":"Tribes & Institutions"},{"slug":"11_Population_Geography","title":"Population Geography"},{"slug":"12_Human_Geography","title":"Human Geography (Settlements)"},{"slug":"13_Disaster_Geography","title":"Disaster Geography"},{"slug":"14_Earth_and_Universe","title":"Earth & Universe"},{"slug":"15_Geomorphology_and_Landform_Processes","title":"Geomorphology & Landform Processes"},{"slug":"16_Oceans","title":"Oceans"},{"slug":"17_World_Rivers_and_Lakes","title":"World Rivers & Lakes"},{"slug":"18_World_Landforms","title":"World Landforms"},{"slug":"19_World_Regional_Geography","title":"World Regional Geography"},{"slug":"20_World_Agriculture","title":"World Agriculture"},{"slug":"21_World_Minerals_Energy","title":"World Minerals & Energy"},{"slug":"22_World_Industries","title":"World Industries"},{"slug":"23_Political_Map_Geography","title":"Political & Map-Based Geography"},{"slug":"uttar pradesh/24_Geography_of_Uttar_Pradesh","title":"Geography of Uttar Pradesh"},{"slug":"uttarakhand/01_Location_Relief_Structure","title":"Location, Relief & Structure"},{"slug":"uttarakhand/02_Climate_and_Drainage","title":"Climate & Drainage"},{"slug":"uttarakhand/03_Vegetation_and_Wildlife","title":"Vegetation & Wildlife"},{"slug":"uttarakhand/04_Minerals_Power_Industry","title":"Minerals, Power & Industry"},{"slug":"uttarakhand/05_Agriculture_Animal_Husbandry_Irrigation","title":"Agri, AH & Irrigation"},{"slug":"uttarakhand/06_Population_SC_ST_Settlements","title":"Population, SC/ST & Settlements"},{"slug":"uttarakhand/07_Transport_Tourism_Natural_Hazards","title":"Transport, Tourism & Hazards"},{"slug":"00_Daily_Revision_Facts","title":"Daily Revision Facts"},{"slug":"00_Prelims_Analysis","title":"Prelims Analysis"},{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"25_Census_and_Demographics","title":"Census and Demographics"},{"slug":"26_Agriculture_Minerals_Ranks","title":"Agriculture Minerals Ranks"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Geography","title":"UKPCS PYQ Bank Geography"}],"environments & ecology":[{"slug":"01_Environment_Basics","title":"Environment Basics"},{"slug":"02_Ecology_and_Ecosystem","title":"Ecology & Ecosystem"},{"slug":"03_Food_Chain_and_Energy_Flow","title":"Food Chain & Energy Flow"},{"slug":"04_Biodiversity","title":"Biodiversity"},{"slug":"05_Habitat_Flora_and_Fauna","title":"Habitat, Flora & Fauna"},{"slug":"06_Protected_Areas_and_Conservation","title":"Protected Areas & Conservation"},{"slug":"07_Wildlife_Conservation","title":"Wildlife Conservation"},{"slug":"08_Forests_and_Forest_Management","title":"Forests & Forest Management"},{"slug":"09_Pollution_and_Waste_Management","title":"Pollution & Waste Management"},{"slug":"10_Climate_Change","title":"Climate Change"},{"slug":"11_Ozone_Layer","title":"Ozone Layer"},{"slug":"12_Acid_Rain","title":"Acid Rain"},{"slug":"13_Desertification_and_Land_Degradation","title":"Desertification & Land Degradation"},{"slug":"14_Environmental_Impact_Assessment","title":"Environmental Impact Assessment"},{"slug":"15_Sustainable_Development_and_Environmental_Governance","title":"Sustainable Development & Environmental Governance"},{"slug":"16_Environmental_Organizations_India","title":"Environmental Organizations (India)"},{"slug":"17_Environmental_Laws_and_Policies","title":"Environmental Laws & Policies"},{"slug":"18_International_Environmental_Agreements_and_Conferences","title":"International Environmental Agreements & Conferences"},{"slug":"19_Climate_and_Environmental_Institutions","title":"Climate & Environmental Institutions"},{"slug":"20_Biodiversity_Conservation_Methods","title":"Biodiversity Conservation Methods"},{"slug":"21_Species_and_Ecology","title":"Species & Ecology"},{"slug":"22_Renewable_Energy","title":"Renewable Energy"},{"slug":"23_Disaster_and_Environment","title":"Disaster & Environment"},{"slug":"24_Current_Environmental_Issues","title":"Current Environmental Issues"},{"slug":"25_Global_Environmental_Geography","title":"Global Environmental Geography"},{"slug":"26_Water_Resources_and_Water_Conservation","title":"Water Resources & Water Conservation"},{"slug":"27_Renewable_and_Non_Renewable_Energy","title":"Renewable & Non-Renewable Energy"},{"slug":"28_Environmental_Research_and_Institutions","title":"Environmental Research & Institutions"},{"slug":"29_Indian_Environmental_Movements","title":"Indian Environmental Movements"},{"slug":"30_Environmental_Literature_and_Awareness","title":"Environmental Literature & Awareness"},{"slug":"31_Environmental_Days","title":"Environmental Days"},{"slug":"32_National_Parks_and_Protected_Areas_Advanced","title":"National Parks & Protected Areas (Advanced)"},{"slug":"33_Biosphere_Reserves","title":"Biosphere Reserves"},{"slug":"34_Climate_Change_Advanced","title":"Climate Change (Advanced)"},{"slug":"35_Atmosphere","title":"Atmosphere"},{"slug":"36_Ozone_Layer","title":"Ozone Layer"},{"slug":"37_Greenhouse_Gases","title":"Greenhouse Gases"},{"slug":"38_Pollution_Advanced","title":"Pollution (Advanced)"},{"slug":"39_Acid_Rain","title":"Acid Rain"},{"slug":"40_Desertification","title":"Desertification"},{"slug":"41_Environmental_Monitoring","title":"Environmental Monitoring"},{"slug":"42_International_Environmental_Organizations","title":"International Environmental Organizations"},{"slug":"43_International_Environmental_Agreements","title":"International Environmental Agreements"},{"slug":"44_Current_Environmental_Issues","title":"Current Environmental Issues"},{"slug":"uttarakhand/01_Natural_Resources_and_Climate_Contribution","title":"01 — Natural Resources & Climate Contribution"},{"slug":"uttarakhand/02_Biodiversity_and_Protected_Areas","title":"02 — Biodiversity & Protected Areas"},{"slug":"uttarakhand/03_Climate_Vulnerability_and_Governance","title":"03 — Climate Vulnerability & Governance"},{"slug":"00_Daily_Revision_Facts","title":"Daily Revision Facts"},{"slug":"00_Prelims_Analysis","title":"Prelims Analysis"},{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"45_Environment_PYQ_Trend_Analysis","title":"Environment PYQ Trend Analysis"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Environment","title":"UKPCS PYQ Bank Environment"},{"slug":"uttarakhand/04_National_Parks_Sanctuaries","title":"National Parks Sanctuaries"}],"polity":[{"slug":"01_Constitutional_Development","title":"Constitutional Development"},{"slug":"02_Features_of_the_Constitution","title":"Features of the Constitution"},{"slug":"03_Parts_Articles_and_Schedules","title":"Parts, Articles & Schedules"},{"slug":"04_Union_and_Territory","title":"Union & Territory"},{"slug":"05_Fundamental_Rights_and_Duties","title":"Fundamental Rights & Duties"},{"slug":"06_Union_Executive","title":"Union Executive"},{"slug":"07_Parliament","title":"Parliament"},{"slug":"08_State_Government","title":"State Government"},{"slug":"09_Judiciary","title":"Judiciary"},{"slug":"10_Local_Government","title":"Local Government"},{"slug":"11_Centre_State_Relations","title":"Centre–State Relations"},{"slug":"12_Constitutional_Bodies","title":"Constitutional Bodies"},{"slug":"13_Statutory_and_Non_Constitutional_Bodies","title":"Statutory & Non-Constitutional Bodies"},{"slug":"14_Elections","title":"Elections"},{"slug":"15_Emergency_Provisions","title":"Emergency Provisions"},{"slug":"16_Constitutional_Amendments","title":"Constitutional Amendments"},{"slug":"17_Language_and_Special_Provisions","title":"Language & Special Provisions"},{"slug":"18_Political_Parties_and_Pressure_Groups","title":"Political Parties & Pressure Groups"},{"slug":"19_Acts_and_Governance","title":"Acts & Governance"},{"slug":"20_Internal_Security","title":"Internal Security"},{"slug":"21_International_Relations","title":"International Relations"},{"slug":"22_Constitutional_Philosophy","title":"Constitutional Philosophy"},{"slug":"23_Constitutional_and_Legal_Offices","title":"Constitutional & Legal Offices"},{"slug":"24_Important_Supreme_Court_Judgments","title":"Important Supreme Court Judgments"},{"slug":"25_UP_Special","title":"UP Special"},{"slug":"26_One_Liner_Revision","title":"One-Liner Revision"},{"slug":"uttarakhand/01_Constitutional_Framework_of_Uttarakhand","title":"Constitutional Framework"},{"slug":"uttarakhand/02_Public_Services_PSC_Auditing","title":"Public Services, PSC & Auditing"},{"slug":"uttarakhand/03_High_Court_and_Jurisdiction","title":"High Court & Jurisdiction"},{"slug":"uttarakhand/04_SC_ST_Minorities_Official_Language","title":"SC/ST, Minorities & Language"},{"slug":"uttarakhand/05_Funds_Parties_Elections","title":"Funds, Parties & Elections"},{"slug":"uttarakhand/06_Local_Government_Panchayati_Raj","title":"Local Government & PR"},{"slug":"uttarakhand/07_Governance_and_Rights_Schemes","title":"Governance & Rights Schemes"},{"slug":"00_Daily_Revision_Facts","title":"Daily Revision Facts"},{"slug":"00_Prelims_Analysis","title":"Prelims Analysis"},{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"27_Committees_and_Commissions","title":"Committees and Commissions"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_UKPCS_PYQ_Bank_Polity","title":"UKPCS PYQ Bank Polity"}],"economy":[{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"}],"science and technology":[{"slug":"00_Syllabus","title":"Syllabus"},{"slug":"uttarakhand/00_Syllabus","title":"Syllabus"}],"up special":[{"slug":"01_UP_History_and_Culture","title":"UP History & Culture"},{"slug":"02_UP_Geography_and_Rivers","title":"UP Geography, Rivers & Climate"},{"slug":"03_UP_Economy_Budget_and_Agriculture","title":"UP Economy, Budget & Agriculture"},{"slug":"04_UP_Polity_and_Administration","title":"UP Polity & Administration"},{"slug":"05_UP_Census_and_Demographics","title":"UP Census & Demographics"},{"slug":"06_UP_Schemes_and_Welfare_Policies","title":"UP Government Schemes & Welfare"},{"slug":"07_UP_Tourism_and_Heritage_Sites","title":"UP Tourism & Heritage Sites"}],"current affairs":[{"slug":"01_National_Current_Affairs","title":"National Current Affairs & Events"},{"slug":"02_International_Relations_and_Summits","title":"International Summits & Treaties"},{"slug":"03_UP_Current_Affairs_and_Schemes","title":"UP State Current Affairs"},{"slug":"04_Economic_Survey_and_Budget","title":"Union & State Budget / Economic Survey"},{"slug":"05_Science_Tech_Defense_and_Space","title":"Defense, Space & S&T Updates"},{"slug":"06_Environment_Ecology_Current_Affairs","title":"Environment & COP Summits"},{"slug":"07_Awards_Sports_Persons_in_News","title":"Awards, Sports & Appointments"},{"slug":"08_Indices_and_Reports","title":"Global & National Indices / Reports"}],"csat":[{"slug":"01_Interpersonal_Skills_and_Communication","title":"Interpersonal Skills & Communication"},{"slug":"02_Logical_Reasoning_and_Analytical_Ability","title":"Logical Reasoning & Analytical Ability"},{"slug":"03_Decision_Making_and_Problem_Solving","title":"Decision Making & Problem Solving"},{"slug":"04_General_Mental_Ability","title":"General Mental Ability"},{"slug":"05_Basic_Numeracy_and_Data_Interpretation","title":"Basic Numeracy & Data Interpretation"},{"slug":"06_General_Hindi_Grammar","title":"General Hindi Grammar (Class X Level)"},{"slug":"07_General_English_Comprehension","title":"General English Comprehension"}]};

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

  // Resolve matching topic in localStorage across all dates and on backend
  async function apiResolveTopicEverywhere(subject, topic) {
    if (!subject || !topic) return;
    const normSub = (subject || '').toLowerCase().trim();
    const normTopic = (topic || '').toLowerCase().trim();

    try {
      const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        let changed = false;
        Object.keys(all).forEach(d => {
          const dayData = all[d];
          if (dayData && Array.isArray(dayData.reading_topics)) {
            dayData.reading_topics.forEach(t => {
              const tSub = (t.subject || '').toLowerCase().trim();
              const tName = (t.topic || '').toLowerCase().trim();
              const match = (tSub === normSub || normSub.includes(tSub) || tSub.includes(normSub)) && (
                tName === normTopic || tName.includes(normTopic) || normTopic.includes(tName) ||
                tName.replace(/[^a-z0-9]/g, '') === normTopic.replace(/[^a-z0-9]/g, '')
              );
              if (match && t.status !== 'achieved') {
                t.status = 'achieved';
                t.achieved_at = new Date().toISOString();
                t.cleared_by = 'read_marker';
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
    const normTopic = topicSlug.toLowerCase().trim();
    const todayStr = getTodayISODate();

    const raw = localStorage.getItem(LOCAL_PLANNER_KEY);
    if (!raw) return null;
    try {
      const all = JSON.parse(raw);
      // 1. Check today
      const todayData = all[todayStr];
      if (todayData && Array.isArray(todayData.reading_topics)) {
        const match = todayData.reading_topics.find(t => {
          const tSub = (t.subject || '').toLowerCase().trim();
          const tName = (t.topic || '').toLowerCase().trim();
          return (tSub === normSub || normSub.includes(tSub) || tSub.includes(normSub)) && (
            tName === normTopic || tName.includes(normTopic) || normTopic.includes(tName) ||
            tName.replace(/[^a-z0-9]/g, '') === normTopic.replace(/[^a-z0-9]/g, '')
          );
        });
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
          const match = dayData.reading_topics.find(t => {
            const tSub = (t.subject || '').toLowerCase().trim();
            const tName = (t.topic || '').toLowerCase().trim();
            return (tSub === normSub || normSub.includes(tSub) || tSub.includes(normSub)) && (
              tName === normTopic || tName.includes(normTopic) || normTopic.includes(tName) ||
              tName.replace(/[^a-z0-9]/g, '') === normTopic.replace(/[^a-z0-9]/g, '')
            );
          });
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
    if (!local.reading_topics) local.reading_topics = [];
    local.reading_topics.push(newTopic);
    saveLocalDailyPlanner(targetDate, local);

    try {
      await authFetch(`${API_BASE}/daily-planner/topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate, subject, topic, slot, notes })
      });
    } catch (e) {
      console.warn('Backend sync failed, saved locally:', e);
    }
    return newTopic;
  }

  // Batch add multiple selected chapters
  async function apiAddPlannerTopicsBatch(date, subject, topicsList, slot, notes) {
    const targetDate = date || activePlannerDate;
    const local = getLocalDailyPlanner(targetDate);
    if (!local.reading_topics) local.reading_topics = [];

    const created = [];
    for (const tName of topicsList) {
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

      // Parse options A, B, C, D and question stem
      const options = { A: '', B: '', C: '', D: '' };
      const normalizedBlock = rawText.replace(/\r?\n\s*\(([A-D])\)\s+/gi, '\n$1. ');

      let stemPart = normalizedBlock;
      let optionsPart = '';

      const codeMatch = normalizedBlock.match(/\r?\n\s*(?:Code|Codes)\s*:\s*\r?\n/i);
      if (codeMatch) {
        const codeIdx = codeMatch.index;
        stemPart = normalizedBlock.substring(0, codeIdx).trim();
        optionsPart = normalizedBlock.substring(codeIdx + codeMatch[0].length).trim();
      } else {
        const allA = [...normalizedBlock.matchAll(/\r?\n\s*(?:\(?A[\.\)]|\bA\.)\s+/gi)];
        if (allA.length > 0) {
          for (let i = allA.length - 1; i >= 0; i--) {
            const cand = allA[i];
            const afterCand = normalizedBlock.substring(cand.index);
            if (/\r?\n\s*(?:\(?B[\.\)]|\bB\.)\s+/i.test(afterCand) &&
                /\r?\n\s*(?:\(?C[\.\)]|\bC\.)\s+/i.test(afterCand) &&
                /\r?\n\s*(?:\(?D[\.\)]|\bD\.)\s+/i.test(afterCand)) {
              stemPart = normalizedBlock.substring(0, cand.index).trim();
              optionsPart = normalizedBlock.substring(cand.index).trim();
              break;
            }
          }
        }
      }

      if (optionsPart) {
        const optSplit = ('\n' + optionsPart).split(/\r?\n\s*([A-D])[\.\)]\s+/);
        for (let i = 1; i < optSplit.length; i += 2) {
          const letter = (optSplit[i] || '').toUpperCase();
          const text = optSplit[i + 1] ? optSplit[i + 1].trim() : '';
          if (['A', 'B', 'C', 'D'].includes(letter)) {
            options[letter] = text;
          }
        }
      }

      // Fallback
      if (!options.A || !options.B) {
        const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
        lines.forEach(line => {
          const optMatch = line.match(/^([A-D])\.\s*(.+)$/i);
          if (optMatch) {
            options[optMatch[1].toUpperCase()] = optMatch[2].trim();
          }
        });
      }

      let stem = stemPart.trim();

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

    // Check if this chapter is scheduled on today's reading plan or in the backlog
    const planStatus = getChapterReadingPlanStatus(topicInfo.subject, topicInfo.topic);
    if (planStatus) {
      const banner = document.createElement('div');
      banner.id = 'st-chapter-plan-banner';
      if (planStatus.status === 'today') {
        if (planStatus.isAchieved) {
          banner.className = 'st-chapter-plan-banner is-cleared';
          banner.innerHTML = `
            <span>✅ <strong>Completed in Today's Reading Plan</strong> (${formatPlannerDateDisplay(planStatus.plannedDate)})</span>
          `;
        } else {
          banner.className = 'st-chapter-plan-banner is-today';
          banner.innerHTML = `
            <span>🎯 <strong>Scheduled in Today's Reading Plan</strong> &bull; Target: Till Midnight 11:59 PM</span>
            <button type="button" class="st-act-btn is-success" id="st-banner-mark-read" style="padding:0.25rem 0.65rem; font-size:0.75rem;">
              Mark Read Now (+1)
            </button>
          `;
        }
      } else if (planStatus.status === 'backlog') {
        banner.className = 'st-chapter-plan-banner is-backlog';
        banner.innerHTML = `
          <span>⚠️ <strong>In Your Study Backlog</strong> &bull; Planned on ${planStatus.plannedDate} (${planStatus.daysOverdue} day${planStatus.daysOverdue === 1 ? '' : 's'} overdue)</span>
          <button type="button" class="st-act-btn is-success" id="st-banner-mark-read" style="padding:0.25rem 0.65rem; font-size:0.75rem;">
            Clear from Backlog (+1 Read)
          </button>
        `;
      }
      h1.insertAdjacentElement('afterend', banner);
      banner.querySelector('#st-banner-mark-read')?.addEventListener('click', () => {
        const plusOneBtn = document.getElementById('st-btn-plus-one');
        if (plusOneBtn) plusOneBtn.click();
      });
    }

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

  // Quick 1-click +1 Read handler
  async function handleQuickPlusOne(topicInfo) {
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

      const hText = h.textContent.replace(/¶/g, '').trim().toLowerCase();
      
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
        badge.title = `Automatic Weak Area: You made ${mistakesCount} mistake(s) here in recent tests. Prioritize active recall!`;
        badge.innerHTML = `⚠️ Focus Area (${mistakesCount} Mistake${mistakesCount > 1 ? 's' : ''})`;
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
          <button type="button" class="st-subtopic-tag" data-subtopic="${encodeURIComponent(ws.subtopic)}" title="Click to jump to this subtopic section in notes">
            ⚠️ ${escapeHtml(displayName)} <strong>(${count} Miss${count > 1 ? 'es' : ''})</strong> ➔
          </button>
        `;
      }).join('');

      chipsContainer.querySelectorAll('.st-subtopic-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
          const sub = decodeURIComponent(e.currentTarget.getAttribute('data-subtopic') || '');
          scrollToSubtopicHeading(sub);
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
        const res = await authFetch(`${API_BASE}/chapter-questions?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}&shuffle=true`);
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
    function startActiveQuiz() {
      testStartTime = Date.now();
      currentQuestionIndex = 0;
      selectedAnswers = {};
      flaggedQuestions = {};
      visitedQuestions = {};

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
                <div class="st-q-stem-text">${q.stem}</div>
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
                      <span class="st-opt-text">${optText}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Practice Mode Instant Explanation -->
              ${testMode === 'practice' && userChoice ? `
                <div class="st-practice-explanation">
                  <h4>${userChoice === q.correct_answer ? '🟢 Correct Answer!' : '🔴 Incorrect!'}</h4>
                  <div>${q.explanation || 'Answer: ' + q.correct_answer}</div>
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
          renderQuestionView();
        });
      });

      // Clear Choice
      document.getElementById('st-btn-clear-choice')?.addEventListener('click', () => {
        delete selectedAnswers[q.q_id];
        renderQuestionView();
      });

      // Toggle Flag
      document.getElementById('st-btn-toggle-flag')?.addEventListener('click', () => {
        if (flaggedQuestions[q.q_id]) {
          delete flaggedQuestions[q.q_id];
        } else {
          flaggedQuestions[q.q_id] = true;
        }
        renderQuestionView();
      });

      // Palette Jump Clicks
      document.querySelectorAll('.st-palette-item').forEach(btn => {
        btn.addEventListener('click', () => {
          currentQuestionIndex = Number(btn.dataset.idx);
          renderQuestionView();
        });
      });

      // Navigation
      document.getElementById('st-quiz-prev')?.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          renderQuestionView();
        }
      });

      document.getElementById('st-quiz-next')?.addEventListener('click', () => {
        if (currentQuestionIndex < total - 1) {
          currentQuestionIndex++;
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
            topic: topicInfo.topic,
            topic_title: topicInfo.title,
            time_spent_seconds: totalTimeSec,
            test_mode: testMode === 'exam' ? 'Live Exam CBT' : 'Practice Drill',
            answers: selectedAnswers
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
              q_num: idx + 1,
              stem: q.stem,
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
            time_spent_seconds: totalTimeSec,
            wrong_questions: wrongList,
            date: new Date().toISOString()
          }
        };
      }

      const sc = evaluationData.scorecard;
      if (evaluationData.detailed_review && evaluationData.detailed_review.length > 0) {
        sc.detailed_review = evaluationData.detailed_review;
      }
      saveLocalTestAttempt(topicInfo.subject, topicInfo.topic, sc);
      refreshPastScoresBadge(topicInfo);

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
            <div class="st-score-label">Net Score (1/3rd Negative Marking: +1.33 Correct, -0.44 Wrong)</div>
            <div class="st-score-acc">Accuracy: <strong>${sc.accuracy_pct}%</strong> (${sc.correct} Correct, ${sc.incorrect} Incorrect)</div>
          </div>

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
                    <div class="st-wi-stem"><strong>Q${w.q_num} ${w.section_title ? `[${escapeHtml(w.section_title)}]` : ''}:</strong> ${w.stem}</div>
                    <div class="st-wi-choices">
                      <span class="st-choice-wrong">Your Choice: <strong>${w.user_answer}</strong> ❌</span>
                      <span class="st-choice-correct">Correct Answer: <strong>${w.correct_answer}</strong> ✅</span>
                    </div>
                    ${w.explanation ? `<div class="st-wi-expl">${w.explanation}</div>` : ''}
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
                    <div class="st-wi-stem"><strong>Q${idx + 1}:</strong> ${q.stem}</div>
                    <div class="st-wi-choices">
                      <span>Your Choice: <strong>${uAns || 'Unattempted'}</strong> ${isCor ? '✅' : (uAns ? '❌' : '⚪')}</span>
                      <span class="st-choice-correct">Correct Answer: <strong>${q.correct_answer}</strong> ✅</span>
                    </div>
                    ${q.explanation ? `<div class="st-wi-expl">${q.explanation}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Actions -->
          <div class="st-form-actions" style="margin-top: 1.5rem;">
            <button type="button" class="st-btn st-btn-outline" id="st-close-scorecard">Close & Back to Notes</button>
            <button type="button" class="st-btn st-btn-primary" id="st-retake-test">🔄 Retake Test</button>
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

                  <div class="st-detail-qstem">${escapeHtml(q.stem)}</div>

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
                      <strong>💡 Logic & Explanation:</strong><br/>
                      ${escapeHtml(q.explanation).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
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

                  <div class="st-detail-qstem">${escapeHtml(w.stem)}</div>

                  <div class="st-detail-answer-bar">
                    <span style="color:#ef4444;">Your Choice: <strong>${escapeHtml(w.user_answer || 'None')}</strong> ❌</span>
                    <span style="color:#10b981;">Correct Answer: <strong>${escapeHtml(w.correct_answer)}</strong> ✅</span>
                  </div>

                  ${w.explanation ? `
                    <div class="st-detail-expl-box">
                      <strong>💡 Logic & Solution:</strong><br/>
                      ${escapeHtml(w.explanation).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
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
    const priorityInfo = getChapterPriority(topicInfo.subject, topicInfo.topic);

    showModal(`⚠️ Trap Radar & Mistake Vault: ${topicInfo.title}`, `
      <div class="st-loading-spinner" style="padding: 2.5rem 1rem;">
        <div class="st-spinner"></div>
        <p style="margin-top:0.75rem;"><strong>Scanning recurring trap questions...</strong></p>
        <small style="color: var(--md-default-fg-color--light);">Cross-referencing your test attempts in MongoDB Atlas</small>
      </div>
    `);

    let data = testData || window.__TOPIC_PAST_TESTS__;
    if (!data) {
      try {
        const res = await authFetch(`${API_BASE}/chapter-tests?subject=${encodeURIComponent(topicInfo.subject)}&topic=${encodeURIComponent(topicInfo.topic)}`);
        if (res.ok) {
          data = await res.json();
          window.__TOPIC_PAST_TESTS__ = data;
        }
      } catch (err) {
        console.warn('Failed to load past test traps:', err);
      }
    }

    const localTests = getLocalTopicTests(topicInfo.subject, topicInfo.topic);
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

    // Auto-enrich any trap questions that lack options by fetching full question bank
    const missingOptionTraps = trapQuestions.filter(t => !t.options && t.q_id);
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
                if (!t.options) t.options = fullQ.options;
                if (!t.explanation && fullQ.explanation) t.explanation = fullQ.explanation;
                if (!t.correct_answer && fullQ.correct_answer) t.correct_answer = fullQ.correct_answer;
                if (!t.stem && fullQ.stem) t.stem = fullQ.stem;
              }
            });
          }
        }
      } catch (err) {}
    }

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
            const hasOptionsObj = q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0;
            const userPick = (q.user_answer || '').toUpperCase().trim();
            const correctAns = (q.correct_answer || '').toUpperCase().trim();
            const missCount = q.times_missed || 1;
            const stemText = (q.stem && String(q.stem).trim())
              || (q.q_header && String(q.q_header).trim())
              || 'Stem not saved for this trap — open Practice to reload.';

            let optionsHtml = '';
            if (hasOptionsObj) {
              optionsHtml = '<div class="st-trap-options-grid">' + Object.entries(q.options).map(([optKey, optVal]) => {
                const k = optKey.toUpperCase();
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
                + '<div style="font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.04em;color:#6366f1;margin-bottom:0.35rem;">💡 Explanation</div>'
                + '<div>' + escapeHtml(q.explanation).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') + '</div>'
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
  function openChapterLogsModal(topicInfo) {
    const localData = getLocalTopicData(topicInfo.subject, topicInfo.topic);
    const liveData = window.__TOPIC_LIVE_DATA__;

    let logsList = [];
    if (liveData && liveData.recent_revisions && liveData.recent_revisions.length > 0) {
      logsList = liveData.recent_revisions.map((r) => ({
        date: r.date,
        stage: `Revision #${r.revision_number}`,
        confidence: r.confidence,
        notes: r.notes
      }));
    } else if (localData && localData.logs) {
      logsList = localData.logs;
    }

    const totalRead = liveData?.revision_count || localData?.read_count || 0;

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
          <button type="button" class="st-subtab is-active" id="tab-btn-logs">📜 View Reading Logs (${logsList.length})</button>
          <button type="button" class="st-subtab" id="tab-btn-form">📝 Update Reading Form</button>
        </div>

        <div id="subtab-logs-content">
          ${logsList.length === 0 ? `
            <div class="st-empty-state">
              📖 No reading sessions recorded yet.<br/>
              Click <strong>➕ Mark +1 Read</strong> at the top of the chapter, or use the form tab!
            </div>
          ` : `
            <div class="st-logs-timeline">
              ${logsList.map((log, idx) => `
                <div class="st-timeline-item">
                  <div class="st-tl-header">
                    <span class="st-tl-stage">${log.stage || `Read #${logsList.length - idx}`}</span>
                    <span class="st-tl-stars">${'★'.repeat(log.confidence || 3)}</span>
                    <span class="st-tl-date">${formatDate(log.date)} (${timeAgo(log.date)})</span>
                  </div>
                  ${log.notes ? `<div class="st-tl-notes">"${log.notes}"</div>` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>

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
    const tabForm = document.getElementById('tab-btn-form');
    const contentLogs = document.getElementById('subtab-logs-content');
    const contentForm = document.getElementById('subtab-form-content');

    tabLogs?.addEventListener('click', () => {
      tabLogs.classList.add('is-active');
      tabForm.classList.remove('is-active');
      if (contentLogs) contentLogs.style.display = 'block';
      if (contentForm) contentForm.style.display = 'none';
    });

    tabForm?.addEventListener('click', () => {
      tabForm.classList.add('is-active');
      tabLogs.classList.remove('is-active');
      if (contentForm) contentForm.style.display = 'block';
      if (contentLogs) contentLogs.style.display = 'none';
    });

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
  // 5. MODAL SYSTEM
  // -------------------------------------------------------------
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
        if (e.target === overlay) closeModal();
      });
      document.getElementById('st-modal-close')?.addEventListener('click', closeModal);
    }
    return overlay;
  }

  function closeModal() {
    const overlay = document.getElementById('st-modal-overlay');
    if (overlay) overlay.style.display = 'none';
    const box = document.getElementById('st-modal-box');
    if (box) box.classList.remove('st-modal-wide');
  }

  function showModal(title, contentHtml) {
    const overlay = getOrCreateModal();
    document.getElementById('st-modal-title').textContent = title;
    document.getElementById('st-modal-body').innerHTML = contentHtml;
    overlay.style.display = 'flex';
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
        openChapterLogsModal({
          subject: subject,
          topic: topic,
          title: titleEl.textContent.trim()
        });
      });

      titleEl.insertAdjacentElement('afterend', badge);
    });
  }

  // -------------------------------------------------------------
  // 7. PREP TRACKER & ANALYTICS DASHBOARD (/tracker-dashboard/)
  // -------------------------------------------------------------
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

    // Focus Studio Analytics computation
    const dailyStudyChapters = dailyStudyRecord.chapters || {};
    const studiedChaptersList = Object.values(dailyStudyChapters).sort((a, b) => (b.seconds || 0) - (a.seconds || 0));
    const deepWorkChapters = studiedChaptersList.filter(c => (c.seconds || 0) >= 1500); // >= 25 mins

    // Time leakage diagnostics: planned chapters for this date with < 60s read
    const unopenedPlannedTargets = readingTopics.filter(t => {
      const sec = getTodayChapterStudySeconds(t.subject, t.topic, activePlannerDate);
      return sec < 60;
    });

    // Subject focus distribution map
    const subjectDistribution = {};
    studiedChaptersList.forEach(c => {
      const sub = (c.subject || 'other').toLowerCase();
      subjectDistribution[sub] = (subjectDistribution[sub] || 0) + (c.seconds || 0);
    });

    const subColorPalette = {
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
      'current affairs': '#e11d48',
      'csat': '#64748b'
    };

    function renderSubjectDistSegmentsHtml(distMap, totalSec) {
      if (!totalSec || totalSec <= 0) return '';
      return Object.keys(distMap).map(sub => {
        const sec = distMap[sub];
        const pct = Math.max(1, Math.round((sec / totalSec) * 100));
        const color = subColorPalette[sub.toLowerCase()] || '#6366f1';
        return `<div class="st-focus-dist-segment" style="width:${pct}%; background:${color};" title="${escapeHtml(sub)}: ${formatDurationDisplay(sec)} (${pct}%)"></div>`;
      }).join('');
    }

    function renderSubjectDistLegendHtml(distMap, totalSec) {
      if (!totalSec || totalSec <= 0) return '';
      return Object.keys(distMap).map(sub => {
        const sec = distMap[sub];
        const pct = Math.max(1, Math.round((sec / totalSec) * 100));
        const color = subColorPalette[sub.toLowerCase()] || '#6366f1';
        return `
          <div class="st-dist-legend-item">
            <span class="st-dist-dot" style="background:${color};"></span>
            <span style="text-transform:capitalize;">${escapeHtml(sub)}</span>
            <strong style="color:var(--md-primary-fg-color, #273c75);">${formatDurationDisplay(sec)}</strong>
            <span style="color:var(--md-default-fg-color--light); font-size:0.68rem;">(${pct}%)</span>
          </div>
        `;
      }).join('');
    }

    const isPastDate = activePlannerDate < getTodayISODate();

    // Active targets for active date (active during today/future; on past dates they move to Backlog)
    const midnightTargets = readingTopics.filter(t => (t.slot === 'midnight_slot' || t.slot === 'all_day' || t.slot === 'morning_12pm' || !t.slot) && t.status !== 'achieved' && !isPastDate);
    // Evening / Afternoon targets
    const eveningTargets = readingTopics.filter(t => t.slot === 'evening' && t.status !== 'achieved' && !isPastDate);
    // Achieved on this date
    const achievedTopics = readingTopics.filter(t => t.status === 'achieved');
    // Backlog on this date (uncompleted items from any slot after 11:59 PM or marked pending)
    const dateBacklogTopics = readingTopics.filter(t => t.status !== 'achieved' && (t.missed_12pm || t.missed_midnight || t.slot === 'pending' || isPastDate));

    // Overall Cumulative Backlog (all past unachieved topics)
    const rawOverallBacklog = (serverBacklog && Array.isArray(serverBacklog.backlog))
      ? serverBacklog.backlog
      : getOverallBacklogFromLocal();
    const overallBacklog = rawOverallBacklog.filter(t => t.status !== 'achieved');

    // 9-Day Calendar navigation strip
    const calendarDays = getCalendarDaysList(activePlannerDate);
    const midnightCountdownStr = getMidnightRemainingStr();

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

    // Fallback stats
    const isOnline = !!summary;
    const localLogs = getLocalLogs();
    const localTests = getLocalTests();
    const allLocalTests = Object.values(localTests).flat();

    const totalRevs = summary ? summary.total_revisions : Object.values(localLogs).reduce((a, b) => a + (b.read_count || 0), 0);
    const dueCount = summary ? summary.revisions_due_today : 0;
    const totalTests = summary ? summary.total_tests : allLocalTests.length;
    const avgTestScore = summary ? summary.avg_test_score : (totalTests > 0 ? (allLocalTests.reduce((a, b) => a + (b.net_marks || 0), 0) / totalTests).toFixed(2) : 0);
    const avgTestAccuracy = summary ? summary.avg_test_accuracy : (totalTests > 0 ? (allLocalTests.reduce((a, b) => a + (Number(b.accuracy_pct) || 0), 0) / totalTests).toFixed(1) : 0);
    const totalPyqs = summary ? summary.total_pyqs_practiced : 0;
    const pyqAccuracy = summary ? summary.overall_pyq_accuracy : 0;
    const recentTests = summary?.recent_tests || allLocalTests.slice(0, 10);
    const subjects = summary?.subject_breakdown || [];

    const html = `
      <div class="st-dash-root">
        <!-- Banner -->
        <div class="st-dash-banner">
          <div class="st-dash-banner-left">
            <span class="st-server-pill ${isOnline ? 'is-online' : 'is-offline'}">
              ${isOnline ? '🟢 Connected to MongoDB Atlas' : '🔴 Server Offline (Local Storage Mode)'}
            </span>
            <span style="font-size: 0.8rem; color: var(--md-default-fg-color--light); margin-left: 0.5rem;">
              Database: <strong>uppcs_study_tracker</strong>
            </span>
          </div>
          <div class="st-dash-banner-right" style="display:flex; gap:0.5rem;">
            <button type="button" class="st-btn st-btn-outline" id="st-dash-refresh" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
              🔄 Refresh Stats
            </button>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="st-dash-kpis">
          <div class="st-kpi-card">
            <div class="st-kpi-label">📖 Total Chapter Revisions</div>
            <div class="st-kpi-val">${totalRevs} <small>logs</small></div>
            <div class="st-kpi-sub">Spaced repetition tracking active</div>
          </div>

          <div class="st-kpi-card ${dueCount > 0 ? 'st-kpi-highlight' : ''}">
            <div class="st-kpi-label">⏰ Due Today</div>
            <div class="st-kpi-val" style="${dueCount > 0 ? 'color: #ef4444;' : ''}">${dueCount} <small>chapters</small></div>
            <div class="st-kpi-sub">${dueCount > 0 ? '⚠️ Revisions waiting in queue' : '✅ All caught up today!'}</div>
          </div>

          <div class="st-kpi-card">
            <div class="st-kpi-label">🎯 Tests Given & Accuracy</div>
            <div class="st-kpi-val">${totalTests} <small>tests</small></div>
            <div class="st-kpi-sub">Avg Marks: <strong>${avgTestScore}</strong> | Acc: <strong>${avgTestAccuracy}%</strong></div>
          </div>

          <div class="st-kpi-card">
            <div class="st-kpi-label">📚 Question Bank Practiced</div>
            <div class="st-kpi-val">${totalPyqs} <small>questions</small></div>
            <div class="st-kpi-sub">Overall PYQ Accuracy: <strong>${pyqAccuracy}%</strong></div>
          </div>
        </div>

        <!-- ============================================================= -->
        <!-- EXECUTIVE STUDY TIME MONITORING & FOCUS RADAR STUDIO -->
        <!-- ============================================================= -->
        <div class="st-focus-studio-card">
          <div class="st-focus-studio-header">
            <div class="st-focus-title-group">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="st-focus-icon-pill">⏱️</span>
                <h3 style="margin:0; font-size:1.15rem; font-weight:800;">Study Time & Focus Analytics Studio</h3>
                <span class="st-focus-live-pill">⚡ Live Session Radar</span>
              </div>
              <p style="margin:0.25rem 0 0; font-size:0.8rem; color:var(--md-default-fg-color--light);">
                Active stopwatch focus analytics for <strong>${formatPlannerDateDisplay(activePlannerDate)}</strong>. Monitors deep work chapters, pace velocity, and time leakage.
              </p>
            </div>
            <div class="st-focus-header-meta">
              <span class="st-focus-goal-badge">
                🎯 Daily Target: 4h 00m &bull; ${Math.min(100, Math.round((totalDayStudySeconds / 14400) * 100))}% Reached
              </span>
            </div>
          </div>

          <!-- 4 Executive Focus KPI Cards -->
          <div class="st-focus-kpi-deck">
            <!-- Card 1: Total Study Time -->
            <div class="st-focus-kpi-item">
              <div class="st-fkpi-top">
                <span class="st-fkpi-icon" style="background: rgba(99, 102, 241, 0.15); color: #6366f1;">⏱️</span>
                <span class="st-fkpi-label">Focused Study Today</span>
              </div>
              <div class="st-fkpi-val">${formatDurationDisplay(totalDayStudySeconds)}</div>
              <div class="st-fkpi-sub">
                <div class="st-fkpi-prog-track">
                  <div class="st-fkpi-prog-fill" style="width: ${Math.min(100, Math.round((totalDayStudySeconds / 14400) * 100))}%;"></div>
                </div>
                <span>${totalDayStudySeconds > 0 ? `${Math.round(totalDayStudySeconds / 60)} mins active reading` : 'No reading sessions logged yet'}</span>
              </div>
            </div>

            <!-- Card 2: Deep Work Chapters -->
            <div class="st-focus-kpi-item">
              <div class="st-fkpi-top">
                <span class="st-fkpi-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">⚡</span>
                <span class="st-fkpi-label">Deep Work Chapters</span>
              </div>
              <div class="st-fkpi-val">${deepWorkChapters.length} <small>chapters</small></div>
              <div class="st-fkpi-sub">
                ${deepWorkChapters.length > 0 ? `🔥 &ge;25m intensive reading` : 'Aim for 25m+ deep reading sessions'}
              </div>
            </div>

            <!-- Card 3: Active Chapters Read -->
            <div class="st-focus-kpi-item">
              <div class="st-fkpi-top">
                <span class="st-fkpi-icon" style="background: rgba(14, 165, 233, 0.15); color: #0ea5e9;">📖</span>
                <span class="st-fkpi-label">Chapters Studied</span>
              </div>
              <div class="st-fkpi-val">${studiedChaptersList.length} <small>/ ${readingTopics.length} planned</small></div>
              <div class="st-fkpi-sub">
                ${readingTopics.length > 0 ? `${Math.round((studiedChaptersList.length / Math.max(1, readingTopics.length)) * 100)}% coverage of planned targets` : 'Add chapters to your daily plan'}
              </div>
            </div>

            <!-- Card 4: Time Leakage & Backlog Radar -->
            <div class="st-focus-kpi-item ${unopenedPlannedTargets.length > 0 ? 'is-warning' : ''}">
              <div class="st-fkpi-top">
                <span class="st-fkpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">🛡️</span>
                <span class="st-fkpi-label">Time Leakage Radar</span>
              </div>
              <div class="st-fkpi-val" style="${unopenedPlannedTargets.length > 0 ? 'color:#f59e0b;' : ''}">
                ${unopenedPlannedTargets.length} <small>unopened</small>
              </div>
              <div class="st-fkpi-sub">
                ${unopenedPlannedTargets.length > 0 ? `⚠️ ${unopenedPlannedTargets.length} planned chapters have 0m study logged!` : '✅ Zero leakage! All planned targets opened.'}
              </div>
            </div>
          </div>

          <!-- Subject Distribution Segmented Bar (if any study recorded) -->
          ${studiedChaptersList.length > 0 ? `
            <div class="st-focus-distribution-wrap">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--md-default-fg-color--light);">
                  Subject Focus Distribution
                </span>
                <span style="font-size:0.75rem; color:var(--md-default-fg-color--light);">
                  ${Object.keys(subjectDistribution).length} active subjects
                </span>
              </div>
              <div class="st-focus-dist-bar">
                ${renderSubjectDistSegmentsHtml(subjectDistribution, totalDayStudySeconds)}
              </div>
              <div class="st-focus-dist-legend">
                ${renderSubjectDistLegendHtml(subjectDistribution, totalDayStudySeconds)}
              </div>
            </div>
          ` : ''}

          <!-- Chapter Focus Log & Velocity Table / Cards -->
          <div class="st-focus-chapters-panel">
            <div class="st-focus-panel-head">
              <span style="font-size:0.85rem; font-weight:700;">📖 Chapter Reading Velocity & Time Log</span>
              <span style="font-size:0.75rem; color:var(--md-default-fg-color--light);">${studiedChaptersList.length} chapters logged</span>
            </div>
            ${studiedChaptersList.length === 0 ? `
              <div class="st-empty-focus-state">
                <span style="font-size:2rem; display:block; margin-bottom:0.35rem;">⏱️</span>
                <strong>No reading sessions logged yet for this date</strong>
                <p>Open any chapter notes in the library — your active focus stopwatch starts automatically and accumulates till 11:59 PM!</p>
              </div>
            ` : `
              <div class="st-focus-chapters-grid">
                ${studiedChaptersList.map(ch => `
                  <div class="st-fchap-card">
                    <div class="st-fchap-top">
                      <span class="st-sub-pill ${getSubjectPillClass(ch.subject)}">${ch.subject}</span>
                      <span class="st-fchap-velocity ${ch.seconds >= 1800 ? 'is-deep' : (ch.seconds >= 600 ? 'is-active' : 'is-quick')}">
                        ${ch.seconds >= 1800 ? '⚡ Deep Dive (>30m)' : (ch.seconds >= 600 ? '📖 Active Study' : '⚡ Quick Scan')}
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
            `}
          </div>

          <!-- Time Leak Diagnostics Warning (if unopened targets exist) -->
          ${unopenedPlannedTargets.length > 0 ? `
            <div class="st-focus-leak-box">
              <div class="st-leak-icon">⚠️</div>
              <div class="st-leak-content">
                <strong>Attention: Time Leakage Detected on ${unopenedPlannedTargets.length} Planned Chapters</strong>
                <p>
                  You scheduled these chapters for today, but have not opened them yet:
                  <strong>${unopenedPlannedTargets.map(t => escapeHtml(t.topic)).slice(0, 4).join(', ')}${unopenedPlannedTargets.length > 4 ? ` and ${unopenedPlannedTargets.length - 4} more` : ''}</strong>.
                  Conquer them before 11:59 PM to prevent them from moving into your Cumulative Overdue Backlog!
                </p>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- DAILY TARGET PLANNER & MIDNIGHT EXECUTION HUB -->
        <div class="st-planner-section" id="st-planner-root">
          <div class="st-planner-header">
            <div class="st-planner-title-group">
              <h3>🎯 Daily Study Plan & Midnight Execution Hub</h3>
              <p>Plan your subjects & chapters, conquer targets before midnight (11:59 PM), track daily date-wise backlog, and maintain your cumulative backlog.</p>
            </div>
            <div class="st-planner-actions-bar">
              <!-- Midnight Deadline Checkpoint Badge -->
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
                  <button type="submit" class="st-btn st-btn-primary" style="padding: 0.45rem 1rem; font-size: 0.82rem; white-space: nowrap;">
                    ➕ Add Target(s)
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
                            <button type="button" class="st-act-btn is-success st-topic-achieve-midnight-btn" data-id="${t.id}" title="Conquered before midnight!">
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
                            <button type="button" class="st-act-btn is-success st-topic-achieve-btn" data-id="${t.id}" title="Mark as Achieved">
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
                            <button type="button" class="st-act-btn is-success st-topic-achieve-now-btn" data-id="${t.id}" title="Mark as Achieved Now">
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

        <!-- Dashboard Tabs -->
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

      await apiAddPlannerTopicsBatch(activePlannerDate, sub, selectedChapters, slot, notes);
      renderPrepDashboard();
    });

    // Overall Backlog Item Actions
    document.querySelectorAll('.st-backlog-achieve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sub = btn.dataset.subject;
        const topic = btn.dataset.topic;
        const id = btn.dataset.id;
        const date = btn.dataset.date;
        await apiResolveTopicEverywhere(sub, topic);
        if (date) {
          await apiUpdatePlannerTopic(date, id, { status: 'achieved', achieved_by_12pm: false });
        }
        alert(`🎉 Mark read! Cleared "${topic}" from backlog.`);
        renderPrepDashboard();
      });
    });

    document.querySelectorAll('.st-backlog-to-today-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const fromDate = btn.dataset.date;
        const today = getTodayISODate();
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

    // Active Date Topic Actions
    document.querySelectorAll('.st-topic-achieve-midnight-btn, .st-topic-achieve-12pm-btn, .st-topic-achieve-btn, .st-topic-achieve-now-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await apiUpdatePlannerTopic(activePlannerDate, id, {
          status: 'achieved',
          achieved_by_12pm: true,
          missed_12pm: false
        });
        renderPrepDashboard();
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
