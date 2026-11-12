/* GPO Value Board on the web: a small stand-in for Obsidian, so the real GpoBoard.js runs in a browser unchanged.
   It gives the script what it asks Obsidian for: the element helpers (createEl / createDiv / addClass …), a vault whose
   files are the ones in the published bundle (reads work, writes stay in this page only), Notice / Menu / Modal, and
   harmless stand-ins for the desktop-only parts (files, windows, hotkeys, screenshots). View-only by design. */
(function () {
  'use strict';
  const files = new Map();
  const noop = () => {};
  const P = HTMLElement.prototype, N = Node.prototype;
  function fill(el, o) {
    if (o == null) return el;
    if (typeof o === 'string') { el.className = o; return el; }
    if (o.cls) el.className = Array.isArray(o.cls) ? o.cls.join(' ') : o.cls;
    if (o.text != null) el.textContent = o.text instanceof Node ? '' : String(o.text);
    if (o.text instanceof Node) el.appendChild(o.text);
    if (o.attr) for (const k of Object.keys(o.attr)) { const v = o.attr[k]; if (v === null || v === undefined || v === false) continue; el.setAttribute(k, v === true ? '' : String(v)); }
    if (o.title) el.title = o.title;
    if (o.href) el.setAttribute('href', o.href);
    if (o.type) el.setAttribute('type', o.type);
    if (o.value != null) el.value = o.value;
    if (o.placeholder) el.placeholder = o.placeholder;
    return el;
  }
  function make(tag, o, cb) { const el = fill(document.createElement(tag), o); if (typeof cb === 'function') cb(el); return el; }
  N.createEl = function (tag, o, cb) { const el = make(tag, o, cb); if (o && o.prepend) this.prepend(el); else this.appendChild(el); return el; };
  N.createDiv = function (o, cb) { return this.createEl('div', o, cb); };
  N.createSpan = function (o, cb) { return this.createEl('span', o, cb); };
  N.createSvg = function (tag, o) { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); if (o && o.cls) el.setAttribute('class', o.cls); if (o && o.attr) for (const k of Object.keys(o.attr)) el.setAttribute(k, o.attr[k]); this.appendChild(el); return el; };
  N.empty = function () { while (this.lastChild) this.removeChild(this.lastChild); };
  N.detach = function () { if (this.parentNode) this.parentNode.removeChild(this); };
  N.appendText = function (t) { this.appendChild(document.createTextNode(t)); };
  N.setChildrenInPlace = function (kids) { this.empty(); kids.forEach((k) => this.appendChild(k)); };
  const E = Element.prototype;
  E.addClass = function (...c) { c.flat().forEach((x) => String(x).split(/\s+/).filter(Boolean).forEach((y) => this.classList.add(y))); return this; };
  E.addClasses = function (c) { return this.addClass(c); };
  E.removeClass = function (...c) { c.flat().forEach((x) => String(x).split(/\s+/).filter(Boolean).forEach((y) => this.classList.remove(y))); return this; };
  E.removeClasses = function (c) { return this.removeClass(c); };
  E.toggleClass = function (c, on) { (Array.isArray(c) ? c : String(c).split(/\s+/)).filter(Boolean).forEach((y) => this.classList.toggle(y, on === undefined ? undefined : Boolean(on))); return this; };
  E.hasClass = function (c) { return this.classList.contains(c); };
  E.setText = function (t) { this.textContent = t == null ? '' : String(t); return this; };
  E.getText = function () { return this.textContent; };
  E.setAttr = function (k, v) { if (v === null || v === undefined) this.removeAttribute(k); else this.setAttribute(k, String(v)); return this; };
  E.setAttrs = function (o) { Object.keys(o || {}).forEach((k) => this.setAttr(k, o[k])); return this; };
  E.getAttr = function (k) { return this.getAttribute(k); };
  E.find = function (s) { return this.querySelector(s); };
  E.findAll = function (s) { return Array.from(this.querySelectorAll(s)); };
  E.matchParent = function (s) { return this.parentElement ? this.parentElement.closest(s) : null; };
  E.isShown = function () { return Boolean(this.offsetParent); };
  P.show = function () { this.style.display = ''; return this; };
  P.hide = function () { this.style.display = 'none'; return this; };
  P.toggle = function (on) { this.style.display = on ? '' : 'none'; return this; };
  P.toggleVisibility = function (on) { this.style.visibility = on ? '' : 'hidden'; return this; };
  P.setCssStyles = function (o) { Object.assign(this.style, o); return this; };
  P.setCssProps = function (o) { Object.keys(o || {}).forEach((k) => this.style.setProperty(k, o[k])); return this; };
  P.onClickEvent = function (fn, opt) { this.addEventListener('click', fn, opt); this.addEventListener('auxclick', fn, opt); };
  P.onNodeInserted = function (fn) { fn(); return noop; };
  P.onWindowMigrated = function () { return noop; };
  P.trigger = function (name) { this.dispatchEvent(new Event(name, { bubbles: true })); };
  EventTarget.prototype.on = EventTarget.prototype.on || function (type, sel, fn, opt) { const h = (e) => { const t = e.target && e.target.closest ? e.target.closest(sel) : null; if (t && this.contains(t)) fn.call(this, e, t); }; this.addEventListener(type, h, opt); return h; };
  Object.defineProperty(N, 'doc', { get() { return this.ownerDocument || document; }, configurable: true });
  Object.defineProperty(N, 'win', { get() { return window; }, configurable: true });
  Object.defineProperty(UIEvent.prototype, 'doc', { get() { return document; }, configurable: true });
  Object.defineProperty(UIEvent.prototype, 'win', { get() { return window; }, configurable: true });
  window.createEl = make;
  window.createDiv = (o, cb) => make('div', o, cb);
  window.createSpan = (o, cb) => make('span', o, cb);
  window.createFragment = (cb) => { const f = document.createDocumentFragment(); if (cb) cb(f); return f; };
  window.activeDocument = document;
  window.activeWindow = window;
  window.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  if (!Array.prototype.contains) Object.defineProperty(Array.prototype, 'contains', { value(x) { return this.includes(x); } });
  if (!Array.prototype.last) Object.defineProperty(Array.prototype, 'last', { value() { return this[this.length - 1]; } });
  if (!Array.prototype.first) Object.defineProperty(Array.prototype, 'first', { value() { return this[0]; } });
  if (!Array.prototype.remove) Object.defineProperty(Array.prototype, 'remove', { value(x) { const i = this.indexOf(x); if (i >= 0) this.splice(i, 1); } });
  if (!String.prototype.contains) Object.defineProperty(String.prototype, 'contains', { value(x) { return this.includes(x); } });

  /* ---- Obsidian's small classes */
  const toasts = () => document.getElementById('web-notices') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'web-notices' }));
  class Notice {
    constructor(msg, ms) {
      this.noticeEl = toasts().createDiv({ cls: 'notice' });
      this.containerEl = this.noticeEl;
      this.setMessage(msg);
      if (ms !== 0) setTimeout(() => this.hide(), ms || 4000);
    }
    setMessage(m) { this.noticeEl.empty(); if (m instanceof Node) this.noticeEl.appendChild(m); else this.noticeEl.textContent = String(m == null ? '' : m); return this; }
    hide() { this.noticeEl.remove(); }
  }
  class MenuItem {
    constructor(menu) { this.menu = menu; this.dom = createDiv({ cls: 'menu-item' }); this.iconEl = this.dom.createDiv({ cls: 'menu-item-icon' }); this.titleEl = this.dom.createDiv({ cls: 'menu-item-title' }); }
    setTitle(t) { this.titleEl.empty(); if (t instanceof Node) this.titleEl.appendChild(t); else this.titleEl.textContent = t; return this; }
    setIcon() { return this; }
    setChecked(on) { this.dom.toggleClass('mod-checked', on); if (on) this.iconEl.textContent = '✓'; return this; }
    setDisabled(on) { this.dom.toggleClass('is-disabled', on); this.disabled = on; return this; }
    setSection() { return this; }
    setIsLabel(on) { this.dom.toggleClass('is-label', on); return this; }
    setWarning(on) { this.dom.toggleClass('is-warning', on); return this; }
    onClick(fn) { this.dom.addEventListener('click', (e) => { if (this.disabled) return; this.menu.hide(); fn(e); }); return this; }
    setSubmenu() { return new Menu(); }
  }
  class Menu {
    constructor() { this.dom = createDiv({ cls: 'menu' }); this.items = []; }
    addItem(cb) { const it = new MenuItem(this); this.items.push(it); this.dom.appendChild(it.dom); cb(it); return this; }
    addSeparator() { this.dom.createDiv({ cls: 'menu-separator' }); return this; }
    setNoIcon() { this.dom.addClass('no-icon'); return this; }
    setUseNativeMenu() { return this; }
    onHide(fn) { this._onHide = fn; return this; }
    showAtPosition(p) {
      document.body.appendChild(this.dom);
      const w = this.dom.offsetWidth, h = this.dom.offsetHeight;
      this.dom.style.left = Math.max(4, Math.min(p.x, innerWidth - w - 4)) + 'px';
      this.dom.style.top = Math.max(4, Math.min(p.y, innerHeight - h - 4)) + 'px';
      this._off = (e) => { if (!this.dom.contains(e.target)) this.hide(); };
      setTimeout(() => { document.addEventListener('mousedown', this._off, true); document.addEventListener('keydown', this._esc = (e) => { if (e.key === 'Escape') this.hide(); }, true); }, 0);
      return this;
    }
    showAtMouseEvent(e) { return this.showAtPosition({ x: e.clientX, y: e.clientY }); }
    hide() { this.dom.remove(); document.removeEventListener('mousedown', this._off, true); document.removeEventListener('keydown', this._esc, true); if (this._onHide) this._onHide(); return this; }
    close() { return this.hide(); }
  }
  class Modal {
    constructor(a) {
      this.app = a;
      this.containerEl = createDiv({ cls: 'modal-container' });
      this.bgEl = this.containerEl.createDiv({ cls: 'modal-bg' });
      this.modalEl = this.containerEl.createDiv({ cls: 'modal' });
      const x = this.modalEl.createDiv({ cls: 'modal-close-button', text: '✕' });
      this.titleEl = this.modalEl.createDiv({ cls: 'modal-title' });
      this.contentEl = this.modalEl.createDiv({ cls: 'modal-content' });
      this.scope = new Scope();
      x.addEventListener('click', () => this.close());
      this.bgEl.addEventListener('click', () => this.close());
    }
    setTitle(t) { this.titleEl.textContent = t; return this; }
    open() { document.body.appendChild(this.containerEl); this._esc = (e) => { if (e.key === 'Escape') this.close(); }; document.addEventListener('keydown', this._esc); if (this.onOpen) this.onOpen(); }
    close() { document.removeEventListener('keydown', this._esc); if (this.onClose) this.onClose(); this.containerEl.remove(); }
  }
  class Scope { constructor(parent) { this.parent = parent; this.keys = []; } register(modifiers, key, func) { const h = { modifiers: modifiers ? modifiers.join(',') : null, key, func }; this.keys.push(h); return h; } unregister(h) { this.keys.remove(h); } handleKey() { return undefined; } }
  class Component {
    constructor() { this._kids = []; this._undo = []; }
    load() { if (this.onload) this.onload(); } unload() { this._undo.splice(0).forEach((f) => { try { f(); } catch (e) { /* next */ } }); if (this.onunload) this.onunload(); }
    addChild(c) { this._kids.push(c); c.load(); return c; } removeChild(c) { this._kids.remove(c); c.unload(); return c; }
    register(fn) { this._undo.push(fn); } registerEvent() {} registerInterval(id) { this._undo.push(() => clearInterval(id)); return id; }
    registerDomEvent(el, type, fn, opt) { el.addEventListener(type, fn, opt); this._undo.push(() => el.removeEventListener(type, fn, opt)); }
  }
  class MarkdownRenderChild extends Component { constructor(el) { super(); this.containerEl = el; } }
  const obsidian = { Notice, Menu, MenuItem, Modal, Scope, Component, MarkdownRenderChild, Platform: { isDesktop: false, isDesktopApp: false, isMobile: false, isWin: false },
    setIcon: noop, setTooltip: (el, t) => { if (el) el.title = t; }, normalizePath: (p) => String(p).replace(/\\/g, '/').replace(/^\/+|\/+$/g, ''), debounce: (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; },
    requestUrl: () => Promise.reject(new Error('not on the web')), MarkdownRenderer: { render: (a, md, el) => { el.textContent = md; return Promise.resolve(); }, renderMarkdown: (md, el) => { el.textContent = md; return Promise.resolve(); } },
    moment: window.moment, TFile: class {}, TFolder: class {} };

  /* ---- anything desktop-only: an object that swallows every call */
  function hollow(name) {
    const fn = function () { return hollow(name); };
    return new Proxy(fn, { get(t, k) { if (k === 'then') return undefined; if (k === Symbol.toPrimitive) return () => ''; if (k === 'length') return 0; if (k === Symbol.iterator) return function* () {}; return hollow(name + '.' + String(k)); }, apply() { return hollow(name); }, construct() { return hollow(name); } });
  }
  const path = { join: (...a) => a.filter(Boolean).join('/').replace(/\/+/g, '/'), basename: (p, ext) => { const b = String(p).split(/[\\/]/).pop(); return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b; }, dirname: (p) => String(p).replace(/[\\/][^\\/]*$/, ''), extname: (p) => (/\.[^./\\]+$/.exec(String(p)) || [''])[0], sep: '/', resolve: (...a) => a.join('/'), normalize: (p) => p };
  const fsStub = { existsSync: () => false, readFileSync: () => { throw new Error('no files on the web'); }, writeFileSync: noop, unlinkSync: noop, mkdirSync: noop, readdirSync: () => [], statSync: () => { throw new Error('no files on the web'); }, promises: hollow('fs.promises'), watch: () => ({ close: noop }) };
  const mods = { obsidian, path, fs: fsStub, os: { tmpdir: () => '', homedir: () => '', platform: () => 'web' }, child_process: { exec: noop, execFile: noop, spawn: () => hollow('spawn'), execSync: () => '' } };
  window.require = (name) => mods[name] || hollow(name);
  window.process = window.process || { env: {}, platform: 'web' };
  window.Buffer = window.Buffer || { from: () => ({ toString: () => '' }), concat: () => ({}) };

  /* ---- the vault: the bundle's files; writes stay in this page */
  const adapter = {
    read: (p) => (files.has(p) ? Promise.resolve(files.get(p)) : Promise.reject(new Error('ENOENT ' + p))),
    exists: (p) => Promise.resolve(files.has(p) || Array.from(files.keys()).some((k) => k.startsWith(p + '/'))),
    write: (p, text) => { files.set(p, String(text)); return Promise.resolve(); },
    append: (p, text) => { files.set(p, (files.get(p) || '') + text); return Promise.resolve(); },
    list: (dir) => Promise.resolve({ files: Array.from(files.keys()).filter((k) => k.startsWith(dir + '/')), folders: [] }),
    mkdir: () => Promise.resolve(), remove: (p) => { files.delete(p); return Promise.resolve(); }, rmdir: () => Promise.resolve(),
    stat: (p) => Promise.resolve(files.has(p) ? { type: 'file', mtime: Date.now(), ctime: Date.now(), size: files.get(p).length } : null),
    getBasePath: () => '', getFullPath: (p) => p, getResourcePath: (p) => p, basePath: '',
  };
  const fileOf = (p) => (files.has(p) ? { path: p, name: p.split('/').pop(), basename: p.split('/').pop().replace(/\.[^.]+$/, ''), extension: (p.split('.').pop() || ''), stat: { mtime: Date.now(), size: files.get(p).length } } : null);
  const leaf = { view: { containerEl: document.body, file: null, getViewType: () => 'markdown', scope: new Scope() }, containerEl: document.body, getContainer: () => ({ win: window }), rebuildView: noop };
  const events = () => ({ on: () => ({}), off: noop, offref: noop, trigger: noop });
  window.app = {
    vault: Object.assign(events(), { adapter, getAbstractFileByPath: fileOf, getFileByPath: fileOf, read: (f) => adapter.read(f.path), cachedRead: (f) => adapter.read(f.path), modify: (f, t) => adapter.write(f.path, t),
      process: (f, fn) => adapter.read(f.path).then((t) => adapter.write(f.path, fn(t))), create: (p, t) => adapter.write(p, t).then(() => fileOf(p)), getName: () => 'web', configDir: '.obsidian', getFiles: () => [] }),
    workspace: Object.assign(events(), { iterateAllLeaves: noop, activeLeaf: leaf, getLeaf: () => leaf, getActiveFile: () => null, openLinkText: () => Promise.resolve(), openPopoutLeaf: () => leaf, getLeavesOfType: () => [], onLayoutReady: (fn) => fn(), containerEl: document.body, getActiveViewOfType: () => null }),
    metadataCache: Object.assign(events(), { getFileCache: () => null, getFirstLinkpathDest: () => null }),
    plugins: { plugins: { customjs: { registerMarkdownCodeBlockProcessor: noop, addCommand: noop, registerEvent: noop, registerInterval: (id) => id, registerDomEvent: (el, t, fn, o) => el.addEventListener(t, fn, o) } }, enabledPlugins: new Set() },
    keymap: { pushScope: noop, popScope: noop }, scope: new Scope(), commands: { executeCommandById: noop, commands: {} }, setting: { open: noop, openTabById: noop },
    isMobile: false, appId: 'web', loadLocalStorage: (k) => { try { return localStorage.getItem('gpo-web-' + k); } catch (e) { return null; } }, saveLocalStorage: (k, v) => { try { localStorage.setItem('gpo-web-' + k, v); } catch (e) { /* private window */ } },
  };
  window.customJS = window.customJS || {};

  /* ---- start: put the bundle's files in, run the board's script, draw it into `host` */
  window.GpoWeb = {
    files,
    async start(bundle, host, opts) {
      files.clear();
      Object.keys(bundle.files || {}).forEach((k) => files.set(k, bundle.files[k]));
      if (opts && opts.patchConfig) {
        const p = 'Resources/utility-config.json';
        const cfg = JSON.parse(files.get(p) || '{}');
        cfg.gpoBoard = Object.assign(cfg.gpoBoard || {}, opts.patchConfig);
        files.set(p, JSON.stringify(cfg));
      }
      if (!window.GpoBoard || window.__gpoScript !== bundle.digest) {
        const Board = new Function(bundle.script + '\n;return GpoBoard;')();
        window.GpoBoard = Board;
        window.__gpoScript = bundle.digest;
        await new Board().invoke();
      }
      host.empty();
      const el = host.createDiv({ cls: 'block-language-gpo-board' });
      await window._gpoBoardRender('', el, { sourcePath: 'Gaming/GPO Value Board.md', addChild: (c) => { try { c.load(); } catch (e) { /* drawn anyway */ } }, getSectionInfo: () => null });
      return el;
    },
  };
}());
