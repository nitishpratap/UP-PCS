(() => {
  const primaryClass = "study-hide-subjects";
  const secondaryClass = "study-hide-toc";
  const oneColClass = "study-recall-one-col";

  function isRecallDeck() {
    const path = decodeURIComponent(location.pathname).replace(/\/+$/, "");
    const match = path.match(/\/active-recall\/(.+)$/);
    if (!match) return false;
    const rest = match[1].split("/").filter(Boolean);
    return rest.length >= 2 && rest[rest.length - 1] !== "index";
  }

  function isFactLockSheet() {
    const path = decodeURIComponent(location.pathname).replace(/\/+$/, "");
    const match = path.match(/\/fact-locks\/(.+)$/);
    if (!match) return false;
    const rest = match[1].split("/").filter(Boolean);
    return rest.length >= 2 && rest[rest.length - 1] !== "index";
  }

  function wrapFactLockSections() {
    const sheet = document.querySelector(".fact-lock-sheet");
    if (sheet && !sheet.classList.contains("fact-lock-sheet--dense")) {
      sheet.classList.add("fact-lock-sheet--dense");
    }
    if (!sheet) return;

    const headings = [...sheet.querySelectorAll(":scope > h2")];
    headings.forEach((h2) => {
      if (h2.closest(".fact-lock-section")) return;

      const section = document.createElement("div");
      section.className = "fact-lock-section";
      h2.parentNode.insertBefore(section, h2);
      section.appendChild(h2);

      let node = section.nextSibling;
      while (node) {
        if (node.nodeType === 1 && node.tagName === "H2" && node.parentNode === sheet) break;
        const next = node.nextSibling;
        section.appendChild(node);
        node = next;
      }

      const title = (h2.textContent || "").toLowerCase();
      if (
        section.querySelector("table") ||
        section.querySelector(".fact-lock-chips") ||
        section.querySelector(".fact-lock-review") ||
        /master|must ratta|rapid ratta|final 50|table|1-minute|process|landform final|high-yield|agent →|indian geomorphology|top 50/i.test(
          title,
        )
      ) {
        section.classList.add("fact-lock-section--full");
      }
    });

    sheet.querySelectorAll(".fact-lock-traps-table, .fact-lock-answer-key").forEach((block) => {
      if (block.closest(".fact-lock-section")) return;
      const wrap = document.createElement("div");
      wrap.className = "fact-lock-section fact-lock-section--wide";
      block.parentNode.insertBefore(wrap, block);
      wrap.appendChild(block);
    });

    sheet.querySelectorAll(".fact-lock-section:has(> table)").forEach((section) => {
      section.classList.add("fact-lock-section--table");
    });
  }

  function initialiseFactLockPage() {
    if (!isFactLockSheet()) return;
    document.body.classList.add("fact-lock-page", "fact-lock-dense");
    wrapFactLockSections();
  }

  function setButtonState(button, isHidden, hiddenLabel, shownLabel) {
    button.setAttribute("aria-pressed", String(isHidden));
    button.textContent = isHidden ? shownLabel : hiddenLabel;
  }

  function isFocusMode() {
    return (
      document.body.classList.contains(primaryClass) &&
      document.body.classList.contains(secondaryClass)
    );
  }

  function updateButtons() {
    document.querySelectorAll("[data-study-toggle]").forEach((button) => {
      const type = button.dataset.studyToggle;
      const isHidden = document.body.classList.contains(
        type === "subjects" ? primaryClass : secondaryClass,
      );
      setButtonState(
        button,
        isHidden,
        type === "subjects" ? "Hide subjects" : "Hide contents",
        type === "subjects" ? "Show subjects" : "Show contents",
      );
    });

    const focusButton = document.querySelector("[data-study-reset]");
    if (focusButton) {
      setButtonState(focusButton, isFocusMode(), "Focus mode", "Exit focus");
    }

    const colsButton = document.querySelector("[data-study-cols]");
    if (colsButton) {
      setButtonState(
        colsButton,
        document.body.classList.contains(oneColClass),
        "One column",
        "Two columns",
      );
    }
  }

  function savePreference() {
    localStorage.setItem(primaryClass, String(document.body.classList.contains(primaryClass)));
    localStorage.setItem(secondaryClass, String(document.body.classList.contains(secondaryClass)));
  }

  function initialiseReadingMode() {
    if (!document.querySelector(".reading-tools")) {
      const article = document.querySelector(".md-content__inner");
      const heading = article?.querySelector("h1");
      if (!article || !heading) return;

      const tools = document.createElement("div");
      tools.className = "reading-tools";
      tools.setAttribute("aria-label", "Reading layout controls");
      tools.innerHTML = `
        <span class="reading-tools__label">Reading view</span>
        <button type="button" class="md-button md-button--compact" data-study-toggle="subjects"></button>
        <button type="button" class="md-button md-button--compact" data-study-toggle="toc"></button>
        <button type="button" class="md-button md-button--compact" data-study-reset>Focus mode</button>
        ${
          isRecallDeck()
            ? `<button type="button" class="md-button md-button--compact" data-study-cols></button>`
            : ""
        }
      `;
      heading.insertAdjacentElement("afterend", tools);

      tools.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.dataset.studyToggle === "subjects") document.body.classList.toggle(primaryClass);
        if (button.dataset.studyToggle === "toc") document.body.classList.toggle(secondaryClass);
        if (button.hasAttribute("data-study-reset")) {
          if (isFocusMode()) {
            document.body.classList.remove(primaryClass, secondaryClass);
          } else {
            document.body.classList.add(primaryClass, secondaryClass);
          }
        }
        if (button.hasAttribute("data-study-cols")) {
          document.body.classList.toggle(oneColClass);
          localStorage.setItem(
            oneColClass,
            String(document.body.classList.contains(oneColClass)),
          );
          initialiseRecallColumns();
        }
        savePreference();
        updateButtons();
        if (isFactLockSheet()) {
          document.body.classList.toggle("fact-lock-focus", isFocusMode());
        }
      });
    }
    updateButtons();
  }

  const restorePreference = () => {
    document.body.classList.toggle(primaryClass, localStorage.getItem(primaryClass) === "true");
    document.body.classList.toggle(secondaryClass, localStorage.getItem(secondaryClass) === "true");
    document.body.classList.toggle(oneColClass, localStorage.getItem(oneColClass) === "true");
  };

  // Reading progress bar — shows how far down the current note you are.
  function initialiseProgressBar() {
    let bar = document.querySelector(".study-progress");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "study-progress";
      bar.setAttribute("role", "progressbar");
      bar.setAttribute("aria-label", "Reading progress");
      document.body.appendChild(bar);
    }

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0;
      bar.style.width = pct + "%";
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  // --------------------------------------------------------------------------
  // Practice / embedded PYQ cards — wrap Q blocks, format Options + match lists
  // --------------------------------------------------------------------------
  // Q12. / Q0b. / Q1a. — letter suffixes are used when one year has multiple bank items.
  const QUESTION_ID_RE = /^Q\d+[a-z]?\./i;
  const QUESTION_ID_ONLY_RE = /^Q\d+[a-z]?\.?$/i;

  function isQuestionStart(el) {
    if (!el || el.nodeType !== 1) return false;
    if (/^H[1-6]$/.test(el.tagName)) return false;
    if (el.classList.contains("study-recall-split") || el.classList.contains("study-mcq")) {
      return false;
    }
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (QUESTION_ID_RE.test(text)) return true;
    if (/^PYQ\b/i.test(text)) return true;
    const strong = el.querySelector(":scope > strong");
    if (strong) {
      const label = (strong.textContent || "").trim();
      if (QUESTION_ID_ONLY_RE.test(label) || QUESTION_ID_RE.test(label) || /^PYQ\b/i.test(label)) {
        return true;
      }
    }
    return false;
  }

  function isSectionBreak(el) {
    if (!el || el.nodeType !== 1) return true;
    return /^H[1-6]$/.test(el.tagName) || el.tagName === "HR";
  }

  function splitOptionsLine(text) {
    const cleaned = text.replace(/^\s*Options:\s*/i, "").trim();
    if (!cleaned) return [];
    const parts = cleaned.split(/\s+(?=[A-D]\.\s+)/);
    return parts
      .map((part) => {
        const match = part.match(/^([A-D])\.\s*(.*)$/s);
        if (!match) return null;
        return { key: match[1], body: match[2].trim() };
      })
      .filter(Boolean);
  }

  /** Parse A–D choices from one or many lines. Never invent empty keys. */
  function collectOptionsFromLines(lines) {
    const joined = (Array.isArray(lines) ? lines : [lines])
      .map((line) => String(line || "").trim())
      .filter(Boolean);
    if (!joined.length) return [];

    if (joined.length >= 2) {
      const fromLines = joined.map(parseOptionLine).filter(Boolean);
      if (fromLines.length >= 2) return fromLines;
    }

    // Soft-break markdown often collapses "A. … B. … C. … D. …" onto one line.
    const inline = splitOptionsLine(joined.join(" "));
    if (inline.length >= 2) return inline;

    return joined.map(parseOptionLine).filter(Boolean);
  }

  function appendPlainLines(fragment, lines) {
    (Array.isArray(lines) ? lines : [lines]).forEach((line) => {
      const text = String(line || "").trim();
      if (!text) return;
      const p = document.createElement("p");
      setRichText(p, text);
      fragment.appendChild(p);
    });
  }

  /** Prefer a styled options list; if parsing fails, keep the raw text visible. */
  function appendOptionsKeepVisible(fragment, lines) {
    const options = collectOptionsFromLines(lines);
    if (options.length >= 2) {
      fragment.appendChild(buildOptionsList(options));
      return true;
    }
    appendPlainLines(fragment, lines);
    return false;
  }

  function averageOptionLength(options) {
    if (!options.length) return 0;
    return options.reduce((sum, opt) => sum + opt.body.length, 0) / options.length;
  }

  function buildOptionsList(options) {
    const list = document.createElement("ul");
    list.className = "study-mcq__options";
    if (averageOptionLength(options) < 42) {
      list.classList.add("study-mcq__options--short");
    }
    options.forEach((opt) => {
      const li = document.createElement("li");
      li.className = "study-mcq__option";
      li.innerHTML =
        `<span class="study-mcq__option-key">${opt.key}.</span>` +
        `<span class="study-mcq__option-text"></span>`;
      li.querySelector(".study-mcq__option-text").textContent = opt.body;
      list.appendChild(li);
    });
    return list;
  }

  function formatOptionsInCard(card) {
    card.querySelectorAll("p").forEach((p) => {
      const raw = (p.textContent || "").trim();
      if (!/^Options:/i.test(raw)) return;
      const options = splitOptionsLine(raw);
      if (options.length < 2) return;
      p.replaceWith(buildOptionsList(options));
    });
  }

  function setRichText(el, text) {
    el.textContent = "";
    const parts = String(text).split(/(\*\*[^*]+\*\*)/);
    parts.forEach((part) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        el.appendChild(strong);
      } else if (part) {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function parseOptionLine(line) {
    const match = line.match(/^([A-D])\.\s*(.*)$/);
    return match ? { key: match[1], body: match[2].trim() } : null;
  }

  function splitInlineOptionsText(text) {
    const cleaned = text.replace(/^\s*Options:\s*/i, "").trim();
    const parts = cleaned.split(/\s+(?=[A-D]\.\s+)/);
    if (parts.length < 2) return null;
    const options = parts.map((part) => parseOptionLine(part)).filter(Boolean);
    if (options.length < 2) return null;
    const first = parts[0];
    if (/^[A-D]\.\s/.test(first)) return { stem: "", options };
    return { stem: first.trim(), options };
  }

  function buildStemParagraph(text, className) {
    const stemP = document.createElement("p");
    stemP.className = className || "study-mcq__stem";
    const qMatch = text.match(/^(Q\d+[a-z]?\.)\s*(.*)$/i);
    if (qMatch) {
      const badge = document.createElement("strong");
      badge.textContent = qMatch[1];
      stemP.appendChild(badge);
      stemP.appendChild(document.createTextNode(" " + qMatch[2]));
    } else {
      setRichText(stemP, text);
    }
    return stemP;
  }

  function isAnswerCodeBody(body) {
    return /^(A-\d|Only\b|Both\b|Neither\b|All\b|None\b|\d+\s+\d+|\d+\s+and\b)/i.test(
      String(body || "").trim(),
    );
  }

  function findAnswerOptionsStart(text) {
    const match = String(text).match(
      /\s(?=[A-D]\.\s+(?:A-\d|Only\b|Both\b|Neither\b|All\b|None\b|\d+\s+\d+|\d+\s+and\b))/i,
    );
    return match ? match.index + 1 : -1;
  }

  function extractPrefixedItems(text, kind) {
    const items = [];
    const re = kind === "num" ? /\b(\d+)\.\s+/gi : /\b([A-D])\.\s+/gi;
    const matches = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push({ key: m[1], index: m.index, end: m.index + m[0].length });
    }
    for (let i = 0; i < matches.length; i += 1) {
      const start = matches[i].end;
      const stop = i + 1 < matches.length ? matches[i + 1].index : text.length;
      const body = text.slice(start, stop).trim().replace(/\s+/g, " ");
      if (!body) continue;
      items.push({ key: String(matches[i].key).toUpperCase(), body });
    }
    return items;
  }

  function buildMatchTable(listI, listII) {
    const table = document.createElement("table");
    table.className = "study-mcq__match";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["List-I", "List-II"].forEach((label) => {
      const th = document.createElement("th");
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    const rows = Math.max(listI.length, listII.length);
    for (let r = 0; r < rows; r += 1) {
      const tr = document.createElement("tr");
      const left = listI[r];
      const right = listII[r];
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      td1.textContent = left ? `${left.key}. ${left.body}` : "";
      td2.textContent = right ? `${right.key}. ${right.body}` : "";
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  // Single-paragraph Match Lists (markdown joins soft line-breaks) — keep List-I/II + codes visible.
  function tryRestructureMatchListText(text) {
    const cleaned = String(text || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return null;
    const looksMatch =
      /Match List/i.test(cleaned) ||
      (/\bA\.\s+\S+/.test(cleaned) && /\b1\.\s+\S+/.test(cleaned) && /\bA\.\s+A-\d/i.test(cleaned));
    if (!looksMatch) return null;

    const answerAt = findAnswerOptionsStart(cleaned);
    if (answerAt < 0) return null;

    const before = cleaned.slice(0, answerAt).trim();
    const after = cleaned.slice(answerAt).trim();
    const options = splitOptionsLine(after).filter((opt) => isAnswerCodeBody(opt.body));
    if (options.length < 2) return null;

    const numAt = before.search(/\s1\.\s+/);
    const head = (numAt >= 0 ? before.slice(0, numAt) : before).trim();
    const mid = (numAt >= 0 ? before.slice(numAt) : "").trim();

    const alphaAt = head.search(/\bA\.\s+/);
    const stemText = (alphaAt >= 0 ? head.slice(0, alphaAt) : head).trim();
    const listI = extractPrefixedItems(alphaAt >= 0 ? head.slice(alphaAt) : "", "alpha");
    const listII = extractPrefixedItems(mid, "num");
    if (listI.length < 2 && listII.length < 2) return null;

    const fragment = document.createDocumentFragment();
    if (stemText) fragment.appendChild(buildStemParagraph(stemText));
    if (listI.length || listII.length) fragment.appendChild(buildMatchTable(listI, listII));
    fragment.appendChild(buildOptionsList(options));
    return fragment;
  }

  function buildPyqLabel(text) {
    const labelP = document.createElement("p");
    labelP.className = "study-mcq__label";
    const strong = document.createElement("strong");
    strong.textContent = text.trim();
    labelP.appendChild(strong);
    return labelP;
  }

  function restructureParagraph(p) {
    const raw = (p.innerText || p.textContent || "").replace(/\r\n/g, "\n");
    const trimmed = raw.trim();
    if (!trimmed) return;

    const matchFragment = tryRestructureMatchListText(trimmed);
    if (matchFragment) {
      p.replaceWith(matchFragment);
      return;
    }

    const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
    const hasMultilineOptions = lines.length > 1 && lines.some((line) => /^[A-D]\.\s/.test(line));
    // Leading "A." counts too (collapsed soft-break paragraphs often start with A.).
    const hasInlineOptions =
      /(?:^|\s)A\.\s/.test(trimmed) && /\sB\.\s/.test(trimmed) && !hasMultilineOptions;
    const hasNumberedStatements = lines.some((line) => /^\d+\.\s+/.test(line));
    const hasCollapsedOptionsLine = lines.some(
      (line) => /^[A-D]\.\s/.test(line) && /\s[B-D]\.\s/.test(line),
    );

    if (
      !hasMultilineOptions &&
      !hasInlineOptions &&
      !hasNumberedStatements &&
      !hasCollapsedOptionsLine &&
      !/^Options:/i.test(trimmed)
    ) {
      return;
    }

    const fragment = document.createDocumentFragment();
    let i = 0;

    if (/^PYQ\s*[—–-]/i.test(lines[0])) {
      fragment.appendChild(buildPyqLabel(lines[0]));
      i = 1;
    }

    if (hasInlineOptions) {
      const split = splitInlineOptionsText(lines.slice(i).join(" "));
      if (split) {
        if (split.stem) fragment.appendChild(buildStemParagraph(split.stem));
        fragment.appendChild(buildOptionsList(split.options));
        p.replaceWith(fragment);
        return;
      }
    }

    const stemLines = [];
    while (
      i < lines.length &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^[A-D]\.\s/.test(lines[i]) &&
      !/^Options:/i.test(lines[i]) &&
      !looksLikeMatchRow(lines[i])
    ) {
      stemLines.push(lines[i]);
      i += 1;
    }
    if (stemLines.length) fragment.appendChild(buildStemParagraph(stemLines.join(" ")));

    const statements = [];
    while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
      statements.push(lines[i].replace(/^\d+\.\s+/, ""));
      i += 1;
    }
    if (statements.length) {
      const ol = document.createElement("ol");
      statements.forEach((text) => {
        const li = document.createElement("li");
        setRichText(li, text);
        ol.appendChild(li);
      });
      fragment.appendChild(ol);
    }

    const matchRows = [];
    while (i < lines.length && looksLikeMatchRow(lines[i])) {
      matchRows.push(pipeCells(lines[i]));
      i += 1;
    }
    if (matchRows.length >= 2) {
      const table = document.createElement("table");
      table.className = "study-mcq__match";
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      matchRows[0].forEach((cell) => {
        const th = document.createElement("th");
        setRichText(th, cell);
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      matchRows.slice(1).forEach((cells) => {
        const tr = document.createElement("tr");
        cells.forEach((cell) => {
          const td = document.createElement("td");
          setRichText(td, cell);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      fragment.appendChild(table);
    }

    // Match List-I rows (A–D labels) before List-II (1–4) — keep as plain lines / table, not options.
    const listILines = [];
    if (
      i < lines.length &&
      /^[A-D]\.\s/.test(lines[i]) &&
      lines.slice(i + 1).some((line) => /^\d+\.\s+/.test(line))
    ) {
      while (i < lines.length && /^[A-D]\.\s/.test(lines[i])) {
        listILines.push(lines[i]);
        i += 1;
      }
      const listIILines = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        listIILines.push(lines[i]);
        i += 1;
      }
      const listI = listILines.map(parseOptionLine).filter(Boolean);
      const listII = listIILines
        .map((line) => {
          const m = line.match(/^(\d+)\.\s*(.*)$/);
          return m ? { key: m[1], body: m[2].trim() } : null;
        })
        .filter(Boolean);
      if (listI.length || listII.length) fragment.appendChild(buildMatchTable(listI, listII));
    }

    while (i < lines.length && !/^[A-D]\.\s/.test(lines[i]) && !/^Options:/i.test(lines[i])) {
      const extra = document.createElement("p");
      setRichText(extra, lines[i]);
      fragment.appendChild(extra);
      i += 1;
    }

    const optionLines = [];
    while (i < lines.length && /^[A-D]\.\s/.test(lines[i])) {
      optionLines.push(lines[i]);
      i += 1;
    }
    if (optionLines.length) {
      // One collapsed line ("A. … B. …") or several lines — always keep visible.
      appendOptionsKeepVisible(fragment, optionLines);
    } else if (i < lines.length && /^Options:/i.test(lines[i])) {
      appendOptionsKeepVisible(fragment, lines[i]);
      i += 1;
    }

    while (i < lines.length) {
      const extra = document.createElement("p");
      setRichText(extra, lines[i]);
      fragment.appendChild(extra);
      i += 1;
    }

    if (fragment.childNodes.length) p.replaceWith(fragment);
  }

  function restructureAllParagraphsInCard(card) {
    [...card.querySelectorAll(":scope > p")].forEach((p) => restructureParagraph(p));
    formatSeparateOptionParagraphs(card);
  }

  function isMatchListParagraph(text) {
    // "A. Kerala | 1. Dodda Betta" — match-list row, not an answer option
    return /\|/.test(text) && /^[A-D]\.\s+.+\|\s*\d+\./.test(text);
  }

  function isListTwoAhead(nodes, startIndex) {
    // Match-List List-I uses A–D labels; List-II uses 1–4. Do not treat List-I as options.
    for (let k = startIndex; k < Math.min(nodes.length, startIndex + 10); k += 1) {
      const el = nodes[k];
      if (!el || el.nodeType !== 1) continue;
      const text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/List-II\b/i.test(text)) return true;
      if (/^1\.\s+/.test(text)) return true;
      // Stop scanning once real answer codes like "A. 4 1 2 3" or "A. Only 1" appear after a gap.
      if (/^[A-D]\.\s+(\d+\s+\d+|Only\b|Both\b|Neither\b|A-)/i.test(text)) break;
    }
    return false;
  }

  function formatSeparateOptionParagraphs(card) {
    const nodes = [...card.children];
    let i = 0;
    while (i < nodes.length) {
      const el = nodes[i];
      if (el.tagName !== "P") {
        i += 1;
        continue;
      }
      const text = (el.textContent || "").trim();
      if (!/^[A-D]\.\s/.test(text) || isMatchListParagraph(text)) {
        i += 1;
        continue;
      }

      const group = [el];
      let j = i + 1;
      while (j < nodes.length) {
        const next = nodes[j];
        if (next.tagName !== "P") break;
        const nextText = (next.textContent || "").trim();
        if (!/^[A-D]\.\s/.test(nextText) || isMatchListParagraph(nextText)) break;
        group.push(next);
        j += 1;
      }

      const rawLines = group.map((p) => (p.textContent || "").trim());
      const options = collectOptionsFromLines(rawLines);
      const looksLikeAnswers = options.length >= 2 && options.every((opt) => isAnswerCodeBody(opt.body));

      // Skip Match List-I rows (A–D followed by List-II / numbered 1–4), but never skip real codes.
      if (!looksLikeAnswers && isListTwoAhead(nodes, j)) {
        i = j;
        continue;
      }

      // group.length === 1 still OK when one <p> holds "A. … B. … C. … D. …"
      if (options.length >= 2) {
        const list = buildOptionsList(options);
        group[0].replaceWith(list);
        group.slice(1).forEach((p) => p.remove());
        nodes.splice(i, group.length, list);
      }
      i += 1;
    }
  }

  function parseRecallLinkStem(text) {
    const normalized = (text || "").replace(/\s+/g, " ").trim();
    const patterns = [
      /^(Q\d+[a-z]?\.)\s*(From memory, link each[^:]*:)\s*(.+)$/i,
      /^(Q\d+[a-z]?\.)\s*(From memory, recall[^:]*:)\s*(.+)$/i,
      /^(Q\d+[a-z]?\.)\s*(From memory, complete[^:]*:)\s*(.+)$/i,
    ];
    for (const re of patterns) {
      const match = normalized.match(re);
      if (!match) continue;
      const items = match[3]
        .split(/;\s*/)
        .map((item) => item.trim())
        .filter(Boolean);
      if (items.length >= 2) {
        return { badge: match[1], intro: match[2], items };
      }
    }
    return null;
  }

  function buildRecallLinkBlock(parsed) {
    const wrap = document.createElement("div");
    wrap.className = "study-mcq__recall-block";

    const head = document.createElement("p");
    head.className = "study-mcq__stem";
    const badge = document.createElement("strong");
    badge.textContent = parsed.badge;
    head.appendChild(badge);
    head.appendChild(document.createTextNode(" " + parsed.intro));
    wrap.appendChild(head);

    const list = document.createElement("ul");
    list.className = "study-mcq__recall-items";
    list.setAttribute("role", "list");
    parsed.items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "study-mcq__recall-chip";
      li.setAttribute("role", "listitem");
      const num = document.createElement("span");
      num.className = "study-mcq__recall-num";
      num.textContent = String(index + 1);
      const label = document.createElement("span");
      label.className = "study-mcq__recall-label";
      label.textContent = item;
      li.append(num, label);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function formatRecallLinkStems(card) {
    card.querySelectorAll(":scope > p.study-mcq__stem, :scope > p").forEach((p) => {
      if (p.closest(".study-mcq__recall-block")) return;
      const parsed = parseRecallLinkStem(p.textContent || "");
      if (!parsed) return;
      p.replaceWith(buildRecallLinkBlock(parsed));
    });
  }

  function formatRecallPromptTables(card) {
    const tables = [...card.querySelectorAll(":scope > table")];
    tables.forEach((table, index) => {
      if (table.classList.contains("study-mcq__recall-prompt")) return;
      const headers = [...table.querySelectorAll("thead th")].map((th) =>
        (th.textContent || "").trim().toLowerCase()
      );
      const bodyRows = [...table.querySelectorAll("tbody tr")];
      const hasRecallHeader =
        headers.length >= 1 &&
        /recall|prompt|item|name|link|anchor|tinai|#/.test(headers.join(" "));
      const hasPlaceholders = bodyRows.some((row) =>
        [...row.querySelectorAll("td")].some((td) => /\?/.test(td.textContent || ""))
      );
      const isSingleColPrompt =
        headers.length === 1 && hasRecallHeader && bodyRows.length >= 2;
      const isMultiColPrompt =
        headers.length >= 2 && hasPlaceholders && bodyRows.length >= 2 && index === 0;
      if (!isSingleColPrompt && !isMultiColPrompt) return;

      table.classList.add("study-mcq__recall-prompt");
      if (bodyRows.length > 6) {
        table.classList.add("study-mcq__recall-prompt--scroll");
      }

      bodyRows.forEach((row, rowIndex) => {
        const cells = [...row.querySelectorAll("td")];
        if (!cells.length) return;

        if (cells.length === 1) {
          const cell = cells[0];
          cell.classList.add("study-mcq__recall-chip");
          const num = document.createElement("span");
          num.className = "study-mcq__recall-num";
          num.textContent = String(rowIndex + 1);
          const label = document.createElement("span");
          label.className = "study-mcq__recall-label";
          label.textContent = (cell.textContent || "").trim();
          cell.textContent = "";
          cell.append(num, label);
          return;
        }

        row.classList.add("study-mcq__recall-row");
        const labelCell = cells[0];
        const promptParts = cells.slice(1).map((td) => (td.textContent || "").trim());
        const key = (labelCell.textContent || "").trim();
        labelCell.classList.add("study-mcq__recall-chip");
        labelCell.colSpan = cells.length;
        labelCell.textContent = "";
        const num = document.createElement("span");
        num.className = "study-mcq__recall-num";
        num.textContent = String(rowIndex + 1);
        const label = document.createElement("span");
        label.className = "study-mcq__recall-label";
        label.textContent = promptParts.filter(Boolean).length
          ? `${key} — ${promptParts.join(" · ")}`
          : key;
        labelCell.append(num, label);
        cells.slice(1).forEach((td) => td.remove());
      });
    });
  }

  function formatMatchTablesInCard(card) {
    card.querySelectorAll(":scope > table").forEach((table) => {
      if (table.classList.contains("study-mcq__recall-prompt")) return;
      const rows = [...table.querySelectorAll("tbody tr")];
      if (rows.length >= 4 && rows.some((row) => /\?/.test(row.textContent || ""))) {
        table.classList.add("study-mcq__match");
        if (rows.length > 8) {
          table.classList.add("study-mcq__match--scroll");
        }
      }
    });
  }

  function applyCardLabels(card) {
    let labeledStem = false;
    card.querySelectorAll(":scope > p").forEach((p) => {
      const text = (p.textContent || "").trim();
      if (/^PYQ\s*[—–-]/i.test(text)) {
        p.classList.add("study-mcq__label");
        return;
      }
      if (!labeledStem && text && !/^[A-D]\.\s/.test(text) && !/^Options:/i.test(text)) {
        p.classList.add("study-mcq__stem");
        labeledStem = true;
      }
    });
  }

  function formatAnswerDetails(card) {
    card.querySelectorAll("details.study-mcq__answer").forEach((details) => {
      const summary = details.querySelector("summary");
      [...details.childNodes].forEach((node) => {
        if (node === summary) return;
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (!text) return;
          const p = document.createElement("p");
          setRichText(p, text);
          details.replaceChild(p, node);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "P") {
          setRichText(node, node.textContent || "");
        }
      });
    });
  }

  function pipeCells(line) {
    return line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length);
  }

  function looksLikeMatchRow(text) {
    const cells = pipeCells(text);
    if (cells.length !== 2) return false;
    return /^(List-[IVX]+|[A-D]\.)/i.test(cells[0]) || /^(List-[IVX]+|\d+\.)/i.test(cells[1]);
  }

  function formatMatchListsInCard(card) {
    const nodes = [...card.children];
    let i = 0;
    while (i < nodes.length) {
      const el = nodes[i];
      if (el.tagName !== "P" || !looksLikeMatchRow((el.textContent || "").trim())) {
        i += 1;
        continue;
      }

      const group = [el];
      let j = i + 1;
      while (j < nodes.length) {
        const next = nodes[j];
        if (next.tagName !== "P" || !looksLikeMatchRow((next.textContent || "").trim())) break;
        group.push(next);
        j += 1;
      }
      if (group.length < 2) {
        i += 1;
        continue;
      }

      const rows = group.map((p) => pipeCells((p.textContent || "").trim()));
      const table = document.createElement("table");
      table.className = "study-mcq__match";
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      rows[0].forEach((cell) => {
        const th = document.createElement("th");
        th.textContent = cell;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      rows.slice(1).forEach((cells) => {
        const tr = document.createElement("tr");
        cells.forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      group[0].replaceWith(table);
      group.slice(1).forEach((p) => p.remove());
      nodes.splice(i, group.length, table);
      i += 1;
    }
  }

  function unwrapMcqCards(scope) {
    scope.querySelectorAll(".study-mcq").forEach((card) => {
      const parent = card.parentNode;
      if (!parent) return;
      [...card.childNodes].forEach((node) => parent.insertBefore(node, card));
      card.remove();
    });
  }

  function enhanceMcqCardsInContainer(root) {
    if (!root) return;

    const children = [...root.children];
    let index = 0;
    while (index < children.length) {
      const start = children[index];
      if (!isQuestionStart(start)) {
        index += 1;
        continue;
      }

      const block = [start];
      let cursor = index + 1;
      while (cursor < children.length) {
        const next = children[cursor];
        if (isSectionBreak(next) || isQuestionStart(next)) break;
        block.push(next);
        cursor += 1;
      }

      const card = document.createElement("div");
      card.className = "study-mcq";
      start.parentNode.insertBefore(card, start);
      block.forEach((node) => card.appendChild(node));

      card.querySelectorAll("details").forEach((details) => {
        details.classList.add("study-mcq__answer");
        const summary = details.querySelector("summary");
        if (summary && !summary.textContent.trim()) summary.textContent = "Show answer";
      });

      restructureAllParagraphsInCard(card);
      formatMatchListsInCard(card);
      formatOptionsInCard(card);
      applyCardLabels(card);
      formatRecallLinkStems(card);
      formatRecallPromptTables(card);
      formatMatchTablesInCard(card);
      formatAnswerDetails(card);

      children.splice(index, block.length, card);
      index += 1;
    }
  }

  function enhanceMcqCards(root) {
    root =
      root ||
      document.querySelector(".md-content__inner") ||
      document.querySelector(".md-typeset");
    if (!root) return;

    // Re-run safely on Material instant navigation.
    unwrapMcqCards(root);

    enhanceMcqCardsInContainer(root);
    root.querySelectorAll(".fact-lock-sheet, .fact-lock-section").forEach((container) => {
      enhanceMcqCardsInContainer(container);
    });
  }

  function insertSplitBefore(leftNodes, rightNodes) {
    const first = leftNodes[0];
    const parent = first.parentNode;
    const wrap = document.createElement("div");
    wrap.className = "study-recall-split";
    parent.insertBefore(wrap, first);

    const left = document.createElement("div");
    left.className = "study-recall-split__col";
    const divider = document.createElement("div");
    divider.className = "study-recall-split__divider";
    divider.setAttribute("aria-hidden", "true");
    const right = document.createElement("div");
    right.className = "study-recall-split__col";
    wrap.append(left, divider, right);
    leftNodes.forEach((node) => left.appendChild(node));
    (rightNodes || []).forEach((node) => right.appendChild(node));
  }

  function teardownRecallColumns() {
    document.querySelectorAll(".study-recall-split").forEach((split) => {
      const parent = split.parentNode;
      if (!parent) return;
      split.querySelectorAll(":scope > .study-recall-split__col").forEach((col) => {
        [...col.childNodes].forEach((node) => parent.insertBefore(node, split));
      });
      split.remove();
    });
    document.body.classList.remove("study-recall-cols");
  }

  function isTopicHeading(el) {
    return el && /^H[2-6]$/.test(el.tagName);
  }

  function collectTopicSections(nodes) {
    const sections = [];
    let bucket = [];
    nodes.forEach((el, index) => {
      const next = nodes[index + 1];
      if (el.tagName === "HR" && bucket.length && isTopicHeading(next)) return;
      if (isTopicHeading(el) && bucket.length) {
        sections.push(bucket);
        bucket = [el];
        return;
      }
      bucket.push(el);
    });
    if (bucket.length) sections.push(bucket);
    return sections;
  }

  function initialiseRecallColumns() {
    teardownRecallColumns();
    if (!isRecallDeck()) return;
    if (document.body.classList.contains(oneColClass)) return;

    const article = document.querySelector(".md-content__inner");
    const tools = article?.querySelector(".reading-tools");
    if (!article || !tools) return;

    const nodes = [];
    let cursor = tools.nextElementSibling;
    while (cursor) {
      nodes.push(cursor);
      cursor = cursor.nextElementSibling;
    }
    if (!nodes.length) return;

    const firstHeadingAt = nodes.findIndex(isTopicHeading);
    const rest = firstHeadingAt === -1 ? nodes : nodes.slice(firstHeadingAt);
    const sections = collectTopicSections(rest);

    document.body.classList.add("study-recall-cols");

    if (sections.length >= 2) {
      for (let i = 0; i < sections.length; i += 2) {
        const left = sections[i];
        const right = sections[i + 1];
        if (!right) break;
        insertSplitBefore(left, right);
      }
      return;
    }

    const cards = rest.filter((el) => el.classList && el.classList.contains("study-mcq"));
    if (cards.length < 4) {
      document.body.classList.remove("study-recall-cols");
      return;
    }
    const mid = Math.ceil(cards.length / 2);
    insertSplitBefore(cards.slice(0, mid), cards.slice(mid));
  }

  const boot = () => {
    teardownRecallColumns();
    document.body.classList.remove("fact-lock-page", "fact-lock-focus");
    initialiseReadingMode();
    initialiseProgressBar();
    enhanceMcqCards();
    initialiseFactLockPage();
    initialiseRecallColumns();
    if (document.body.classList.contains(primaryClass) && document.body.classList.contains(secondaryClass)) {
      document.body.classList.add("fact-lock-focus");
    }
  };

  restorePreference();
  if (typeof document$ !== "undefined") document$.subscribe(boot);
  else document.addEventListener("DOMContentLoaded", boot);
})();
