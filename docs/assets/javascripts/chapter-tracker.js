(() => {
  const STORAGE_KEY = "uppcs.ukpcs.chapterTracker.v1";
  let bound = false;
  let currentFilter = "all";

  function isTrackerPage() {
    return Boolean(document.querySelector(".ct-toolbar") && document.querySelector(".ct-row"));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function rows() {
    return [...document.querySelectorAll(".ct-row")];
  }

  function updateProgress() {
    const all = rows();
    const done = all.filter((row) => row.querySelector(".ct-check")?.checked).length;
    const overall = document.querySelector('.ct-progress[data-ct-subject="all"]');
    if (overall) overall.textContent = `${done} / ${all.length} done`;

    document.querySelectorAll(".ct-progress[data-ct-subject]").forEach((el) => {
      const sid = el.getAttribute("data-ct-subject");
      if (!sid || sid === "all") return;
      const heading = document.getElementById(sid);
      if (!heading) return;
      const sectionRows = [];
      let node = heading.nextElementSibling;
      while (node && node.tagName !== "H2") {
        if (node.querySelectorAll) sectionRows.push(...node.querySelectorAll(".ct-row"));
        node = node.nextElementSibling;
      }
      const d = sectionRows.filter((row) => row.querySelector(".ct-check")?.checked).length;
      el.textContent = `${d} / ${sectionRows.length} done`;
    });
  }

  function applyFilter(filter) {
    currentFilter = filter || "all";
    document.querySelectorAll(".ct-filter").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-ct-filter") === currentFilter);
    });

    rows().forEach((row) => {
      const group = row.getAttribute("data-group");
      const checked = Boolean(row.querySelector(".ct-check")?.checked);
      let show = true;
      if (currentFilter === "high" || currentFilter === "medium" || currentFilter === "least") {
        show = group === currentFilter;
      } else if (currentFilter === "open") {
        show = !checked;
      }
      row.hidden = !show;
      const item = row.closest("li");
      if (item) item.hidden = !show;
    });

    document.querySelectorAll(".ct-list").forEach((list) => {
      const visible = [...list.querySelectorAll(".ct-row")].some((row) => !row.hidden);
      list.hidden = !visible;
      const heading = list.previousElementSibling;
      if (heading && /^H[23]$/.test(heading.tagName)) heading.hidden = !visible;
    });

    document.querySelectorAll(".md-typeset h2[id]").forEach((h2) => {
      let node = h2.nextElementSibling;
      let any = false;
      while (node && node.tagName !== "H2") {
        if (node.classList?.contains("ct-list") && !node.hidden) any = true;
        node = node.nextElementSibling;
      }
      if (h2.id === "economy" || h2.id === "science-and-technology") {
        const hide = currentFilter !== "all" && currentFilter !== "open";
        h2.hidden = hide;
        let p = h2.nextElementSibling;
        while (p && p.tagName !== "H2") {
          if (!p.classList?.contains("ct-list")) p.hidden = hide;
          p = p.nextElementSibling;
        }
        return;
      }
      h2.hidden = currentFilter !== "all" && !any;
      const sub = h2.nextElementSibling;
      if (sub && sub.classList?.contains("ct-subhead")) sub.hidden = h2.hidden;
    });
  }

  function restoreChecks() {
    const state = loadState();
    rows().forEach((row) => {
      const id = row.getAttribute("data-ct-id");
      const box = row.querySelector(".ct-check");
      if (!id || !box) return;
      box.checked = Boolean(state[id]);
      row.classList.toggle("is-done", box.checked);
    });
  }

  function onChange(event) {
    const box = event.target.closest?.(".ct-check");
    if (!box) return;
    const row = box.closest(".ct-row");
    const id = box.getAttribute("data-ct-id") || row?.getAttribute("data-ct-id");
    if (!id) return;
    const next = loadState();
    if (box.checked) next[id] = true;
    else delete next[id];
    saveState(next);
    row?.classList.toggle("is-done", box.checked);
    updateProgress();
    applyFilter(currentFilter);
  }

  function onClick(event) {
    const filterBtn = event.target.closest?.(".ct-filter");
    if (filterBtn) {
      applyFilter(filterBtn.getAttribute("data-ct-filter") || "all");
      return;
    }
    if (event.target.closest?.("#ct-reset")) {
      if (!window.confirm("Clear every chapter tick stored in this browser?")) return;
      localStorage.removeItem(STORAGE_KEY);
      rows().forEach((row) => {
        const box = row.querySelector(".ct-check");
        if (box) box.checked = false;
        row.classList.remove("is-done");
      });
      updateProgress();
      applyFilter("all");
    }
  }

  function bindOnce() {
    if (bound) return;
    bound = true;
    document.addEventListener("change", onChange);
    document.addEventListener("click", onClick);
  }

  function initialiseTracker() {
    if (!isTrackerPage()) {
      document.body.classList.remove("chapter-tracker-page");
      return;
    }
    document.body.classList.add("chapter-tracker-page");
    bindOnce();
    restoreChecks();
    updateProgress();
    applyFilter(currentFilter === "all" ? "all" : currentFilter);
  }

  if (typeof document$ !== "undefined") document$.subscribe(initialiseTracker);
  else document.addEventListener("DOMContentLoaded", initialiseTracker);
})();
