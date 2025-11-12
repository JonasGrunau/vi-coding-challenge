import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * An Element to display detailed information about a specific Pokemon.
 */
@customElement('pokemon-element')
export class PokemonElement extends LitElement {
  @property({ type: Number })
  index = 0;
  @property({ type: String })
  name = '';
  @property({ type: String })
  spriteUrl = '';

  render() {
    const capitalizedName = this.name
      ? this.name.charAt(0).toUpperCase() + this.name.slice(1)
      : '';

    return html`
      <span class="index">#${this.index}</span>
      <img src="${this.spriteUrl || ''}" alt="${this.name} sprite" />
      <h2>${capitalizedName}</h2>
    `;
  }

  static styles = css`
    :host {
      flex: 1;
      aspect-ratio: 1 / 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      position: relative;
    }

    .index {
      position: absolute;
      top: 16px;
      right: 16px;
      font-weight: bold;
      align-self: flex-end;
    }

    img {
      width: 120px;
      height: 120px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-element': PokemonElement;
  }
}
