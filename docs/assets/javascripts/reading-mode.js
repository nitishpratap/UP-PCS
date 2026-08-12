(() => {
  const primaryClass = "study-hide-subjects";
  const secondaryClass = "study-hide-toc";

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
        savePreference();
        updateButtons();
      });
    }
    updateButtons();
  }

  const restorePreference = () => {
    document.body.classList.toggle(primaryClass, localStorage.getItem(primaryClass) === "true");
    document.body.classList.toggle(secondaryClass, localStorage.getItem(secondaryClass) === "true");
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

    const scroller =
      document.querySelector(".md-content__inner")?.closest(".md-main") ?? document.documentElement;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = (doc.scrollHeight || scroller.scrollHeight) - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0;
      bar.style.width = pct + "%";
    };

    window.removeEventListener("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  // --------------------------------------------------------------------------
  // Practice / embedded PYQ cards — wrap Q blocks, format Options + match lists
  // --------------------------------------------------------------------------
  function isQuestionStart(el) {
    if (!el || el.nodeType !== 1) return false;
    if (/^H[1-6]$/.test(el.tagName)) return false;
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (/^Q\d+\./i.test(text)) return true;
    if (/^PYQ\b/i.test(text)) return true;
    const strong = el.querySelector(":scope > strong");
    if (strong) {
      const label = (strong.textContent || "").trim();
      if (/^Q\d+\.?$/i.test(label) || /^PYQ\b/i.test(label)) return true;
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
    const qMatch = text.match(/^(Q\d+\.)\s*(.*)$/i);
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

    const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
    const hasMultilineOptions = lines.length > 1 && lines.some((line) => /^[A-D]\.\s/.test(line));
    const hasInlineOptions =
      /\sA\.\s/.test(trimmed) && /\sB\.\s/.test(trimmed) && !hasMultilineOptions;
    const hasNumberedStatements = lines.some((line) => /^\d+\.\s+/.test(line));

    if (!hasMultilineOptions && !hasInlineOptions && !hasNumberedStatements && !/^Options:/i.test(trimmed)) {
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
    if (optionLines.length >= 2) {
      const options = optionLines.map(parseOptionLine).filter(Boolean);
      if (options.length >= 2) fragment.appendChild(buildOptionsList(options));
    } else if (i < lines.length && /^Options:/i.test(lines[i])) {
      const options = splitOptionsLine(lines[i]);
      if (options.length >= 2) fragment.appendChild(buildOptionsList(options));
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

      if (group.length >= 2) {
        const options = group.map((p) => parseOptionLine((p.textContent || "").trim())).filter(Boolean);
        if (options.length >= 2) {
          const list = buildOptionsList(options);
          group[0].replaceWith(list);
          group.slice(1).forEach((p) => p.remove());
          nodes.splice(i, group.length, list);
        }
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

  function enhanceMcqCards() {
    const root = document.querySelector(".md-typeset");
    if (!root) return;

    // Re-run safely on Material instant navigation.
    root.querySelectorAll(".study-mcq").forEach((card) => {
      const kids = [...card.childNodes];
      kids.forEach((node) => root.insertBefore(node, card));
      card.remove();
    });

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

  const boot = () => {
    initialiseReadingMode();
    initialiseProgressBar();
    enhanceMcqCards();
  };

  restorePreference();
  if (typeof document$ !== "undefined") document$.subscribe(boot);
  else document.addEventListener("DOMContentLoaded", boot);
})();
