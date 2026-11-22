/**
 * A form editor for pieces whose state lists must follow the entity the rules judge: the "rules entity" when one is set,
 * else the piece's own entity. HA's built-in form cannot change a field's context while you edit, so the lists stayed
 * greyed out on a piece with only a rules entity. This wraps the same schema in an ha-form of our own.
 */
import { html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import type { Hass } from "./types";

interface Field {
  name?: string;
  context?: Record<string, string | undefined>;
  schema?: Field[];
  [key: string]: unknown;
}

export interface FormDef {
  schema: Field[];
  computeLabel?: (s: { name: string }) => string;
  computeHelper?: (s: { name: string }) => string | undefined;
}

/** The lists of states: they offer the states of the judged entity. */
const JUDGED = new Set(["selected_when", "alert_when"]);

export const retarget = (schema: Field[], from: string): Field[] =>
  schema.map((f) => {
    if (f.schema) return { ...f, schema: retarget(f.schema, from) };
    if (f.name && JUDGED.has(f.name)) return { ...f, context: { filter_entity: from } };
    return f;
  });

export class RamsFormEditor extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) lovelace?: unknown;
  @property({ attribute: false }) config?: Record<string, unknown>;
  form?: FormDef;

  setConfig(config: Record<string, unknown>): void {
    this.config = config;
  }

  private changed = (e: CustomEvent) => {
    e.stopPropagation();
    this.config = e.detail.value as Record<string, unknown>;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this.config || !this.hass || !this.form) return nothing;
    const from = this.config.rules_entity ? "rules_entity" : "entity";
    return html`<ha-form .hass=${this.hass} .data=${this.config} .schema=${retarget(this.form.schema, from)} .computeLabel=${this.form.computeLabel} .computeHelper=${this.form.computeHelper} @value-changed=${this.changed}></ha-form>`;
  }
}

if (!customElements.get("rams-form-editor")) customElements.define("rams-form-editor", RamsFormEditor);

/** For a piece's static getConfigElement. */
export async function formEditor(form: FormDef): Promise<HTMLElement> {
  const el = document.createElement("rams-form-editor") as RamsFormEditor;
  el.form = form;
  return el;
}
