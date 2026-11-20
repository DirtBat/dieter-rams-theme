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
var __defProp$7 = Object.defineProperty;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$7(target, key, result);
  return result;
};
class Piece extends i {
  constructor() {
    super(...arguments);
    this.defaultFrame = "none";
    this.hostFrame = true;
    this.minRows = false;
    this.lastRows = 0;
  }
  setConfig(config) {
    this.config = config;
  }
  /** True when this piece handles taps itself, so the panel's own action stays out of the way. */
  actionable() {
    const c2 = this.config;
    return [c2 == null ? void 0 : c2.tap_action, c2 == null ? void 0 : c2.hold_action].some((a2) => a2 && a2.action !== "none");
  }
  /** Pieces that can signal a state override this: a tone fills the piece (see the shared styles). */
  signal() {
    return void 0;
  }
  willUpdate(changed) {
    var _a2;
    const signal = this.signal();
    if (signal) this.setAttribute("signal", signal);
    else this.removeAttribute("signal");
    if (!changed.has("config")) return;
    this.setAttribute("frame", this.hostFrame ? ((_a2 = this.config) == null ? void 0 : _a2.frame) ?? this.defaultFrame : "none");
    this.toggleAttribute("actionable", this.actionable());
    if (this.minRows) {
      const n3 = this.rowsSet() ?? 1;
      const min = `calc(var(--_row) * ${n3} + var(--_gap) * ${n3 - 1})`;
      this.style.minHeight = min;
      this.style.setProperty("--_min", min);
    }
  }
  /** The rows the user gave this card: in the YAML (rows) or in the Layout tab (grid_options). */
  rowsSet() {
    var _a2;
    const c2 = this.config;
    if (typeof (c2 == null ? void 0 : c2.rows) === "number") return c2.rows;
    const g2 = (_a2 = c2 == null ? void 0 : c2.grid_options) == null ? void 0 : _a2.rows;
    return typeof g2 === "number" ? g2 : void 0;
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
  /** Tells HA's Layout tab this card can be resized, and its smallest size. Defaults apply until the user sets a size. */
  getGridOptions() {
    return { columns: 6, rows: this.minRows ? 1 : "auto", min_columns: 1, min_rows: 1 };
  }
  getCardSize() {
    var _a2;
    return ((_a2 = this.config) == null ? void 0 : _a2.rows) ?? 1;
  }
}
__decorateClass$e([
  n2({ attribute: false })
], Piece.prototype, "hass");
__decorateClass$e([
  n2({ attribute: false })
], Piece.prototype, "config");
var __defProp$6 = Object.defineProperty;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$6(target, key, result);
  return result;
};
const JUDGED = /* @__PURE__ */ new Set(["selected_when", "alert_when"]);
const retarget = (schema, from) => schema.map((f2) => {
  if (f2.schema) return { ...f2, schema: retarget(f2.schema, from) };
  if (f2.name && JUDGED.has(f2.name)) return { ...f2, context: { filter_entity: from } };
  return f2;
});
class RamsFormEditor extends i {
  constructor() {
    super(...arguments);
    this.changed = (e2) => {
      e2.stopPropagation();
      this.config = e2.detail.value;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
    };
  }
  setConfig(config) {
    this.config = config;
  }
  render() {
    if (!this.config || !this.hass || !this.form) return A;
    const from = this.config.rules_entity ? "rules_entity" : "entity";
    return b`<ha-form .hass=${this.hass} .data=${this.config} .schema=${retarget(this.form.schema, from)} .computeLabel=${this.form.computeLabel} .computeHelper=${this.form.computeHelper} @value-changed=${this.changed}></ha-form>`;
  }
}
__decorateClass$d([
  n2({ attribute: false })
], RamsFormEditor.prototype, "hass");
__decorateClass$d([
  n2({ attribute: false })
], RamsFormEditor.prototype, "lovelace");
__decorateClass$d([
  n2({ attribute: false })
], RamsFormEditor.prototype, "config");
if (!customElements.get("rams-form-editor")) customElements.define("rams-form-editor", RamsFormEditor);
async function formEditor(form) {
  const el = document.createElement("rams-form-editor");
  el.form = form;
  return el;
}
const TOGGLE = ["light", "switch", "input_boolean", "fan", "scene", "script", "automation", "cover", "lock", "humidifier", "siren", "group"];
function fireAction(node, config, action) {
  var _a2;
  const domain = ((_a2 = config.entity) == null ? void 0 : _a2.split(".")[0]) ?? "";
  const fallback = { action: action === "tap" && TOGGLE.includes(domain) ? "toggle" : "more-info" };
  const given = action === "tap" ? config.tap_action : config.hold_action;
  const full = { ...config, [action === "tap" ? "tap_action" : "hold_action"]: given ?? fallback };
  node.dispatchEvent(new CustomEvent("hass-action", { detail: { config: full, action }, bubbles: true, composed: true }));
}
class Press {
  constructor(node, actions, onTap) {
    this.node = node;
    this.actions = actions;
    this.onTap = onTap;
    this.held = false;
    this.down = () => {
      this.held = false;
      this.timer = window.setTimeout(() => {
        const a2 = this.actions();
        if (!(a2 == null ? void 0 : a2.hold_action) || a2.hold_action.action === "none") return;
        this.held = true;
        fireAction(this.node, a2, "hold");
      }, 500);
    };
    this.up = () => window.clearTimeout(this.timer);
    this.click = () => {
      var _a2;
      const a2 = this.actions();
      if (this.held || !a2) return;
      if ((_a2 = this.onTap) == null ? void 0 : _a2.call(this)) return;
      fireAction(this.node, a2, "tap");
    };
  }
}
const TONES = [
  ["neutral", "Neutral"],
  ["red", "Red"],
  ["orange", "Orange"],
  ["blue", "Blue"],
  ["green", "Green"],
  ["grey", "Grey"]
];
const WARNING_CLASSES = ["problem", "safety", "smoke", "gas", "carbon_monoxide", "moisture", "tamper", "battery", "heat"];
const ACTIVE_STATES = ["on", "open", "playing"];
function valueTone(state, rows) {
  var _a2;
  const v2 = Number(state);
  if (!rows || state === "" || Number.isNaN(v2)) return void 0;
  const above = rows.filter((r2) => r2.when !== "below" && v2 > Number(r2.value)).sort((a2, b2) => Number(b2.value) - Number(a2.value))[0];
  const below = rows.filter((r2) => r2.when === "below" && v2 < Number(r2.value)).sort((a2, b2) => Number(a2.value) - Number(b2.value))[0];
  return (_a2 = above ?? below) == null ? void 0 : _a2.tone;
}
const same = (a2, b2) => (a2 ?? "").trim().toLowerCase() === b2.toLowerCase();
function readState(hass, entity, rules) {
  var _a2, _b, _c;
  const own = entity ? hass == null ? void 0 : hass.states[entity] : void 0;
  const judged = rules.rules_entity ?? entity;
  const e2 = judged ? hass == null ? void 0 : hass.states[judged] : void 0;
  const state = (e2 == null ? void 0 : e2.state) ?? "";
  const auto = !rules.alert_when && !!e2 && judged.startsWith("binary_sensor.") && state === "on" && WARNING_CLASSES.includes(String(e2.attributes.device_class));
  const alert = auto || !!((_a2 = rules.alert_when) == null ? void 0 : _a2.some((w2) => same(w2, state)));
  const hit = state ? (_c = (_b = rules.state_colours) == null ? void 0 : _b.find((r2) => same(r2.state, state))) == null ? void 0 : _c.tone : void 0;
  const byValue = hit ?? valueTone(state, rules.value_colours);
  return {
    state: (own == null ? void 0 : own.state) ?? "",
    alert,
    active: (rules.selected_when ?? ACTIVE_STATES).some((a2) => same(a2, state)),
    signal: byValue && byValue !== "neutral" ? byValue : alert ? "red" : void 0,
    tone: byValue && byValue !== "neutral" ? byValue : void 0
  };
}
function canWarn(hass, entity, rules) {
  var _a2;
  if ((_a2 = rules.alert_when) == null ? void 0 : _a2.length) return true;
  const judged = rules.rules_entity ?? entity;
  const e2 = judged ? hass == null ? void 0 : hass.states[judged] : void 0;
  return !!e2 && judged.startsWith("binary_sensor.") && WARNING_CLASSES.includes(String(e2.attributes.device_class));
}
const tokens = i$3`
  :host {
    --_plate: var(--rams-plate, #f5f4f0);
    --_cap: var(--rams-cap, #e6e3da);
    --_field: var(--rams-field, #eae9e3);
    --_ink: var(--rams-ink, #261201);
    --_ink-on: var(--rams-ink-on, #ffffff);
    --_muted: var(--rams-muted, #736356);
    --_red: var(--rams-red, #c8362b);
    --_orange: var(--rams-orange, #e8801a);
    --_blue: var(--rams-blue, #2f5fa8);
    --_green: var(--rams-green, #3e8e5a);
    --_grey: var(--rams-grey, #8a8a86);
    --_active: var(--rams-active, var(--_orange));
    --_honey: var(--rams-honey, var(--_orange));
    --_alert: var(--rams-alert, var(--_red));
    --_border: var(--rams-border, 1px solid rgba(38, 18, 1, 0.18));
    --_raised: var(--rams-raised, 0 2px 3px rgba(38, 18, 1, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.8));
    --_pressed: var(--rams-pressed, inset 0 2px 3px rgba(38, 18, 1, 0.25));
    --_inset: var(--rams-inset, inset 0 2px 3px rgba(38, 18, 1, 0.12));
    --_radius: var(--rams-radius, 6px);
    --_row: var(--rams-row, 56px);
    --_down: var(--rams-down, #cfcbc1);
    --_key-edge: var(--rams-key-edge, rgba(38, 18, 1, 0.35));
    --_cutout: var(--rams-cutout, #17110c);
    --_lens: var(--rams-lens, #b9b3a6);
    --_ring: var(--rams-ring, color-mix(in srgb, var(--_plate) 82%, #000));
    --_slot: var(--rams-slot, #2b2118);
    --_lever: var(--rams-lever, #efece4);
    --_dish: color-mix(in srgb, var(--_cap) 88%, #000);
    --_gap: var(--rams-gap, 8px);
    /* night roles: day values make them invisible */
    --_glow: var(--rams-glow, 0px);
    --_cap-rest: var(--rams-cap-rest, 100%);
    --_cap-on: var(--rams-cap-on, 78%);
    --_cap-on-mix: var(--rams-cap-on-mix, #000);
    --_lcd-bg: var(--rams-lcd-bg, var(--_field));
    --_lcd-ink: var(--rams-lcd-ink, var(--_ink));
    --_lcd-muted: color-mix(in srgb, var(--_lcd-ink) 72%, transparent);
    font-family: var(--rams-font, "Helvetica Neue", Helvetica, Arial, sans-serif);
    color: var(--_ink);
    display: block;
    height: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  /* Frame: the piece's own box. The base class reflects config.frame to the host attribute. */
  :host([frame="outline"]),
  :host([frame="recessed"]),
  :host([frame="raised"]) {
    border: var(--_border);
    border-radius: var(--_radius);
    padding: 0 var(--_fpad, var(--_gap));
  }
  /* A signalled piece takes the tone as --_sig; the piece itself decides what to fill (the display fills its face). */
  :host([signal="red"]) { --_sig: var(--_alert); }
  :host([signal="orange"]) { --_sig: var(--_orange); }
  :host([signal="blue"]) { --_sig: var(--_blue); }
  :host([signal="green"]) { --_sig: var(--_green); }
  :host([signal="grey"]) { --_sig: var(--_grey); }
  :host([actionable]) { cursor: pointer; }
  :host([frame="recessed"]) { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); box-shadow: var(--_inset); }
  :host([frame="raised"]) { background: var(--_cap); box-shadow: var(--_raised); }
`;
function fitKey(w2, h2) {
  if (w2 <= 0 || h2 <= 0) return { n: 1, m: 1, u: 0 };
  const n3 = w2 >= h2 ? Math.max(1, Math.round(w2 / h2)) : 1;
  const m2 = w2 >= h2 ? 1 : Math.max(1, Math.round(h2 / w2));
  return { n: n3, m: m2, u: Math.min(w2 / n3, h2 / m2) };
}
const keyStyles = i$3`
  /* The key, its LED and its name are one group, centred in whatever room the card has: spare room goes
     outside the group, never between the key and its name. One gap (5px) everywhere. */
  .cell { height: 100%; min-height: var(--_min, var(--_row)); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-width: 0; }
  .cell.above { flex-direction: column-reverse; }
  .cell.left { flex-direction: row-reverse; }
  .cell.right { flex-direction: row; }
  .stack { flex: none; display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .cell.left .txt, .cell.right .txt { max-width: 45%; margin-top: 13px; }
  .cell.left .txt { text-align: right; } .cell.right .txt { text-align: left; }
  .led.off { visibility: hidden; }
  .led { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
  .led.on { background: var(--_alert); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--_alert) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
  .txt { flex: none; min-height: 13px; max-width: 100%; box-sizing: border-box; padding: 0 2px; font-size: 10px; line-height: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* the key's room. In a card (.cell) its size is set from the fit, so the group stays compact; in the keypad it fills its grid cell. */
  .cell .keyarea { flex: none; min-height: 0; width: auto; position: relative; align-items: center; }
  /* A square key sits in a black cut-out in the panel. The cut-out is square-cornered (no dips where plates meet) and reaches half a gap past the key at the sides and 3px above and below, so keys side by side
     share one black block: the black between two keys is twice the black round the outside. */
  .plate { position: absolute; top: 0; bottom: 0; left: calc(var(--_gap, 8px) / -2); right: calc(var(--_gap, 8px) / -2); border-radius: 0; background: var(--_cutout); box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(255, 255, 255, 0.5); pointer-events: none; }
  .key.sq { flex: none; border-radius: 3px; margin: auto; }
  .keyarea { flex: 1; min-height: 24px; min-width: 0; width: 100%; display: flex; justify-content: center; container-type: size; }
  .key {
    position: relative; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; padding: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--_key-edge); border-radius: var(--_radius);
    background: linear-gradient(180deg, var(--_cap), color-mix(in srgb, var(--_cap) 92%, #000));
    box-shadow: var(--_raised); color: var(--_ink);
    font: inherit; font-size: 14px; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  /* down: the key stays in while active */
  .key.down, .key:active { background: var(--_down); box-shadow: var(--_pressed); transform: translateY(1px); }

  /* the dish: a circle on a square key, a pill on a long (n > 1) or tall (m > 1) one. --u is the key's unit square. */
  .key::before {
    content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    height: calc(var(--u, 56px) * 0.86); aspect-ratio: 1; border-radius: 50%;
    /* hollow: shaded at the top edge, catching the light at the bottom */
    background: radial-gradient(circle at 50% 80%, color-mix(in srgb, var(--_cap) 78%, #fff) 0%, var(--_dish) 72%);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 -1px 1px rgba(255, 255, 255, 0.55), 0 1px 0 rgba(255, 255, 255, 0.45);
  }
  .key:not([data-n="1"])::before { width: calc(100% - var(--u) * 0.14); aspect-ratio: auto; border-radius: 999px; }
  .key:not([data-m="1"])::before { height: calc(100% - var(--u) * 0.14); width: calc(var(--u) * 0.86); aspect-ratio: auto; border-radius: 999px; }
  .key.tall::before { height: calc(100% - var(--u) * 0.14); width: 74%; aspect-ratio: auto; border-radius: 999px; }
  /* text printed on the key sits on a pill-shaped dish */
  .key:has(.legend):not(.round)::before { height: calc(var(--u, 56px) * 0.7); width: calc(100% - 10px); aspect-ratio: auto; border-radius: 999px; }
  .key > * { position: relative; z-index: 1; }
  .ico { --mdc-icon-size: 22px; flex: none; }
  .ico.tinted { color: var(--t); }
  .key.round .ico { --mdc-icon-size: 18px; }
  .key:has(.legend) { flex-direction: column; gap: 2px; }
  .legend { max-width: 86%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.1; }

  /* a toned key: the whole key takes the colour */
  .key.filled { --c: var(--t); color: var(--_ink-on); }
  .key.filled:not(.round) { background: linear-gradient(180deg, color-mix(in srgb, var(--c) 92%, #fff), var(--c)); box-shadow: var(--_raised), 0 0 var(--_glow) 1px color-mix(in srgb, var(--c) 45%, transparent); }
  .key.filled:not(.round)::before { background: radial-gradient(circle at 50% 80%, color-mix(in srgb, var(--c) 88%, #fff) 0%, color-mix(in srgb, var(--c) 76%, #000) 75%); }

  /* round: a dome on a dark ring, as on the Braun calculator. Always a circle: the biggest that fits. */
  .key.round {
    --dome: radial-gradient(circle at 38% 28%, color-mix(in srgb, var(--c, var(--_cap)) 78%, #fff) 0%, var(--c, var(--_cap)) 52%, color-mix(in srgb, var(--c, var(--_cap)) 78%, #000) 100%);
    flex: none; align-self: center; width: calc(min(100cqw, 100cqh) - 6px); height: calc(min(100cqw, 100cqh) - 6px); border: 0; border-radius: 50%;
    background: var(--dome);
    box-shadow: 0 0 0 3px var(--_ring), 0 2px 4px rgba(0, 0, 0, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.45);
  }
  .key.round.filled { box-shadow: 0 0 0 3px var(--_ring), 0 2px 4px rgba(0, 0, 0, 0.35), 0 0 var(--_glow) 1px color-mix(in srgb, var(--c) 55%, transparent), inset 0 -2px 3px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.5); }
  .key.round::before { display: none; }
  .key.round .legend { text-transform: none; letter-spacing: 0; font-size: 11px; font-weight: 500; }
  .key.round.down, .key.round:active { background: var(--dome); filter: brightness(0.88); transform: translateY(1px); }

  /* the dot: only where a state rule (or a keypad mode) gives the key a colour */
  .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--t); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25), 0 0 var(--_glow) 1px color-mix(in srgb, var(--t) 70%, transparent); }
  .red { --t: var(--_red); } .orange { --t: var(--_orange); } .blue { --t: var(--_blue); } .green { --t: var(--_green); } .grey { --t: var(--_grey); }
`;
const LABELS = {
  columns: "width in panel (grid units)",
  rows: "height in panel (grid units)",
  selected_when: "active when",
  alert_when: "warning when",
  state_colours: "colour by state",
  value_colours: "colour by value"
};
const computeLabel = (s2) => LABELS[s2.name] ?? s2.name.replace(/_/g, " ");
const HELPERS = {
  player_from: "Optional. An input_select that says where to play, for example your music output selector. A tapped tile then plays on the player it names; the player above is the fallback.",
  players: "Optional. Which player goes with which option. Left empty, an option is matched by name: Kitchen finds media_player.kitchen_ma or media_player.kitchen.",
  entities: "Optional, instead of the entity: several at once, for example all your speakers. The ruler shows the one that is playing; a touch sets the value on every one of them.",
  options: "Optional. Rename an option, give it an icon, put them in another order or leave one out. Type each option exactly as the entity names it. Left empty: all of the entity's options, as named.",
  labels_position: "Above or below a horizontal lever, left or right of a vertical one. A side that does not fit is turned to the nearest that does.",
  setpoint: "Optional. A second entity, for example the heating setpoint: a dark pointer outside the scale. A climate entity gives its target temperature.",
  rules_entity: "Optional. Judge the rules below by another entity's state, for example a level sensor. The lists below then offer that entity's states.",
  selected_when: "Type a state if it is not listed.",
  alert_when: "Type a state if it is not listed.",
  state_colours: 'Optional. A colour for each state, instead of red for every warning. A state listed here wins over "warning when".',
  value_colours: "Optional. Colour the piece when the number is above or below a value, for example CO2 above 1000. The strictest matching row wins.",
  value: "A fixed value. Used only when no entity is set. The red mark sits at the value; nothing is drawn when there is none.",
  interval: "Distance between the small tick marks. On an interactive dial it is also the step.",
  major: "Distance between the thick tick marks, counted from the minimum. Empty: only the first and the last.",
  columns: "Only used inside a Rams panel. A standalone card is sized in the Layout tab.",
  rows: "Only used inside a Rams panel. A standalone card is sized in the Layout tab."
};
const computeHelper = (s2) => HELPERS[s2.name];
const num$1 = (name, min, max, extra = {}) => ({
  name,
  selector: { number: { min, max, mode: "box", ...extra } }
});
const dropdown = (name, options) => ({
  name,
  selector: { select: { mode: "dropdown", options: options.map(([value, label]) => ({ value, label })) } }
});
const FRAMES = [["none", "None"], ["outline", "Outline"], ["recessed", "Recessed"], ["raised", "Raised"]];
const SIZES$1 = [["small", "Small"], ["medium", "Medium"], ["large", "Large"]];
const layoutFields = (frame = true) => [
  {
    type: "expandable",
    name: "",
    title: "Size in panel",
    schema: [{ type: "grid", name: "", schema: [num$1("columns", 1, 12), num$1("rows", 1, 12)] }]
  },
  ...frame ? [dropdown("frame", FRAMES)] : []
];
const actionFields = () => [
  { name: "tap_action", selector: { ui_action: {} } },
  { name: "hold_action", selector: { ui_action: {} } }
];
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
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$5(target, key, result);
  return result;
};
const FRAME = 3;
let RamsButton = class extends Piece {
  constructor() {
    super(...arguments);
    this.hostFrame = false;
    this.minRows = true;
    this.press = new Press(this, () => this.config, () => this.step());
    this.fit = { n: 1, m: 1, u: 0 };
  }
  /**
   * Measure the room left for the key (the card minus the LED and the name), so the key is a square or a whole
   * number of squares whatever the grid gives it, and the key, LED and name stay one compact group.
   */
  firstUpdated() {
    const cell = this.renderRoot.querySelector(".cell");
    if (!cell) return;
    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(cell);
  }
  updated() {
    this.measure();
  }
  measure() {
    var _a2;
    const cell = this.renderRoot.querySelector(".cell");
    if (!cell) return;
    const side = cell.classList.contains("left") || cell.classList.contains("right");
    const led = cell.querySelector(".led");
    const txt = cell.querySelector(".txt");
    const gap = 5;
    const aw = cell.clientWidth - (side && txt ? txt.offsetWidth + gap : 0);
    const ah = cell.clientHeight - (led ? led.offsetHeight + gap : 0) - (!side && txt ? txt.offsetHeight + gap : 0);
    const w2 = Math.max(aw, 24), h2 = Math.max(ah, 24);
    const sq = this.isSquare();
    const f2 = ((_a2 = this.config) == null ? void 0 : _a2.shape) === "tall" ? fitKey(w2, h2) : { n: 1, m: 1, u: Math.max(0, Math.min(w2, sq ? h2 - 2 * FRAME : h2)) };
    if (f2.n !== this.fit.n || f2.m !== this.fit.m || Math.abs(f2.u - this.fit.u) > 0.5) this.fit = f2;
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback();
    (_a2 = this.ro) == null ? void 0 : _a2.disconnect();
  }
  static getStubConfig() {
    return { type: "custom:rams-button", name: "Button", columns: 2, rows: 2 };
  }
  static getConfigElement() {
    return formEditor(this.getConfigForm());
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("label_position", [["below", "Below"], ["above", "Above"], ["left", "Left"], ["right", "Right"], ["inside", "Inside"]]),
            dropdown("shape", [["square", "Square"], ["tall", "Tall"], ["round", "Round"]]),
            dropdown("tone", TONES),
            dropdown("icon_tone", TONES)
          ]
        },
        ...layoutFields(false),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            { name: "selected_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            {
              name: "state_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "state",
                  fields: {
                    state: { label: "State", selector: { text: {} }, required: true },
                    tone: { selector: { select: { mode: "dropdown", options: ["red", "orange", "blue", "green", "grey"] } }, required: true }
                  }
                }
              }
            },
            { name: "adjust_by", selector: { number: { step: "any", mode: "box" } } }
          ]
        }
      ],
      computeLabel,
      computeHelper
    };
  }
  actionable() {
    var _a2;
    return !!((_a2 = this.config) == null ? void 0 : _a2.entity) || super.actionable();
  }
  /** Climate stepper: the only case that needs more than a perform-action. */
  step() {
    var _a2;
    const c2 = this.config;
    if (!(c2 == null ? void 0 : c2.adjust_by) || !((_a2 = c2.entity) == null ? void 0 : _a2.startsWith("climate.")) || !this.hass) return false;
    const now = readNumber(this.hass, c2.entity);
    if (now !== void 0) void writeNumber(this.hass, c2.entity, clamp(now + c2.adjust_by, defaultRange(this.hass, c2.entity)));
    return true;
  }
  /** Anything that is not round or tall is a square key (an old or unknown shape such as "key" included). */
  isSquare() {
    var _a2, _b;
    return ((_a2 = this.config) == null ? void 0 : _a2.shape) !== "round" && ((_b = this.config) == null ? void 0 : _b.shape) !== "tall";
  }
  areaSize() {
    const { n: n3, m: m2, u: u2 } = this.fit;
    if (!u2) return "width:0; height:0";
    const sq = this.isSquare();
    return `width:${n3 * u2}px; height:${m2 * u2 + (sq ? 2 * FRAME : 0)}px`;
  }
  keySize(shape) {
    const { n: n3, m: m2, u: u2 } = this.fit;
    if (shape === "round" || !u2) return "";
    if (shape !== "tall") return `--u:${u2}px; width:${u2}px; height:${u2}px`;
    return `--u:${u2}px; width:${(shape === "tall" ? n3 / 2 : n3) * u2}px; height:${m2 * u2}px`;
  }
  render() {
    var _a2, _b;
    const c2 = this.config;
    if (!c2) return A;
    const view = readState(this.hass, c2.entity, c2);
    const name = c2.name || String(((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity ?? ""]) == null ? void 0 : _b.attributes.friendly_name) ?? "");
    const pos = c2.label_position ?? "below";
    const own = c2.tone && c2.tone !== "neutral" ? c2.tone : "";
    const tone = own ? view.tone ?? own : "";
    const square = this.isSquare();
    const cls = ["key", square ? "sq" : "", c2.shape === "round" || c2.shape === "tall" ? c2.shape : "", tone ? `filled ${tone}` : "", view.active ? "down" : ""].filter(Boolean).join(" ");
    return b`<div class="cell ${pos === "inside" ? "below" : pos}">
      <div class="stack">
        <i class="led ${canWarn(this.hass, c2.entity, c2) ? view.alert ? "on" : "" : "off"}"></i>
        <div class="keyarea" style=${this.areaSize()}>${square ? b`<i class="plate"></i>` : A}<button class=${cls} style=${this.keySize(c2.shape)} data-n=${this.fit.n} data-m=${this.fit.m} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
          ${view.tone && !own ? b`<i class="dot ${view.tone}"></i>` : A}
          ${c2.icon ? b`<ha-icon class="ico ${c2.icon_tone && c2.icon_tone !== "neutral" ? `tinted ${c2.icon_tone}` : ""}" .icon=${c2.icon}></ha-icon>` : A}
          ${pos === "inside" && name ? b`<span class="legend">${name}</span>` : A}
        </button></div>
      </div>
      ${pos === "inside" || !name.trim() && (pos === "left" || pos === "right") ? A : b`<div class="txt">${name}</div>`}
    </div>`;
  }
};
RamsButton.styles = [tokens, keyStyles, i$3`:host { display: block; }`];
__decorateClass$c([
  r()
], RamsButton.prototype, "fit", 2);
RamsButton = __decorateClass$c([
  t("rams-button")
], RamsButton);
const faceStyles = i$3`
  :host { display: block; }
  .wrap { height: 100%; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  /* the title comes first in the markup: that is "above" (column) and "left" (row) */
  .wrap.below { flex-direction: column-reverse; }
  .wrap.left { flex-direction: row; align-items: center; }
  .wrap.right { flex-direction: row-reverse; align-items: center; }
  .outer { flex: none; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .left .outer, .right .outer { max-width: 40%; }
  .face { flex: 1; min-width: 0; min-height: 0; box-sizing: border-box; }
  .left .face, .right .face { align-self: stretch; }
  .face.outline, .face.recessed, .face.raised { border: var(--_border); border-radius: var(--_radius); padding: 0 var(--_gap); }
  .face.outline { background: transparent; }
  .face.raised { background: var(--_cap); box-shadow: var(--_raised); }
  .face.recessed { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); box-shadow: var(--_inset); }
  .face.sig { background: var(--_sig); color: var(--_ink-on); --_ink: var(--_ink-on); --_muted: color-mix(in srgb, var(--_ink-on) 78%, transparent); border-radius: var(--_radius); box-shadow: 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--_sig) 50%, transparent); }
`;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
const KNOB = { small: 104, medium: 128, large: 156 };
const BOOLEAN = ["input_boolean", "switch", "light", "fan"];
const knobStep = (n3, pointer) => n3 < 2 ? 0 : pointer ? Math.min(36, 270 / (n3 - 1)) : Math.min(60, n3 === 2 ? 90 : 270 / (n3 - 1));
const SIZES = { small: { fs: 9, p: 26, ico: 16 }, medium: { fs: 11, p: 30, ico: 20 }, large: { fs: 14, p: 36, ico: 24 } };
let RamsSelector = class extends Piece {
  constructor() {
    super(...arguments);
    this.hostFrame = false;
    this.minRows = true;
    this.fitKnob = () => {
      var _a2, _b;
      const slot = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".kslot");
      if (!slot) return;
      const e2 = this.knobExtent();
      const floor = KNOB[((_b = this.config) == null ? void 0 : _b.size) ?? "small"] * 0.6;
      const k2 = Math.floor(Math.max(floor, Math.min(slot.clientWidth / (e2.maxX - e2.minX), slot.clientHeight / (e2.maxY - e2.minY))));
      const set = (name, v2) => this.style.getPropertyValue(name) !== v2 && this.style.setProperty(name, v2);
      set("--_K", `${k2}px`);
      set("--_dx", `${Math.round(-((e2.minX + e2.maxX) / 2) * k2)}px`);
      set("--_dy", `${Math.round(-((e2.minY + e2.maxY) / 2) * k2)}px`);
    };
  }
  static getStubConfig() {
    return {
      type: "custom:rams-selector",
      title: "Mode",
      options: [{ option: "off", label: "off" }, { option: "auto", label: "auto" }, { option: "manual", label: "manual" }],
      columns: 6,
      rows: 2
    };
  }
  static getConfigElement() {
    return formEditor(this.getConfigForm());
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: { domain: ["input_select", "select", ...BOOLEAN] } } },
        { name: "title", selector: { text: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("title_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("shape", [["lever", "Lever"], ["knob", "Knob"]]),
            dropdown("cap", [["round", "Round cap (knob)"], ["pointer", "Pointer (knob)"]]),
            dropdown("orientation", [["right", "Right: first option on the left"], ["left", "Left: first option on the right"], ["down", "Down: first option on top"], ["up", "Up: first option at the bottom"]]),
            dropdown("show", [["auto", "Icon if set, else label"], ["labels", "Labels only"], ["both", "Icons and labels"], ["none", "None: no labels or icons"]]),
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown("labels_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("light", [["none", "None"], ["above", "One above"], ["below", "One below"], ["options", "One on each option"]]),
            { name: "lines", selector: { boolean: {} } },
            dropdown("order", [["normal", "Normal: first on the left or on top"], ["reversed", "Reversed"]])
          ]
        },
        {
          name: "options",
          selector: {
            object: {
              multiple: true,
              label_field: "option",
              description_field: "label",
              fields: {
                option: { label: "Option", required: true, selector: { text: {} } },
                label: { label: "Label", selector: { text: {} } },
                icon: { label: "Icon", selector: { icon: {} } }
              }
            }
          }
        },
        ...layoutFields(false),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            {
              name: "state_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "state",
                  fields: {
                    state: { label: "State", required: true, selector: { text: {} } },
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: TONES.filter(([v2]) => v2 !== "neutral").map(([value, label]) => ({ value, label })) } } }
                  }
                }
              }
            }
          ]
        }
      ],
      computeLabel,
      computeHelper
    };
  }
  actionable() {
    var _a2;
    return !!((_a2 = this.config) == null ? void 0 : _a2.entity) || super.actionable();
  }
  /** The stops in the entity's order (or as the options list gives them). */
  stops() {
    var _a2, _b, _c;
    const c2 = this.config;
    if ((_a2 = c2.options) == null ? void 0 : _a2.length) return c2.options.filter((o2) => (o2 == null ? void 0 : o2.option) !== void 0).map((o2) => {
      var _a3;
      return { option: String(o2.option), label: ((_a3 = o2.label) == null ? void 0 : _a3.trim()) ? o2.label : String(o2.option), icon: o2.icon || void 0 };
    });
    if (this.isBoolean()) return [{ option: "off", label: "off" }, { option: "on", label: "on" }];
    const options = c2.entity ? (_c = (_b = this.hass) == null ? void 0 : _b.states[c2.entity]) == null ? void 0 : _c.attributes.options : void 0;
    return Array.isArray(options) ? options.map((o2) => ({ option: String(o2), label: String(o2) })) : [];
  }
  /** The colour of an option's own lamp: lit on the current option, in the colour its state rule gives it. With rules set, an option without one stays dark. */
  lampTone(option) {
    var _a2, _b, _c, _d;
    const c2 = this.config;
    const judged = (_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.rules_entity ?? c2.entity ?? ""]) == null ? void 0 : _b.state;
    if (judged !== option) return void 0;
    if (!((_c = c2.state_colours) == null ? void 0 : _c.length)) return "red";
    const tone = (_d = c2.state_colours.find((r2) => r2.state === option)) == null ? void 0 : _d.tone;
    return tone && tone !== "neutral" ? tone : void 0;
  }
  vertical() {
    var _a2, _b;
    return ((_a2 = this.config) == null ? void 0 : _a2.orientation) === "down" || ((_b = this.config) == null ? void 0 : _b.orientation) === "up";
  }
  reversed() {
    var _a2, _b;
    return ((_a2 = this.config) == null ? void 0 : _a2.orientation) === "left" || ((_b = this.config) == null ? void 0 : _b.orientation) === "up";
  }
  current() {
    var _a2, _b, _c;
    const state = ((_a2 = this.config) == null ? void 0 : _a2.entity) ? (_c = (_b = this.hass) == null ? void 0 : _b.states[this.config.entity]) == null ? void 0 : _c.state : void 0;
    return state === void 0 ? -1 : this.stops().findIndex((s2) => s2.option === state);
  }
  isBoolean() {
    var _a2, _b;
    return BOOLEAN.includes(((_b = (_a2 = this.config) == null ? void 0 : _a2.entity) == null ? void 0 : _b.split(".")[0]) ?? "");
  }
  select(option) {
    var _a2;
    const c2 = this.config;
    const domain = (_a2 = c2 == null ? void 0 : c2.entity) == null ? void 0 : _a2.split(".")[0];
    if (!(c2 == null ? void 0 : c2.entity) || !this.hass) return;
    if (this.isBoolean()) void this.hass.callService("homeassistant", option === "on" ? "turn_on" : "turn_off", { entity_id: c2.entity });
    else if (domain === "input_select" || domain === "select") void this.hass.callService(domain, "select_option", { entity_id: c2.entity, option });
  }
  /** A tap on the current stop steps on; a tap on another stop goes there. */
  choose(i2) {
    const stops = this.stops();
    if (!stops.length) return;
    const now = this.current();
    if (i2 !== now) return this.select(stops[i2].option);
    this.select(stops[(now + 1) % stops.length].option);
  }
  /** The angle of each option round the knob, in degrees clockwise from straight up. The fan is centred on the side the labels are on. */
  knobAngles() {
    const c2 = this.config;
    const n3 = this.stops().length;
    const step = knobStep(n3, (c2 == null ? void 0 : c2.cap) === "pointer");
    const side = (c2 == null ? void 0 : c2.labels_position) ?? "above";
    const centre = side === "right" ? 90 : side === "below" ? 180 : side === "left" ? 270 : 0;
    const dir = (side === "below" || side === "left" ? -1 : 1) * ((c2 == null ? void 0 : c2.order) === "reversed" ? -1 : 1);
    return Array.from({ length: n3 }, (_2, i2) => centre + dir * (-(step * (n3 - 1)) / 2 + i2 * step));
  }
  /** What the knob's drawing covers, as fractions of its square measured from its centre (y down): the cap, the labels and the scale. */
  knobExtent() {
    const c2 = this.config;
    const ptr = (c2 == null ? void 0 : c2.cap) === "pointer";
    const show = (c2 == null ? void 0 : c2.show) ?? "auto";
    const stops = this.stops();
    const chars = show === "none" ? 0 : Math.max(0, ...stops.map((x2) => show === "labels" || show === "both" || !x2.icon ? x2.label.length : 0));
    const lw = chars ? Math.min(0.9, 0.07 * chars + 0.05) + (show === "both" ? 0.1 : 0) : show === "none" ? 0.04 : 0.14;
    const lh = 0.1;
    const reach = ptr ? (c2 == null ? void 0 : c2.light) === "options" ? 0.49 : 0.42 : (c2 == null ? void 0 : c2.light) === "options" ? 0.44 : 0.38;
    let minX = ptr ? -0.13 : -0.27, maxX = -minX, minY = minX, maxY = maxX;
    for (const a2 of this.knobAngles()) {
      const sx = Math.sin(a2 * Math.PI / 180), sy = -Math.cos(a2 * Math.PI / 180);
      const tb = (c2 == null ? void 0 : c2.labels_position) === "left" || (c2 == null ? void 0 : c2.labels_position) === "right";
      const col = (c2 == null ? void 0 : c2.labels_position) === "left" ? -1 : 1;
      const cx = tb ? col * (reach + lw / 2) : reach * sx + sx * lw / 2, cy = tb ? (ptr ? 0.38 : 0.33) * sy : reach * sy + sy * lh / 2;
      minX = Math.min(minX, cx - lw / 2);
      maxX = Math.max(maxX, cx + lw / 2);
      minY = Math.min(minY, cy - lh / 2);
      maxY = Math.max(maxY, cy + lh / 2);
      if (ptr) {
        minX = Math.min(minX, 0.34 * sx - 0.03);
        maxX = Math.max(maxX, 0.34 * sx + 0.03);
        minY = Math.min(minY, 0.34 * sy - 0.03);
        maxY = Math.max(maxY, 0.34 * sy + 0.03);
      }
    }
    return { minX, maxX, minY, maxY: maxY + 0.03 };
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback();
    (_a2 = this.watcher) == null ? void 0 : _a2.disconnect();
    this.watcher = void 0;
    this.watched = void 0;
  }
  /** In a panel with no rows set, ask for the rows the control needs; the lever, labels, lamp and title must fit. */
  updated() {
    var _a2, _b, _c;
    const c2 = this.config;
    const face = ((_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".kslot")) ?? void 0;
    if (face !== this.watched) {
      (_b = this.watcher) == null ? void 0 : _b.disconnect();
      this.watched = face;
      if (face) {
        this.watcher ?? (this.watcher = new ResizeObserver(this.fitKnob));
        this.watcher.observe(face);
      }
    }
    this.fitKnob();
    if (!c2 || this.rowsSet() !== void 0) return;
    const stops = this.stops();
    const n3 = stops.length;
    const z2 = SIZES[c2.size ?? "small"];
    const light = c2.light === "above" || c2.light === "below" ? 17 : 0;
    const pos = c2.title_position ?? "below";
    const title = ((_c = c2.title) == null ? void 0 : _c.trim()) && pos !== "left" && pos !== "right" ? 18 : 0;
    const show = c2.show ?? "auto";
    const own = c2.light === "options";
    const icon = show !== "labels" && show !== "none" && stops.some((x2) => x2.icon);
    const text = show === "labels" || show === "both" || show === "auto" && stops.some((x2) => !x2.icon);
    const body = icon && text && show === "both" ? z2.ico + 3 + z2.fs + 4 : icon ? z2.ico : text ? z2.fs + 4 : 0;
    const labels = body || own ? body + (own ? 15 : 0) + (c2.lines && !own ? 8 : 0) + 4 : 0;
    if (c2.shape === "knob") {
      const e2 = this.knobExtent();
      return this.reportRows(this.rowsFor(KNOB[c2.size ?? "small"] * (e2.maxY - e2.minY) + light + title + 4));
    }
    const need = this.vertical() ? n3 * z2.p + light + title + 4 : z2.p + labels + light + title + 4;
    this.reportRows(this.rowsFor(need));
  }
  /** The stop one step toward the left (-1) or right (1) of the scale, or -1 at the end. A knob does not wrap. */
  nudgeTo(side, dir) {
    const n3 = this.stops().length;
    const now = this.current();
    if (now < 0) return n3 ? 0 : -1;
    const i2 = now + side * dir;
    return i2 < 0 || i2 >= n3 ? -1 : i2;
  }
  nudge(side, dir) {
    const i2 = this.nudgeTo(side, dir);
    if (i2 >= 0) this.select(this.stops()[i2].option);
  }
  /** Knob: the options are spread round the top, the cap turns to the current one. */
  knob(c2, stops, now, show, z2, lamp, title, pos, own, lines) {
    const n3 = stops.length;
    const ptr = c2.cap === "pointer";
    const step = knobStep(n3, ptr);
    const angles = this.knobAngles();
    const angle = (i2) => angles[i2];
    const turn = n3 > 1 && angles[n3 - 1] > angles[0] ? 1 : 0;
    const sgn = c2.order === "reversed" ? -1 : 1;
    const tb = c2.labels_position === "left" || c2.labels_position === "right";
    const S2 = KNOB[c2.size ?? "small"];
    const cap = now < 0 ? (angles[0] + angles[n3 - 1]) / 2 : angle(now);
    const at2 = (a2, r2) => `${(50 + r2 * Math.sin(a2 * Math.PI / 180)).toFixed(2)} ${(50 - r2 * Math.cos(a2 * Math.PI / 180)).toFixed(2)}`;
    const rm = ptr ? 38 : 33;
    const arc = n3 > 1 && !own ? w$1`<svg class="arc" viewBox="0 0 100 100"><path d="M ${at2(angle(0), rm)} A ${rm} ${rm} 0 ${step * (n3 - 1) > 180 ? 1 : 0} ${turn} ${at2(angle(n3 - 1), rm)}" />${stops.map((_2, i2) => w$1`<line x1=${at2(angle(i2), rm).split(" ")[0]} y1=${at2(angle(i2), rm).split(" ")[1]} x2=${at2(angle(i2), rm - 2.5).split(" ")[0]} y2=${at2(angle(i2), rm - 2.5).split(" ")[1]} />`)}</svg>` : A;
    const drop = ptr ? w$1`<svg viewBox="-31 -31 62 62"><defs><linearGradient id="rams-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9d8d3" /><stop offset="0.55" stop-color="#a9a8a3" /><stop offset="1" stop-color="#8f8e89" /></linearGradient></defs><path d="M10.05 -5.8 L3.35 -17.57 Q1.86 -20.18 1.86 -23.18 L1.86 -31.9 A1.86 1.86 0 0 0 -1.86 -31.9 L-1.86 -23.18 Q-1.86 -20.18 -3.35 -17.57 L-10.05 -5.8 A11.6 11.6 0 1 0 10.05 -5.8 Z" fill="url(#rams-metal)" stroke="rgba(0,0,0,0.25)" stroke-width="0.4" stroke-linejoin="round" /></svg>` : A;
    const pts = stops.map((s2, i2) => {
      const a2 = angle(i2);
      const rad2 = a2 * Math.PI / 180;
      const ax = Math.round(Math.sin(rad2) * 1e3) / 1e3;
      const ay = Math.round(-Math.cos(rad2) * 1e3) / 1e3;
      const sideSign = c2.labels_position === "left" ? -1 : 1;
      const ux = tb ? sideSign : ax;
      const uy = tb ? 0 : ay;
      const bx = tb ? sideSign : ax;
      const reach = ptr ? own ? 49 : 42 : own ? 44 : 38;
      const ayv = tb ? ay * rm / reach : ay;
      const hasIcon = show !== "labels" && show !== "none" && !!s2.icon;
      const icon = hasIcon ? b`<ha-icon class="ico" .icon=${s2.icon}></ha-icon>` : A;
      const text = show === "labels" || show === "both" || show === "auto" && !hasIcon ? b`<span>${s2.label}</span>` : A;
      const tone = own ? this.lampTone(s2.option) : void 0;
      const lampEl = own ? b`<span class="ray" style="--r:${a2}deg"><span class="pip" style="top: calc(-${rm}cqmin - 4px)"><i class="lamp sm ${tone ? `on ${tone}` : ""}"></i></span></span>` : A;
      const side = ux < -0.3 ? "ux-l" : "ux-1";
      return b`${lampEl}<span class="pt ${side}" style="--ax:${bx}; --ay:${ayv}; --ux:${ux}; --uy:${uy}; --pr:${reach}"><button class="lab ${i2 === now ? "on" : ""}" title=${s2.label} @click=${() => this.choose(i2)}>${icon}${text}</button></span>`;
    });
    return b`<div class="wrap ${pos}">
      ${pos ? b`<span class="outer">${title}</span>` : A}
      <div class="face k" style="overflow: visible; gap: 12px; --S:${S2}px">${c2.light === "below" ? A : lamp}
        <div class="kslot"><div class="knobbox ${tb ? "tb" : ""}" style="--a:${cap}deg; --fs:${z2.fs}px; --ico:${z2.ico}px">${arc}${pts}<span class="disc ${ptr ? "ptr" : ""} ${now < 0 ? "none" : ""}"><span class="turn">${ptr ? drop : b`<i class="dot"></i>`}</span></span><button class="half l ${this.nudgeTo(-1, sgn) < 0 ? "off" : ""}" aria-label=${tb ? "Up" : "Left"} @click=${() => this.nudge(-1, sgn)}></button><button class="half r ${this.nudgeTo(1, sgn) < 0 ? "off" : ""}" aria-label=${tb ? "Down" : "Right"} @click=${() => this.nudge(1, sgn)}></button></div></div>
      ${c2.light === "below" ? lamp : A}</div>
    </div>`;
  }
  render() {
    var _a2;
    const c2 = this.config;
    if (!c2) return A;
    const vertical = this.vertical();
    const stops = this.stops();
    const n3 = Math.max(1, stops.length);
    const order = stops.map((_2, i2) => i2);
    if (this.reversed()) order.reverse();
    const now = this.current();
    const slotIndex = now < 0 ? 0 : order.indexOf(now);
    const show = c2.show ?? "auto";
    const z2 = SIZES[c2.size ?? "small"];
    const lines = !!c2.lines && c2.light !== "options";
    const side = c2.labels_position ?? (vertical ? "right" : "above");
    const before = vertical ? side === "left" || side === "above" : side === "above" || side === "left";
    const view = readState(this.hass, c2.entity, c2);
    const lamp = c2.light === "above" || c2.light === "below" ? b`<i class="lamp ${view.signal ? `on ${view.signal}` : ""}"></i>` : A;
    const title = ((_a2 = c2.title) == null ? void 0 : _a2.trim()) ?? "";
    const pos = title ? c2.title_position ?? "below" : "";
    const own = c2.light === "options";
    const labels = show === "none" && !own && !lines ? A : b`<div class="labels ${before ? "before" : "after"}">${order.map((i2) => {
      const s2 = stops[i2];
      const hasIcon = show !== "labels" && show !== "none" && !!s2.icon;
      const icon = hasIcon ? b`<ha-icon class="ico" .icon=${s2.icon}></ha-icon>` : A;
      const text = show === "labels" || show === "both" || show === "auto" && !hasIcon ? b`<span>${s2.label}</span>` : A;
      const vi = order.indexOf(i2);
      const half = Math.floor(n3 / 2);
      const where = n3 === 1 || n3 % 2 === 1 && vi === half ? "m" : vi < half ? "l" : "r";
      const tone = own ? this.lampTone(s2.option) : void 0;
      return b`<button class="lab ${where} ${i2 === now ? "on" : ""}" title=${s2.label} @click=${() => this.choose(i2)}>${lines ? b`<i class="lead"></i>` : A}${own ? b`<span class="lane"><i class="lamp sm ${tone ? `on ${tone}` : ""}"></i></span>` : A}${icon}${text}</button>`;
    })}</div>`;
    if (c2.shape === "knob") return this.knob(c2, stops, now, show, z2, lamp, title, pos, own, lines);
    const slot = b`<div class="slot"><div class="stops">${order.map((i2) => b`<button class="stop" aria-label=${stops[i2].label} @click=${() => this.choose(i2)}></button>`)}</div><i class="lever ${now < 0 ? "none" : ""}"></i></div>`;
    const ctl = b`<div class="ctl ${vertical ? "v" : "h"}" style="--n:${n3}; --i:${slotIndex}; --p:${z2.p}px; --fs:${z2.fs}px; --ico:${z2.ico}px">${before ? labels : A}${slot}${before ? A : labels}</div>`;
    return b`<div class="wrap ${pos}">
      ${pos ? b`<span class="outer">${title}</span>` : A}
      <div class="face ${vertical ? "v" : "h"}">${c2.light === "below" ? A : lamp}${ctl}${c2.light === "below" ? lamp : A}</div>
    </div>`;
  }
};
RamsSelector.styles = [
  tokens,
  faceStyles,
  i$3`
      /* a flex column, so the card fills the height its rows give it even where the host's own height is not known (sections view) */
      :host { display: flex; flex-direction: column; }
      .wrap { flex: 1; }
      /* a horizontal lever and its title sit together in the middle of the cell; a vertical one takes the cell's height */
      .wrap { justify-content: center; }
      .face.h { flex: none; }
      .wrap.left .face.h, .wrap.right .face.h { flex: 1; }
      .face { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 0; overflow: visible; }
      .ctl { box-sizing: border-box; min-width: 0; display: flex; gap: 4px; }
      .ctl.h { flex-direction: column; width: 100%; max-width: calc(var(--n) * 110px); }
      .ctl.v { flex: 1; align-self: stretch; min-height: 0; flex-direction: row; justify-content: center; gap: 8px; }
      .slot { position: relative; flex: none; box-sizing: border-box; border-radius: 4px; background-color: var(--_slot, #2b2118); box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6); }
      /* a fine brushed grain, along the travel */
      .h .slot { width: 100%; height: var(--p); background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 3px); }
      .v .slot { width: var(--p); height: 100%; background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 3px); }
      .stops { position: absolute; inset: 0; display: grid; }
      .h .stops { grid-template-columns: repeat(var(--n), 1fr); }
      .v .stops { grid-template-rows: repeat(var(--n), 1fr); }
      .stop { all: unset; cursor: pointer; -webkit-tap-highlight-color: transparent; }
      /* the lever: graphite with ribs across the travel, and a white stripe */
      .lever { position: absolute; border-radius: 3px; --_g: color-mix(in srgb, var(--_slot, #2b2118) 38%, #bdbab4); background-color: var(--_g); box-shadow: 0 calc(var(--p) * 0.08) calc(var(--p) * 0.1) rgba(0, 0, 0, 0.7), 0 1px 1px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.14); pointer-events: none; transition: left 0.12s ease-out, top 0.12s ease-out; }
      .h .lever { top: 3px; bottom: 3px; left: calc(var(--i) * 100% / var(--n) + 3px); width: calc(100% / var(--n) - 6px); background-image: repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.22) 0 1px, rgba(255, 255, 255, 0.35) 1px 2px, transparent 2px 5px); }
      .v .lever { left: 3px; right: 3px; top: calc(var(--i) * 100% / var(--n) + 3px); height: calc(100% / var(--n) - 6px); background-image: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 1px, rgba(255, 255, 255, 0.35) 1px 2px, transparent 2px 5px); }
      .lever::after { content: ""; position: absolute; background: #fff; border-radius: 1px; box-shadow: 0 0 1px rgba(255, 255, 255, 0.6), 0 0 0 0.5px rgba(0, 0, 0, 0.25); }
      .h .lever::after { top: 22%; bottom: 22%; left: 50%; width: 3px; margin-left: -1.5px; }
      .v .lever::after { left: 22%; right: 22%; top: 50%; height: 3px; margin-top: -1.5px; }
      .lever.none { opacity: 0.4; }
      /* the knob: options sit round it from a start angle; the box is square and everything inside is in cqmin of it */
      /* the knob fills the room it is given (--S is the least it needs): a square as big as fits beside the lamp, with text and shadow scaling along */
      .face.k { flex: 1; align-self: stretch; min-height: 0; }
      .kslot { flex: 1; min-height: 0; align-self: stretch; position: relative; }
      .knobbox { position: absolute; left: 50%; top: 50%; width: var(--_K, var(--S)); height: var(--_K, var(--S)); transform: translate(calc(-50% + var(--_dx, 0px)), calc(-50% + var(--_dy, 0px))); container-type: size; }
      .knobbox .lab { font-size: max(var(--fs), 8.6cqmin); }
      .knobbox .ico { --mdc-icon-size: max(var(--ico), 14cqmin); width: max(var(--ico), 14cqmin); height: max(var(--ico), 14cqmin); }
      .knobbox .lamp.sm { width: max(8px, 6cqmin); height: max(8px, 6cqmin); }
      /* round cap: spun metal with a sheen that stays put while the red dot turns; the shadow falls the same way whatever the position */
      .knobbox .disc { pointer-events: none; position: absolute; left: calc(50% - 24cqmin); top: calc(50% - 24cqmin); width: 48cqmin; height: 48cqmin; border-radius: 50%; box-sizing: border-box;
        background:
          radial-gradient(circle, transparent 0 62%, rgba(0, 0, 0, 0.1) 100%),
          repeating-radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0 0.3cqmin, rgba(255, 255, 255, 0.04) 0.3cqmin 0.6cqmin),
          conic-gradient(from 20deg, #d8d6d1, #eceae6 14%, #c4c2bc 28%, #e3e1dc 42%, #bbb9b3 56%, #dfddd8 70%, #c7c5bf 84%, #d8d6d1);
        box-shadow: 0 4cqmin 4cqmin rgba(0, 0, 0, 0.28), 0 1cqmin 1cqmin rgba(0, 0, 0, 0.45), 0 0 0 0.3cqmin rgba(0, 0, 0, 0.3), inset 0 0.5cqmin 0.5cqmin rgba(255, 255, 255, 0.75), inset 0 -0.5cqmin 0.5cqmin rgba(0, 0, 0, 0.18); }
      .disc .turn { position: absolute; inset: 0; transform: rotate(var(--a)); transition: transform 0.15s ease-out; }
      /* a small red triangle pointing out to the rim */
      .disc .dot { position: absolute; left: calc(50% - 3.2cqmin); top: 2.8cqmin; width: 6.4cqmin; height: 6.4cqmin; clip-path: polygon(50% 0, 100% 100%, 0 100%); background: linear-gradient(180deg, #e8685c, var(--_alert, #c8362b) 55%, #a82c22); }
      .knobbox .disc.none { opacity: 0.4; }
      /* pointer cap: a brushed-metal teardrop turning about its round end, the scale arc beyond its tip */
      .knobbox .disc.ptr { left: calc(50% - 31cqmin); top: calc(50% - 31cqmin); width: 62cqmin; height: 62cqmin; border-radius: 0; background: none; box-shadow: none; overflow: visible; filter: drop-shadow(0 4cqmin 3cqmin rgba(0, 0, 0, 0.32)) drop-shadow(0 1cqmin 1cqmin rgba(0, 0, 0, 0.45)); }
      .disc.ptr svg { width: 100%; height: 100%; overflow: visible; }
      .arc { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .arc path, .arc line { stroke: var(--_muted); stroke-width: 0.9; fill: none; stroke-linecap: round; }
      /* two halves: left steps toward the left of the scale, right toward the right (top and bottom when the labels are at the side); nothing at either end */
      .half { all: unset; position: absolute; top: calc(50% - 28cqmin); width: 28cqmin; height: 56cqmin; cursor: pointer; -webkit-tap-highlight-color: transparent; }
      .half.l { left: calc(50% - 28cqmin); border-radius: 28cqmin 0 0 28cqmin; } .half.r { left: 50%; border-radius: 0 28cqmin 28cqmin 0; }
      .knobbox.tb .half.l { left: calc(50% - 28cqmin); top: calc(50% - 28cqmin); width: 56cqmin; height: 28cqmin; border-radius: 28cqmin 28cqmin 0 0; }
      .knobbox.tb .half.r { left: calc(50% - 28cqmin); top: 50%; width: 56cqmin; height: 28cqmin; border-radius: 0 0 28cqmin 28cqmin; }
      .half.off { cursor: default; }
      .ray { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform: rotate(var(--r)); }
      .ray .tick { position: absolute; left: -0.5px; top: -33cqmin; width: 1px; height: 5cqmin; background: var(--_muted); }
      .ray .pip { position: absolute; left: -4px; top: calc(-33cqmin - 4px); display: flex; align-items: center; justify-content: center; width: 8px; height: 8px; }
      .pt { position: absolute; left: calc(50% + var(--ax) * var(--pr) * 1cqmin); top: calc(50% + var(--ay) * var(--pr) * 1cqmin); transform: translate(calc(-50% + var(--ux) * 50%), calc(-50% + var(--uy) * 50%)); }
      .pt .lab { flex-direction: row; gap: 4px; padding: 0; white-space: nowrap; }
      .pt.ux-1 .lab { flex-direction: row; } .pt.ux-l .lab { flex-direction: row-reverse; }
      .pt .lab.ico-only { gap: 0; }
      .labels { display: grid; min-width: 0; }
      .h .labels { grid-template-columns: repeat(var(--n), 1fr); width: 100%; }
      .v .labels { grid-template-rows: repeat(var(--n), 1fr); flex: none; width: max-content; max-width: 70%; }
      /* from the slot outward: line, lamp, icon, text. The lamp and icon sit in lanes of their own, so they line up whatever the text. */
      .lab { all: unset; box-sizing: border-box; min-width: 0; display: flex; align-items: center; gap: 4px; padding: 0 1px; cursor: pointer; font-size: var(--fs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--_muted); -webkit-tap-highlight-color: transparent; }
      .lab.on { color: var(--_ink); }
      .lab span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .h .lab { flex-direction: column; justify-content: center; gap: 3px; }
      .h .labels.before .lab { flex-direction: column-reverse; }
      .v .lab { flex-direction: row; justify-content: flex-start; gap: 8px; padding: 0; }
      .v .labels.before .lab { flex-direction: row-reverse; }
      .v .labels.before .lab span { text-align: right; }
      .lead { flex: none; background: var(--_muted); }
      .v .lead { width: 8px; height: 1px; }
      /* horizontal: a hook. A bar on the text side runs to the middle of the cell, where the stop is, and drops to the slot. Odd middle: straight. */
      .h .lead { width: 50%; height: 8px; background: none; border: 0 solid var(--_muted); }
      .h .lab.l { align-items: flex-start; text-align: left; } .h .lab.r { align-items: flex-end; text-align: right; } .h .lab.m { align-items: center; text-align: center; }
      .h .lab.l .lead { align-self: flex-start; border-right-width: 1px; } .h .lab.r .lead { align-self: flex-end; border-left-width: 1px; }
      .h .lab.m .lead { align-self: center; width: 0; border-left-width: 1px; }
      .h .labels.before .lab.l .lead, .h .labels.before .lab.r .lead { border-top-width: 1px; }
      .h .labels.after .lab.l .lead, .h .labels.after .lab.r .lead { border-bottom-width: 1px; }
      .lane { flex: none; display: flex; align-items: center; justify-content: center; width: 12px; height: 12px; }
      .v .lane { width: 8px; }
      .ico { --mdc-icon-size: var(--ico); flex: none; display: inline-flex; width: var(--ico); height: var(--ico); }
      .lamp.sm { width: 8px; height: 8px; }
      .lamp { flex: none; width: 12px; height: 12px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
      .lamp.on { background: var(--l); box-shadow: 0 0 max(var(--_glow), 6px) 1px color-mix(in srgb, var(--l) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
      .lamp.red { --l: var(--_alert); } .lamp.orange { --l: var(--_orange); } .lamp.blue { --l: var(--_blue); } .lamp.green { --l: var(--_green); } .lamp.grey { --l: var(--_grey); }
    `
];
RamsSelector = __decorateClass$b([
  t("rams-selector")
], RamsSelector);
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsDisplay = class extends Piece {
  constructor() {
    super(...arguments);
    this.defaultFrame = "recessed";
    this.hostFrame = false;
    this.press = new Press(this, () => this.actionable() ? this.config : void 0);
  }
  signal() {
    var _a2;
    if (this.lamp()) return void 0;
    return readState(this.hass, (_a2 = this.config) == null ? void 0 : _a2.entity, this.config ?? {}).signal;
  }
  lamp() {
    var _a2;
    return !!((_a2 = this.config) == null ? void 0 : _a2.light) && this.config.light !== "none";
  }
  static getStubConfig() {
    return { type: "custom:rams-display", title: "Title", text: "Value", size: "medium" };
  }
  static getConfigElement() {
    return formEditor(this.getConfigForm());
  }
  static getConfigForm() {
    const dropdown2 = (name, options) => ({
      name,
      selector: { select: { mode: "dropdown", options: options.map(([value, label]) => ({ value, label })) } }
    });
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "text", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
            { name: "unit", selector: { text: {} } },
            dropdown2("title_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown2("show", [["all", "Title and value"], ["value", "Value only"], ["title", "Title only"], ["none", "Icon and light only"]]),
            dropdown2("light", [["none", "None"], ["left", "Left"], ["right", "Right"], ["only", "Only the light"]]),
            dropdown2("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown2("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]])
          ]
        },
        ...layoutFields(),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            {
              name: "value_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "value",
                  description_field: "when",
                  fields: {
                    when: { label: "When the number is", required: true, selector: { select: { mode: "dropdown", options: [{ value: "above", label: "Above" }, { value: "below", label: "Below" }] } } },
                    value: { label: "Value", required: true, selector: { number: { mode: "box", step: "any" } } },
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: TONES.filter(([v2]) => v2 !== "neutral").map(([value, label]) => ({ value, label })) } } }
                  }
                }
              }
            },
            {
              name: "state_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "state",
                  fields: {
                    state: { label: "State", required: true, selector: { text: {} } },
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: TONES.filter(([v2]) => v2 !== "neutral").map(([value, label]) => ({ value, label })) } } }
                  }
                }
              }
            }
          ]
        }
      ],
      computeLabel,
      computeHelper
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
    var _a2;
    const c2 = this.config;
    if (!c2) return A;
    const title = ((_a2 = c2.title) == null ? void 0 : _a2.trim()) ?? "";
    const outside = c2.title_position && c2.title_position !== "inside" && !!title;
    const inside = !!title && !outside;
    const light = this.lamp() ? c2.light : "none";
    const show = c2.show ?? "all";
    const notext = show === "none" && light !== "only";
    const showTitle = inside && (show === "all" || show === "title");
    const showValue = show === "all" || show === "value";
    const cls = [c2.align ?? "start", c2.size ?? "medium", showTitle && light !== "only" ? "has-title" : "", notext ? "notext" : "", !showValue ? "noval" : "", light !== "none" ? `lamp-${light}` : ""].filter(Boolean).join(" ");
    const tone = light !== "none" ? readState(this.hass, c2.entity, c2).signal : void 0;
    const face = [c2.frame ?? this.defaultFrame, this.hasAttribute("signal") ? "sig" : ""].filter((x2) => x2 && x2 !== "none").join(" ");
    return b`<div class="wrap ${outside ? c2.title_position : ""}">
      ${outside ? b`<span class="outer">${title}</span>` : A}
      <div class="face ${face}" @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
        <div class="box ${cls}">
          ${light !== "none" ? b`<i class="lamp ${tone ? `on ${tone}` : ""}"></i>` : A}
          ${light === "only" ? A : b`<div class="block">
            ${showTitle ? b`<span class="title">${title}</span>` : A}
            <span class="value">${c2.icon ? b`<ha-icon class="ico" .icon=${c2.icon}></ha-icon>` : A}${showValue ? b`<span class="txt">${this.value()}${c2.unit ? b`<span class="unit">${c2.unit}</span>` : A}</span>` : A}</span>
          </div>`}
        </div>
      </div>
    </div>`;
  }
};
RamsDisplay.styles = [
  tokens,
  faceStyles,
  i$3`
      /* the lamp and the text are one group, centred; spare room goes outside it */
      .box { box-sizing: border-box; height: 100%; display: flex; align-items: center; gap: 8px; }
      .box.lamp-right { flex-direction: row-reverse; }
      .box.lamp-only { justify-content: center; }
      .block { flex: 1; min-width: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
      .start .block { align-items: flex-start; text-align: left; }
      .center .block { align-items: center; text-align: center; }
      .end .block { align-items: flex-end; text-align: right; }
      /* no text: the icon and the lamp sit together, on the side the alignment says */
      .notext .block { flex: none; }
      /* icon and lamp on one centre line */
      .noval .ico { margin: 0; }
      .notext.start { justify-content: flex-start; } .notext.center { justify-content: center; } .notext.end { justify-content: flex-end; }
      .notext.lamp-right.start { justify-content: flex-end; } .notext.lamp-right.end { justify-content: flex-start; }
      .has-title { padding: 8px 0; }
      .lamp { flex: none; width: 12px; height: 12px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
      .lamp-only .lamp { width: 16px; height: 16px; }
      .lamp.on { background: var(--l); box-shadow: 0 0 max(var(--_glow), 6px) 1px color-mix(in srgb, var(--l) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
      .lamp.red { --l: var(--_alert); } .lamp.orange { --l: var(--_orange); } .lamp.blue { --l: var(--_blue); } .lamp.green { --l: var(--_green); } .lamp.grey { --l: var(--_grey); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      /* icon and text on one centre line; the unit sits on the text's baseline */
      .value { display: flex; align-items: center; line-height: 1.1; }
      .txt { display: flex; align-items: baseline; gap: 3px; white-space: nowrap; }
      .ico { --mdc-icon-size: 1em; flex: none; display: inline-flex; align-items: center; justify-content: center; width: 1em; height: 1em; margin-right: 6px; }
      .small .value { font-size: 12px; }
      .medium .value { font-size: 20px; }
      .large .value { font-size: 44px; letter-spacing: -0.02em; }
      .unit { font-size: 0.4em; color: var(--_muted); letter-spacing: 0; }
    `
];
RamsDisplay = __decorateClass$a([
  t("rams-display")
], RamsDisplay);
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsLabel = class extends Piece {
  constructor() {
    super(...arguments);
    this.hostFrame = false;
    this.press = new Press(this, () => this.actionable() ? this.config : void 0);
  }
  signal() {
    var _a2;
    return readState(this.hass, (_a2 = this.config) == null ? void 0 : _a2.entity, this.config ?? {}).signal;
  }
  static getStubConfig() {
    return { type: "custom:rams-label", text: "Section", line: "below" };
  }
  static getConfigElement() {
    return formEditor(this.getConfigForm());
  }
  static getConfigForm() {
    const tones = TONES.filter(([v2]) => v2 !== "neutral").map(([value, label]) => ({ value, label }));
    return {
      schema: [
        { name: "text", selector: { text: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
            { name: "unit", selector: { text: {} } },
            dropdown("size", SIZES$1),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
            dropdown("line", [["none", "None"], ["below", "Below the text"], ["above", "Above the text"], ["beside", "Both sides of the text"]])
          ]
        },
        {
          type: "expandable",
          name: "",
          title: "Size in panel",
          schema: [{ type: "grid", name: "", schema: [num$1("columns", 1, 24), num$1("rows", 0.5, 12, { step: 0.5 })] }]
        },
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            {
              name: "value_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "value",
                  description_field: "when",
                  fields: {
                    when: { label: "When the number is", required: true, selector: { select: { mode: "dropdown", options: [{ value: "above", label: "Above" }, { value: "below", label: "Below" }] } } },
                    value: { label: "Value", required: true, selector: { number: { mode: "box", step: "any" } } },
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: tones } } }
                  }
                }
              }
            },
            {
              name: "state_colours",
              selector: {
                object: {
                  multiple: true,
                  label_field: "state",
                  fields: {
                    state: { label: "State", required: true, selector: { text: {} } },
                    tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: tones } } }
                  }
                }
              }
            }
          ]
        }
      ],
      computeLabel,
      computeHelper: (s2) => s2.name === "rows" ? "Only used inside a Rams panel. A label is half a row high (0.5) unless you say otherwise." : computeHelper(s2)
    };
  }
  /** A label defaults to half a row; the panel reads this. */
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 1, min_rows: 1 };
  }
  value() {
    var _a2;
    const c2 = this.config;
    if (!c2.entity) return c2.text ?? "";
    const e2 = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity];
    if (!e2) return "";
    return c2.attribute ? String(e2.attributes[c2.attribute] ?? "") : e2.state;
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const line = c2.line ?? "none";
    const beside = line === "beside";
    const align = beside ? "center" : c2.align ?? "start";
    const cls = [align, c2.size ?? "small", line === "below" || line === "above" ? line : ""].filter(Boolean).join(" ");
    return b`<div class="lab ${cls}" @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
      ${beside ? b`<i class="rule"></i>` : A}
      <span class="t">${c2.icon ? b`<ha-icon class="ico" .icon=${c2.icon}></ha-icon>` : A}${this.value()}${c2.unit ? b`<span class="unit">${c2.unit}</span>` : A}</span>
      ${beside ? b`<i class="rule"></i>` : A}
    </div>`;
  }
};
RamsLabel.styles = [
  tokens,
  i$3`
      :host { display: block; min-width: 0; }
      .lab { box-sizing: border-box; height: 100%; min-height: 0; display: flex; align-items: center; gap: 10px; min-width: 0; color: var(--_ink); }
      .lab.start { justify-content: flex-start; } .lab.center { justify-content: center; } .lab.end { justify-content: flex-end; }
      .t { display: inline-flex; align-items: baseline; gap: 3px; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-transform: uppercase; letter-spacing: 0.1em; color: var(--_muted); }
      :host([signal]) .t { color: var(--_sig); }
      .ico { --mdc-icon-size: 1.2em; flex: none; align-self: center; margin-right: 4px; }
      .unit { font-size: 0.85em; letter-spacing: 0; }
      .small .t { font-size: 11px; }
      .medium .t { font-size: 14px; }
      .large .t { font-size: 18px; letter-spacing: 0.06em; }
      .rule { flex: 1; min-width: 12px; height: 1px; background: color-mix(in srgb, var(--_muted) 55%, transparent); }
      .lab.below, .lab.above { position: relative; }
      .lab.below::after, .lab.above::after { content: ""; position: absolute; left: 0; right: 0; height: 1px; background: color-mix(in srgb, var(--_muted) 55%, transparent); }
      .lab.below::after { bottom: 0; } .lab.above::after { top: 0; }
      :host([actionable]) .lab { cursor: pointer; }
    `
];
RamsLabel = __decorateClass$9([
  t("rams-label")
], RamsLabel);
var __defProp$4 = Object.defineProperty;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$4(target, key, result);
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
    this.helper = (s2) => s2.name === "screws" ? "A screw in each corner. The panel gets a wider margin so the pieces keep clear of them." : s2.name === "columns" ? "Inside another panel this is also the panel's width, in the parent's grid units." : s2.name === "rows" ? "Only used inside another panel: the height in the parent's grid units. Left empty, it takes what its content needs." : void 0;
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
    this.hideStackTitle(editor == null ? void 0 : editor.shadowRoot);
    const cards = ((_a2 = this.config) == null ? void 0 : _a2.cards) ?? [];
    if (editor && cards !== this.lastCards) {
      this.lastCards = cards;
      editor.setConfig({ type: "vertical-stack", cards });
    }
  }
  /** The stack editor brings its own "Title" field; the panel has a real one, so hide the stray copy. */
  hideStackTitle(root) {
    if (!root || root.querySelector("style[data-rams]")) return;
    const style = document.createElement("style");
    style.dataset.rams = "";
    style.textContent = "ha-form { display: none; }";
    root.append(style);
  }
  render() {
    if (!this.config || !this.hass) return A;
    const c2 = this.config;
    const schema = [
      { name: "title", selector: { text: {} } },
      { type: "grid", name: "", schema: [num$1("columns", 1, 24), num$1("spacing", 0, 24), dropdown("frame", FRAMES)] },
      { name: "screws", selector: { boolean: {} } },
      {
        type: "expandable",
        name: "",
        title: "Size in panel",
        schema: [num$1("rows", 1, 24)]
      },
      ...actionFields()
    ];
    const data = { ...c2, columns: c2.columns ?? 12, spacing: c2.spacing ?? 8, frame: c2.frame ?? "raised" };
    return b`
      <ha-form .hass=${this.hass} .data=${data} .schema=${schema} .computeLabel=${(s2) => s2.name === "columns" ? "grid columns" : computeLabel(s2)} .computeHelper=${this.helper} @value-changed=${this.columnsChanged}></ha-form>
      ${this.stackOk ? b`<hui-stack-card-editor
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            @config-changed=${this.cardsChanged}
          ></hui-stack-card-editor>` : b`<p>The visual piece editor is not available in this Home Assistant version. Use "Show code editor" to edit the cards.</p>`}
    `;
  }
}
__decorateClass$8([
  n2({ attribute: false })
], RamsPanelEditor.prototype, "hass");
__decorateClass$8([
  n2({ attribute: false })
], RamsPanelEditor.prototype, "lovelace");
__decorateClass$8([
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
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
const BASE_GAP = 8;
const BASE_RADIUS = 6;
let RamsPanel = class extends Piece {
  constructor() {
    super(...arguments);
    this.defaultFrame = "raised";
    this.hostFrame = false;
    this.press = new Press(this, () => this.config);
    this.needed = 1;
    this.fit = () => {
      var _a2, _b, _c, _d, _e;
      const plate = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".plate");
      const grid = (_b = this.shadowRoot) == null ? void 0 : _b.querySelector(".grid");
      if (!plate || !grid) return;
      const cs = getComputedStyle(plate);
      const px = (v2) => parseFloat(v2) || 0;
      const title = ((_d = (_c = this.shadowRoot) == null ? void 0 : _c.querySelector(".title")) == null ? void 0 : _d.offsetHeight) ?? 0;
      const nested = this.isNested();
      this.toggleAttribute("nested", nested);
      const fixed = nested && typeof ((_e = this.config) == null ? void 0 : _e.rows) === "number";
      this.toggleAttribute("fixed", fixed);
      grid.classList.add("natural");
      const natural = px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth) + title + grid.offsetHeight;
      grid.classList.remove("natural");
      const row = px(cs.getPropertyValue("--_row")) || 56;
      const gap = px(cs.getPropertyValue("--_gap")) || 8;
      const n3 = Math.max(1, Math.ceil((natural - 0.5 + gap) / (row + gap)));
      this.needed = n3;
      const span = fixed ? this.config.rows : n3;
      this.reportRows(span);
      const h2 = `${span * row + (span - 1) * gap}px`;
      if (plate.style.minHeight !== h2) plate.style.minHeight = h2;
    };
    this.onRows = (e2) => {
      const card = e2.composedPath().find((n3) => n3.localName === "hui-card");
      if (card) card.style.gridRow = `span ${e2.detail.rows * 2}`;
      e2.stopPropagation();
    };
    this.fits = (e2) => !e2.composedPath().some((n3) => {
      var _a2;
      return (_a2 = n3.hasAttribute) == null ? void 0 : _a2.call(n3, "actionable");
    });
    this.onClick = (e2) => {
      if (this.fits(e2)) this.press.click();
    };
    this.onDown = (e2) => {
      if (this.fits(e2)) this.press.down();
    };
  }
  static getStubConfig() {
    const key = (name) => ({ type: "custom:rams-button", name, columns: 3, rows: 2 });
    const cards = [
      { type: "custom:rams-display", title: "Temperature", text: "21.5", unit: "°C", size: "large", columns: 8, rows: 2 },
      { type: "custom:rams-dial", value: 40, min: 0, max: 100, interval: 10, label: "Level", columns: 4, rows: 3 },
      key("Lamp"),
      key("Fan"),
      key("Scene"),
      key("Alarm")
    ];
    return { type: "custom:rams-panel", columns: 12, cards };
  }
  static async getConfigElement() {
    return loadPanelEditor();
  }
  getGridOptions() {
    return { columns: 12, rows: "auto", min_rows: this.needed };
  }
  /** One base radius and one gap: both come from the panel's spacing, so the corners stay concentric. */
  willUpdate(changed) {
    var _a2;
    super.willUpdate(changed);
    if (!changed.has("config")) return;
    const gap = ((_a2 = this.config) == null ? void 0 : _a2.spacing) ?? BASE_GAP;
    this.style.setProperty("--rams-gap", `${gap}px`);
    this.style.setProperty("--rams-radius", `${Math.max(2, BASE_RADIUS + (gap - BASE_GAP) / 2)}px`);
  }
  /** True when this panel sits inside another panel (through hui-card and shadow roots). */
  isNested() {
    let n3 = this.parentNode;
    while (n3) {
      n3 = n3 instanceof ShadowRoot ? n3.host : n3;
      if (n3.localName === "rams-panel") return true;
      n3 = n3.parentNode ?? n3.host ?? null;
    }
    return false;
  }
  updated() {
    var _a2;
    const grid = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".grid");
    if (grid && !this.watcher) {
      this.watcher = new ResizeObserver(this.fit);
      this.watcher.observe(grid);
    }
    this.fit();
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback();
    (_a2 = this.watcher) == null ? void 0 : _a2.disconnect();
    this.watcher = void 0;
  }
  /** Rows a card takes: what it says, else one (a label: half a row). */
  rowsOf(card) {
    return typeof card.rows === "number" ? card.rows : card.type === "custom:rams-label" ? 0.5 : 1;
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const cols = c2.columns ?? 12;
    const frame = c2.frame ?? this.defaultFrame;
    const screws = !!c2.screws && frame !== "none";
    return b`<div class="plate f-${frame} ${screws ? "screwed" : ""}" @rams-rows=${this.onRows} @click=${this.onClick} @pointerdown=${this.onDown} @pointerup=${this.press.up} @pointerleave=${this.press.up}>
      ${screws ? b`<i class="screw tl"></i><i class="screw tr"></i><i class="screw bl"></i><i class="screw br"></i>` : A}
      ${c2.title ? b`<div class="title">${c2.title}</div>` : A}
      <div class="grid" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr))">
        ${(c2.cards ?? []).map(
      (card) => b`<hui-card
            .config=${card}
            .hass=${this.hass}
            style="grid-column: ${card.columns ? `span ${Math.min(card.columns, cols)}` : "1 / -1"}; grid-row: span ${Math.max(1, Math.round(2 * this.rowsOf(card)))}"
          ></hui-card>`
    )}
      </div>
    </div>`;
  }
};
RamsPanel.styles = [
  tokens,
  i$3`
      .plate { display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; height: 100%; padding: var(--_gap); border-radius: calc(var(--_radius) + var(--_gap)); }
      .plate.f-outline, .plate.f-recessed, .plate.f-raised { background: var(--_plate); border: var(--_border); }
      .plate.f-recessed { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); --rams-ink: var(--_lcd-ink); --rams-muted: var(--_lcd-muted); box-shadow: var(--_inset); }
      .plate.f-raised { box-shadow: var(--_raised); }
      .plate.screwed { position: relative; padding: calc(var(--_gap) + 18px); }
      .screw { position: absolute; width: 11px; height: 11px; border-radius: 50%; box-sizing: border-box; pointer-events: none;
        background: radial-gradient(circle at 38% 30%, color-mix(in srgb, var(--_cap) 70%, #fff), color-mix(in srgb, var(--_cap) 85%, #000) 80%);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--_ink) 30%, transparent), 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(0, 0, 0, 0.18); }
      .screw::before, .screw::after { content: ""; position: absolute; left: 50%; top: 50%; width: 7px; height: 1.5px; margin: -0.75px 0 0 -3.5px; border-radius: 1px; background: color-mix(in srgb, var(--_ink) 78%, transparent); transform: rotate(45deg); }
      .screw::after { transform: rotate(-45deg); }
      .screw.tl { top: 9px; left: 9px; } .screw.tr { top: 9px; right: 9px; } .screw.bl { bottom: 9px; left: 9px; } .screw.br { bottom: 9px; right: 9px; }
      .plate.f-none { padding: 0; border-radius: 0; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 2px calc(var(--_gap) - 2px); }
      /* the grid counts in half rows: two of them and the gap between make one row, so a label (half a row) and a whole row line up */
      .grid { --_half: calc((var(--_row) - var(--_gap)) / 2); display: grid; gap: var(--_gap); grid-auto-rows: var(--_half); }
      /* Inside another panel the cell is a whole number of outer rows: the rows share the spare height instead of leaving a blank strip */
      :host([nested]) .grid { flex: 1; grid-auto-rows: minmax(var(--_half), 1fr); }
      :host([nested]) .grid.natural { flex: none; grid-auto-rows: var(--_half); }
      /* a nested panel with rows set is exactly that many rows, like any piece next to it: its own rows share what is left */
      :host([nested][fixed]) .grid { grid-auto-rows: minmax(0, 1fr); }
      hui-card { min-width: 0; }
    `
];
RamsPanel = __decorateClass$7([
  t("rams-panel")
], RamsPanel);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
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
      this.config;
      if (this.drag !== void 0 && this.hass) for (const e2 of this.all()) void writeNumber(this.hass, e2, this.drag);
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
        { name: "entities", selector: { entity: { multiple: true } } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        { name: "target_entity", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "min", selector: { number: { step: "any", mode: "box" } } },
            { name: "max", selector: { number: { step: "any", mode: "box" } } },
            { name: "step", selector: { number: { step: "any", mode: "box" } } },
            { name: "unit", selector: { text: {} } }
          ]
        },
        {
          type: "grid",
          name: "",
          schema: [
            num$1("value", void 0, void 0, { step: "any" }),
            num$1("interval", void 0, void 0, { step: "any" }),
            num$1("major", void 0, void 0, { step: "any" }),
            { name: "title", selector: { text: {} } },
            dropdown("title_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]])
          ]
        },
        dropdown("orientation", [["horizontal", "Horizontal"], ["vertical", "Vertical"]]),
        { name: "number", selector: { boolean: {} } },
        { name: "centre", selector: { boolean: {} } },
        { name: "labels", selector: { boolean: {} } },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields()
      ],
      computeLabel,
      computeHelper
    };
  }
  /** The entities the ruler stands for. */
  all() {
    var _a2;
    const c2 = this.config;
    return ((_a2 = c2 == null ? void 0 : c2.entities) == null ? void 0 : _a2.length) ? c2.entities : (c2 == null ? void 0 : c2.entity) ? [c2.entity] : [];
  }
  /** The one whose value is shown: the first that is playing or on, else the first. */
  lead() {
    const list = this.all();
    return list.find((e2) => {
      var _a2, _b;
      return ["playing", "paused", "buffering", "on"].includes(((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[e2]) == null ? void 0 : _b.state) ?? "");
    }) ?? list[0];
  }
  range() {
    const c2 = this.config;
    const d2 = defaultRange(this.hass, this.lead());
    return { min: c2.min ?? d2.min, max: c2.max ?? d2.max, step: c2.step ?? d2.step };
  }
  frac(v2, min, max) {
    return v2 === void 0 ? void 0 : Math.min(1, Math.max(0, (v2 - min) / (max - min)));
  }
  fromPointer(e2, el) {
    var _a2;
    const r2 = this.range();
    const box = el.getBoundingClientRect();
    const f2 = ((_a2 = this.config) == null ? void 0 : _a2.orientation) === "vertical" ? Math.min(1, Math.max(0, 1 - (e2.clientY - box.top) / box.height)) : Math.min(1, Math.max(0, (e2.clientX - box.left) / box.width));
    return clamp(r2.min + f2 * (r2.max - r2.min), r2);
  }
  fmt(v2) {
    var _a2, _b;
    const s2 = Number.isInteger(v2) ? String(v2) : String(Math.round(v2 * 100) / 100);
    return `${v2 > 0 && ((_a2 = this.config) == null ? void 0 : _a2.centre) ? "+" : ""}${s2}${((_b = this.config) == null ? void 0 : _b.unit) ?? ""}`;
  }
  render() {
    var _a2;
    const c2 = this.config;
    if (!c2) return A;
    const { min, max } = this.range();
    const value = this.drag ?? (this.all().length ? readNumber(this.hass, this.lead(), c2.attribute) : c2.value);
    const f2 = this.frac(value, min, max);
    const tf = this.frac(readNumber(this.hass, c2.target_entity, c2.target_attribute), min, max);
    const span = max - min;
    const steps = c2.interval && c2.interval > 0 && span > 0 ? Math.min(200, Math.max(1, Math.round(span / c2.interval))) : 20;
    const ticks = Array.from({ length: steps + 1 }, (_2, i2) => i2 / steps);
    const isMajor = (t2) => c2.major && c2.major > 0 ? Math.abs(Math.round(t2 * span / c2.major) * c2.major - t2 * span) < span * 1e-6 || t2 === 0 || t2 === 1 : t2 === 0 || t2 === 0.5 || t2 === 1;
    const vertical = c2.orientation === "vertical";
    const pct = (x2) => `${x2 * 100}%`;
    const at2 = (x2) => `${vertical ? "bottom" : "left"}:${pct(x2)}`;
    const bar = f2 === void 0 || !c2.centre ? A : b`<div class="bar" style="${at2(Math.min(f2, 0.5))};${vertical ? "height" : "width"}:${pct(Math.abs(f2 - 0.5))}"></div>`;
    const title = ((_a2 = c2.title) == null ? void 0 : _a2.trim()) ?? "";
    const ruler = b`<div class="wrap ${vertical ? "v" : ""}">
      <div class="track ${c2.interactive ? "interactive" : ""}" @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
        <div class="line"></div>
        ${ticks.map((t2) => b`<div class="tick ${isMajor(t2) ? "major" : ""}" style="${at2(t2)}"></div>`)}
        ${bar}
        ${tf === void 0 ? A : b`<div class="target" style="${at2(tf)}"></div>`}
        ${f2 === void 0 || c2.centre ? A : b`<div class="pointer" style="${at2(f2)}"></div>`}
      </div>
      ${c2.number && value !== void 0 ? b`<div class="num ${c2.align ?? "center"}">${this.fmt(value)}</div>` : A}
      ${c2.labels ? b`<div class="labels"><span>${this.fmt(min)}</span>${c2.centre ? b`<span>${this.fmt(0)}</span>` : A}<span>${this.fmt(max)}</span></div>` : A}
    </div>`;
    return title ? b`<div class="t ${c2.title_position ?? "above"}"><span class="outer">${title}</span>${ruler}</div>` : ruler;
  }
};
RamsRuler.styles = [
  tokens,
  i$3`
      :host { display: block; height: 100%; min-width: 0; }
      .t { height: 100%; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
      .t.below { flex-direction: column-reverse; }
      .t.left { flex-direction: row; align-items: center; } .t.right { flex-direction: row-reverse; align-items: center; }
      .t > .wrap { flex: 1; min-width: 0; min-height: 0; }
      .outer { flex: none; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .left .outer, .right .outer { max-width: 40%; }
      .num { font-size: 12px; color: var(--_ink); line-height: 1.1; }
      .num.start { text-align: left; } .num.center { text-align: center; } .num.end { text-align: right; }
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
      /* vertical: the same scale turned up, lowest value at the bottom */
      .wrap.v { flex-direction: row; align-items: stretch; justify-content: center; gap: 6px; }
      .v .track { width: 24px; height: auto; flex: none; }
      .v .line { left: 50%; right: auto; top: 0; bottom: 0; width: 1px; height: auto; }
      .v .tick { left: 50%; top: auto; width: 6px; height: 1px; transform: translateX(-50%); }
      .v .tick.major { width: 12px; height: 1px; }
      .v .bar { left: 50%; top: auto; width: 4px; height: auto; transform: translateX(-50%); }
      .v .pointer { left: 2px; right: 2px; top: auto; width: auto; height: 3px; margin: 0 0 -1.5px 0; }
      .v .target { left: 0; top: auto; width: 8px; height: 3px; margin: 0 0 -1.5px 0; }
      .v .labels { flex-direction: column-reverse; align-items: flex-start; }
    `
];
__decorateClass$6([
  r()
], RamsRuler.prototype, "drag", 2);
RamsRuler = __decorateClass$6([
  t("rams-ruler")
], RamsRuler);
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsArtwork = class extends Piece {
  constructor() {
    super(...arguments);
    this.defaultFrame = "raised";
    this.onTap = () => {
      if (this.config) fireAction(this, this.config, "tap");
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-artwork", columns: 4 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "image", selector: { text: {} } },
        { name: "caption", selector: { text: {} } },
        { name: "playing_entity", selector: { entity: {} } },
        { name: "controls", selector: { boolean: {} } },
        ...layoutFields(),
        ...actionFields()
      ],
      computeLabel,
      computeHelper
    };
  }
  actionable() {
    var _a2;
    return !!((_a2 = this.config) == null ? void 0 : _a2.entity) || super.actionable();
  }
  firstUpdated(_c) {
    this.observer = new ResizeObserver(() => this.fit());
    this.observer.observe(this);
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this.observer) == null ? void 0 : _a2.disconnect();
    super.disconnectedCallback();
  }
  updated(_c) {
    this.fit();
  }
  fit() {
    if (this.config && typeof this.config.rows !== "number") this.reportRows(Math.max(1, Math.round((this.offsetWidth + 8) / 64)));
  }
  media(service) {
    var _a2, _b;
    const e2 = (_a2 = this.config) == null ? void 0 : _a2.entity;
    if (e2) void ((_b = this.hass) == null ? void 0 : _b.callService("media_player", service, { entity_id: e2 }));
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
      ${c2.controls ? b`<div class="ctl" @click=${(e2) => e2.stopPropagation()}>
        <button @click=${() => this.media("media_previous_track")}>&#9664;&#9664;</button>
        <button @click=${() => this.media("media_play_pause")}>${playing ? "II" : "▶"}</button>
        <button @click=${() => this.media("media_next_track")}>&#9654;&#9654;</button>
      </div>` : A}
    </div>`;
  }
};
RamsArtwork.styles = [
  tokens,
  i$3`
      :host { --_fpad: 0px; overflow: hidden; }
      .art { position: relative; box-sizing: border-box; height: 100%; background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .cap { position: absolute; left: 6px; bottom: 6px; padding: 2px 5px; border-radius: 2px; font-size: 11px; background: var(--_cap); color: var(--_ink); }
      .ctl { position: absolute; left: 6px; right: 6px; bottom: 6px; display: flex; gap: 6px; justify-content: center; }
      .ctl button { flex: 1; max-width: 56px; height: 28px; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); color: var(--_ink); box-shadow: var(--_raised); font: inherit; font-size: 10px; cursor: pointer; }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); box-shadow: 0 0 var(--_glow) color-mix(in srgb, var(--_active) 80%, transparent); }
    `
];
RamsArtwork = __decorateClass$5([
  t("rams-artwork")
], RamsArtwork);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let RamsClock = class extends Piece {
  constructor() {
    super(...arguments);
    this.defaultFrame = "none";
    this.hostFrame = false;
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
        { name: "title", selector: { text: {} } },
        dropdown("title_position", [["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
        { name: "alarm_entity", selector: { entity: { domain: ["input_boolean", "switch"] } } },
        ...layoutFields()
      ],
      computeLabel,
      computeHelper
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
    const digital = c2.variant === "digital";
    const alarm = c2.alarm_entity ? ((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.alarm_entity]) == null ? void 0 : _b.state) === "on" : false;
    const led = c2.alarm_entity ? b`<button class="led ${alarm ? "on" : ""}" aria-label="Alarm" @click=${this.toggleAlarm}></button>` : A;
    const frame = c2.frame ?? (digital ? "recessed" : this.defaultFrame);
    const pos = c2.title ? c2.title_position ?? "above" : "";
    const hourDeg = (h2 % 12 + m2 / 60) * 30;
    const minDeg = (m2 + s2 / 60) * 6;
    const pad = (n3) => String(n3).padStart(2, "0");
    const dial = digital ? b`<span class="digital ${c2.seconds ? "sec" : ""}">${pad(h2)}:${pad(m2)}${c2.seconds ? `:${pad(s2)}` : ""}</span>` : w$1`<svg viewBox="0 0 120 120">
      <circle class="dots" cx="60" cy="60" r="50" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 26.18" transform="rotate(-90 60 60)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="38" stroke-width="4" style="transform: rotate(${hourDeg}deg)" />
      <line class="hand" x1="60" y1="60" x2="60" y2="22" stroke-width="3" style="transform: rotate(${minDeg}deg)" />
      ${c2.seconds ? w$1`<line class="sec" x1="60" y1="68" x2="60" y2="12" stroke-width="1" style="transform: rotate(${s2 * 6}deg)" />` : A}
      <circle class="hub" cx="60" cy="60" r="4.5" />
    </svg>`;
    return b`<div class="wrap ${pos}">
      ${pos ? b`<span class="outer">${c2.title}</span>` : A}
      <div class="face ${frame === "none" ? "" : frame}">${dial}${led}</div>
    </div>`;
  }
};
RamsClock.styles = [
  tokens,
  faceStyles,
  i$3`
      .face { position: relative; display: grid; place-items: center; overflow: hidden; container-type: inline-size; }
      svg { height: 100%; max-width: 100%; aspect-ratio: 1; }
      .dots { stroke: var(--_ink); }
      .hand { stroke: var(--_ink); stroke-linecap: round; transform-origin: 60px 60px; }
      .sec { stroke: var(--_honey); transform-origin: 60px 60px; }
      .hub { fill: var(--_ink); }
      .digital { font-family: var(--rams-mono, ui-monospace, "SF Mono", Menlo, monospace); font-size: clamp(14px, 24cqw, 40px); letter-spacing: 0.02em; white-space: nowrap; }
      .digital.sec { font-size: clamp(12px, 15cqw, 34px); }
      /* the alarm lamp: dark glass, lit while the alarm is on */
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; padding: 0; border: 0; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); cursor: pointer; }
      .led.on { background: var(--_active); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--_active) 85%, transparent); }
    `
];
__decorateClass$4([
  r()
], RamsClock.prototype, "now", 2);
RamsClock = __decorateClass$4([
  t("rams-clock")
], RamsClock);
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
const parse = (e2) => typeof e2 === "string" ? { entity: e2 } : e2;
const states = (a2) => {
  const l2 = (Array.isArray(a2) ? a2 : (a2 ?? "").split(",")).map((x2) => String(x2).trim()).filter(Boolean);
  return l2.length ? l2 : void 0;
};
const COLOURS = { red: "var(--_red)", orange: "var(--_orange)", blue: "var(--_blue)", green: "var(--_green)", grey: "var(--_grey)" };
let RamsList = class extends Piece {
  static getStubConfig() {
    return { type: "custom:rams-list", entities: [] };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        {
          name: "entities",
          selector: {
            object: {
              multiple: true,
              label_field: "entity",
              fields: {
                entity: { required: true, selector: { entity: {} } },
                name: { selector: { text: {} } },
                icon: { selector: { icon: {} } },
                show: { label: "show", selector: { select: { mode: "dropdown", options: [{ value: "all", label: "Name and value" }, { value: "name", label: "Name only" }, { value: "value", label: "Value only" }, { value: "none", label: "Icon and lamp only" }] } } },
                lamp: { label: "lamp", selector: { boolean: {} } },
                alert_when: { label: "lamp lights when", selector: { text: {} } },
                lamp_tone: { label: "lamp colour", selector: { select: { mode: "dropdown", options: TONES.filter(([v2]) => v2 !== "neutral").map(([value, label]) => ({ value, label })) } } },
                category: { selector: { select: { mode: "dropdown", options: TONES.filter(([v2]) => v2 !== "neutral").map(([value, label]) => ({ value, label })) } } }
              }
            }
          }
        },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            { name: "attribute", selector: { text: {} } },
            dropdown("keys", [["none", "None"], ["toggle", "Toggle key"], ["cover", "Up / down keys"]]),
            num$1("max_items", 1, 50),
            { name: "empty_text", selector: { text: {} } }
          ]
        },
        ...layoutFields()
      ],
      computeLabel,
      computeHelper
    };
  }
  actionable() {
    return true;
  }
  more(entity) {
    fireAction(this, { entity, tap_action: { action: "more-info" } }, "tap");
  }
  call(e2, domain, service, entity) {
    var _a2;
    e2.stopPropagation();
    void ((_a2 = this.hass) == null ? void 0 : _a2.callService(domain, service, { entity_id: entity }));
  }
  value(hass, e2) {
    return hass.formatEntityState ? hass.formatEntityState(e2) : `${e2.state}${e2.attributes.unit_of_measurement ? ` ${e2.attributes.unit_of_measurement}` : ""}`;
  }
  firstUpdated() {
    this.observer = new ResizeObserver(() => this.fit());
    this.observer.observe(this);
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this.observer) == null ? void 0 : _a2.disconnect();
    super.disconnectedCallback();
  }
  willUpdate(changed) {
    var _a2;
    super.willUpdate(changed);
    if (changed.has("config")) this.setAttribute("size", ((_a2 = this.config) == null ? void 0 : _a2.size) ?? "medium");
  }
  updated() {
    this.fit();
  }
  /** No height set: report the content height to the panel. Height set: clip what does not fit and say how many are hidden. */
  fit() {
    var _a2;
    const list = this.renderRoot.querySelector(".list");
    if (!list) return;
    const rows = Array.from(list.querySelectorAll(".row"));
    const more = list.querySelector(".more");
    rows.forEach((r2) => r2.hidden = false);
    if (more) more.hidden = true;
    if (typeof ((_a2 = this.config) == null ? void 0 : _a2.rows) !== "number") {
      list.style.height = "auto";
      this.reportRows(this.rowsFor(list.offsetHeight + 2));
      return;
    }
    list.style.height = "100%";
    if (list.scrollHeight <= list.clientHeight + 1 || !more) return;
    more.hidden = false;
    more.textContent = "+0 more";
    let hidden = 0;
    for (let i2 = rows.length - 1; i2 >= 0 && list.scrollHeight > list.clientHeight + 1; i2--) {
      rows[i2].hidden = true;
      hidden++;
      more.textContent = `+${hidden} more`;
    }
  }
  /** When some rows have a category dot, the others keep the same indent so the names stay aligned. */
  get categorised() {
    var _a2;
    return (((_a2 = this.config) == null ? void 0 : _a2.entities) ?? []).some((e2) => !!parse(e2).category);
  }
  any(key) {
    var _a2;
    return (((_a2 = this.config) == null ? void 0 : _a2.entities) ?? []).some((e2) => !!parse(e2)[key]);
  }
  row(entry) {
    var _a2;
    const c2 = this.config;
    const r2 = parse(entry);
    const { entity: id, name: own, category } = r2;
    const show = r2.show ?? "all";
    const e2 = (_a2 = this.hass) == null ? void 0 : _a2.states[id];
    const dot = category && COLOURS[category] ? b`<span class="dot" style="--c:${COLOURS[category]}"></span>` : this.categorised ? b`<span class="dot spacer"></span>` : A;
    const icon = r2.icon ? b`<ha-icon class="ico" .icon=${r2.icon}></ha-icon>` : this.any("icon") ? b`<span class="ico spacer"></span>` : A;
    if (!this.hass || !e2) return b`<div class="row">${dot}${icon}<span class="name">${own || id}</span><span class="val">n/a</span></div>`;
    const name = own || String(e2.attributes.friendly_name ?? id);
    const small = c2.attribute ? String(e2.attributes[c2.attribute] ?? "") : String(e2.attributes.device_class ?? "");
    const alert = readState(this.hass, id, { alert_when: states(r2.alert_when) }).alert;
    const lamp = r2.lamp ? b`<i class="lamp ${alert ? "on" : ""}" style="--l:${COLOURS[r2.lamp_tone ?? "red"] ?? COLOURS.red}"></i>` : this.any("lamp") ? b`<i class="lamp spacer"></i>` : A;
    const keys = c2.keys === "toggle" ? b`<button class="key" @click=${(ev) => this.call(ev, "homeassistant", "toggle", id)}>${e2.state === "on" ? "on" : "off"}</button>` : c2.keys === "cover" ? b`<button class="key" @click=${(ev) => this.call(ev, "cover", "open_cover", id)}>&#9650;</button><button class="key" @click=${(ev) => this.call(ev, "cover", "close_cover", id)}>&#9660;</button>` : A;
    return b`<div class="row" @click=${() => this.more(id)}>
      ${dot}${icon}${lamp}
      ${show === "all" || show === "name" ? b`<span class="name">${small ? b`<small>${small.replace(/_/g, " ")}</small>` : A}${name}</span>` : A}
      ${show === "all" || show === "value" ? b`<span class="val ${alert ? "alert" : ""}" style=${show === "value" ? "margin-left:auto" : ""}>${this.value(this.hass, e2)}</span>` : A}${keys}
    </div>`;
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const all = c2.entities ?? [];
    const shown = all.slice(0, c2.max_items ?? all.length);
    return b`<div class="list">
      ${c2.title ? b`<div class="title">${c2.title}</div>` : A}
      ${shown.length === 0 && c2.empty_text ? b`<div class="empty">${c2.empty_text}</div>` : A}
      ${shown.map((id) => this.row(id))}
      <div class="more" hidden></div>
      ${all.length > shown.length ? b`<div class="more">+${all.length - shown.length} more</div>` : A}
    </div>`;
  }
};
RamsList.styles = [
  tokens,
  i$3`
      :host { --sz: 14px; }
      :host([size="small"]) { --sz: 12px; }
      :host([size="large"]) { --sz: 18px; }
      /* the side padding keeps a lit lamp's glow inside the clipped area */
      .list { display: flex; flex-direction: column; height: 100%; overflow: hidden; padding: 0 6px; margin: 0 -6px; font-size: var(--sz); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 0 6px; flex: none; }
      .row { display: flex; align-items: center; gap: var(--_gap); box-sizing: border-box; padding: 6px 0; cursor: pointer; flex: none; }
      .dot.spacer, .lamp.spacer { background: none; box-shadow: none; }
      .lamp { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
      .lamp.on { background: var(--l); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--l) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
      .ico { --mdc-icon-size: 1.3em; flex: none; color: var(--_ink); }
      .ico.spacer { display: inline-block; width: 1.3em; }
      .row[hidden], .more[hidden] { display: none; }
      .dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--c); }
      .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .name small { display: block; font-size: 0.72em; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); line-height: 1.3; }
      .val { color: var(--_muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .val.alert { color: var(--_alert); }
      .key { flex: none; min-width: 34px; height: 28px; padding: 0 6px; box-sizing: border-box; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); box-shadow: var(--_raised); color: var(--_ink); font: inherit; font-size: 11px; cursor: pointer; }
      .key:active { box-shadow: var(--_pressed); }
      .empty, .more { font-size: 0.85em; color: var(--_muted); padding: 4px 0; flex: none; }
    `
];
RamsList = __decorateClass$3([
  t("rams-list")
], RamsList);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
const IDLE_MS = 3e4;
let RamsKeypad = class extends Piece {
  constructor() {
    super(...arguments);
    this.code = "";
  }
  static getStubConfig() {
    return { type: "custom:rams-keypad", columns: 12 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: { domain: "alarm_control_panel" } } },
        dropdown("arm_mode", [["arm_away", "Arm away"], ["arm_home", "Arm home"], ["arm_night", "Night mode"]]),
        {
          name: "state_colours",
          selector: {
            object: {
              multiple: true,
              label_field: "state",
              fields: {
                state: { label: "State", required: true, selector: { text: {} } },
                tone: { label: "Colour", required: true, selector: { select: { mode: "dropdown", options: TONES.filter(([v2]) => v2 !== "neutral").map(([value, label]) => ({ value, label })) } } }
              }
            }
          }
        },
        ...layoutFields(false)
      ],
      computeLabel,
      computeHelper
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
  /** Like Alarmo: confirm disarms an armed alarm, and arms a disarmed one. The code is sent only when one was typed. */
  confirm() {
    var _a2;
    const c2 = this.config;
    if (!(c2 == null ? void 0 : c2.entity) || !this.hass) return;
    const disarmed = ((_a2 = this.hass.states[c2.entity]) == null ? void 0 : _a2.state) === "disarmed";
    const data = { entity_id: c2.entity };
    if (this.code) data.code = this.code;
    void this.hass.callService("alarm_control_panel", disarmed ? `alarm_${c2.arm_mode ?? "arm_away"}` : "alarm_disarm", data);
    this.code = "";
  }
  updated(_c) {
    this.reportRows(5);
  }
  cap(legend, onTap, tone = "") {
    return b`<div class="keyarea"><button class="key round ${tone ? `filled ${tone}` : ""}" @click=${onTap}><span class="legend">${legend}</span></button></div>`;
  }
  render() {
    var _a2, _b;
    const c2 = this.config;
    if (!c2) return A;
    const alarm = c2.entity && ((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity]) == null ? void 0 : _b.state) || "";
    const rows = [...c2.state_colours ?? [], ...["triggered", "pending", "armed_away"].map((state2) => ({ state: state2, tone: "red" }))];
    const view = readState(this.hass, c2.entity, { state_colours: rows });
    return b`<div class="pad">
      <div class="screen ${view.signal ? `sig ${view.signal}` : ""}">
        <div class="dots">${Array.from({ length: Math.max(4, this.code.length) }, (_2, i2) => b`<b class=${i2 < this.code.length ? "f" : ""}></b>`)}</div>
        <span class="state">${alarm.replace(/_/g, " ")}</span>
      </div>
      ${["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d2) => this.cap(d2, () => this.press(d2)))}
      ${this.cap("✕", () => this.code = "")}
      ${this.cap("0", () => this.press("0"))}
      ${this.cap("✓", () => this.confirm(), "green")}
    </div>`;
  }
};
RamsKeypad.styles = [
  tokens,
  keyStyles,
  i$3`
      :host { display: block; min-width: 0; }
      /* one centred block: the screen and the keys share the same width and margins */
      .pad { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: var(--_row); gap: var(--_gap); width: min(100%, calc(3 * var(--_row) + 2 * var(--_gap) + 24px)); margin: 0 auto; }
      /* the screen is the display: the same recessed LCD, filled with a tone for a state */
      .screen { grid-column: 1 / -1; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; border-radius: var(--_radius); background: var(--_lcd-bg); color: var(--_lcd-ink); border: var(--_border); box-shadow: var(--_inset); font-size: 12px; }
      .screen.sig { background: var(--_sig); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); box-shadow: 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--_sig) 50%, transparent); }
      .sig.red { --_sig: var(--_alert); } .sig.orange { --_sig: var(--_orange); } .sig.blue { --_sig: var(--_blue); } .sig.green { --_sig: var(--_green); } .sig.grey { --_sig: var(--_grey); }
      .dots { display: flex; gap: 10px; }
      .dots b { width: 10px; height: 10px; border-radius: 50%; border: 2px solid currentColor; box-sizing: border-box; }
      .dots b.f { background: currentColor; }
      .state { text-transform: lowercase; opacity: 0.8; }
      /* each key in its own cell; the key is always a circle, the biggest that fits */
      .keyarea { min-height: 0; }
      .legend { font-size: 18px; font-weight: 400; }
    `
];
__decorateClass$2([
  r()
], RamsKeypad.prototype, "code", 2);
RamsKeypad = __decorateClass$2([
  t("rams-keypad")
], RamsKeypad);
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsShelf = class extends Piece {
  /** A new shelf starts on the first input_select whose options look like "kind|title|id|picture". */
  static getStubConfig(hass) {
    const found = Object.keys((hass == null ? void 0 : hass.states) ?? {}).find(
      (id) => {
        var _a2;
        return id.startsWith("input_select.") && ((_a2 = hass.states[id].attributes.options) == null ? void 0 : _a2.some((o2) => o2.split("|").length >= 3));
      }
    );
    return { type: "custom:rams-shelf", columns: 12, per_row: 4, ...found ? { entity: found } : {} };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        { name: "player", selector: { entity: { domain: "media_player" } } },
        { name: "player_from", selector: { entity: { domain: ["input_select", "select"] } } },
        {
          name: "players",
          selector: {
            object: {
              multiple: true,
              label_field: "option",
              description_field: "player",
              fields: {
                option: { label: "Option", required: true, selector: { text: {} } },
                player: { label: "Player", required: true, selector: { entity: { domain: "media_player" } } }
              }
            }
          }
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "kind", selector: { text: {} } },
            { name: "per_row", selector: { number: { min: 1, max: 8, mode: "box" } } }
          ]
        },
        ...layoutFields()
      ],
      computeLabel,
      computeHelper
    };
  }
  items() {
    var _a2, _b;
    const c2 = this.config;
    const e2 = c2.entity ? (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity] : void 0;
    if (!e2) return [];
    const attr = c2.attribute ?? (((_b = c2.entity) == null ? void 0 : _b.startsWith("input_select.")) ? "options" : void 0);
    let raw = attr ? e2.attributes[attr] : e2.state;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        return [];
      }
    }
    if (!Array.isArray(raw)) return [];
    const list = [];
    for (const r2 of raw) {
      if (typeof r2 === "string") {
        const [kind, title, id, ...pic] = r2.split("|");
        if (!kind || !id) continue;
        list.push({ kind: kind.trim(), title: title == null ? void 0 : title.trim(), media_content_id: id.trim(), media_content_type: kind.trim(), picture: pic.join("|").trim() || void 0 });
      } else if (r2 && typeof r2 === "object") {
        list.push(r2);
      }
    }
    return c2.kind ? list.filter((i2) => i2.kind === c2.kind) : list;
  }
  /** The player a tile plays on: the one the selector names, else the fixed player. */
  target() {
    var _a2, _b, _c, _d;
    const c2 = this.config;
    const sel = (c2 == null ? void 0 : c2.player_from) ? (_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.player_from]) == null ? void 0 : _b.state : void 0;
    if (sel) {
      const mapped = (_d = (_c = c2 == null ? void 0 : c2.players) == null ? void 0 : _c.find((p2) => p2.option === sel)) == null ? void 0 : _d.player;
      if (mapped) return mapped;
      const slug = sel.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      const guess = [`media_player.${slug}_ma`, `media_player.${slug}`].find((id) => {
        var _a3;
        return (_a3 = this.hass) == null ? void 0 : _a3.states[id];
      });
      if (guess) return guess;
    }
    return c2 == null ? void 0 : c2.player;
  }
  play(item) {
    const player = this.target();
    if (!player || !this.hass || !item.media_content_id) return;
    void this.hass.callService("media_player", "play_media", {
      entity_id: player,
      media_content_id: item.media_content_id,
      media_content_type: item.media_content_type ?? "music"
    });
  }
  updated(_changed) {
    const grid = this.renderRoot.querySelector(".grid");
    if (grid) this.reportRows(this.rowsFor(grid.offsetHeight));
  }
  render() {
    var _a2, _b, _c, _d, _e;
    const c2 = this.config;
    if (!c2) return A;
    const items = this.items();
    const player = this.target();
    const playingId = player ? (_b = (_a2 = this.hass) == null ? void 0 : _a2.states[player]) == null ? void 0 : _b.attributes.media_content_id : void 0;
    const playing = player && ((_d = (_c = this.hass) == null ? void 0 : _c.states[player]) == null ? void 0 : _d.state) === "playing";
    if (items.length === 0) {
      const why = !c2.entity ? "Choose an entity" : !((_e = this.hass) == null ? void 0 : _e.states[c2.entity]) ? `${c2.entity} not found` : `No items in ${c2.entity}`;
      return b`<div class="empty">${why}</div>`;
    }
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
      /* square covers: the picture is the object, a rounded corner would show the picture behind its edge */
      .tile { aspect-ratio: 1; box-sizing: border-box; position: relative; overflow: hidden; border-radius: 0; box-shadow: var(--_raised); background: var(--_field) center / cover no-repeat; cursor: pointer; }
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); box-shadow: 0 0 var(--_glow) color-mix(in srgb, var(--_active) 80%, transparent); }
      .empty { font-size: 12px; color: var(--_muted); }
    `
];
RamsShelf = __decorateClass$1([
  t("rams-shelf")
], RamsShelf);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
const rad = (deg) => deg * Math.PI / 180;
const at = (deg, r2) => [r2 * Math.sin(rad(deg)), -r2 * Math.cos(rad(deg))];
const MINOR = 7;
const MAJOR = 12;
const MARK_OUT = 4;
const POINTER = 10;
const MARK_IN = 14;
const NUMBER_H = 28;
const END_GAP = 8;
let RamsDial = class extends Piece {
  constructor() {
    super(...arguments);
    this.room = { w: 0, h: 0 };
    this.origin = [0, 0];
    this.onDown = (e2) => {
      var _a2;
      if (!((_a2 = this.config) == null ? void 0 : _a2.interactive)) return;
      e2.currentTarget.setPointerCapture(e2.pointerId);
      this.drag = this.fromPointer(e2);
    };
    this.onMove = (e2) => {
      if (this.drag !== void 0) this.drag = this.fromPointer(e2);
    };
    this.onUp = () => {
      this.config;
      if (this.drag !== void 0 && this.hass) for (const e2 of this.all()) void writeNumber(this.hass, e2, this.drag);
      this.drag = void 0;
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-dial", min: 0, max: 100, interval: 10, value: 40, start_angle: -90, end_angle: 90, columns: 6, rows: 3 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "entities", selector: { entity: { multiple: true } } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        { name: "setpoint", selector: { entity: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            num$1("value", void 0, void 0, { step: "any" }),
            num$1("min", void 0, void 0, { step: "any" }),
            num$1("max", void 0, void 0, { step: "any" }),
            num$1("interval", void 0, void 0, { step: "any" }),
            num$1("major", void 0, void 0, { step: "any" }),
            num$1("start_angle", -360, 360, { step: 5 }),
            num$1("end_angle", -360, 360, { step: 5 }),
            { name: "unit", selector: { text: {} } },
            { name: "title", selector: { text: {} } },
            dropdown("title_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
            dropdown("show", [["all", "Scale and number"], ["none", "Scale only"]]),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]])
          ]
        },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields()
      ],
      computeLabel,
      computeHelper
    };
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback();
    (_a2 = this.watcher) == null ? void 0 : _a2.disconnect();
    this.watcher = this.watched = void 0;
  }
  updated() {
    const el = this.renderRoot.querySelector(".room");
    if (!el || el === this.watched) return;
    this.watcher ?? (this.watcher = new ResizeObserver(([e2]) => {
      const w2 = Math.round(e2.contentRect.width), h2 = Math.round(e2.contentRect.height);
      if (w2 !== this.room.w || h2 !== this.room.h) this.room = { w: w2, h: h2 };
    }));
    if (this.watched) this.watcher.unobserve(this.watched);
    this.watcher.observe(el);
    this.watched = el;
  }
  range() {
    const c2 = this.config;
    return { min: c2.min ?? 0, max: c2.max ?? 100, step: c2.interval ?? 1 };
  }
  /** Start and end angle; the end is always after the start and the arc at most a full circle. */
  angles() {
    const c2 = this.config;
    const start = c2.start_angle ?? -90;
    const end = c2.end_angle ?? 90;
    return [start, Math.min(start + 360, Math.max(start + 1, end))];
  }
  at(f2, r2) {
    const [a0, a1] = this.angles();
    return at(a0 + f2 * (a1 - a0), r2);
  }
  text() {
    var _a2, _b;
    return (((_a2 = this.config) == null ? void 0 : _a2.title) ?? ((_b = this.config) == null ? void 0 : _b.label) ?? "").trim();
  }
  inside() {
    var _a2;
    return !((_a2 = this.config) == null ? void 0 : _a2.title_position) || this.config.title_position === "inside";
  }
  /** Text size of the end numbers: it follows the dial a little, within limits. */
  endSize(r2) {
    return Math.min(13, Math.max(10, r2 * 0.13));
  }
  /** The bounding box of everything drawn at radius r: the arc, the marks, the end numbers, an inside title. */
  bounds(r2) {
    var _a2;
    const [a0, a1] = this.angles();
    const { min, max } = this.range();
    const fs = this.endSize(r2);
    const pts = [];
    const angles = [a0, a1];
    for (let a2 = Math.ceil(a0 / 90) * 90; a2 < a1; a2 += 90) angles.push(a2);
    for (let a2 = a0; a2 < a1; a2 += 5) angles.push(a2);
    const out = ((_a2 = this.config) == null ? void 0 : _a2.setpoint) ? POINTER + 1 : MARK_OUT;
    for (const a2 of angles) {
      pts.push(at(a2, r2 + out), at(a2, r2 - MAJOR));
    }
    const label = (a2, value) => {
      const [x2, y3] = at(a2, r2 + END_GAP);
      const sin = Math.sin(rad(a2));
      const w2 = String(value).length * fs * 0.62;
      const left = sin > 0.4 ? x2 : sin < -0.4 ? x2 - w2 : x2 - w2 / 2;
      pts.push([left, y3 - fs * 0.65], [left + w2, y3 + fs * 0.35]);
    };
    label(a0, min);
    label(a1, max);
    const title = this.inside() ? this.text() : "";
    if (title) {
      const top = Math.min(...pts.map((p2) => p2[1]));
      const cx = (at(a0, r2)[0] + at(a1, r2)[0]) / 2;
      const w2 = title.length * 6.4;
      pts.push([cx - w2 / 2, top - 18], [cx + w2 / 2, top - 8]);
    }
    const xs = pts.map((p2) => p2[0]), ys = pts.map((p2) => p2[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }
  /** The largest radius whose drawing fits the room. */
  radius(w2, h2) {
    let lo = 12, hi = 4e3;
    for (let i2 = 0; i2 < 24; i2++) {
      const mid = (lo + hi) / 2;
      const [x0, y0, x1, y1] = this.bounds(mid);
      if (x1 - x0 <= w2 && y1 - y0 <= h2) lo = mid;
      else hi = mid;
    }
    return lo;
  }
  fromPointer(e2) {
    const rect = e2.currentTarget.getBoundingClientRect();
    const px = e2.clientX - rect.left + this.origin[0];
    const py = e2.clientY - rect.top + this.origin[1];
    const [a0, a1] = this.angles();
    let a2 = Math.atan2(px, -py) * 180 / Math.PI;
    while (a2 < a0) a2 += 360;
    while (a2 >= a0 + 360) a2 -= 360;
    if (a2 > a1) a2 = a2 - a1 < a0 + 360 - a2 ? a1 : a0;
    const r2 = this.range();
    return clamp(r2.min + (a2 - a0) / (a1 - a0) * (r2.max - r2.min), r2);
  }
  /** The scale, in a room of w x h pixels (the number's line already taken off). */
  scale(w2, h2, value) {
    const c2 = this.config;
    const { min, max, step } = this.range();
    const [a0, a1] = this.angles();
    const r2 = this.radius(w2, h2);
    const [bx0, by0, bx1, by1] = this.bounds(r2);
    const height = Math.ceil(by1 - by0) + 4;
    const vx = (bx0 + bx1) / 2 - w2 / 2, vy = by0 - 2;
    this.origin = [vx, vy];
    const span = max - min;
    const frac = (v2) => (v2 - min) / span;
    const count = Math.min(100, Math.max(1, Math.round(span / step)));
    const majors = [0, 1];
    if (c2.major && c2.major > 0) for (let v2 = min + c2.major; v2 < max - span * 1e-6; v2 += c2.major) majors.push(frac(v2));
    const isMajor = (f22) => majors.some((m2) => Math.abs(m2 - f22) < 1e-6);
    const minors = Array.from({ length: count + 1 }, (_2, i2) => i2 / count).filter((f22) => !isMajor(f22));
    const tick = (f22, len, cls) => {
      const [x1, y1] = this.at(f22, r2);
      const [x2, y22] = this.at(f22, r2 - len);
      return w$1`<line class="tick ${cls}" x1=${x1} y1=${y1} x2=${x2} y2=${y22} />`;
    };
    const [sx, sy] = at(a0, r2), [ex, ey] = at(a1, r2);
    const large = a1 - a0 > 180 ? 1 : 0;
    const fs = this.endSize(r2);
    const endLabel = (a2, text) => {
      const [x2, y3] = at(a2, r2 + END_GAP);
      const s2 = Math.sin(rad(a2));
      return w$1`<text class="end" style="font-size:${fs}px" x=${x2} y=${y3 + fs * 0.35} text-anchor=${s2 > 0.4 ? "start" : s2 < -0.4 ? "end" : "middle"}>${text}</text>`;
    };
    const top = Math.min(...[a0, a1, ...[...Array(4).keys()].map((k2) => k2 * 90).filter((a2) => a2 > a0 && a2 < a1)].map((a2) => at(a2, r2 + MARK_OUT)[1]));
    const f2 = value === void 0 ? void 0 : Math.min(1, Math.max(0, frac(value)));
    const sp = c2.setpoint ? readNumber(this.hass, c2.setpoint) : void 0;
    const pointer = (v2) => {
      const a2 = a0 + Math.min(1, Math.max(0, frac(v2))) * (a1 - a0);
      const t2 = [Math.cos(rad(a2)), Math.sin(rad(a2))];
      const [ax, ay] = at(a2, r2 + 1), [bx, by] = at(a2, r2 + POINTER);
      return w$1`<polygon class="pointer" points="${ax},${ay} ${bx + t2[0] * 4.5},${by + t2[1] * 4.5} ${bx - t2[0] * 4.5},${by - t2[1] * 4.5}" />`;
    };
    const [m1x, m1y] = f2 === void 0 ? [0, 0] : this.at(f2, r2 + MARK_OUT);
    const [m2x, m2y] = f2 === void 0 ? [0, 0] : this.at(f2, r2 - MARK_IN);
    return {
      height,
      svg: b`<svg viewBox="${vx} ${vy} ${w2} ${height}" style="height:${height}px" class=${c2.interactive ? "interactive" : ""} @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
        ${w$1`<path class="arc" d="M ${sx} ${sy} A ${r2} ${r2} 0 ${large} 1 ${ex} ${ey}" />
        ${minors.map((t2) => tick(t2, MINOR, ""))}
        ${majors.map((t2) => tick(t2, MAJOR, "major"))}
        ${f2 === void 0 ? A : w$1`<line class="mark" x1=${m1x} y1=${m1y} x2=${m2x} y2=${m2y} />`}
        ${sp === void 0 ? A : pointer(sp)}
        ${endLabel(a0, min)}${endLabel(a1, max)}
        ${this.inside() && this.text() ? w$1`<text class="lab" x=${(sx + ex) / 2} y=${top - 10}>${this.text()}</text>` : A}`}
      </svg>`
    };
  }
  /** The entities the dial stands for. */
  all() {
    var _a2;
    const c2 = this.config;
    return ((_a2 = c2 == null ? void 0 : c2.entities) == null ? void 0 : _a2.length) ? c2.entities : (c2 == null ? void 0 : c2.entity) ? [c2.entity] : [];
  }
  /** The one whose value is shown: the first that is playing or on, else the first. */
  lead() {
    const list = this.all();
    return list.find((e2) => {
      var _a2, _b;
      return ["playing", "paused", "buffering", "on"].includes(((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[e2]) == null ? void 0 : _b.state) ?? "");
    }) ?? list[0];
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const value = this.drag ?? (this.all().length ? readNumber(this.hass, this.lead(), c2.attribute) : c2.value);
    const showNumber = c2.show !== "none";
    const { w: w2, h: h2 } = this.room;
    const shown = value === void 0 ? "–" : String(Math.round(value * 10) / 10);
    const ready = w2 > 0 && h2 > 0;
    const dial = b`<div class="dial"><div class="room">
      ${ready ? this.scale(w2, Math.max(20, h2 - 8 - (showNumber ? NUMBER_H + 4 : 0)), value).svg : A}
      ${ready && showNumber ? b`<div class="num ${c2.align ?? "center"}">${shown}${c2.unit ? b`<small>${c2.unit}</small>` : A}</div>` : A}
    </div></div>`;
    const outside = !this.inside() && !!this.text();
    if (!outside) return dial;
    return b`<div class="wrap ${c2.title_position}"><div class="outer">${this.text()}</div><div class="face">${dial}</div></div>`;
  }
};
RamsDial.styles = [
  tokens,
  faceStyles,
  i$3`
      :host([frame="recessed"]) { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: var(--_lcd-muted); }
      .dial { height: 100%; min-height: 72px; }
      .room { box-sizing: border-box; height: 100%; padding: 4px 0; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
      svg { display: block; flex: none; width: 100%; touch-action: none; }
      .face { display: block; }
      .arc { fill: none; stroke: var(--_muted); stroke-width: 1.5; }
      .tick { stroke: var(--_muted); stroke-width: 1.5; }
      .tick.major { stroke: var(--_ink); stroke-width: 2.5; }
      .pointer { fill: var(--_ink); }
      .mark { stroke: var(--_red); stroke-width: 3.5; stroke-linecap: butt; }
      .unit, .lab, .end { fill: var(--_muted); letter-spacing: 0.06em; text-transform: uppercase; }
      .lab { font-size: 10px; text-anchor: middle; }
      .num { flex: none; box-sizing: border-box; height: ${NUMBER_H}px; margin-top: 4px; padding: 0 2px; display: flex; align-items: baseline; justify-content: center; gap: 3px; font-size: 24px; line-height: ${NUMBER_H}px; color: var(--_ink); }
      .num.start { justify-content: flex-start; } .num.end { justify-content: flex-end; }
      .num small { font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .interactive { cursor: pointer; }
    `
];
__decorateClass([
  r()
], RamsDial.prototype, "drag", 2);
__decorateClass([
  r()
], RamsDial.prototype, "room", 2);
RamsDial = __decorateClass([
  t("rams-dial")
], RamsDial);
console.info(`%c RAMS CARDS %c built ${"2026-11-20 12:29 UTC"}`, "background:#261201;color:#fff", "");
const w = window;
w.customCards = w.customCards ?? [];
w.customCards.push(
  { type: "rams-panel", name: "Dieter Rams Panel", description: "Container: a plate with pieces on an N-column grid", preview: true },
  { type: "rams-display", name: "Dieter Rams Display", description: "Text block: one or two lines, optional frame", preview: true },
  { type: "rams-label", name: "Dieter Rams Label", description: "Heading for a group of pieces: half a row high, optional hairline", preview: true },
  { type: "rams-ruler", name: "Dieter Rams Ruler", description: "Scale with pointer or centre bar; optional touch to set", preview: true },
  { type: "rams-artwork", name: "Dieter Rams Artwork", description: "Picture with playing LED and optional media keys", preview: true },
  { type: "rams-clock", name: "Dieter Rams Clock", description: "Analog or digital clock", preview: true },
  { type: "rams-list", name: "Dieter Rams List", description: "List of entities with state and optional keys", preview: true },
  { type: "rams-keypad", name: "Dieter Rams Keypad", description: "Alarm code entry and mode keys", preview: true },
  { type: "rams-shelf", name: "Dieter Rams Shelf", description: "Artwork tiles generated from a list", preview: true },
  { type: "rams-button", name: "Dieter Rams Button", description: "Key with dish, state dot and warning LED", preview: true },
  { type: "rams-selector", name: "Dieter Rams Selector", description: "Lever or knob with one stop per option: input_select, select, or an on/off switch", preview: true },
  { type: "rams-dial", name: "Dieter Rams Dial", description: "Half-round scale with a needle, value from an entity or fixed", preview: true }
);
