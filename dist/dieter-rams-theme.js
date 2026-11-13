/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2, e2 = false, h2) {
    var _a2;
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i2 ?? (i2 = r2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = (t2) => t2, s$1 = t$1.trustedTypes, e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$2, r$2 = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y2 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), b = x(1), w$1 = x(2), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
function V(t2, i2) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e ? e.createHTML(i2) : i2;
}
const N = (t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y2.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n3 = void 0);
    const x2 = c2 === p && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$2 + x2) : s3 + o$2 + (-2 === d2 ? i3 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
};
class S {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i2);
    if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o$2), e3 = /([.?@])?(.*)/.exec(i3);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o$2) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y2.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$2), i3 = t3.length - 1;
          if (i3 > 0) {
            r2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i3], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$1) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$2, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$2.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function M(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === E) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = a(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class R {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? l).importNode(i2, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n3];
      }
      o2 !== (r2 == null ? void 0 : r2.index) && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class k {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = M(this, t2, i2), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = C.get(t2.strings);
    return void 0 === i2 && C.set(t2.strings, i2 = new S(t2)), i2;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$1(t2).nextSibling;
      i$1(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i2, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M(this, e3[s2 + n3], i2, n3), r2 === E && (r2 = this._$AH[n3]), o2 || (o2 = !a(r2) || r2 !== this._$AH[n3]), r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
class z extends H {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = M(this, t2, i2, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class Z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
}
const B = t$1.litHtmlPolyfillSupport;
B == null ? void 0 : B(S, k), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.3");
const D = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new k(i2.insertBefore(c(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return E;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
var __defProp$4 = Object.defineProperty;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$4(target, key, result);
  return result;
};
class Piece extends i {
  constructor() {
    super(...arguments);
    this.lastRows = 0;
  }
  setConfig(config) {
    this.config = config;
  }
  /** Tell the enclosing panel how many grid rows this piece needs (data-driven height). */
  reportRows(rows) {
    if (rows === this.lastRows) return;
    this.lastRows = rows;
    this.dispatchEvent(new CustomEvent("rams-rows", { detail: { rows }, bubbles: true, composed: true }));
  }
  /** Convert a measured pixel height to whole grid rows, using the row and gap tokens. */
  rowsFor(px) {
    const style = getComputedStyle(this);
    const row = parseFloat(style.getPropertyValue("--_row")) || 56;
    const gap = parseFloat(style.getPropertyValue("--_gap")) || 8;
    return Math.max(1, Math.ceil((px + gap) / (row + gap)));
  }
  getCardSize() {
    var _a2;
    return ((_a2 = this.config) == null ? void 0 : _a2.rows) ?? 1;
  }
}
__decorateClass$a([
  n2({ attribute: false })
], Piece.prototype, "hass");
__decorateClass$a([
  n2({ attribute: false })
], Piece.prototype, "config");
function fireAction(node, config, action) {
  node.dispatchEvent(new CustomEvent("hass-action", { detail: { config, action }, bubbles: true, composed: true }));
}
function readState(hass, entity, rules) {
  var _a2, _b, _c;
  const state = entity && ((_a2 = hass == null ? void 0 : hass.states[entity]) == null ? void 0 : _a2.state) || "";
  return {
    state,
    alert: !!((_b = rules.alert_when) == null ? void 0 : _b.includes(state)),
    selected: !!((_c = rules.selected_when) == null ? void 0 : _c.includes(state))
  };
}
const tokens = i$3`
  :host {
    --_plate: var(--rams-plate, #c8c5b9);
    --_cap: var(--rams-cap, #d9d2c6);
    --_cap-dark: var(--rams-cap-dark, #261201);
    --_cap-dark-ink: var(--rams-cap-dark-ink, #d9d2c6);
    --_field: var(--rams-field, #c9ccbf);
    --_ink: var(--rams-ink, #261201);
    --_muted: var(--rams-muted, #736356);
    --_active: var(--rams-active, #ed8008);
    --_honey: var(--rams-honey, #bf7c2a);
    --_alert: var(--rams-alert, #ad1d1d);
    --_alert-ink: var(--rams-alert-ink, #d9d2c6);
    --_border: var(--rams-border, 1px solid rgba(38, 18, 1, 0.28));
    --_raised: var(--rams-raised, 0 2px 3px rgba(38, 18, 1, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.55));
    --_pressed: var(--rams-pressed, inset 0 2px 3px rgba(38, 18, 1, 0.3));
    --_inset: var(--rams-inset, inset 0 2px 3px rgba(38, 18, 1, 0.18));
    --_radius: var(--rams-radius, 5px);
    --_row: var(--rams-row, 56px);
    --_gap: var(--rams-gap, 8px);
    font-family: var(--rams-font, "Helvetica Neue", Helvetica, Arial, sans-serif);
    color: var(--_ink);
  }
`;
const domainOf = (entity) => entity.split(".")[0];
const num = (v2) => v2 === void 0 || v2 === null || v2 === "" || Number.isNaN(Number(v2)) ? void 0 : Number(v2);
function readNumber(hass, entity, attribute) {
  const e2 = entity ? hass == null ? void 0 : hass.states[entity] : void 0;
  if (!e2) return void 0;
  if (attribute) return num(e2.attributes[attribute]);
  switch (domainOf(e2.entity_id)) {
    case "light": {
      const b2 = num(e2.attributes.brightness);
      return e2.state === "off" ? 0 : b2 === void 0 ? void 0 : Math.round(b2 / 255 * 100);
    }
    case "media_player": {
      const v2 = num(e2.attributes.volume_level);
      return v2 === void 0 ? void 0 : Math.round(v2 * 100);
    }
    case "climate":
      return num(e2.attributes.temperature);
    default:
      return num(e2.state);
  }
}
function defaultRange(hass, entity) {
  const e2 = entity ? hass == null ? void 0 : hass.states[entity] : void 0;
  const a2 = (e2 == null ? void 0 : e2.attributes) ?? {};
  switch (e2 && domainOf(e2.entity_id)) {
    case "climate":
      return { min: num(a2.min_temp) ?? 7, max: num(a2.max_temp) ?? 35, step: num(a2.target_temp_step) ?? 0.5 };
    case "input_number":
    case "number":
      return { min: num(a2.min) ?? 0, max: num(a2.max) ?? 100, step: num(a2.step) ?? 1 };
    default:
      return { min: 0, max: 100, step: 1 };
  }
}
const clamp = (v2, r2) => Math.min(r2.max, Math.max(r2.min, Math.round(v2 / r2.step) * r2.step));
async function writeNumber(hass, entity, value) {
  const entity_id = entity;
  switch (domainOf(entity)) {
    case "light":
      return hass.callService("light", value <= 0 ? "turn_off" : "turn_on", value <= 0 ? { entity_id } : { entity_id, brightness_pct: value });
    case "media_player":
      return hass.callService("media_player", "volume_set", { entity_id, volume_level: value / 100 });
    case "climate":
      return hass.callService("climate", "set_temperature", { entity_id, temperature: value });
    case "input_number":
      return hass.callService("input_number", "set_value", { entity_id, value });
    case "number":
      return hass.callService("number", "set_value", { entity_id, value });
    default:
      throw new Error(`rams: cannot set a number on ${entity}`);
  }
}
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
const HOLD_MS = 500;
let RamsButton = class extends Piece {
  constructor() {
    super(...arguments);
    this.held = false;
    this.down = () => {
      this.held = false;
      this.holdTimer = window.setTimeout(() => {
        this.held = true;
        if (this.config) fireAction(this, this.config, "hold");
      }, HOLD_MS);
    };
    this.up = () => window.clearTimeout(this.holdTimer);
    this.onTap = () => {
      const c2 = this.config;
      if (this.held || !c2) return;
      if (c2.adjust_by && c2.entity && this.hass) {
        const now = readNumber(this.hass, c2.entity);
        if (now === void 0) return;
        const range = defaultRange(this.hass, c2.entity);
        void writeNumber(this.hass, c2.entity, clamp(now + c2.adjust_by, range));
        return;
      }
      fireAction(this, c2, "tap");
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-button", name: "Button" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "label", selector: { text: {} } },
        { name: "show_state", selector: { boolean: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "shape", selector: { select: { mode: "dropdown", options: [{ value: "key", label: "Key" }, { value: "round", label: "Round" }] } } },
            { name: "tone", selector: { select: { mode: "dropdown", options: [{ value: "neutral", label: "Neutral" }, { value: "dark", label: "Dark" }, { value: "alert", label: "Alert" }] } } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } },
            { name: "adjust_by", selector: { number: { step: "any", mode: "box" } } }
          ]
        },
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "alert_when", selector: { select: { multiple: true, custom_value: true, options: [] } } },
            { name: "selected_when", selector: { select: { multiple: true, custom_value: true, options: [] } } }
          ]
        },
        { name: "tap_action", selector: { ui_action: {} } },
        { name: "hold_action", selector: { ui_action: {} } }
      ],
      computeLabel: (s2) => s2.name.replace(/_/g, " ")
    };
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const view = readState(this.hass, c2.entity, c2);
    const tone = view.alert ? "alert" : c2.tone ?? "neutral";
    const small = c2.show_state ? view.state : c2.label;
    const shape = c2.shape ?? "key";
    const cls = [shape === "round" ? "btn round" : "btn", tone !== "neutral" ? tone : "", view.selected ? "selected" : ""].filter(Boolean).join(" ");
    const button = b`<button class=${cls} @pointerdown=${this.down} @pointerup=${this.up} @pointerleave=${this.up} @click=${this.onTap}>
      ${shape === "key" && small ? b`<span class="small">${small}</span>` : A}
      <span>${c2.name ?? ""}</span>
    </button>`;
    if (shape === "key") return button;
    return b`<div class="round-cell ${small ? "has-label" : ""}">${small ? b`<span class="small">${small}</span>` : A}${button}</div>`;
  }
};
RamsButton.styles = [
  tokens,
  i$3`
      :host { display: block; height: 100%; min-width: 0; }
      .btn {
        box-sizing: border-box; height: 100%; width: 100%;
        display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px;
        background: var(--_cap); color: var(--_ink);
        border: var(--_border); border-radius: var(--_radius); box-shadow: var(--_raised);
        font: inherit; font-size: 13px; cursor: pointer; user-select: none; position: relative; padding: 0 6px;
      }
      .btn:active { box-shadow: var(--_pressed); filter: brightness(0.94); }
      .small { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .dark { background: var(--_cap-dark); color: var(--_cap-dark-ink); }
      .alert { background: var(--_alert); color: var(--_alert-ink); }
      .alert .small, .dark .small { color: inherit; opacity: 0.8; }
      .selected { outline: 2px solid var(--_ink); outline-offset: -2px; }
      /* round: a circle as tall as the cell, centred */
      .round-cell { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; }
      .round-cell .small { text-transform: none; letter-spacing: 0; }
      .round { aspect-ratio: 1; height: auto; width: min(100%, var(--_row)); flex: 0 1 auto; border-radius: 50%; padding: 0; }
      .round-cell.has-label .round { width: min(100%, 38px); }
    `
];
RamsButton = __decorateClass$9([
  t("rams-button")
], RamsButton);
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsDisplay = class extends Piece {
  static getStubConfig() {
    return { type: "custom:rams-display", title: "Title", text: "Value", size: "medium" };
  }
  static getConfigForm() {
    const dropdown = (name, options) => ({
      name,
      selector: { select: { mode: "dropdown", options: options.map(([value, label]) => ({ value, label })) } }
    });
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "text", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} } },
            { name: "unit", selector: { text: {} } },
            dropdown("frame", [["none", "None"], ["outline", "Outline"], ["recessed", "Recessed"]]),
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } }
          ]
        }
      ],
      computeLabel: (s2) => s2.name.replace(/_/g, " ")
    };
  }
  value() {
    var _a2;
    const c2 = this.config;
    if (!c2.entity) return c2.text ?? "";
    const entity = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity];
    if (!entity) return "";
    return c2.attribute ? String(entity.attributes[c2.attribute] ?? "") : entity.state;
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const cls = [c2.frame && c2.frame !== "none" ? c2.frame : "", c2.align ?? "start", c2.size ?? "medium", c2.title ? "has-title" : ""].filter(Boolean).join(" ");
    return b`<div class="box ${cls}">
      ${c2.title ? b`<span class="title">${c2.title}</span>` : A}
      <span class="value">${this.value()}${c2.unit ? b`<span class="unit">${c2.unit}</span>` : A}</span>
    </div>`;
  }
};
RamsDisplay.styles = [
  tokens,
  i$3`
      :host { display: block; height: 100%; min-width: 0; }
      .box { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 10px; border-radius: var(--_radius); overflow: hidden; }
      .outline { border: var(--_border); }
      .recessed { background: var(--_field); border: var(--_border); box-shadow: var(--_inset); }
      .start { align-items: flex-start; text-align: left; }
      .center { align-items: center; text-align: center; }
      .end { align-items: flex-end; text-align: right; }
      .box.has-title { justify-content: flex-start; padding-top: 8px; padding-bottom: 8px; }
      .has-title .value { flex: 1; display: flex; align-items: center; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .value { line-height: 1.1; }
      .small .value { font-size: 12px; }
      .medium .value { font-size: 20px; }
      .large .value { font-size: 44px; letter-spacing: -0.02em; }
      .unit { font-size: 0.4em; color: var(--_muted); margin-left: 3px; letter-spacing: 0; }
    `
];
RamsDisplay = __decorateClass$8([
  t("rams-display")
], RamsDisplay);
var __defProp$3 = Object.defineProperty;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$3(target, key, result);
  return result;
};
class RamsPanelEditor extends i {
  constructor() {
    super(...arguments);
    this.stackOk = !!customElements.get("hui-stack-card-editor");
    this.columnsChanged = (e2) => {
      e2.stopPropagation();
      this.emit({ ...this.config, ...e2.detail.value });
    };
    this.cardsChanged = (e2) => {
      e2.stopPropagation();
      this.emit({ ...this.config, cards: e2.detail.config.cards ?? [] });
    };
  }
  setConfig(config) {
    this.config = config;
  }
  emit(config) {
    this.lastCards = config.cards;
    this.config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
  /** Hand the current pieces to HA's stack editor, only when they changed from outside it. */
  updated() {
    var _a2;
    const editor = this.renderRoot.querySelector("hui-stack-card-editor");
    const cards = ((_a2 = this.config) == null ? void 0 : _a2.cards) ?? [];
    if (editor && cards !== this.lastCards) {
      this.lastCards = cards;
      editor.setConfig({ type: "vertical-stack", cards });
    }
  }
  render() {
    if (!this.config || !this.hass) return A;
    const schema = [{ name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } }];
    return b`
      <ha-form .hass=${this.hass} .data=${{ columns: this.config.columns ?? 12 }} .schema=${schema} .computeLabel=${(s2) => s2.name} @value-changed=${this.columnsChanged}></ha-form>
      ${this.stackOk ? b`<hui-stack-card-editor
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            @config-changed=${this.cardsChanged}
          ></hui-stack-card-editor>` : b`<p>The visual piece editor is not available in this Home Assistant version. Use "Show code editor" to edit the cards.</p>`}
    `;
  }
}
__decorateClass$7([
  n2({ attribute: false })
], RamsPanelEditor.prototype, "hass");
__decorateClass$7([
  n2({ attribute: false })
], RamsPanelEditor.prototype, "lovelace");
__decorateClass$7([
  n2({ attribute: false })
], RamsPanelEditor.prototype, "config");
if (!customElements.get("rams-panel-editor")) customElements.define("rams-panel-editor", RamsPanelEditor);
async function loadPanelEditor() {
  try {
    const helpers = await window.loadCardHelpers();
    helpers.createCardElement({ type: "vertical-stack", cards: [] });
    await customElements.whenDefined("hui-vertical-stack-card");
    await customElements.get("hui-vertical-stack-card").getConfigElement();
    await customElements.whenDefined("hui-stack-card-editor");
  } catch {
  }
  return document.createElement("rams-panel-editor");
}
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsPanel = class extends Piece {
  constructor() {
    super(...arguments);
    this.onRows = (e2) => {
      const card = e2.composedPath().find((n3) => n3.localName === "hui-card");
      if (card) card.style.gridRow = `span ${e2.detail.rows}`;
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-panel", columns: 6, cards: [] };
  }
  static async getConfigElement() {
    return loadPanelEditor();
  }
  getGridOptions() {
    return { columns: 12, rows: "auto" };
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const cols = c2.columns ?? 12;
    return b`<div class="plate" @rams-rows=${this.onRows} style="grid-template-columns: repeat(${cols}, minmax(0, 1fr))">
      ${(c2.cards ?? []).map(
      (card) => b`<hui-card
          .config=${card}
          .hass=${this.hass}
          style="grid-column: span ${card.columns ?? 1}; grid-row: span ${typeof card.rows === "number" ? card.rows : 1}"
        ></hui-card>`
    )}
    </div>`;
  }
};
RamsPanel.styles = [
  tokens,
  i$3`
      :host { display: block; }
      .plate { display: grid; gap: var(--_gap); grid-auto-rows: var(--_row); padding: var(--_gap); background: var(--_plate); border-radius: calc(var(--_radius) + 1px); }
      hui-card { min-width: 0; }
    `
];
RamsPanel = __decorateClass$6([
  t("rams-panel")
], RamsPanel);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let RamsRuler = class extends Piece {
  constructor() {
    super(...arguments);
    this.onDown = (e2) => {
      var _a2;
      if (!((_a2 = this.config) == null ? void 0 : _a2.interactive)) return;
      const el = e2.currentTarget;
      el.setPointerCapture(e2.pointerId);
      this.drag = this.fromPointer(e2, el);
    };
    this.onMove = (e2) => {
      if (this.drag === void 0) return;
      this.drag = this.fromPointer(e2, e2.currentTarget);
    };
    this.onUp = () => {
      const c2 = this.config;
      if (this.drag !== void 0 && (c2 == null ? void 0 : c2.entity) && this.hass) void writeNumber(this.hass, c2.entity, this.drag);
      this.drag = void 0;
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-ruler", labels: true };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        { name: "target_entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "min", selector: { number: { step: "any", mode: "box" } } },
            { name: "max", selector: { number: { step: "any", mode: "box" } } },
            { name: "step", selector: { number: { step: "any", mode: "box" } } },
            { name: "unit", selector: { text: {} } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } }
          ]
        },
        { name: "centre", selector: { boolean: {} } },
        { name: "labels", selector: { boolean: {} } },
        { name: "interactive", selector: { boolean: {} } }
      ],
      computeLabel: (s2) => s2.name.replace(/_/g, " ")
    };
  }
  range() {
    const c2 = this.config;
    const d2 = defaultRange(this.hass, c2.entity);
    return { min: c2.min ?? d2.min, max: c2.max ?? d2.max, step: c2.step ?? d2.step };
  }
  frac(v2, min, max) {
    return v2 === void 0 ? void 0 : Math.min(1, Math.max(0, (v2 - min) / (max - min)));
  }
  fromPointer(e2, el) {
    const r2 = this.range();
    const box = el.getBoundingClientRect();
    const f2 = Math.min(1, Math.max(0, (e2.clientX - box.left) / box.width));
    return clamp(r2.min + f2 * (r2.max - r2.min), r2);
  }
  fmt(v2) {
    var _a2, _b;
    const s2 = Number.isInteger(v2) ? String(v2) : String(Math.round(v2 * 100) / 100);
    return `${v2 > 0 && ((_a2 = this.config) == null ? void 0 : _a2.centre) ? "+" : ""}${s2}${((_b = this.config) == null ? void 0 : _b.unit) ?? ""}`;
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const { min, max } = this.range();
    const value = this.drag ?? readNumber(this.hass, c2.entity, c2.attribute);
    const f2 = this.frac(value, min, max);
    const tf = this.frac(readNumber(this.hass, c2.target_entity, c2.target_attribute), min, max);
    const ticks = Array.from({ length: 21 }, (_2, i2) => i2 / 20);
    const pct = (x2) => `${x2 * 100}%`;
    const bar = f2 === void 0 ? A : c2.centre ? b`<div class="bar" style="left:${pct(Math.min(f2, 0.5))};width:${pct(Math.abs(f2 - 0.5))}"></div>` : A;
    return b`<div class="wrap">
      <div class="track ${c2.interactive ? "interactive" : ""}" @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
        <div class="line"></div>
        ${ticks.map((t2) => b`<div class="tick ${t2 === 0 || t2 === 0.5 || t2 === 1 ? "major" : ""}" style="left:${pct(t2)}"></div>`)}
        ${bar}
        ${tf === void 0 ? A : b`<div class="target" style="left:${pct(tf)}"></div>`}
        ${f2 === void 0 || c2.centre ? A : b`<div class="pointer" style="left:${pct(f2)}"></div>`}
      </div>
      ${c2.labels ? b`<div class="labels"><span>${this.fmt(min)}</span>${c2.centre ? b`<span>${this.fmt(0)}</span>` : A}<span>${this.fmt(max)}</span></div>` : A}
    </div>`;
  }
};
RamsRuler.styles = [
  tokens,
  i$3`
      :host { display: block; height: 100%; min-width: 0; }
      .wrap { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0 2px; }
      .track { position: relative; height: 24px; touch-action: none; }
      .track.interactive { cursor: pointer; }
      .line { position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--_muted); }
      .tick { position: absolute; top: 50%; width: 1px; height: 6px; background: var(--_muted); transform: translateY(-50%); }
      .tick.major { height: 12px; }
      .bar { position: absolute; top: 50%; height: 4px; transform: translateY(-50%); background: var(--_ink); }
      .pointer { position: absolute; top: 2px; bottom: 2px; width: 3px; margin-left: -1.5px; background: var(--_active); }
      .target { position: absolute; top: 0; height: 8px; width: 3px; margin-left: -1.5px; background: var(--_honey, var(--_muted)); }
      .labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--_muted); }
    `
];
__decorateClass$5([
  r()
], RamsRuler.prototype, "drag", 2);
RamsRuler = __decorateClass$5([
  t("rams-ruler")
], RamsRuler);
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsArtwork = class extends Piece {
  constructor() {
    super(...arguments);
    this.onTap = () => {
      if (this.config) fireAction(this, this.config, "tap");
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-artwork", columns: 4, rows: 2 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "image", selector: { text: {} } },
        { name: "caption", selector: { text: {} } },
        { name: "playing_entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } }
          ]
        },
        { name: "tap_action", selector: { ui_action: {} } },
        { name: "hold_action", selector: { ui_action: {} } }
      ],
      computeLabel: (s2) => s2.name.replace(/_/g, " ")
    };
  }
  render() {
    var _a2, _b, _c, _d;
    const c2 = this.config;
    if (!c2) return A;
    const picture = c2.entity && ((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity]) == null ? void 0 : _b.attributes.entity_picture) || c2.image || "";
    const playing = ((_d = (_c = this.hass) == null ? void 0 : _c.states[c2.playing_entity ?? c2.entity ?? ""]) == null ? void 0 : _d.state) === "playing";
    return b`<div class="art" style=${picture ? `background-image:url('${picture}')` : ""} @click=${this.onTap}>
      ${c2.caption ? b`<span class="cap">${c2.caption}</span>` : A}
      ${playing ? b`<span class="led"></span>` : A}
    </div>`;
  }
};
RamsArtwork.styles = [
  tokens,
  i$3`
      :host { display: block; height: 100%; min-width: 0; }
      .art { position: relative; box-sizing: border-box; height: 100%; overflow: hidden; border-radius: var(--_radius); border: var(--_border); box-shadow: var(--_raised); background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .cap { position: absolute; left: 6px; bottom: 6px; padding: 2px 5px; border-radius: 2px; font-size: 11px; background: var(--_cap); color: var(--_ink); }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); }
    `
];
RamsArtwork = __decorateClass$4([
  t("rams-artwork")
], RamsArtwork);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let RamsClock = class extends Piece {
  constructor() {
    super(...arguments);
    this.now = /* @__PURE__ */ new Date();
    this.toggleAlarm = (e2) => {
      var _a2;
      e2.stopPropagation();
      if ((_a2 = this.config) == null ? void 0 : _a2.alarm_entity) fireAction(this, { entity: this.config.alarm_entity, tap_action: { action: "toggle" } }, "tap");
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-clock", variant: "analog", columns: 6, rows: 3 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "variant", selector: { select: { mode: "dropdown", options: [{ value: "analog", label: "Analog" }, { value: "digital", label: "Digital" }] } } },
        { name: "seconds", selector: { boolean: {} } },
        { name: "alarm_entity", selector: { entity: { domain: ["input_boolean", "switch"] } } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } },
            { name: "rows", selector: { number: { min: 1, max: 6, mode: "box" } } }
          ]
        }
      ],
      computeLabel: (s2) => s2.name.replace(/_/g, " ")
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => this.now = /* @__PURE__ */ new Date(), 1e3);
  }
  disconnectedCallback() {
    window.clearInterval(this.timer);
    super.disconnectedCallback();
  }
  /** Wall-clock parts in the Home Assistant time zone (falls back to the browser's). */
  parts() {
    var _a2, _b;
    const tz = (_b = (_a2 = this.hass) == null ? void 0 : _a2.config) == null ? void 0 : _b.time_zone;
    const f2 = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23" });
    const p2 = Object.fromEntries(f2.formatToParts(this.now).map((x2) => [x2.type, Number(x2.value)]));
    return { h: p2.hour ?? 0, m: p2.minute ?? 0, s: p2.second ?? 0 };
  }
  render() {
    var _a2, _b;
    const c2 = this.config;
    if (!c2) return A;
    const { h: h2, m: m2, s: s2 } = this.parts();
    const alarm = c2.alarm_entity ? ((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.alarm_entity]) == null ? void 0 : _b.state) === "on" : false;
    const key = c2.alarm_entity ? b`<div class="key ${alarm ? "on" : ""}" @click=${this.toggleAlarm}></div>` : A;
    if (c2.variant === "digital") {
      const pad = (n3) => String(n3).padStart(2, "0");
      return b`<div class="face"><span class="digital">${pad(h2)}:${pad(m2)}${c2.seconds ? `:${pad(s2)}` : ""}</span>${key}</div>`;
    }
    const hourDeg = (h2 % 12 + m2 / 60) * 30;
    const minDeg = (m2 + s2 / 60) * 6;
    return b`<div class="face">${w$1`<svg viewBox="0 0 120 120">
      <circle class="dots" cx="60" cy="60" r="50" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 26.18" transform="rotate(-90 60 60)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="38" stroke-width="6" style="transform: rotate(${hourDeg}deg)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="22" stroke-width="5" style="transform: rotate(${minDeg}deg)" />
      ${c2.seconds ? w$1`<line class="sec" x1="60" y1="68" x2="60" y2="12" stroke-width="1.5" style="transform: rotate(${s2 * 6}deg)" />` : A}
      <circle class="hub" cx="60" cy="60" r="6" />
    </svg>`}${key}</div>`;
  }
};
RamsClock.styles = [
  tokens,
  i$3`
      :host { display: block; height: 100%; min-width: 0; }
      .face { position: relative; box-sizing: border-box; height: 100%; display: grid; place-items: center; border-radius: 12px; border: var(--_border); box-shadow: var(--_raised); background: var(--_cap); }
      svg { height: 100%; max-width: 100%; aspect-ratio: 1; }
      .dots { stroke: var(--_ink); }
      .hand { stroke: var(--_ink); stroke-linecap: round; transform-origin: 60px 60px; }
      .sec { stroke: var(--_honey); transform-origin: 60px 60px; }
      .hub { fill: var(--_ink); }
      .digital { font-family: var(--rams-mono, ui-monospace, "SF Mono", Menlo, monospace); font-size: 30px; letter-spacing: 0.02em; }
      .key { position: absolute; top: -4px; right: 14%; width: 22%; height: 7px; border-radius: 2px; border: var(--_border); background: var(--_cap-dark); cursor: pointer; }
      .key.on { background: var(--_active); }
    `
];
__decorateClass$3([
  r()
], RamsClock.prototype, "now", 2);
RamsClock = __decorateClass$3([
  t("rams-clock")
], RamsClock);
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsList = class extends Piece {
  static getStubConfig() {
    return { type: "custom:rams-list", columns: 12, rows: "auto", empty_text: "None" };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "primary_key", selector: { text: {} } },
            { name: "secondary_key", selector: { text: {} } },
            { name: "max_items", selector: { number: { min: 1, max: 50, mode: "box" } } },
            { name: "empty_text", selector: { text: {} } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } }
          ]
        }
      ],
      computeLabel: (s2) => s2.name.replace(/_/g, " ")
    };
  }
  items() {
    var _a2;
    const c2 = this.config;
    const e2 = c2.entity ? (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity] : void 0;
    if (!e2) return [];
    const raw = c2.attribute ? e2.attributes[c2.attribute] : e2.state;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
  text(item, key) {
    if (item && typeof item === "object") return key ? String(item[key] ?? "") : "";
    return key ? "" : String(item);
  }
  updated(_changed) {
    const box = this.renderRoot.querySelector(".list");
    if (box) this.reportRows(this.rowsFor(box.offsetHeight));
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const all = this.items();
    const max = c2.max_items ?? all.length;
    const shown = all.slice(0, max);
    return b`<div class="list">
      ${c2.title ? b`<div class="title">${c2.title}</div>` : A}
      ${shown.length === 0 && c2.empty_text ? b`<div class="empty">${c2.empty_text}</div>` : A}
      ${shown.map((i2) => b`<div class="item"><span>${this.text(i2, c2.primary_key)}</span><span>${this.text(i2, c2.secondary_key)}</span></div>`)}
      ${all.length > shown.length ? b`<div class="more">+${all.length - shown.length} more</div>` : A}
    </div>`;
  }
};
RamsList.styles = [
  tokens,
  i$3`
      :host { display: block; min-width: 0; }
      .list { display: flex; flex-direction: column; gap: var(--_gap); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); height: 24px; display: flex; align-items: center; }
      .item { box-sizing: border-box; height: 24px; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 0 10px; font-size: 12px; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); }
      .item span:last-child { color: var(--_muted); }
      .empty, .more { font-size: 12px; color: var(--_muted); padding: 0 2px; }
    `
];
RamsList = __decorateClass$2([
  t("rams-list")
], RamsList);
var __defProp = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
const MODE_LABEL = { disarm: "Disarm", arm_home: "Arm home", arm_away: "Arm away", arm_night: "Night mode" };
const MODE_SERVICE = { disarm: "alarm_disarm", arm_home: "alarm_arm_home", arm_away: "alarm_arm_away", arm_night: "alarm_arm_night" };
const IDLE_MS = 3e4;
const NO_ACTION = { action: "none" };
let RamsKeypad = class extends Piece {
  constructor() {
    super(...arguments);
    this.code = "";
  }
  static getStubConfig() {
    return { type: "custom:rams-keypad", columns: 12, modes: ["disarm", "arm_home", "arm_away", "arm_night"] };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: { domain: "alarm_control_panel" } } },
        { name: "modes", selector: { select: { multiple: true, mode: "list", options: Object.keys(MODE_LABEL).map((value) => ({ value, label: MODE_LABEL[value] })) } } },
        { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } }
      ],
      computeLabel: (s2) => s2.name
    };
  }
  touch() {
    window.clearTimeout(this.idle);
    this.idle = window.setTimeout(() => this.code = "", IDLE_MS);
  }
  press(d2) {
    this.code = (this.code + d2).slice(0, 8);
    this.touch();
  }
  runMode(mode) {
    const c2 = this.config;
    if (!(c2 == null ? void 0 : c2.entity) || !this.hass) return;
    const data = { entity_id: c2.entity };
    if (this.code) data.code = this.code;
    void this.hass.callService("alarm_control_panel", MODE_SERVICE[mode], data);
    this.code = "";
  }
  updated(_c) {
    this.reportRows(5);
  }
  key(label, cls, onTap, extra = {}) {
    return b`<div class=${cls} @click=${onTap}><rams-button .hass=${this.hass} .config=${{ type: "custom:rams-button", name: label, tap_action: NO_ACTION, ...extra }}></rams-button></div>`;
  }
  render() {
    var _a2, _b;
    const c2 = this.config;
    if (!c2) return A;
    const state2 = c2.entity && ((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity]) == null ? void 0 : _b.state) || "";
    const modes = c2.modes ?? ["disarm", "arm_home", "arm_away", "arm_night"];
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const modeTone = { disarm: "neutral", arm_home: "neutral", arm_away: "alert", arm_night: "dark" };
    return b`<div class="pad">
      <div class="screen">
        <div class="dots">${Array.from({ length: Math.max(4, this.code.length) }, (_2, i2) => b`<b class=${i2 < this.code.length ? "f" : ""}></b>`)}</div>
        <span class="state">${state2.replace(/_/g, " ")}</span>
      </div>
      ${digits.map((d2) => this.key(d2, "digit", () => this.press(d2), { shape: "round" }))}
      ${this.key("clr", "digit", () => this.code = "", { shape: "round", tone: "dark" })}
      ${this.key("0", "digit", () => this.press("0"), { shape: "round" })}
      ${this.key("⌫", "digit", () => this.code = this.code.slice(0, -1), { shape: "round" })}
      ${modes.map((m2, i2) => b`<div class="mode" style="grid-row: ${2 + i2}">${this.key(MODE_LABEL[m2], "", () => this.runMode(m2), { tone: modeTone[m2], selected_when: [] })}</div>`)}
    </div>`;
  }
};
RamsKeypad.styles = [
  tokens,
  i$3`
      :host { display: block; min-width: 0; }
      .pad { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: var(--_row); gap: var(--_gap); }
      .screen { grid-column: 1 / -1; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; border-radius: var(--_radius); background: var(--_field); border: var(--_border); box-shadow: var(--_inset); font-size: 12px; }
      .dots { display: flex; gap: 10px; }
      .dots b { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--_ink); box-sizing: border-box; }
      .dots b.f { background: var(--_ink); }
      .state { color: var(--_muted); text-transform: lowercase; }
      .digit, .mode, .digit > div, .mode > div { height: 100%; }
      .digit { grid-column: span 2; }
      .mode { grid-column: 7 / -1; }
    `
];
__decorateClass$1([
  r()
], RamsKeypad.prototype, "code", 2);
RamsKeypad = __decorateClass$1([
  t("rams-keypad")
], RamsKeypad);
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsShelf = class extends Piece {
  static getStubConfig() {
    return { type: "custom:rams-shelf", columns: 12, rows: "auto", per_row: 3 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        { name: "player", selector: { entity: { domain: "media_player" } } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "kind", selector: { text: {} } },
            { name: "per_row", selector: { number: { min: 1, max: 8, mode: "box" } } },
            { name: "columns", selector: { number: { min: 1, max: 12, mode: "box" } } }
          ]
        }
      ],
      computeLabel: (s2) => s2.name.replace(/_/g, " ")
    };
  }
  items() {
    var _a2;
    const c2 = this.config;
    const e2 = c2.entity ? (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity] : void 0;
    if (!e2) return [];
    let raw = c2.attribute ? e2.attributes[c2.attribute] : e2.state;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        return [];
      }
    }
    const list = Array.isArray(raw) ? raw : [];
    return c2.kind ? list.filter((i2) => i2.kind === c2.kind) : list;
  }
  play(item) {
    const c2 = this.config;
    if (!(c2 == null ? void 0 : c2.player) || !this.hass || !item.media_content_id) return;
    void this.hass.callService("media_player", "play_media", {
      entity_id: c2.player,
      media_content_id: item.media_content_id,
      media_content_type: item.media_content_type ?? "music"
    });
  }
  updated(_changed) {
    const grid = this.renderRoot.querySelector(".grid");
    if (grid) this.reportRows(this.rowsFor(grid.offsetHeight));
  }
  render() {
    var _a2, _b, _c, _d;
    const c2 = this.config;
    if (!c2) return A;
    const items = this.items();
    const playingId = c2.player ? (_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.player]) == null ? void 0 : _b.attributes.media_content_id : void 0;
    const playing = c2.player && ((_d = (_c = this.hass) == null ? void 0 : _c.states[c2.player]) == null ? void 0 : _d.state) === "playing";
    if (items.length === 0) return b`<div class="empty">Nothing to show</div>`;
    return b`<div class="grid" style="grid-template-columns: repeat(${c2.per_row ?? 3}, minmax(0, 1fr))">
      ${items.map(
      (i2) => b`<div class="tile" style=${i2.picture ? `background-image:url('${i2.picture}')` : ""} @click=${() => this.play(i2)}>
          ${playing && playingId && playingId === i2.media_content_id ? b`<span class="led"></span>` : A}
        </div>`
    )}
    </div>`;
  }
};
RamsShelf.styles = [
  tokens,
  i$3`
      :host { display: block; min-width: 0; }
      .grid { display: grid; gap: var(--_gap); }
      .tile { aspect-ratio: 1; box-sizing: border-box; position: relative; overflow: hidden; border-radius: var(--_radius); border: var(--_border); box-shadow: var(--_raised); background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); }
      .empty { font-size: 12px; color: var(--_muted); }
    `
];
RamsShelf = __decorateClass([
  t("rams-shelf")
], RamsShelf);
const w = window;
w.customCards = w.customCards ?? [];
w.customCards.push(
  { type: "rams-panel", name: "Rams panel", description: "Container: a plate with pieces on an N-column grid" },
  { type: "rams-display", name: "Rams display", description: "Text block: one or two lines, optional frame" },
  { type: "rams-ruler", name: "Rams ruler", description: "Scale with pointer or centre bar; optional touch to set" },
  { type: "rams-artwork", name: "Rams artwork", description: "Square picture with playing LED" },
  { type: "rams-clock", name: "Rams clock", description: "Analog or digital clock" },
  { type: "rams-list", name: "Rams list", description: "Dynamic list from an entity attribute" },
  { type: "rams-keypad", name: "Rams keypad", description: "Alarm code entry and mode keys" },
  { type: "rams-shelf", name: "Rams shelf", description: "Artwork tiles generated from a list" },
  { type: "rams-button", name: "Rams button", description: "Key or round button" }
);
