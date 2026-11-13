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
let R$1 = class R {
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
};
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
      const t3 = new R$1(e2, this), s3 = t3.u(this.options);
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
var __defProp$5 = Object.defineProperty;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(target, key, result) || result;
  if (result) __defProp$5(target, key, result);
  return result;
};
class Piece extends i {
  constructor() {
    super(...arguments);
    this.defaultFrame = "none";
    this.hostFrame = true;
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
  willUpdate(changed) {
    var _a2;
    if (!changed.has("config")) return;
    this.setAttribute("frame", this.hostFrame ? ((_a2 = this.config) == null ? void 0 : _a2.frame) ?? this.defaultFrame : "none");
    this.toggleAttribute("actionable", this.actionable());
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
__decorateClass$b([
  n2({ attribute: false })
], Piece.prototype, "hass");
__decorateClass$b([
  n2({ attribute: false })
], Piece.prototype, "config");
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
function readState(hass, entity, rules) {
  var _a2;
  const e2 = entity ? hass == null ? void 0 : hass.states[entity] : void 0;
  const state = (e2 == null ? void 0 : e2.state) ?? "";
  const auto = !rules.alert_when && !!e2 && entity.startsWith("binary_sensor.") && state === "on" && WARNING_CLASSES.includes(String(e2.attributes.device_class));
  return {
    state,
    alert: auto || !!((_a2 = rules.alert_when) == null ? void 0 : _a2.includes(state)),
    active: (rules.selected_when ?? ACTIVE_STATES).includes(state)
  };
}
const tokens = i$3`
  :host {
    --_plate: var(--rams-plate, #f5f4f0);
    --_cap: var(--rams-cap, #ffffff);
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
    --_gap: var(--rams-gap, 8px);
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
  :host([frame="recessed"]) { background: var(--_field); box-shadow: var(--_inset); }
  :host([frame="raised"]) { background: var(--_cap); box-shadow: var(--_raised); }
`;
const LABELS = {
  columns: "width (grid units)",
  rows: "height (grid units)",
  selected_when: "active when",
  alert_when: "warning when"
};
const computeLabel = (s2) => LABELS[s2.name] ?? s2.name.replace(/_/g, " ");
const num$1 = (name, min, max, extra = {}) => ({
  name,
  selector: { number: { min, max, mode: "box", ...extra } }
});
const dropdown = (name, options) => ({
  name,
  selector: { select: { mode: "dropdown", options: options.map(([value, label]) => ({ value, label })) } }
});
const FRAMES = [["none", "None"], ["outline", "Outline"], ["recessed", "Recessed"], ["raised", "Raised"]];
const layoutFields = () => ({
  type: "grid",
  name: "",
  schema: [num$1("columns", 1, 12), num$1("rows", 1, 12), dropdown("frame", FRAMES)]
});
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
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
function readable(state, tz) {
  if (!/^\d{4}-\d\d-\d\dT/.test(state)) return state;
  const d2 = new Date(state);
  if (isNaN(d2.getTime())) return state;
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d2);
}
let RamsButton = class extends Piece {
  constructor() {
    super(...arguments);
    this.hostFrame = false;
    this.press = new Press(this, () => this.config, () => this.step());
  }
  static getStubConfig() {
    return { type: "custom:rams-button", name: "Button", columns: 3 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        { name: "label", selector: { text: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            dropdown("label_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["beside", "Beside"]]),
            { name: "show_state", selector: { boolean: {} } },
            dropdown("shape", [["key", "Key"], ["round", "Round"]]),
            dropdown("tone", TONES),
            dropdown("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]]),
            { name: "lamp", selector: { boolean: {} } }
          ]
        },
        layoutFields(),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "selected_when", selector: { select: { multiple: true, custom_value: true, options: [] } } },
            { name: "alert_when", selector: { select: { multiple: true, custom_value: true, options: [] } } },
            { name: "adjust_by", selector: { number: { step: "any", mode: "box" } } }
          ]
        }
      ],
      computeLabel
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
  render() {
    var _a2, _b;
    const c2 = this.config;
    if (!c2) return A;
    const view = readState(this.hass, c2.entity, c2);
    const pos = c2.label_position ?? "inside";
    const shape = c2.shape ?? "key";
    const tone = c2.tone ?? "neutral";
    const align = c2.align ?? "center";
    const state = c2.show_state ? readable(view.state, (_b = (_a2 = this.hass) == null ? void 0 : _a2.config) == null ? void 0 : _b.time_zone) : "";
    const frame = c2.frame ?? "raised";
    const cls = [
      "btn",
      `f-${frame}`,
      shape === "round" ? "round" : "",
      tone !== "neutral" ? `${tone} toned` : "",
      `a-${align}`,
      view.alert ? "alert" : view.active ? "active" : "",
      c2.lamp ? "lamp" : ""
    ].filter(Boolean).join(" ");
    const triangle = view.alert ? b`<svg class="warn" viewBox="0 0 12 11"><path d="M6 0l6 11H0z" fill="currentColor" /></svg>` : A;
    const inside = pos === "inside" ? c2.label ?? state : "";
    const key = b`<div class="keyarea"><button class=${cls} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
      ${c2.lamp || view.alert ? b`<span class="lampdot"></span>` : A}
      ${inside ? b`<span class="small">${inside}</span>` : A}
      ${c2.name || view.alert ? b`<span class="row">${triangle}${c2.name ?? ""}</span>` : A}
    </button></div>`;
    if (pos === "inside") return b`<div class="cell">${key}</div>`;
    const text = c2.label ?? (c2.show_state ? state : "");
    const second = pos === "beside" && c2.label && c2.show_state ? state : "";
    return b`<div class="cell ${pos}">
      ${key}${text || second ? b`<div class="txt">${text}${second ? b`<small>${second}</small>` : A}</div>` : A}
    </div>`;
  }
};
RamsButton.styles = [
  tokens,
  i$3`
      .cell { height: 100%; display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 3px; min-width: 0; }
      .cell.beside { flex-direction: row; align-items: center; gap: var(--_gap); }
      .cell.above { flex-direction: column; }
      .cell.below { flex-direction: column-reverse; }
      .txt { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); text-align: center; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .beside .txt { text-align: left; font-size: 12px; text-transform: none; letter-spacing: 0; color: var(--_ink); }
      .beside .txt small { display: block; font-size: 11px; color: var(--_muted); }
      .above .txt, .below .txt { flex: none; }

      .btn {
        --t: var(--_ink);
        position: relative; box-sizing: border-box; width: 100%; height: 100%; min-height: 0; min-width: 0;
        display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; padding: 0 8px;
        background: var(--_cap); color: var(--_ink);
        border: var(--_border); border-radius: var(--_radius);
        font: inherit; font-size: 13px; cursor: pointer; user-select: none;
      }
      /* the key's room: the key fills it, a round key is the biggest circle that fits, never an oval */
      .keyarea { flex: 1; min-height: 0; min-width: 0; display: flex; align-items: center; justify-content: center; container-type: size; }
      .beside .keyarea { flex: none; height: 100%; aspect-ratio: 1; }
      .round { border-radius: 50%; padding: 0; width: min(100cqw, 100cqh); height: min(100cqw, 100cqh); }

      /* frame of the key itself */
      .f-raised { box-shadow: var(--_raised); }
      .f-recessed { background: var(--_field); box-shadow: var(--_inset); }
      .f-none { border-color: transparent; background: transparent; }
      .btn:active { box-shadow: var(--_pressed); filter: brightness(0.96); }

      .red { --t: var(--_red); } .orange { --t: var(--_orange); } .blue { --t: var(--_blue); } .green { --t: var(--_green); } .grey { --t: var(--_grey); }
      /* tone stripe at rest, opposite the text alignment */
      .toned::before { content: ""; position: absolute; top: 6px; width: 16px; height: 3px; border-radius: 2px; background: var(--t); }
      .a-center::before { left: 50%; transform: translateX(-50%); }
      .a-start::before { right: 8px; }
      .a-end::before { left: 8px; }
      .a-start { align-items: flex-start; text-align: left; }
      .a-end { align-items: flex-end; text-align: right; }

      /* active: filled in the tone (neutral fills with ink) */
      .active:not(.lamp) { background: var(--t); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); box-shadow: var(--_pressed); }
      .active:not(.lamp)::before { background: rgba(255, 255, 255, 0.7); }
      .small { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .active:not(.lamp) .small, .alert .small { color: inherit; opacity: 0.85; }

      /* warning: red key + triangle */
      .alert { background: var(--_alert); color: var(--_ink-on); border-color: rgba(0, 0, 0, 0.25); }
      .alert::before { background: rgba(255, 255, 255, 0.7); }
      .warn { width: 11px; height: 10px; flex: none; }
      .row { display: flex; align-items: center; gap: 5px; }

      /* lamp: a lit dot in the corner */
      .lampdot { position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: rgba(38, 18, 1, 0.16); }
      .lamp.active .lampdot { background: var(--t); box-shadow: 0 0 6px 2px color-mix(in srgb, var(--t) 55%, transparent); }
      .alert .lampdot { background: #fff; box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.55); }
    `
];
RamsButton = __decorateClass$a([
  t("rams-button")
], RamsButton);
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsDisplay = class extends Piece {
  constructor() {
    super(...arguments);
    this.defaultFrame = "recessed";
  }
  static getStubConfig() {
    return { type: "custom:rams-display", title: "Title", text: "Value", size: "medium" };
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
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} } },
            { name: "unit", selector: { text: {} } },
            dropdown2("size", [["small", "Small"], ["medium", "Medium"], ["large", "Large"]]),
            dropdown2("align", [["start", "Left"], ["center", "Centre"], ["end", "Right"]])
          ]
        },
        layoutFields()
      ],
      computeLabel
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
    const cls = [c2.align ?? "start", c2.size ?? "medium", c2.title ? "has-title" : ""].filter(Boolean).join(" ");
    return b`<div class="box ${cls}">
      ${c2.title ? b`<span class="title">${c2.title}</span>` : A}
      <span class="value">${this.value()}${c2.unit ? b`<span class="unit">${c2.unit}</span>` : A}</span>
    </div>`;
  }
};
RamsDisplay.styles = [
  tokens,
  i$3`
            .box { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; overflow: hidden; }
      .start { align-items: flex-start; text-align: left; }
      .center { align-items: center; text-align: center; }
      .end { align-items: flex-end; text-align: right; }
      .box.has-title { justify-content: flex-start; padding: 8px 0; }
      .has-title .value { flex: 1; display: flex; align-items: center; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .value { line-height: 1.1; }
      .small .value { font-size: 12px; }
      .medium .value { font-size: 20px; }
      .large .value { font-size: 44px; letter-spacing: -0.02em; }
      .unit { font-size: 0.4em; color: var(--_muted); margin-left: 3px; letter-spacing: 0; }
    `
];
RamsDisplay = __decorateClass$9([
  t("rams-display")
], RamsDisplay);
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
      ...actionFields()
    ];
    const data = { ...c2, columns: c2.columns ?? 12, spacing: c2.spacing ?? 8, frame: c2.frame ?? "raised" };
    return b`
      <ha-form .hass=${this.hass} .data=${data} .schema=${schema} .computeLabel=${(s2) => s2.name === "columns" ? "grid columns" : computeLabel(s2)} @value-changed=${this.columnsChanged}></ha-form>
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
    this.onRows = (e2) => {
      const card = e2.composedPath().find((n3) => n3.localName === "hui-card");
      if (card) card.style.gridRow = `span ${e2.detail.rows}`;
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
    return { type: "custom:rams-panel", columns: 12, cards: [] };
  }
  static async getConfigElement() {
    return loadPanelEditor();
  }
  getGridOptions() {
    return { columns: 12, rows: "auto" };
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
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const cols = c2.columns ?? 12;
    return b`<div class="plate f-${c2.frame ?? this.defaultFrame}" @rams-rows=${this.onRows} @click=${this.onClick} @pointerdown=${this.onDown} @pointerup=${this.press.up} @pointerleave=${this.press.up}>
      ${c2.title ? b`<div class="title">${c2.title}</div>` : A}
      <div class="grid" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr))">
        ${(c2.cards ?? []).map(
      (card) => b`<hui-card
            .config=${card}
            .hass=${this.hass}
            style="grid-column: ${card.columns ? `span ${Math.min(card.columns, cols)}` : "1 / -1"}; grid-row: span ${typeof card.rows === "number" ? card.rows : 1}"
          ></hui-card>`
    )}
      </div>
    </div>`;
  }
};
RamsPanel.styles = [
  tokens,
  i$3`
      .plate { display: block; padding: var(--_gap); border-radius: calc(var(--_radius) + var(--_gap)); }
      .plate.f-outline, .plate.f-recessed, .plate.f-raised { background: var(--_plate); border: var(--_border); }
      .plate.f-recessed { box-shadow: var(--_inset); }
      .plate.f-raised { box-shadow: var(--_raised); }
      .plate.f-none { padding: 0; border-radius: 0; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 2px calc(var(--_gap) - 2px); }
      .grid { display: grid; gap: var(--_gap); grid-auto-rows: var(--_row); }
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
            { name: "unit", selector: { text: {} } }
          ]
        },
        { name: "centre", selector: { boolean: {} } },
        { name: "labels", selector: { boolean: {} } },
        { name: "interactive", selector: { boolean: {} } },
        layoutFields()
      ],
      computeLabel
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
        layoutFields(),
        ...actionFields()
      ],
      computeLabel
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
      .led { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--_active); }
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
        layoutFields()
      ],
      computeLabel
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
            .face { position: relative; box-sizing: border-box; height: 100%; display: grid; place-items: center; }
      svg { height: 100%; max-width: 100%; aspect-ratio: 1; }
      .dots { stroke: var(--_ink); }
      .hand { stroke: var(--_ink); stroke-linecap: round; transform-origin: 60px 60px; }
      .sec { stroke: var(--_honey); transform-origin: 60px 60px; }
      .hub { fill: var(--_ink); }
      .digital { font-family: var(--rams-mono, ui-monospace, "SF Mono", Menlo, monospace); font-size: 30px; letter-spacing: 0.02em; }
      .key { position: absolute; top: -4px; right: 14%; width: 22%; height: 7px; border-radius: 2px; border: var(--_border); background: var(--_ink); cursor: pointer; }
      .key.on { background: var(--_active); }
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
const ON = ["on", "open", "playing", "home", "unlocked"];
const PROBLEM = ["problem", "safety", "smoke", "gas", "carbon_monoxide", "moisture", "tamper", "battery", "heat"];
let RamsList = class extends Piece {
  static getStubConfig() {
    return { type: "custom:rams-list", entities: [] };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "entities", selector: { entity: { multiple: true } } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { text: {} } },
            dropdown("keys", [["none", "None"], ["toggle", "Toggle key"], ["cover", "Up / down keys"]]),
            num$1("max_items", 1, 50),
            { name: "empty_text", selector: { text: {} } }
          ]
        },
        layoutFields()
      ],
      computeLabel
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
  updated(_c) {
    const box = this.renderRoot.querySelector(".list");
    if (box) this.reportRows(this.rowsFor(box.offsetHeight + 2));
  }
  row(id) {
    var _a2;
    const c2 = this.config;
    const e2 = (_a2 = this.hass) == null ? void 0 : _a2.states[id];
    if (!this.hass || !e2) return b`<div class="row"><span class="dot"></span><span class="name">${id}</span><span class="val">n/a</span></div>`;
    const name = String(e2.attributes.friendly_name ?? id);
    const small = c2.attribute ? String(e2.attributes[c2.attribute] ?? "") : String(e2.attributes.device_class ?? "");
    const alert = id.startsWith("binary_sensor.") && e2.state === "on" && PROBLEM.includes(String(e2.attributes.device_class));
    const dot = alert ? "alert" : ON.includes(e2.state) ? "on" : "";
    const keys = c2.keys === "toggle" ? b`<button class="key" @click=${(ev) => this.call(ev, "homeassistant", "toggle", id)}>${e2.state === "on" ? "on" : "off"}</button>` : c2.keys === "cover" ? b`<button class="key" @click=${(ev) => this.call(ev, "cover", "open_cover", id)}>&#9650;</button><button class="key" @click=${(ev) => this.call(ev, "cover", "close_cover", id)}>&#9660;</button>` : A;
    return b`<div class="row" @click=${() => this.more(id)}>
      <span class="dot ${dot}"></span>
      <span class="name">${name}${small ? b`<small>${small.replace(/_/g, " ")}</small>` : A}</span>
      <span class="val">${this.value(this.hass, e2)}</span>${keys}
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
      ${all.length > shown.length ? b`<div class="more">+${all.length - shown.length} more</div>` : A}
    </div>`;
  }
};
RamsList.styles = [
  tokens,
  i$3`
      :host { height: auto; }
      .list { display: flex; flex-direction: column; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 0 6px; }
      .row { display: flex; align-items: center; gap: var(--_gap); min-height: 40px; box-sizing: border-box; padding: 4px 0; border-top: var(--_border); cursor: pointer; font-size: 13px; }
      .title + .row, .row:first-child { border-top: 0; }
      .dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--_grey); }
      .dot.on { background: var(--_green); }
      .dot.alert { background: var(--_red); }
      .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .name small { display: block; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .val { color: var(--_muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .key { flex: none; min-width: 34px; height: 28px; padding: 0 6px; box-sizing: border-box; border-radius: var(--_radius); border: var(--_border); background: var(--_cap); box-shadow: var(--_raised); color: var(--_ink); font: inherit; font-size: 11px; cursor: pointer; }
      .key:active { box-shadow: var(--_pressed); }
      .empty, .more { font-size: 12px; color: var(--_muted); padding: 4px 0; }
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
        layoutFields()
      ],
      computeLabel
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
    const modeTone = { disarm: "neutral", arm_home: "neutral", arm_away: "red", arm_night: "blue" };
    return b`<div class="pad">
      <div class="screen">
        <div class="dots">${Array.from({ length: Math.max(4, this.code.length) }, (_2, i2) => b`<b class=${i2 < this.code.length ? "f" : ""}></b>`)}</div>
        <span class="state">${state2.replace(/_/g, " ")}</span>
      </div>
      ${digits.map((d2) => this.key(d2, "digit", () => this.press(d2), { shape: "round" }))}
      ${this.key("clr", "digit", () => this.code = "", { shape: "round", tone: "grey" })}
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
            { name: "per_row", selector: { number: { min: 1, max: 8, mode: "box" } } }
          ]
        },
        layoutFields()
      ],
      computeLabel
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
const CX = 100, CY = 90, R2 = 72;
let RamsDial = class extends Piece {
  constructor() {
    super(...arguments);
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
      const c2 = this.config;
      if (this.drag !== void 0 && (c2 == null ? void 0 : c2.entity) && this.hass) void writeNumber(this.hass, c2.entity, this.drag);
      this.drag = void 0;
    };
  }
  static getStubConfig() {
    return { type: "custom:rams-dial", min: 0, max: 100, interval: 10, value: 40, columns: 6, rows: 3 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} } },
        {
          type: "grid",
          name: "",
          schema: [
            num$1("value", void 0, void 0, { step: "any" }),
            num$1("min", void 0, void 0, { step: "any" }),
            num$1("max", void 0, void 0, { step: "any" }),
            num$1("interval", void 0, void 0, { step: "any" }),
            { name: "unit", selector: { text: {} } },
            { name: "label", selector: { text: {} } }
          ]
        },
        { name: "interactive", selector: { boolean: {} } },
        layoutFields()
      ],
      computeLabel
    };
  }
  range() {
    const c2 = this.config;
    return { min: c2.min ?? 0, max: c2.max ?? 100, step: c2.interval ?? 1 };
  }
  point(f2, r2) {
    const a2 = Math.PI * (1 - f2);
    return [CX + r2 * Math.cos(a2), CY - r2 * Math.sin(a2)];
  }
  fromPointer(e2) {
    const box = e2.currentTarget.getBoundingClientRect();
    const k2 = Math.min(box.width / 200, box.height / 134);
    const px = (e2.clientX - (box.left + (box.width - 200 * k2) / 2)) / k2;
    const py = (e2.clientY - (box.top + (box.height - 134 * k2) / 2)) / k2;
    const a2 = Math.min(Math.PI, Math.max(0, Math.atan2(CY - py, px - CX)));
    const r2 = this.range();
    return clamp(r2.min + (1 - a2 / Math.PI) * (r2.max - r2.min), r2);
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const { min, max, step } = this.range();
    const value = this.drag ?? (c2.entity ? readNumber(this.hass, c2.entity, c2.attribute) : c2.value);
    const f2 = value === void 0 ? void 0 : Math.min(1, Math.max(0, (value - min) / (max - min)));
    const count = Math.min(60, Math.max(1, Math.round((max - min) / step)));
    const ticks = Array.from({ length: count + 1 }, (_2, i2) => i2 / count);
    const shown = value === void 0 ? "–" : String(Math.round(value * 10) / 10);
    const [nx, ny] = f2 === void 0 ? [CX, CY] : this.point(f2, R2 - 6);
    return b`<svg viewBox="0 0 200 134" class=${c2.interactive ? "interactive" : ""} @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
      ${w$1`<path class="arc" d="M ${CX - R2} ${CY} A ${R2} ${R2} 0 0 1 ${CX + R2} ${CY}" />
      ${ticks.map((t2, i2) => {
      const major = i2 === 0 || i2 === count || count % 2 === 0 && i2 === count / 2;
      const [x1, y1] = this.point(t2, R2);
      const [x2, y22] = this.point(t2, R2 - (major ? 12 : 7));
      return w$1`<line class="tick ${major ? "major" : ""}" x1=${x1} y1=${y1} x2=${x2} y2=${y22} />`;
    })}
      ${f2 === void 0 ? A : w$1`<line class="needle" x1=${CX} y1=${CY} x2=${nx} y2=${ny} />`}
      <text class="end" x=${CX - R2} y=${CY + 12}>${min}</text>
      <text class="end" x=${CX + R2} y=${CY + 12}>${max}</text>
      <text class="num" x=${CX} y=${CY + 28}>${shown}</text>
      ${c2.unit ? w$1`<text class="unit" x=${CX} y=${CY + 40}>${c2.unit}</text>` : A}
      ${c2.label ? w$1`<text class="lab" x=${CX} y="10">${c2.label}</text>` : A}`}
    </svg>`;
  }
};
RamsDial.styles = [
  tokens,
  i$3`
      svg { display: block; width: 100%; height: 100%; touch-action: none; }
      .arc { fill: none; stroke: var(--_muted); stroke-width: 1; }
      .tick { stroke: var(--_muted); stroke-width: 1; }
      .tick.major { stroke: var(--_ink); stroke-width: 1.5; }
      .needle { stroke: var(--_red); stroke-width: 3; stroke-linecap: round; }
      .num { fill: var(--_ink); font-size: 22px; text-anchor: middle; }
      .unit, .lab, .end { fill: var(--_muted); font-size: 9px; letter-spacing: 0.06em; text-anchor: middle; text-transform: uppercase; }
      .interactive { cursor: pointer; }
    `
];
__decorateClass([
  r()
], RamsDial.prototype, "drag", 2);
RamsDial = __decorateClass([
  t("rams-dial")
], RamsDial);
const w = window;
w.customCards = w.customCards ?? [];
w.customCards.push(
  { type: "rams-panel", name: "Rams panel", description: "Container: a plate with pieces on an N-column grid", preview: true },
  { type: "rams-display", name: "Rams display", description: "Text block: one or two lines, optional frame", preview: true },
  { type: "rams-ruler", name: "Rams ruler", description: "Scale with pointer or centre bar; optional touch to set", preview: true },
  { type: "rams-artwork", name: "Rams artwork", description: "Picture with playing LED and optional media keys", preview: true },
  { type: "rams-clock", name: "Rams clock", description: "Analog or digital clock", preview: true },
  { type: "rams-list", name: "Rams list", description: "List of entities with state and optional keys", preview: true },
  { type: "rams-keypad", name: "Rams keypad", description: "Alarm code entry and mode keys", preview: true },
  { type: "rams-shelf", name: "Rams shelf", description: "Artwork tiles generated from a list", preview: true },
  { type: "rams-button", name: "Rams button", description: "Key or round button", preview: true },
  { type: "rams-dial", name: "Rams dial", description: "Half-round scale with a needle, value from an entity or fixed", preview: true }
);
