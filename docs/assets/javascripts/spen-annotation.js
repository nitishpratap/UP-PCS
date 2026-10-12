/**
 * ==========================================================================
 * UP-PCS Study Library — S Pen Inking & Markup Suite
 * Dedicated Stylus Annotation, Real-Paper Highlighter, Palm Rejection & Reading Mode
 * ==========================================================================
 */

(() => {
  'use strict';

  // Storage key prefix
  const STORAGE_PREFIX = 'uppcs_spen_notes::';
  const CONFIG_STORAGE_KEY = 'uppcs_spen_user_prefs';

  // Default application state
  const state = {
    mode: 'read', // 'read' | 'pen' | 'highlighter' | 'eraser'
    penColor: '#1d4ed8', // Royal Blue
    highlighterColor: '#fde047', // Sunshine Yellow
    penSize: 3, // 2 (fine), 3.5 (medium), 5 (bold)
    highlighterSize: 22, // 16, 24
    notesVisible: true,
    penOnlyPalmRejection: true, // Only S Pen draws; fingers scroll naturally
    fingerDrawEnabled: false, // If true, finger can draw too
    strokes: [],
    undoStack: [],
    redoStack: [],
    isDrawing: false,
    activePointerId: null,
    currentStroke: null,
    activePathEl: null,
    isCollapsed: true, // Start minimized so it doesn't obstruct reading
    pageKey: '',
  };

  // Preset Colors
  const PEN_COLORS = [
    { label: 'Royal Blue', color: '#1d4ed8' },
    { label: 'Deep Ink', color: '#0f172a', darkColor: '#f8fafc' },
    { label: 'Crimson Red', color: '#dc2626' },
    { label: 'Forest Green', color: '#16a34a' },
    { label: 'Royal Violet', color: '#7c3aed' },
  ];

  const HIGHLIGHTER_COLORS = [
    { label: 'Sunshine Yellow', color: '#fde047' },
    { label: 'Mint Green', color: '#86efac' },
    { label: 'Neon Coral', color: '#f472b6' },
    { label: 'Sky Blue', color: '#38bdf8' },
    { label: 'Soft Lavender', color: '#c084fc' },
  ];

  // DOM Elements
  let containerEl = null;
  let svgEl = null;
  let dockEl = null;
  let launcherEl = null;
  let resizeObserver = null;

  // Helper: Get canonical page key
  function getPageKey() {
    return decodeURIComponent(window.location.pathname).replace(/\/+$/, '') || '/';
  }

  // Load preferences
  function loadPreferences() {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.penColor) state.penColor = parsed.penColor;
        if (parsed.highlighterColor) state.highlighterColor = parsed.highlighterColor;
        if (parsed.penSize) state.penSize = parsed.penSize;
        if (parsed.highlighterSize) state.highlighterSize = parsed.highlighterSize;
        if (typeof parsed.penOnlyPalmRejection === 'boolean') state.penOnlyPalmRejection = parsed.penOnlyPalmRejection;
        if (typeof parsed.fingerDrawEnabled === 'boolean') state.fingerDrawEnabled = parsed.fingerDrawEnabled;
        if (typeof parsed.isCollapsed === 'boolean') state.isCollapsed = parsed.isCollapsed;
      }
    } catch (e) {
      console.warn('SPen Annotation: Failed to load prefs', e);
    }
  }

  // Save preferences
  function savePreferences() {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({
        penColor: state.penColor,
        highlighterColor: state.highlighterColor,
        penSize: state.penSize,
        highlighterSize: state.highlighterSize,
        penOnlyPalmRejection: state.penOnlyPalmRejection,
        fingerDrawEnabled: state.fingerDrawEnabled,
        isCollapsed: state.isCollapsed,
      }));
    } catch (e) {
      // ignore
    }
  }

  // Load strokes for current page
  function loadPageStrokes() {
    state.pageKey = getPageKey();
    state.strokes = [];
    state.undoStack = [];
    state.redoStack = [];

    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + state.pageKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.strokes)) {
          state.strokes = data.strokes;
        }
      }
    } catch (e) {
      console.warn('SPen Annotation: Failed to load notes for page', e);
    }

    renderAllStrokes();
    updateBadge();
    updateUndoRedoButtons();
  }

  // Save strokes for current page
  function savePageStrokes() {
    if (!state.pageKey) return;
    try {
      if (state.strokes.length === 0) {
        localStorage.removeItem(STORAGE_PREFIX + state.pageKey);
      } else {
        localStorage.setItem(STORAGE_PREFIX + state.pageKey, JSON.stringify({
          version: 1,
          path: state.pageKey,
          updatedAt: Date.now(),
          strokes: state.strokes,
        }));
      }
    } catch (e) {
      console.warn('SPen Annotation: Failed to save notes', e);
    }
    updateBadge();
    updateUndoRedoButtons();
  }

  // Smooth quadratic Bézier path builder
  function buildSmoothPath(points) {
    if (!points || points.length === 0) return '';
    if (points.length === 1) {
      const p = points[0];
      return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)} l 0.1 0.1`;
    }

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midX = ((p1.x + p2.x) / 2).toFixed(1);
      const midY = ((p1.y + p2.y) / 2).toFixed(1);
      d += ` Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${midX} ${midY}`;
    }
    const last = points[points.length - 1];
    d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
    return d;
  }

  // Render SVG elements
  function renderAllStrokes() {
    if (!svgEl) return;
    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    state.strokes.forEach((stroke) => {
      const path = createSvgPathElement(stroke);
      svgEl.appendChild(path);
    });
  }

  function createSvgPathElement(stroke) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', stroke.d);
    path.setAttribute('id', stroke.id);
    path.setAttribute('class', `spen-stroke spen-stroke--${stroke.tool}`);

    // Color adaptation for dark mode
    const isDarkMode = document.body.getAttribute('data-md-color-scheme') === 'slate';
    let strokeColor = stroke.color;
    if (isDarkMode && (strokeColor === '#0f172a' || strokeColor === '#000000')) {
      strokeColor = '#f8fafc';
    }

    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', stroke.width);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    if (stroke.tool === 'highlighter') {
      path.setAttribute('stroke-opacity', isDarkMode ? '0.6' : '0.45');
    } else {
      path.setAttribute('stroke-opacity', '0.95');
    }
    return path;
  }

  // Update container size to match .md-content__inner
  function updateSurfaceDimensions() {
    const parent = containerEl?.parentElement;
    if (!parent || !svgEl) return;
    const scrollH = parent.scrollHeight;
    const scrollW = parent.scrollWidth;
    svgEl.setAttribute('width', `${scrollW}px`);
    svgEl.setAttribute('height', `${scrollH}px`);
    svgEl.setAttribute('viewBox', `0 0 ${scrollW} ${scrollH}`);
  }

  // Pointer Events handling on Inking Surface
  function handlePointerDown(e) {
    if (state.mode === 'read') return;

    // Check Pointer Type (S Pen vs Touch/Palm vs Mouse)
    const isPen = e.pointerType === 'pen';
    const isTouch = e.pointerType === 'touch';

    // Palm Rejection Logic:
    // If Pen-Only mode is enabled and user touches with finger/palm: allow native browser scroll!
    if (state.penOnlyPalmRejection && isTouch && !state.fingerDrawEnabled) {
      return; // Do not intercept touch, let page scroll smoothly
    }

    if (e.button !== 0 && !isPen && !isTouch) return; // Only primary button

    e.preventDefault();
    e.stopPropagation();

    state.isDrawing = true;
    state.activePointerId = e.pointerId;
    containerEl.setPointerCapture(e.pointerId);

    const rect = containerEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = (e.pressure && e.pressure > 0) ? e.pressure : 0.5;

    if (state.mode === 'eraser') {
      eraseAtPoint(x, y);
      return;
    }

    // Determine effective size (modulate with S Pen pressure if pen)
    const baseSize = state.mode === 'pen' ? state.penSize : state.highlighterSize;
    const effectiveWidth = isPen && state.mode === 'pen'
      ? Math.max(1.5, baseSize * (0.6 + 0.8 * pressure))
      : baseSize;

    const strokeColor = state.mode === 'pen' ? state.penColor : state.highlighterColor;

    const strokeId = 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    state.currentStroke = {
      id: strokeId,
      tool: state.mode,
      color: strokeColor,
      width: Number(effectiveWidth.toFixed(1)),
      points: [{ x, y, p: pressure }],
      d: `M ${x.toFixed(1)} ${y.toFixed(1)}`,
      bbox: { minX: x, minY: y, maxX: x, maxY: y },
    };

    state.activePathEl = createSvgPathElement(state.currentStroke);
    svgEl.appendChild(state.activePathEl);
  }

  function handlePointerMove(e) {
    if (!state.isDrawing || e.pointerId !== state.activePointerId) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = containerEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = (e.pressure && e.pressure > 0) ? e.pressure : 0.5;

    if (state.mode === 'eraser') {
      eraseAtPoint(x, y);
      return;
    }

    if (!state.currentStroke || !state.activePathEl) return;

    // Append point
    state.currentStroke.points.push({ x, y, p: pressure });
    state.currentStroke.bbox.minX = Math.min(state.currentStroke.bbox.minX, x);
    state.currentStroke.bbox.minY = Math.min(state.currentStroke.bbox.minY, y);
    state.currentStroke.bbox.maxX = Math.max(state.currentStroke.bbox.maxX, x);
    state.currentStroke.bbox.maxY = Math.max(state.currentStroke.bbox.maxY, y);

    // Update smooth path string
    const newD = buildSmoothPath(state.currentStroke.points);
    state.currentStroke.d = newD;
    state.activePathEl.setAttribute('d', newD);
  }

  function handlePointerUp(e) {
    if (!state.isDrawing || e.pointerId !== state.activePointerId) return;

    try {
      containerEl.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }

    state.isDrawing = false;
    state.activePointerId = null;

    if (state.mode === 'eraser') {
      savePageStrokes();
      return;
    }

    if (state.currentStroke && state.currentStroke.points.length > 0) {
      // Commit stroke
      state.strokes.push(state.currentStroke);
      state.undoStack.push({ type: 'add', stroke: state.currentStroke });
      state.redoStack = []; // Clear redo on new action
      savePageStrokes();
    }

    state.currentStroke = null;
    state.activePathEl = null;
  }

  // Stroke Eraser logic
  function eraseAtPoint(x, y) {
    const hitRadius = 18;
    const hitIndices = [];

    for (let i = state.strokes.length - 1; i >= 0; i--) {
      const stroke = state.strokes[i];
      // Quick bounding box check
      const b = stroke.bbox;
      if (x < b.minX - hitRadius || x > b.maxX + hitRadius ||
          y < b.minY - hitRadius || y > b.maxY + hitRadius) {
        continue;
      }

      // Point-distance check
      let hit = false;
      for (let j = 0; j < stroke.points.length; j++) {
        const pt = stroke.points[j];
        const dx = pt.x - x;
        const dy = pt.y - y;
        if ((dx * dx + dy * dy) <= (hitRadius * hitRadius)) {
          hit = true;
          break;
        }
      }

      if (hit) {
        hitIndices.push(i);
        break; // Erase topmost hit stroke per event
      }
    }

    if (hitIndices.length > 0) {
      const idx = hitIndices[0];
      const removed = state.strokes.splice(idx, 1)[0];
      state.undoStack.push({ type: 'delete', stroke: removed, index: idx });
      state.redoStack = [];

      // Remove from SVG
      const el = svgEl.querySelector(`[id="${removed.id}"]`);
      if (el) {
        el.classList.add('stroke-erasing');
        setTimeout(() => el.remove(), 100);
      }
      updateBadge();
      updateUndoRedoButtons();
    }
  }

  // Undo / Redo
  function undo() {
    if (state.undoStack.length === 0) return;
    const action = state.undoStack.pop();
    if (action.type === 'add') {
      // Find stroke and remove
      const idx = state.strokes.findIndex(s => s.id === action.stroke.id);
      if (idx !== -1) {
        const removed = state.strokes.splice(idx, 1)[0];
        state.redoStack.push({ type: 'add', stroke: removed, index: idx });
      }
    } else if (action.type === 'delete') {
      // Restore deleted stroke
      state.strokes.splice(action.index, 0, action.stroke);
      state.redoStack.push({ type: 'delete', stroke: action.stroke });
    }
    renderAllStrokes();
    savePageStrokes();
  }

  function redo() {
    if (state.redoStack.length === 0) return;
    const action = state.redoStack.pop();
    if (action.type === 'add') {
      // Re-add stroke
      state.strokes.splice(action.index, 0, action.stroke);
      state.undoStack.push({ type: 'add', stroke: action.stroke });
    } else if (action.type === 'delete') {
      // Re-delete stroke
      const idx = state.strokes.findIndex(s => s.id === action.stroke.id);
      if (idx !== -1) {
        const removed = state.strokes.splice(idx, 1)[0];
        state.undoStack.push({ type: 'delete', stroke: removed, index: idx });
      }
    }
    renderAllStrokes();
    savePageStrokes();
  }

  function clearAllStrokes() {
    if (state.strokes.length === 0) return;
    if (!confirm('Clear all notes and markings on this page?')) return;
    state.strokes = [];
    state.undoStack = [];
    state.redoStack = [];
    renderAllStrokes();
    savePageStrokes();
  }

  function toggleNotesVisibility() {
    state.notesVisible = !state.notesVisible;
    containerEl?.classList.toggle('notes-hidden', !state.notesVisible);
    const eyeBtn = dockEl?.querySelector('[data-action="toggle-visibility"]');
    if (eyeBtn) {
      eyeBtn.innerHTML = state.notesVisible ? '👁️' : '🙈';
      eyeBtn.title = state.notesVisible ? 'Hide notes' : 'Show notes';
    }
  }

  // Set tool mode: 'read' | 'pen' | 'highlighter' | 'eraser'
  function setMode(newMode) {
    state.mode = newMode;
    const isDrawing = newMode !== 'read';

    containerEl?.classList.toggle('mode-drawing', isDrawing);
    containerEl?.classList.toggle('finger-draw-enabled', state.fingerDrawEnabled);

    // Update Dock buttons
    dockEl?.querySelectorAll('.spen-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === newMode);
    });

    // Update options visibility
    const optionsRow = dockEl?.querySelector('.spen-options-row');
    if (optionsRow) {
      optionsRow.style.display = (newMode === 'pen' || newMode === 'highlighter') ? 'flex' : 'none';
      renderPaletteSwatches();
    }
  }

  // Render swatches depending on current tool
  function renderPaletteSwatches() {
    const swatchesContainer = dockEl?.querySelector('.spen-swatches');
    if (!swatchesContainer) return;
    swatchesContainer.innerHTML = '';

    const colors = state.mode === 'pen' ? PEN_COLORS : HIGHLIGHTER_COLORS;
    const activeColor = state.mode === 'pen' ? state.penColor : state.highlighterColor;

    colors.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'spen-color-swatch' + (activeColor === c.color ? ' active' : '');
      btn.style.backgroundColor = c.color;
      btn.title = c.label;
      btn.addEventListener('click', () => {
        if (state.mode === 'pen') {
          state.penColor = c.color;
        } else {
          state.highlighterColor = c.color;
        }
        savePreferences();
        renderPaletteSwatches();
      });
      swatchesContainer.appendChild(btn);
    });

    // Update sizes buttons
    dockEl?.querySelectorAll('.spen-size-btn').forEach((btn) => {
      const sizeVal = Number(btn.dataset.size);
      const curSize = state.mode === 'pen' ? state.penSize : state.highlighterSize;
      btn.classList.toggle('active', sizeVal === curSize);
    });
  }

  // Update badge in launcher and dock
  function updateBadge() {
    const count = state.strokes.length;
    if (launcherEl) {
      const badge = launcherEl.querySelector('.spen-badge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
      }
    }
    if (dockEl) {
      const countEl = dockEl.querySelector('.spen-note-count');
      if (countEl) {
        countEl.textContent = count > 0 ? `(${count})` : '';
      }
    }
  }

  function updateUndoRedoButtons() {
    if (!dockEl) return;
    const undoBtn = dockEl.querySelector('[data-action="undo"]');
    const redoBtn = dockEl.querySelector('[data-action="redo"]');
    if (undoBtn) undoBtn.disabled = state.undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = state.redoStack.length === 0;
  }

  // Create Minimized Launcher Button
  function createLauncher() {
    if (document.getElementById('spen-floating-launcher')) return;

    launcherEl = document.createElement('button');
    launcherEl.id = 'spen-floating-launcher';
    launcherEl.type = 'button';
    launcherEl.className = 'spen-floating-launcher';
    launcherEl.setAttribute('aria-label', 'Open S Pen Annotation Suite');
    launcherEl.innerHTML = `
      <span class="spen-launcher-icon">🖊️</span>
      <span class="spen-launcher-text">S Pen Notes</span>
      <span class="spen-badge" style="display: none;">0</span>
    `;

    launcherEl.addEventListener('click', () => {
      state.isCollapsed = false;
      savePreferences();
      dockEl?.classList.remove('is-hidden');
      launcherEl.style.display = 'none';
      // If was in read mode, activate pen mode for quick convenience
      if (state.mode === 'read') setMode('pen');
    });

    document.body.appendChild(launcherEl);
  }

  // Create Floating Dock
  function createDock() {
    if (document.getElementById('spen-toolbar-dock')) return;

    dockEl = document.createElement('div');
    dockEl.id = 'spen-toolbar-dock';
    dockEl.className = 'spen-toolbar-dock' + (state.isCollapsed ? ' is-hidden' : '');

    dockEl.innerHTML = `
      <div class="spen-dock-header" id="spen-dock-handle">
        <div class="spen-dock-title-group">
          <span class="spen-drag-indicator">⋮⋮</span>
          <span>🖊️ S Pen Studio <span class="spen-note-count"></span></span>
        </div>
        <div class="spen-dock-controls">
          <button type="button" class="spen-btn-icon" data-action="toggle-visibility" title="Show/Hide notes">👁️</button>
          <button type="button" class="spen-btn-icon" data-action="minimize" title="Minimize toolbar">✕</button>
        </div>
      </div>

      <div class="spen-dock-body">
        <!-- Mode Tabs -->
        <div class="spen-mode-selector">
          <button type="button" class="spen-mode-btn" data-mode="read">
            <span class="mode-icon">📖</span>
            <span>Read</span>
          </button>
          <button type="button" class="spen-mode-btn" data-mode="pen">
            <span class="mode-icon">🖊️</span>
            <span>Pen</span>
          </button>
          <button type="button" class="spen-mode-btn" data-mode="highlighter">
            <span class="mode-icon">🖍️</span>
            <span>Highlight</span>
          </button>
          <button type="button" class="spen-mode-btn" data-mode="eraser">
            <span class="mode-icon">🧽</span>
            <span>Erase</span>
          </button>
        </div>

        <!-- Palette & Sizes Row -->
        <div class="spen-options-row">
          <div class="spen-swatches"></div>
          <div class="spen-sizes">
            <button type="button" class="spen-size-btn" data-size="2" title="Fine tip">
              <span class="spen-size-dot" style="width: 4px; height: 4px;"></span>
            </button>
            <button type="button" class="spen-size-btn" data-size="3.5" title="Medium tip">
              <span class="spen-size-dot" style="width: 7px; height: 7px;"></span>
            </button>
            <button type="button" class="spen-size-btn" data-size="5" title="Bold tip">
              <span class="spen-size-dot" style="width: 10px; height: 10px;"></span>
            </button>
          </div>
        </div>

        <!-- Utilities Row -->
        <div class="spen-actions-row">
          <button type="button" class="spen-action-btn" data-action="undo" title="Undo stroke" disabled>↩ Undo</button>
          <button type="button" class="spen-action-btn" data-action="redo" title="Redo stroke" disabled>↪ Redo</button>
          <button type="button" class="spen-action-btn" data-action="palm-rejection" title="Toggle S Pen only palm rejection">
            🛡️ Pen Only
          </button>
          <button type="button" class="spen-action-btn" data-action="clear" title="Clear page notes">🗑️ Clear</button>
        </div>

        <!-- Palm Rejection Status & Tip -->
        <div class="spen-status-banner">
          <span class="spen-palm-badge" id="spen-palm-status">✓ S Pen Palm Rejection: Active</span>
          <span>Auto-Saved ✓</span>
        </div>
      </div>
    `;

    document.body.appendChild(dockEl);

    // Bind Mode Buttons
    dockEl.querySelectorAll('.spen-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // Bind Size Buttons
    dockEl.querySelectorAll('.spen-size-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = Number(btn.dataset.size);
        if (state.mode === 'pen') {
          state.penSize = val;
        } else {
          state.highlighterSize = val * 5; // Scale up for highlighter
        }
        savePreferences();
        renderPaletteSwatches();
      });
    });

    // Bind Actions
    dockEl.querySelector('[data-action="undo"]')?.addEventListener('click', undo);
    dockEl.querySelector('[data-action="redo"]')?.addEventListener('click', redo);
    dockEl.querySelector('[data-action="clear"]')?.addEventListener('click', clearAllStrokes);
    dockEl.querySelector('[data-action="toggle-visibility"]')?.addEventListener('click', toggleNotesVisibility);

    // Minimize Button
    dockEl.querySelector('[data-action="minimize"]')?.addEventListener('click', () => {
      state.isCollapsed = true;
      setMode('read'); // Switch to read mode when minimizing
      savePreferences();
      dockEl.classList.add('is-hidden');
      if (launcherEl) launcherEl.style.display = 'flex';
    });

    // Palm Rejection Button
    const palmBtn = dockEl.querySelector('[data-action="palm-rejection"]');
    const palmStatus = dockEl.querySelector('#spen-palm-status');

    function updatePalmUi() {
      if (palmBtn) {
        palmBtn.classList.toggle('active', state.penOnlyPalmRejection);
      }
      if (palmStatus) {
        if (state.penOnlyPalmRejection) {
          palmStatus.className = 'spen-palm-badge';
          palmStatus.textContent = '✓ Palm Rejection: Pen Inks, Touch Scrolls';
        } else {
          palmStatus.className = 'spen-palm-badge disabled';
          palmStatus.textContent = '⚠️ Touch Drawing Enabled';
        }
      }
    }

    palmBtn?.addEventListener('click', () => {
      state.penOnlyPalmRejection = !state.penOnlyPalmRejection;
      state.fingerDrawEnabled = !state.penOnlyPalmRejection;
      savePreferences();
      updatePalmUi();
      containerEl?.classList.toggle('finger-draw-enabled', state.fingerDrawEnabled);
    });

    updatePalmUi();
    setupDraggable(dockEl, dockEl.querySelector('#spen-dock-handle'));
  }

  // Modern Draggable Dock following standard best practices
  function setupDraggable(draggable, handle) {
    if (!handle) return;
    let offsetX = 0;
    let offsetY = 0;

    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, input, select, textarea, a')) return;

      const rect = draggable.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      handle.setPointerCapture(e.pointerId);
      handle.classList.add('dragging');
    });

    handle.addEventListener('pointermove', (e) => {
      if (!handle.hasPointerCapture(e.pointerId)) return;

      const maxLeft = Math.max(0, window.innerWidth - draggable.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - draggable.offsetHeight);

      const targetLeft = Math.max(8, Math.min(e.clientX - offsetX, maxLeft - 8));
      const targetTop = Math.max(8, Math.min(e.clientY - offsetY, maxTop - 8));

      draggable.style.left = `${targetLeft}px`;
      draggable.style.top = `${targetTop}px`;
      draggable.style.right = 'auto';
      draggable.style.bottom = 'auto';
    });

    handle.addEventListener('lostpointercapture', () => {
      handle.classList.remove('dragging');
    });
  }

  // Mount annotation layer into the active MkDocs article
  function mount() {
    const article = document.querySelector('.md-content__inner');
    if (!article) return;

    // Remove any previously mounted container
    const oldContainer = article.querySelector('.spen-annotation-container');
    if (oldContainer) oldContainer.remove();

    // Create container
    containerEl = document.createElement('div');
    containerEl.className = 'spen-annotation-container' + (state.mode !== 'read' ? ' mode-drawing' : '');
    if (state.fingerDrawEnabled) containerEl.classList.add('finger-draw-enabled');

    svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('class', 'spen-annotation-svg');
    containerEl.appendChild(svgEl);

    article.appendChild(containerEl);

    // Pointer events on container
    containerEl.addEventListener('pointerdown', handlePointerDown);
    containerEl.addEventListener('pointermove', handlePointerMove);
    containerEl.addEventListener('pointerup', handlePointerUp);
    containerEl.addEventListener('pointercancel', handlePointerUp);

    // Update dimensions on resize
    if (resizeObserver) resizeObserver.disconnect();
    resizeObserver = new ResizeObserver(() => {
      updateSurfaceDimensions();
    });
    resizeObserver.observe(article);
    updateSurfaceDimensions();

    // Setup UI components
    createLauncher();
    createDock();

    // Load strokes for this page
    loadPageStrokes();

    // Set initial tool mode
    setMode(state.mode);
  }

  // Initialize
  function boot() {
    loadPreferences();
    mount();
  }

  // Hook into MkDocs Material navigation observable
  if (typeof document$ !== 'undefined') {
    document$.subscribe(boot);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }
})();
