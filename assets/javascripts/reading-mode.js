(() => {
  const primaryClass = "study-hide-subjects";
  const secondaryClass = "study-hide-toc";

  function setButtonState(button, isHidden, hiddenLabel, shownLabel) {
    button.setAttribute("aria-pressed", String(isHidden));
    button.textContent = isHidden ? shownLabel : hiddenLabel;
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
          document.body.classList.add(primaryClass, secondaryClass);
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

  restorePreference();
  if (typeof document$ !== "undefined") document$.subscribe(initialiseReadingMode);
  else document.addEventListener("DOMContentLoaded", initialiseReadingMode);
})();
