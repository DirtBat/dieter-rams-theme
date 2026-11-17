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
var __decorateClass$c = (decorators, target, key, kind) => {
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
    var _a2, _b;
    const signal = this.signal();
    if (signal) this.setAttribute("signal", signal);
    else this.removeAttribute("signal");
    if (!changed.has("config")) return;
    this.setAttribute("frame", this.hostFrame ? ((_a2 = this.config) == null ? void 0 : _a2.frame) ?? this.defaultFrame : "none");
    this.toggleAttribute("actionable", this.actionable());
    if (this.minRows) {
      const n3 = typeof ((_b = this.config) == null ? void 0 : _b.rows) === "number" ? this.config.rows : 1;
      this.style.minHeight = `calc(var(--_row) * ${n3} + var(--_gap) * ${n3 - 1})`;
    }
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
__decorateClass$c([
  n2({ attribute: false })
], Piece.prototype, "hass");
__decorateClass$c([
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
  :host([frame="recessed"]) { background: var(--_field); box-shadow: var(--_inset); }
  :host([frame="raised"]) { background: var(--_cap); box-shadow: var(--_raised); }
`;
const keyStyles = i$3`
  .cell { height: 100%; min-height: var(--_row); display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; }
  .cell.above { flex-direction: column-reverse; }
  .cell.left { flex-direction: row-reverse; }
  .cell.right { flex-direction: row; }
  /* the LED and the key, together; the name sits beside or above it */
  .stack { flex: 1; min-height: 0; min-width: 0; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .cell.left .stack, .cell.right .stack { width: auto; align-self: stretch; }
  .cell.left .txt, .cell.right .txt { max-width: 45%; }
  /* name beside the key: key and LED sit next to it, not in the middle of the leftover room */
  .cell.right .stack { align-items: flex-end; } .cell.right .keyarea { justify-content: flex-end; }
  .cell.left .stack { align-items: flex-start; } .cell.left .keyarea { justify-content: flex-start; }
  .led { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--_lens); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35); }
  .led.on { background: var(--_alert); box-shadow: 0 0 max(var(--_glow), 5px) 1px color-mix(in srgb, var(--_alert) 85%, transparent), inset 0 0 2px rgba(255, 255, 255, 0.6); }
  .txt { flex: none; min-height: 13px; max-width: 100%; box-sizing: border-box; padding: 0 2px; font-size: 10px; line-height: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* the key's room: the key fills it */
  .keyarea { flex: 1; min-height: 24px; min-width: 0; width: 100%; display: flex; justify-content: center; container-type: size; }
  .key {
    position: relative; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; padding: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--_key-edge); border-radius: var(--_radius);
    background: linear-gradient(180deg, var(--_cap), color-mix(in srgb, var(--_cap) 92%, #000));
    box-shadow: var(--_raised); color: var(--_ink);
    font: inherit; font-size: 14px; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent;
  }
  .key.tall { width: 50%; }
  /* down: the key stays in while active */
  .key.down, .key:active { background: var(--_down); box-shadow: var(--_pressed); transform: translateY(1px); }

  /* the dish */
  .key::before {
    content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    height: 62%; aspect-ratio: 1; border-radius: 50%;
    background: radial-gradient(120% 140% at 50% 15%, var(--_cap) 0%, var(--_dish) 100%);
    box-shadow: var(--_inset), 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  .key.tall::before { height: calc(100% - 20px); width: 56%; aspect-ratio: auto; border-radius: 999px; }
  @container (min-aspect-ratio: 13/10) {
    .key:not(.tall)::before { height: 62%; width: calc(100% - 20px); aspect-ratio: auto; border-radius: 999px; }
  }
  @container (max-aspect-ratio: 10/13) {
    .key:not(.tall)::before { height: calc(100% - 20px); width: 62%; aspect-ratio: auto; border-radius: 999px; }
  }
  /* text printed on the key sits on a pill-shaped dish */
  .key:has(.legend):not(.round)::before { height: 62%; width: calc(100% - 20px); aspect-ratio: auto; border-radius: 999px; }
  .key > * { position: relative; z-index: 1; }
  .ico { --mdc-icon-size: 22px; flex: none; }
  .key.round .ico { --mdc-icon-size: 18px; }
  .key:has(.legend) { flex-direction: column; gap: 2px; }
  .legend { max-width: 86%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.1; }

  /* a toned key: the whole key takes the colour */
  .key.filled { --c: var(--t); color: var(--_ink-on); }
  .key.filled:not(.round) { background: linear-gradient(180deg, color-mix(in srgb, var(--c) 92%, #fff), var(--c)); box-shadow: var(--_raised), 0 0 var(--_glow) 1px color-mix(in srgb, var(--c) 45%, transparent); }
  .key.filled:not(.round)::before { background: radial-gradient(120% 140% at 50% 15%, color-mix(in srgb, var(--c) 90%, #fff) 0%, color-mix(in srgb, var(--c) 80%, #000) 100%); }

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
  rules_entity: "Optional. Judge the rules below by another entity's state, for example a level sensor. Type its states: the lists offer this card's own entity.",
  selected_when: "Type a state if it is not listed.",
  alert_when: "Type a state if it is not listed.",
  state_colours: 'Optional. A colour for each state, instead of red for every warning. A state listed here wins over "warning when".',
  value_colours: "Optional. Colour the piece when the number is above or below a value, for example CO2 above 1000. The strictest matching row wins.",
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
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsButton = class extends Piece {
  constructor() {
    super(...arguments);
    this.hostFrame = false;
    this.minRows = true;
    this.press = new Press(this, () => this.config, () => this.step());
  }
  static getStubConfig() {
    return { type: "custom:rams-button", name: "Button", columns: 2, rows: 2 };
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
            dropdown("tone", TONES)
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
                    state: { selector: { state: {} }, required: true },
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
  render() {
    var _a2, _b;
    const c2 = this.config;
    if (!c2) return A;
    const view = readState(this.hass, c2.entity, c2);
    const name = c2.name || String(((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity ?? ""]) == null ? void 0 : _b.attributes.friendly_name) ?? "");
    const pos = c2.label_position ?? "below";
    const tone = c2.tone && c2.tone !== "neutral" ? c2.tone : "";
    const cls = ["key", c2.shape ?? "", tone ? `filled ${tone}` : "", view.active ? "down" : ""].filter(Boolean).join(" ");
    return b`<div class="cell ${pos === "inside" ? "below" : pos}">
      <div class="stack">
        <i class="led ${view.alert ? "on" : ""}"></i>
        <div class="keyarea"><button class=${cls} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
          ${view.tone ? b`<i class="dot ${view.tone}"></i>` : A}
          ${c2.icon ? b`<ha-icon class="ico" .icon=${c2.icon}></ha-icon>` : A}
          ${pos === "inside" && name ? b`<span class="legend">${name}</span>` : A}
        </button></div>
      </div>
      ${pos === "inside" ? b`<div class="txt"></div>` : b`<div class="txt">${name}</div>`}
    </div>`;
  }
};
RamsButton.styles = [tokens, keyStyles, i$3`:host { display: block; }`];
RamsButton = __decorateClass$b([
  t("rams-button")
], RamsButton);
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = decorator(result) || result;
  return result;
};
let RamsSwitch = class extends Piece {
  constructor() {
    super(...arguments);
    this.hostFrame = false;
    this.minRows = true;
    this.press = new Press(this, () => this.config);
  }
  static getStubConfig() {
    return { type: "custom:rams-switch", name: "Switch", columns: 2, rows: 2 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
        ...layoutFields(false),
        ...actionFields(),
        {
          type: "expandable",
          name: "",
          title: "State rules",
          schema: [
            { name: "rules_entity", selector: { entity: {} } },
            { name: "selected_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } },
            { name: "alert_when", selector: { state: { multiple: true } }, context: { filter_entity: "entity" } }
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
  render() {
    var _a2, _b;
    const c2 = this.config;
    if (!c2) return A;
    const view = readState(this.hass, c2.entity, c2);
    const name = c2.name || String(((_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.entity ?? ""]) == null ? void 0 : _b.attributes.friendly_name) ?? "");
    return b`<div class="cell">
      <i class="led ${view.alert ? "on" : ""}"></i>
      <div class="well">
        <button class="slot ${view.active ? "on" : ""}" aria-pressed=${view.active} @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}><i class="lever"></i></button>
        <div class="pos"><span>off</span><span>on</span></div>
      </div>
      <div class="txt">${name}</div>
    </div>`;
  }
};
RamsSwitch.styles = [
  tokens,
  keyStyles,
  i$3`
      :host { display: block; }
      .well { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; }
      .slot { position: relative; box-sizing: border-box; width: 52px; height: 26px; padding: 0; border: 0; border-radius: 4px; background: var(--_slot, #2b2118); box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6); cursor: pointer; -webkit-tap-highlight-color: transparent; }
      .lever { position: absolute; top: 3px; left: 3px; width: 24px; height: 20px; border-radius: 3px; background: linear-gradient(180deg, var(--_lever, #efece4), color-mix(in srgb, var(--_lever, #efece4) 80%, #000)); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); transition: left 0.12s ease-out; }
      .on .lever { left: 25px; }
      .pos { display: flex; justify-content: space-between; width: 52px; font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--_muted); }
    `
];
RamsSwitch = __decorateClass$a([
  t("rams-switch")
], RamsSwitch);
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
    this.hostFrame = false;
    this.press = new Press(this, () => this.actionable() ? this.config : void 0);
  }
  signal() {
    var _a2;
    return readState(this.hass, (_a2 = this.config) == null ? void 0 : _a2.entity, this.config ?? {}).signal;
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
        { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
            { name: "unit", selector: { text: {} } },
            dropdown2("title_position", [["inside", "Inside"], ["above", "Above"], ["below", "Below"], ["left", "Left"], ["right", "Right"]]),
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
    const c2 = this.config;
    if (!c2) return A;
    const outside = c2.title_position && c2.title_position !== "inside" && !!c2.title;
    const inside = !!c2.title && !outside;
    const cls = [c2.align ?? "start", c2.size ?? "medium", inside ? "has-title" : ""].filter(Boolean).join(" ");
    const face = [c2.frame ?? this.defaultFrame, this.hasAttribute("signal") ? "sig" : ""].filter((x2) => x2 && x2 !== "none").join(" ");
    return b`<div class="wrap ${outside ? c2.title_position : ""}">
      ${outside ? b`<span class="outer">${c2.title}</span>` : A}
      <div class="face ${face}" @pointerdown=${this.press.down} @pointerup=${this.press.up} @pointerleave=${this.press.up} @click=${this.press.click}>
        <div class="box ${cls}">
          ${inside ? b`<span class="title">${c2.title}</span>` : A}
          <span class="value">${c2.icon ? b`<ha-icon class="ico" .icon=${c2.icon}></ha-icon>` : A}${this.value()}${c2.unit ? b`<span class="unit">${c2.unit}</span>` : A}</span>
        </div>
      </div>
    </div>`;
  }
};
RamsDisplay.styles = [
  tokens,
  i$3`
      :host { display: block; }
      .wrap { height: 100%; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
      .wrap.above { flex-direction: column-reverse; }
      .wrap.left { flex-direction: row-reverse; align-items: center; }
      .wrap.right { flex-direction: row; align-items: center; }
      /* the title printed outside the box */
      .outer { flex: none; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--_muted); text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .left .outer, .right .outer { max-width: 40%; }
      /* the face: the box itself */
      .face { flex: 1; min-width: 0; min-height: 0; box-sizing: border-box; }
      .left .face, .right .face { align-self: stretch; }
      .face.outline, .face.recessed, .face.raised { border: var(--_border); border-radius: var(--_radius); padding: 0 var(--_gap); }
      .face.outline { background: transparent; }
      .face.raised { background: var(--_cap); box-shadow: var(--_raised); }
      .face.recessed { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: color-mix(in srgb, var(--_lcd-ink) 62%, transparent); box-shadow: var(--_inset); }
      /* a signalled display (warning or colour for a state): filled with the tone, white text */
      .face.sig { background: var(--_sig); color: var(--_ink-on); --_ink: var(--_ink-on); --_muted: color-mix(in srgb, var(--_ink-on) 78%, transparent); border-radius: var(--_radius); box-shadow: 0 0 calc(var(--_glow) * 1.5) color-mix(in srgb, var(--_sig) 50%, transparent); }
      .box { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 2px; overflow: hidden; }
      .start { align-items: flex-start; text-align: left; }
      .center { align-items: center; text-align: center; }
      .end { align-items: flex-end; text-align: right; }
      .box.has-title { justify-content: flex-start; padding: 8px 0; }
      .has-title .value { flex: 1; display: flex; align-items: center; }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); }
      .value { line-height: 1.1; }
      .ico { --mdc-icon-size: 1em; margin-right: 6px; vertical-align: -0.12em; }
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
    this.needed = 1;
    this.fit = () => {
      var _a2, _b, _c, _d;
      const plate = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".plate");
      const grid = (_b = this.shadowRoot) == null ? void 0 : _b.querySelector(".grid");
      if (!plate || !grid) return;
      const cs = getComputedStyle(plate);
      const px = (v2) => parseFloat(v2) || 0;
      const title = ((_d = (_c = this.shadowRoot) == null ? void 0 : _c.querySelector(".title")) == null ? void 0 : _d.offsetHeight) ?? 0;
      const natural = px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth) + title + grid.offsetHeight;
      const row = px(cs.getPropertyValue("--_row")) || 56;
      const gap = px(cs.getPropertyValue("--_gap")) || 8;
      const n3 = Math.max(1, Math.ceil((natural - 0.5 + gap) / (row + gap)));
      this.needed = n3;
      const h2 = `${n3 * row + (n3 - 1) * gap}px`;
      if (plate.style.minHeight !== h2) plate.style.minHeight = h2;
    };
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
      .plate { display: block; box-sizing: border-box; height: 100%; padding: var(--_gap); border-radius: calc(var(--_radius) + var(--_gap)); }
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
        { name: "centre", selector: { boolean: {} } },
        { name: "labels", selector: { boolean: {} } },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields()
      ],
      computeLabel,
      computeHelper
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
const parse = (e2) => typeof e2 === "string" ? { entity: e2 } : e2;
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
  row(entry) {
    var _a2;
    const c2 = this.config;
    const { entity: id, name: own, category } = parse(entry);
    const e2 = (_a2 = this.hass) == null ? void 0 : _a2.states[id];
    const dot = category && COLOURS[category] ? b`<span class="dot" style="--c:${COLOURS[category]}"></span>` : this.categorised ? b`<span class="dot spacer"></span>` : A;
    if (!this.hass || !e2) return b`<div class="row">${dot}<span class="name">${own || id}</span><span class="val">n/a</span></div>`;
    const name = own || String(e2.attributes.friendly_name ?? id);
    const small = c2.attribute ? String(e2.attributes[c2.attribute] ?? "") : String(e2.attributes.device_class ?? "");
    const alert = readState(this.hass, id, {}).alert;
    const keys = c2.keys === "toggle" ? b`<button class="key" @click=${(ev) => this.call(ev, "homeassistant", "toggle", id)}>${e2.state === "on" ? "on" : "off"}</button>` : c2.keys === "cover" ? b`<button class="key" @click=${(ev) => this.call(ev, "cover", "open_cover", id)}>&#9650;</button><button class="key" @click=${(ev) => this.call(ev, "cover", "close_cover", id)}>&#9660;</button>` : A;
    return b`<div class="row" @click=${() => this.more(id)}>
      ${dot}
      <span class="name">${small ? b`<small>${small.replace(/_/g, " ")}</small>` : A}${name}</span>
      <span class="val ${alert ? "alert" : ""}">${this.value(this.hass, e2)}</span>${keys}
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
      .list { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-size: var(--sz); }
      .title { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--_muted); padding: 2px 0 6px; flex: none; }
      .row { display: flex; align-items: center; gap: var(--_gap); box-sizing: border-box; padding: 6px 0; cursor: pointer; flex: none; }
      .dot.spacer { background: none; }
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
      .pad { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: var(--_row); gap: var(--_gap); }
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
    var _a2, _b, _c, _d, _e;
    const c2 = this.config;
    if (!c2) return A;
    const items = this.items();
    const playingId = c2.player ? (_b = (_a2 = this.hass) == null ? void 0 : _a2.states[c2.player]) == null ? void 0 : _b.attributes.media_content_id : void 0;
    const playing = c2.player && ((_d = (_c = this.hass) == null ? void 0 : _c.states[c2.player]) == null ? void 0 : _d.state) === "playing";
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
const R2 = 72;
const rad = (deg) => deg * Math.PI / 180;
const at = (deg, r2) => [r2 * Math.sin(rad(deg)), -r2 * Math.cos(rad(deg))];
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
    return { type: "custom:rams-dial", min: 0, max: 100, interval: 10, value: 40, start_angle: -90, end_angle: 90, columns: 6, rows: 3 };
  }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "attribute", selector: { attribute: {} }, context: { filter_entity: "entity" } },
        {
          type: "grid",
          name: "",
          schema: [
            num$1("value", void 0, void 0, { step: "any" }),
            num$1("min", void 0, void 0, { step: "any" }),
            num$1("max", void 0, void 0, { step: "any" }),
            num$1("interval", void 0, void 0, { step: "any" }),
            num$1("start_angle", -360, 360, { step: 5 }),
            num$1("end_angle", -360, 360, { step: 5 }),
            { name: "unit", selector: { text: {} } },
            { name: "label", selector: { text: {} } }
          ]
        },
        { name: "interactive", selector: { boolean: {} } },
        ...layoutFields()
      ],
      computeLabel,
      computeHelper
    };
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
  /** The drawing area: the arc, the end labels and the centre text, whatever the angles are. */
  box() {
    var _a2, _b;
    const [a0, a1] = this.angles();
    const pts = [at(a0, R2 + 14), at(a1, R2 + 14), [0, 34 + (((_a2 = this.config) == null ? void 0 : _a2.unit) ? 12 : 0)]];
    for (let a2 = Math.ceil(a0 / 90) * 90; a2 <= a1; a2 += 90) pts.push(at(a2, R2 + 4));
    if ((_b = this.config) == null ? void 0 : _b.label) pts.push([0, -R2 - 16]);
    const xs = pts.map((p2) => p2[0]), ys = pts.map((p2) => p2[1]);
    const x0 = Math.min(...xs) - 4, y0 = Math.min(...ys) - 4;
    return [x0 - 8, y0, Math.max(...xs) + 4 - x0 + 16, Math.max(...ys) + 4 - y0];
  }
  fromPointer(e2) {
    const el = e2.currentTarget;
    const rect = el.getBoundingClientRect();
    const [bx, by, bw, bh] = this.box();
    const k2 = Math.min(rect.width / bw, rect.height / bh);
    const px = (e2.clientX - (rect.left + (rect.width - bw * k2) / 2)) / k2 + bx;
    const py = (e2.clientY - (rect.top + (rect.height - bh * k2) / 2)) / k2 + by;
    const [a0, a1] = this.angles();
    let a2 = Math.atan2(px, -py) * 180 / Math.PI;
    while (a2 < a0) a2 += 360;
    while (a2 >= a0 + 360) a2 -= 360;
    if (a2 > a1) a2 = a2 - a1 < a0 + 360 - a2 ? a1 : a0;
    const r2 = this.range();
    return clamp(r2.min + (a2 - a0) / (a1 - a0) * (r2.max - r2.min), r2);
  }
  render() {
    const c2 = this.config;
    if (!c2) return A;
    const { min, max, step } = this.range();
    const [a0, a1] = this.angles();
    const value = this.drag ?? (c2.entity ? readNumber(this.hass, c2.entity, c2.attribute) : c2.value);
    const f2 = value === void 0 ? void 0 : Math.min(1, Math.max(0, (value - min) / (max - min)));
    const count = Math.min(60, Math.max(1, Math.round((max - min) / step)));
    const ticks = Array.from({ length: count + 1 }, (_2, i2) => i2 / count);
    const shown = value === void 0 ? "–" : String(Math.round(value * 10) / 10);
    const [x0, y0, w2, h2] = this.box();
    const [sx, sy] = at(a0, R2), [ex, ey] = at(a1, R2);
    const large = a1 - a0 > 180 ? 1 : 0;
    const endLabel = (a2, text) => {
      const [x2, y3] = at(a2, R2 + 12);
      const s2 = Math.sin(rad(a2));
      return w$1`<text class="end" x=${x2} y=${y3 + 3} text-anchor=${s2 > 0.4 ? "start" : s2 < -0.4 ? "end" : "middle"}>${text}</text>`;
    };
    return b`<svg viewBox="${x0} ${y0} ${w2} ${h2}" class=${c2.interactive ? "interactive" : ""} @pointerdown=${this.onDown} @pointermove=${this.onMove} @pointerup=${this.onUp} @pointercancel=${this.onUp}>
      ${w$1`<path class="arc" d="M ${sx} ${sy} A ${R2} ${R2} 0 ${large} 1 ${ex} ${ey}" />
      ${ticks.map((t2, i2) => {
      const major = i2 === 0 || i2 === count || count % 2 === 0 && i2 === count / 2;
      const [x1, y1] = this.at(t2, R2);
      const [x2, y22] = this.at(t2, R2 - (major ? 12 : 7));
      return w$1`<line class="tick ${major ? "major" : ""}" x1=${x1} y1=${y1} x2=${x2} y2=${y22} />`;
    })}
      ${f2 === void 0 ? A : w$1`<line class="needle" x1=${this.at(f2, R2 * 0.5)[0]} y1=${this.at(f2, R2 * 0.5)[1]} x2=${this.at(f2, R2 - 6)[0]} y2=${this.at(f2, R2 - 6)[1]} />`}
      ${endLabel(a0, min)}${endLabel(a1, max)}
      <text class="num" x="0" y="26">${shown}</text>
      ${c2.unit ? w$1`<text class="unit" x="0" y="38">${c2.unit}</text>` : A}
      ${c2.label ? w$1`<text class="lab" x="0" y=${-R2 - 8}>${c2.label}</text>` : A}`}
    </svg>`;
  }
};
RamsDial.styles = [
  tokens,
  i$3`
      :host([frame="recessed"]) { background: var(--_lcd-bg); color: var(--_lcd-ink); --_ink: var(--_lcd-ink); --_muted: color-mix(in srgb, var(--_lcd-ink) 62%, transparent); }
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
  { type: "rams-panel", name: "Dieter Rams Panel", description: "Container: a plate with pieces on an N-column grid", preview: true },
  { type: "rams-display", name: "Dieter Rams Display", description: "Text block: one or two lines, optional frame", preview: true },
  { type: "rams-ruler", name: "Dieter Rams Ruler", description: "Scale with pointer or centre bar; optional touch to set", preview: true },
  { type: "rams-artwork", name: "Dieter Rams Artwork", description: "Picture with playing LED and optional media keys", preview: true },
  { type: "rams-clock", name: "Dieter Rams Clock", description: "Analog or digital clock", preview: true },
  { type: "rams-list", name: "Dieter Rams List", description: "List of entities with state and optional keys", preview: true },
  { type: "rams-keypad", name: "Dieter Rams Keypad", description: "Alarm code entry and mode keys", preview: true },
  { type: "rams-shelf", name: "Dieter Rams Shelf", description: "Artwork tiles generated from a list", preview: true },
  { type: "rams-button", name: "Dieter Rams Button", description: "Key with dish, state dot and warning LED", preview: true },
  { type: "rams-switch", name: "Dieter Rams Switch", description: "On/off switch with a lever", preview: true },
  { type: "rams-dial", name: "Dieter Rams Dial", description: "Half-round scale with a needle, value from an entity or fixed", preview: true }
);
