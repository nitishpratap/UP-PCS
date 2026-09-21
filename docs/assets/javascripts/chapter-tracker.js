(() => {
  const STORAGE_KEY = "uppcs.ukpcs.chapterTracker.v1";
  let bound = false;
  let currentFilter = "all";

  function isTrackerPage() {
    return Boolean(document.querySelector(".ct-toolbar") && document.querySelector(".ct-subject"));
  }

  function subjects() {
    return [...document.querySelectorAll("details.ct-subject")];
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

    subjects().forEach((section) => {
      const sid = section.getAttribute("data-ct-subject");
      const el = section.querySelector(`.ct-progress[data-ct-subject="${sid}"]`);
      const sectionRows = [...section.querySelectorAll(".ct-row")];
      if (!el) return;
      const d = sectionRows.filter((row) => row.querySelector(".ct-check")?.checked).length;
      el.textContent = sectionRows.length ? `${d} / ${sectionRows.length} done` : "notes only";
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
      if (heading && (heading.tagName === "H3" || heading.classList?.contains("ct-group-title"))) {
        heading.hidden = !visible;
      }
    });

    subjects().forEach((section) => {
      const sectionRows = [...section.querySelectorAll(".ct-row")];
      if (!sectionRows.length) {
        section.hidden = currentFilter !== "all" && currentFilter !== "open";
        return;
      }
      section.hidden = !sectionRows.some((row) => !row.hidden);
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
      if (!box.dataset.ctBound) {
        box.dataset.ctBound = "1";
        box.addEventListener("click", (event) => event.stopPropagation());
      }
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
        if (row.tagName === "DETAILS") row.open = false;
      });
      subjects().forEach((section) => {
        section.open = false;
      });
      updateProgress();
      applyFilter("all");
    }
  }

  function bindSubjects() {
    subjects().forEach((section) => {
      if (section.dataset.ctBound) return;
      section.dataset.ctBound = "1";
      section.addEventListener("toggle", () => {
        if (!section.open) return;
        queueMicrotask(() => {
          subjects().forEach((other) => {
            if (other !== section) other.open = false;
          });
        });
      });
    });
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
    bindSubjects();
    restoreChecks();
    updateProgress();
    applyFilter(currentFilter === "all" ? "all" : currentFilter);
    subjects().forEach((section) => {
      section.open = false;
    });
  }

  if (typeof document$ !== "undefined") document$.subscribe(initialiseTracker);
  else document.addEventListener("DOMContentLoaded", initialiseTracker);
})();
