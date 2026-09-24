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
  const API_BASE = 'http://localhost:5000/api';
  const LOCAL_STORAGE_KEY = 'uppcs_study_logs_v1';
  const LOCAL_TESTS_KEY = 'uppcs_chapter_tests_v1';
  const AUTH_STORAGE_KEY = 'uppcs_vault_auth_token_v1';

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

  function formatDate(d) {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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

      // Parse options A, B, C, D
      const options = { A: '', B: '', C: '', D: '' };
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      
      lines.forEach(line => {
        const optMatch = line.match(/^([A-D])\.\s*(.+)$/i);
        if (optMatch) {
          options[optMatch[1].toUpperCase()] = optMatch[2].trim();
        }
      });

      // If options were not found via line splits, look in combined text
      if (!options.A || !options.B) {
        const regexOpt = /([A-D])\.\s*([^A-D\n]+)/g;
        let m;
        while ((m = regexOpt.exec(rawText)) !== null) {
          options[m[1].toUpperCase()] = m[2].trim();
        }
      }

      // Extract stem: everything before option A
      let stem = rawText;
      const optAIndex = stem.search(/\bA\.\s+/);
      if (optAIndex > 0) {
        stem = stem.substring(0, optAIndex).trim();
      }

      // Clean up stem question number
      const qNumMatch = stem.match(/Q(?:uestion)?\s*(\d+)/i);
      const qNum = qNumMatch ? qNumMatch[1] : (index + 1);

      questions.push({
        id: `q_${index + 1}`,
        q_num: qNum,
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
            ➕ Mark +1 Read
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-quick-update" title="View all logs & notes">
            📜 Logs
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
          <span class="st-kpi-badge st-badge-neutral" id="st-kpi-attempts-badge">0 Tests</span>
        </div>
        <div class="st-kpi-val" id="st-kpi-score-val">—</div>
        <div class="st-kpi-sub" id="st-kpi-score-sub">Take first live test</div>
        <div class="st-kpi-actions">
          <button type="button" class="st-kpi-btn st-kpi-btn-accent" id="st-btn-start-test">
            🚀 Live Test
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-view-scores" title="View past scores history">
            📊 Past Scores <span class="st-score-pill" id="st-scores-badge">0</span>
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
        <div class="st-kpi-val" id="st-kpi-bank-val">... Qs</div>
        <div class="st-kpi-sub" id="st-kpi-bank-sub">Mapped PYQs & Ghatnachakra</div>
        <div class="st-kpi-actions">
          <button type="button" class="st-kpi-btn st-kpi-btn-outline" id="st-btn-quick-10" title="Launch a quick 10 questions test drill">
            ⚡ Quick 10 Drill
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-all-questions" title="Launch full chapter practice">
            Full Exam
          </button>
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-sync-questions" title="Sync newly added questions from this chapter note to MongoDB Atlas">
            🔄 Sync DB
          </button>
        </div>
      </div>

      <!-- KPI Card 4: Accuracy & Trap Radar -->
      <div class="st-kpi-card" id="st-kpi-radar">
        <div class="st-kpi-header">
          <div class="st-kpi-title-wrap">
            <span class="st-kpi-icon">🧠</span>
            <span class="st-kpi-label">Accuracy & Traps</span>
          </div>
          <span class="st-kpi-badge st-badge-indigo" id="st-kpi-acc-badge">Target: 80%+</span>
        </div>
        <div class="st-kpi-val" id="st-kpi-acc-val">—%</div>
        <div class="st-kpi-sub" id="st-kpi-acc-sub">1/3rd Negative Marking Evaluated</div>
        <div class="st-kpi-actions">
          <button type="button" class="st-kpi-btn st-kpi-btn-ghost" id="st-btn-view-mistakes" title="Review questions answered wrong">
            ⚠️ Trap Radar
          </button>
          <span class="st-mongo-status is-connected" id="st-mongo-status" title="MongoDB Connection Status" style="margin-left:auto;">● Atlas</span>
        </div>
      </div>
    `;

    h1.insertAdjacentElement('afterend', deck);

    // Event listeners
    document.getElementById('st-btn-plus-one')?.addEventListener('click', () => handleQuickPlusOne(topicInfo));
    document.getElementById('st-btn-quick-update')?.addEventListener('click', () => openChapterLogsModal(topicInfo));
    document.getElementById('st-btn-start-test')?.addEventListener('click', () => openTestEngineModal(topicInfo));
    document.getElementById('st-btn-all-questions')?.addEventListener('click', () => openTestEngineModal(topicInfo));
    document.getElementById('st-btn-quick-10')?.addEventListener('click', () => openTestEngineModal(topicInfo, { autoStartCount: 10 }));
    document.getElementById('st-btn-view-scores')?.addEventListener('click', () => openPastScoresModal(topicInfo));
    document.getElementById('st-btn-view-mistakes')?.addEventListener('click', () => openPastScoresModal(topicInfo));

    // Sync DB button listener
    document.getElementById('st-btn-sync-questions')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '🔄 Syncing...';
      try {
        const res = await authFetch(`${API_BASE}/sync-questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: topicInfo.subject, chapter: topicInfo.topic })
        });
        const data = await res.json();
        if (res.ok) {
          alert(`✅ Synced! ${data.count || 0} questions saved to MongoDB Atlas for ${topicInfo.title}`);
          refreshChapterQuestionCount(topicInfo);
        } else {
          alert(`⚠️ Sync notice: ${data.error || 'Failed to sync'}`);
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
      btn.textContent = '✅ Read Marked!';
      setTimeout(() => {
        btn.textContent = '➕ Mark +1 Read';
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

  // Refresh past scores & accuracy KPI card
  async function refreshPastScoresBadge(topicInfo) {
    const badge = document.getElementById('st-scores-badge');
    const attemptsBadge = document.getElementById('st-kpi-attempts-badge');
    const scoreVal = document.getElementById('st-kpi-score-val');
    const scoreSub = document.getElementById('st-kpi-score-sub');
    const accVal = document.getElementById('st-kpi-acc-val');
    const accSub = document.getElementById('st-kpi-acc-sub');
    const accBadge = document.getElementById('st-kpi-acc-badge');

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
      if (scoreVal) {
        scoreVal.innerHTML = `${latest.net_marks > 0 ? '+' : ''}${latest.net_marks} <small style="font-size:0.85rem;color:var(--md-default-fg-color--light);">/ ${latest.max_marks || latest.total_questions * 1.33}</small>`;
      }
      if (scoreSub) {
        scoreSub.textContent = `Accuracy: ${latest.accuracy_pct}% (${latest.correct}✔ / ${latest.incorrect}✖)`;
      }
      avgAccuracy = Number((localTests.reduce((acc, t) => acc + (Number(t.accuracy_pct) || 0), 0) / localTests.length).toFixed(1));
      if (accVal) accVal.textContent = `${avgAccuracy}%`;
      if (accBadge) accBadge.textContent = avgAccuracy >= 80 ? 'Mastered' : 'Progressing';
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
          if (scoreVal) {
            scoreVal.innerHTML = `${latest.net_marks > 0 ? '+' : ''}${latest.net_marks} <small style="font-size:0.85rem;color:var(--md-default-fg-color--light);">/ ${latest.max_marks || latest.total_questions * 1.33}</small>`;
          }
          if (scoreSub) {
            scoreSub.textContent = `Accuracy: ${latest.accuracy_pct}% (${latest.correct}✔ / ${latest.incorrect}✖)`;
          }

          avgAccuracy = data.summary?.avg_accuracy || (attempts.reduce((acc, t) => acc + (t.accuracy_pct || 0), 0) / attempts.length).toFixed(1);
          if (accVal) accVal.textContent = `${avgAccuracy}%`;
          if (accBadge) accBadge.textContent = avgAccuracy >= 80 ? 'Mastered' : (avgAccuracy >= 60 ? 'Strong' : 'Focus Needed');

          const wrongKeys = Object.keys(data.summary?.frequent_wrong_questions || {});
          frequentWrongCount = wrongKeys.length;
          if (accSub) {
            accSub.textContent = frequentWrongCount > 0 ? `${frequentWrongCount} recurring trap area${frequentWrongCount > 1 ? 's' : ''} detected` : 'No recurring mistakes';
          }

          window.__TOPIC_PAST_TESTS__ = data;
        }
      }
    } catch {}
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
          q_header: `Question ${idx + 1}`,
          stem: q.stem,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation_html
        }));
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
    let testMode = 'exam';      // 'exam' or 'practice'
    let questionSubset = [...loadedQuestions];
    let testStartTime = Date.now();
    let timerInterval = null;

    // Question Categorization Helper
    function categorizeQuestion(q) {
      const header = (q.q_header || '').toLowerCase();
      const stem = (q.stem || '').toLowerCase();

      // Practice Zone / in-note drills
      if (header.includes('practice') || stem.includes('practice zone') || header.includes('drill') || header.includes('exercise')) {
        return 'practice';
      }
      // Official UPPCS & State PSC past year questions
      if (header.includes('inline pyq') || header.includes('uppcs') || header.includes('ukpcs') || header.includes('ro/aro') || (header.includes('pyq') && !header.includes('gc'))) {
        return 'pyqs';
      }
      // Ghatnachakra question bank & all state PSCs
      if (header.includes('gc') || header.includes('ghatna') || header.match(/\bq\s*[-–—]?\s*\d+/i) || header.match(/(ias|bpsc|mppcs|cgpcs|ras|jpsc|upsc)/i)) {
        return 'ghatnachakra';
      }
      return 'other';
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

          <div class="st-form-actions">
            <button type="button" class="st-btn-outline" id="st-cancel-test-launch">Cancel</button>
            <button type="button" class="st-btn-primary" id="st-btn-begin-test">
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
      saveLocalTestAttempt(topicInfo.subject, topicInfo.topic, sc);
      refreshPastScoresBadge(topicInfo);

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
                    <div class="st-wi-stem"><strong>Q${w.q_num}:</strong> ${w.stem}</div>
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
      questionSubset = loadedQuestions.slice(0, Number(testOptions.autoStartCount));
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
            <h4>Past Scorecard History</h4>
            ${attempts.map((att, idx) => `
              <div class="st-test-history-row">
                <div class="st-thr-left">
                  <strong>Attempt #${attempts.length - idx}</strong>
                  <span class="st-thr-date">${formatDate(att.date)} (${timeAgo(att.date)})</span>
                </div>
                <div class="st-thr-stats">
                  <span class="st-thr-score">Marks: <strong>${att.net_marks > 0 ? '+' : ''}${att.net_marks}</strong></span>
                  <span class="st-thr-acc">Accuracy: <strong>${att.accuracy_pct}%</strong></span>
                  <span class="st-thr-breakdown">${att.correct} ✔ / ${att.incorrect} ✖ (${att.unattempted} left)</span>
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

    const localLogs = getLocalLogs();

    rows.forEach((row) => {
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
  // 7. MkDocs Material Life-Cycle Bootstrapper
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
  };

  if (typeof document$ !== 'undefined') {
    document$.subscribe(boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
