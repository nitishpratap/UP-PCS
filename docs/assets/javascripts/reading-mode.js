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

  const boot = () => {
    initialiseReadingMode();
    initialiseProgressBar();
  };

  restorePreference();
  if (typeof document$ !== "undefined") document$.subscribe(boot);
  else document.addEventListener("DOMContentLoaded", boot);
})();
