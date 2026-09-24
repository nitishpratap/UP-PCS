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
  // 1. INJECT IN-CHAPTER TRACKER BAR & QUICK CONTROLS
  // -------------------------------------------------------------
  async function injectSubjectNoteWidget() {
    const topicInfo = getCurrentTopicInfo();
    if (!topicInfo) return;

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

    // 1. Update local cache immediately
    saveLocalLog(topicInfo.subject, topicInfo.topic, {
      topic_title: topicInfo.title,
      stage: 'Revision',
      confidence: 4,
      notes: `Quick read marked (+1) on ${formatDate(new Date())}`
    });

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

    const modalBox = document.getElementById('st-modal-box');
    if (modalBox) modalBox.classList.add('st-modal-wide');

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

    // Build the Trap Radar UI
    const html = `
      <div class="st-trap-modal-card">
        <div class="st-trap-header-bar">
          <div class="st-trap-header-left">
            <span class="st-trap-summary-pill">
              ${trapQuestions.length} recurring trap${trapQuestions.length > 1 ? 's' : ''}
            </span>
            <span class="st-kpi-badge ${priorityInfo.badgeClass}" style="font-size:0.76rem;">
              Target: ${priorityInfo.targetAccuracy}% (${priorityInfo.label})
            </span>
          </div>
          <button type="button" class="st-trap-drill-all-btn" id="st-btn-drill-all-traps" title="Launch practice drill on these trap questions">
            Drill All ${trapQuestions.length}
          </button>
        </div>

        <div class="st-trap-toolbar">
          <input type="search" class="st-trap-search" id="st-trap-search-input" placeholder="Filter by keyword, subtopic, or stem…" autocomplete="off" />
          <span class="st-trap-count-label">Showing <strong id="st-trap-visible-count">${trapQuestions.length}</strong></span>
        </div>

        <div class="st-trap-list" id="st-trap-cards-container">
          ${trapQuestions.map((q, idx) => {
            const hasOptionsObj = q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0;
            const userPick = (q.user_answer || '').toUpperCase().trim();
            const correctAns = (q.correct_answer || '').toUpperCase().trim();
            const missCount = q.times_missed || 1;

            return `
              <div class="st-trap-card" data-stem="${escapeHtml((q.stem || '') + ' ' + (q.section_title || '') + ' ' + (q.q_header || '')).toLowerCase()}">
                <div class="st-trap-card-meta">
                  <div class="st-trap-meta-left">
                    <span class="st-trap-tag-num">#${idx + 1}</span>
                    ${q.section_title ? `
                      <span class="st-trap-tag-subtopic" data-section="${escapeHtml(q.section_title)}" title="Jump to this heading in the notes">
                        ${escapeHtml(q.section_title)}
                      </span>
                    ` : ''}
                    ${q.q_header ? `<small>${escapeHtml(q.q_header)}</small>` : ''}
                  </div>
                  <span class="st-trap-miss-pill" title="Missed in ${missCount} test attempt${missCount > 1 ? 's' : ''}">
                    Missed ×${missCount}
                  </span>
                </div>

                <div class="st-trap-stem">${escapeHtml(q.stem || 'Question content')}</div>

                ${hasOptionsObj ? `
                  <div class="st-trap-options-grid">
                    ${Object.entries(q.options).map(([optKey, optVal]) => {
                      const k = optKey.toUpperCase();
                      const isUserWrong = (k === userPick && userPick !== correctAns);
                      const isCorrect = (k === correctAns);
                      let optClass = '';
                      let badge = '';
                      if (isUserWrong) {
                        optClass = 'st-trap-opt-is-user-wrong';
                        badge = '<span class="st-trap-opt-badge is-wrong">Your pick</span>';
                      } else if (isCorrect) {
                        optClass = 'st-trap-opt-is-correct';
                        badge = '<span class="st-trap-opt-badge is-correct">Correct</span>';
                      }

                      return `
                        <div class="st-trap-option-item ${optClass}">
                          <div class="st-trap-opt-letter">${k}</div>
                          <div class="st-trap-opt-text">${escapeHtml(optVal)}</div>
                          ${badge}
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : `
                  <div class="st-detail-answer-bar" style="margin-bottom:0.85rem;">
                    <span style="color:#ef4444;">Your attempt: <strong>${escapeHtml(userPick || 'None')}</strong></span>
                    <span style="color:#10b981;">Correct: <strong>Option ${escapeHtml(correctAns)}</strong></span>
                  </div>
                `}

                ${q.explanation ? `
                  <details class="st-trap-expl-details">
                    <summary>Show explanation</summary>
                    <div class="st-trap-expl-card">
                      ${escapeHtml(q.explanation).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                    </div>
                  </details>
                ` : ''}

                <div class="st-trap-actions">
                  ${q.section_title ? `
                    <button type="button" class="st-trap-action-btn st-jump-btn" data-section="${escapeHtml(q.section_title)}">
                      Jump to notes
                    </button>
                  ` : ''}
                  <button type="button" class="st-trap-action-btn st-drill-single-btn" data-idx="${idx}" style="color:var(--md-primary-fg-color, #273c75); font-weight:700;">
                    Practice this
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="st-trap-footer">
          <button type="button" class="st-btn st-btn-outline" id="st-trap-modal-close">Close</button>
          <button type="button" class="st-btn st-btn-primary" id="st-trap-modal-drill-bottom">
            Drill All ${trapQuestions.length}
          </button>
        </div>
      </div>
    `;

    showModal(`Trap Radar — ${topicInfo.title}`, html);

    if (modalBox) modalBox.classList.add('st-modal-wide');

    // Wire up events
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

    // Single trap drill
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

    // Jump to section in notes
    document.querySelectorAll('.st-jump-btn, .st-trap-tag-subtopic').forEach(el => {
      el.addEventListener('click', () => {
        const sec = el.getAttribute('data-section');
        if (sec) {
          closeModal();
          scrollToSubtopicHeading(sec);
        }
      });
    });

    // Search filter
    const searchInput = document.getElementById('st-trap-search-input');
    const counterEl = document.getElementById('st-trap-visible-count');
    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      let visible = 0;
      document.querySelectorAll('#st-trap-cards-container .st-trap-card').forEach(card => {
        const text = card.getAttribute('data-stem') || '';
        if (!q || text.includes(q)) {
          card.style.display = 'block';
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

    try {
      const [sumRes, dueRes, weakRes] = await Promise.all([
        authFetch(`${API_BASE}/dashboard/summary`).catch(() => null),
        authFetch(`${API_BASE}/revisions/due`).catch(() => null),
        authFetch(`${API_BASE}/weak-topics`).catch(() => null)
      ]);

      if (sumRes && sumRes.ok) summary = await sumRes.json();
      if (dueRes && dueRes.ok) dueRevisions = await dueRes.json();
      if (weakRes && weakRes.ok) weakTopics = await weakRes.json();
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    }

    // Fallback if server is not responding
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

    // Form to map new weak topic
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
