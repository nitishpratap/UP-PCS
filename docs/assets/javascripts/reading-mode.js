(() => {
  const primaryClass = "study-hide-subjects";
  const secondaryClass = "study-hide-toc";
  const deskHideClass = "study-desk-hide-notes";
  let notesAbort = null;

  function isRecallDeck() {
    const path = decodeURIComponent(location.pathname).replace(/\/+$/, "");
    const match = path.match(/\/active-recall\/(.+)$/);
    if (!match) return false;
    const rest = match[1].split("/").filter(Boolean);
    return rest.length >= 2 && rest[rest.length - 1] !== "index";
  }

  function matchingNotesUrl() {
    const url = new URL(location.href);
    if (!url.pathname.includes("/active-recall/")) return "";
    url.pathname = url.pathname.replace("/active-recall/", "/subjects/");
    url.hash = "";
    url.search = "";
    return url.href;
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

    const deskButton = document.querySelector("[data-study-desk]");
    if (deskButton) {
      setButtonState(
        deskButton,
        document.body.classList.contains(deskHideClass),
        "Hide notes",
        "Show notes",
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
            ? `<button type="button" class="md-button md-button--compact" data-study-desk></button>`
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
        if (button.hasAttribute("data-study-desk")) {
          document.body.classList.toggle(deskHideClass);
          localStorage.setItem(
            deskHideClass,
            String(document.body.classList.contains(deskHideClass)),
          );
        }
        savePreference();
        updateButtons();
      });
    }
    updateButtons();
  }

  const restorePreference = () => {
    document.body.classList.toggle(primaryClass, localStorage.getItem(primaryClass) === "true");
    document.body.classList.toggle(secondaryClass, localStorage.getItem(secondaryClass) === "true");
    document.body.classList.toggle(deskHideClass, localStorage.getItem(deskHideClass) === "true");
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

    const cards = document.querySelector(".study-desk__cards");

    const update = () => {
      if (cards) {
        const max = cards.scrollHeight - cards.clientHeight;
        const pct = max > 0 ? Math.min(100, (cards.scrollTop / max) * 100) : 0;
        bar.style.width = pct + "%";
        return;
      }
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0;
      bar.style.width = pct + "%";
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    if (cards) cards.addEventListener("scroll", update, { passive: true });
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
    if (el.classList.contains("study-desk") || el.classList.contains("study-mcq")) return false;
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

  function enhanceMcqCards(root) {
    root =
      root ||
      document.querySelector(".md-content__inner") ||
      document.querySelector(".md-typeset");
    if (!root) return;

    // Re-run safely on Material instant navigation.
    unwrapMcqCards(root);

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
      formatAnswerDetails(card);

      children.splice(index, block.length, card);
      index += 1;
    }
  }

  function paneHead(label) {
    const head = document.createElement("div");
    head.className = "study-desk__pane-head";
    head.textContent = label;
    return head;
  }

  function teardownRecallDesk() {
    if (notesAbort) {
      notesAbort.abort();
      notesAbort = null;
    }
    const desk = document.querySelector(".study-desk");
    if (!desk) {
      document.body.classList.remove("study-recall-desk");
      return;
    }
    const cards = desk.querySelector(".study-desk__cards");
    const parent = desk.parentNode;
    if (cards && parent) {
      [...cards.children].forEach((node) => {
        if (node.classList.contains("study-desk__pane-head")) return;
        parent.insertBefore(node, desk);
      });
    }
    desk.remove();
    document.body.classList.remove("study-recall-desk");
  }

  function bindDeskDivider(desk, divider) {
    divider.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      divider.setPointerCapture(event.pointerId);
      const startX = event.clientX;
      const notes = desk.querySelector(".study-desk__notes");
      const startWidth = notes.getBoundingClientRect().width;
      const total = desk.getBoundingClientRect().width;
      const onMove = (moveEvent) => {
        const pct = ((startWidth + (moveEvent.clientX - startX)) / total) * 100;
        desk.style.setProperty("--study-desk-notes", Math.min(70, Math.max(28, pct)) + "%");
      };
      const onUp = () => {
        divider.removeEventListener("pointermove", onMove);
        divider.removeEventListener("pointerup", onUp);
        localStorage.setItem("study-desk-notes", desk.style.getPropertyValue("--study-desk-notes").trim());
      };
      divider.addEventListener("pointermove", onMove);
      divider.addEventListener("pointerup", onUp);
    });
  }

  function rewriteClonedUrls(scope, baseHref) {
    const base = new URL(baseHref, location.href);
    scope.querySelectorAll("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:")) {
        return;
      }
      try {
        anchor.setAttribute("href", new URL(href, base).href);
      } catch {
        /* keep original */
      }
    });
    scope.querySelectorAll("img[src]").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src) return;
      try {
        img.setAttribute("src", new URL(src, base).href);
      } catch {
        /* keep original */
      }
    });
  }

  async function fillNotesPane(notesPane, noteUrl) {
    notesPane.appendChild(paneHead("Notes"));
    const body = document.createElement("div");
    body.className = "study-desk__note-body md-typeset";
    body.innerHTML = "<p>Loading matching subject notes…</p>";
    notesPane.appendChild(body);

    notesAbort = new AbortController();
    try {
      const response = await fetch(noteUrl, { signal: notesAbort.signal });
      if (!response.ok) throw new Error("missing");
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const source =
        doc.querySelector(".md-content__inner") || doc.querySelector(".md-typeset");
      if (!source) throw new Error("empty");

      body.replaceChildren();
      [...source.children].forEach((child) => {
        if (child.classList && child.classList.contains("reading-tools")) return;
        body.appendChild(document.importNode(child, true));
      });
      body.querySelectorAll(".headerlink").forEach((link) => link.remove());
      rewriteClonedUrls(body, noteUrl);
      enhanceMcqCards(body);
    } catch (error) {
      if (error && error.name === "AbortError") return;
      body.replaceChildren();
      const fallback = document.createElement("p");
      fallback.textContent =
        "No matching Lucent note for this deck. Use the left sidebar Subject Notes if you want the teaching chapter beside the cards.";
      body.appendChild(fallback);
      const link = document.createElement("p");
      const anchor = document.createElement("a");
      anchor.href = noteUrl;
      anchor.textContent = "Try opening the matching notes page";
      link.appendChild(anchor);
      body.appendChild(link);
    }
  }

  function initialiseRecallDesk() {
    if (!isRecallDeck()) return;

    const article = document.querySelector(".md-content__inner");
    const tools = article?.querySelector(".reading-tools");
    if (!article || !tools) return;

    const moveNodes = [];
    let cursor = tools.nextSibling;
    while (cursor) {
      const next = cursor.nextSibling;
      if (cursor.nodeType === 1 || (cursor.nodeType === 3 && cursor.textContent.trim())) {
        moveNodes.push(cursor);
      }
      cursor = next;
    }
    if (!moveNodes.length) return;

    document.body.classList.add("study-recall-desk");
    const desk = document.createElement("div");
    desk.className = "study-desk";
    const savedWidth = localStorage.getItem("study-desk-notes");
    if (savedWidth) desk.style.setProperty("--study-desk-notes", savedWidth);

    const notes = document.createElement("section");
    notes.className = "study-desk__notes";
    notes.setAttribute("aria-label", "Subject notes");

    const divider = document.createElement("div");
    divider.className = "study-desk__divider";
    divider.setAttribute("role", "separator");
    divider.setAttribute("aria-orientation", "vertical");
    divider.setAttribute("aria-label", "Resize notes and cards");
    divider.tabIndex = 0;

    const cards = document.createElement("section");
    cards.className = "study-desk__cards";
    cards.setAttribute("aria-label", "Active recall cards");
    cards.appendChild(paneHead("Cards"));
    moveNodes.forEach((node) => cards.appendChild(node));

    desk.append(notes, divider, cards);
    tools.insertAdjacentElement("afterend", desk);
    bindDeskDivider(desk, divider);
    fillNotesPane(notes, matchingNotesUrl());
  }

  const boot = () => {
    teardownRecallDesk();
    initialiseReadingMode();
    initialiseProgressBar();
    enhanceMcqCards();
    initialiseRecallDesk();
    initialiseProgressBar();
  };

  restorePreference();
  if (typeof document$ !== "undefined") document$.subscribe(boot);
  else document.addEventListener("DOMContentLoaded", boot);
})();
