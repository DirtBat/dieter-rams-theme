// SPIKE: feasibility of panel + visual child editing. Throwaway.
const css = `
:host{display:block}
.plate{display:grid;gap:8px;grid-auto-rows:56px;padding:8px;background:#C8C5B9;border-radius:6px}
`;
class RamsKey extends HTMLElement {
  setConfig(c){ this._c = c; this._r(); }
  set hass(h){ this._h = h; }
  _r(){ if(!this.shadowRoot) this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML = `<style>:host{display:block;height:100%}div{height:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;background:#D9D2C6;border:1px solid rgba(38,18,1,.28);border-radius:5px;font:12px sans-serif;color:#261201}</style><div>${this._c.name ?? ''}</div>`; }
  getCardSize(){ return 1; }
  static getStubConfig(){ return { name: 'key' }; }
  static getConfigForm(){ return { schema: [
    { name: 'name', selector: { text: {} } },
    { name: 'columns', selector: { number: { min: 1, max: 12, mode: 'box' } } },
    { name: 'rows', selector: { number: { min: 1, max: 6, mode: 'box' } } } ],
    computeLabel: s => s.name }; }
}
customElements.define('rams-key', RamsKey);

class RamsPanel extends HTMLElement {
  setConfig(c){ this._c = c; this._build(); }
  set hass(h){ this._hass = h; (this._els||[]).forEach(e => e.hass = h); }
  async _build(){
    if(!this.shadowRoot) this.attachShadow({mode:'open'});
    const helpers = await window.loadCardHelpers();
    const c = this._c;
    this._els = (c.cards||[]).map(cc => { const e = helpers.createCardElement(cc); if(this._hass) e.hass = this._hass; return e; });
    this.shadowRoot.innerHTML = `<style>${css}.plate{grid-template-columns:repeat(${c.columns||12},minmax(0,1fr))}</style><div class="plate"></div>`;
    const plate = this.shadowRoot.querySelector('.plate');
    this._els.forEach((e,i) => { const cc = c.cards[i]; const w = document.createElement('div');
      w.style.cssText = `grid-column:span ${cc.columns||1};grid-row:span ${cc.rows||1};min-width:0`; w.append(e); plate.append(w); });
  }
  getCardSize(){ return 2; }
  getGridOptions(){ return { columns: 12, rows: 'auto' }; }
  static getStubConfig(){ return { columns: 6, cards: [] }; }
  static async getConfigElement(){
    const helpers = await window.loadCardHelpers();
    helpers.createCardElement({ type: 'vertical-stack', cards: [] });   // triggers lazy load of the stack card module
    await customElements.whenDefined('hui-vertical-stack-card');
    await customElements.get('hui-vertical-stack-card').getConfigElement();   // loads hui-stack-card-editor
    await customElements.whenDefined('hui-stack-card-editor');
    return document.createElement('rams-panel-editor');
  }
}
customElements.define('rams-panel', RamsPanel);

class RamsPanelEditor extends HTMLElement {
  setConfig(c){ this._c = c; this._r(); }
  set hass(h){ this._hass = h; this._r(); }
  set lovelace(l){ this._lovelace = l; this._r(); }
  _fire(c){ this._c = c; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true })); }
  _r(){
    if(!this._c || !this._hass) return;
    if(!this._form){
      this._form = document.createElement('ha-form');
      this._form.schema = [{ name: 'columns', selector: { number: { min: 1, max: 12, mode: 'box' } } }];
      this._form.computeLabel = s => s.name;
      this._form.addEventListener('value-changed', e => { e.stopPropagation(); this._fire({ ...this._c, ...e.detail.value }); });
      this._stack = document.createElement('hui-stack-card-editor');
      this._stack.addEventListener('config-changed', e => { e.stopPropagation(); this._fire({ ...this._c, cards: e.detail.config.cards }); });
      this.append(this._form, this._stack);
    }
    this._form.hass = this._hass; this._form.data = { columns: this._c.columns || 12 };
    this._stack.hass = this._hass; if(this._lovelace) this._stack.lovelace = this._lovelace;
    this._stack.setConfig({ type: 'vertical-stack', cards: this._c.cards || [] });
  }
}
customElements.define('rams-panel-editor', RamsPanelEditor);
window.customCards = (window.customCards||[]).concat([
  { type: 'rams-panel', name: 'Rams panel', description: 'spike' },
  { type: 'rams-key', name: 'Rams key', description: 'spike' }]);
