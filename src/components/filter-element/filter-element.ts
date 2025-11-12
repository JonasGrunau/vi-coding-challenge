import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { PokemonType } from '../../interfaces/pokeapi/Pokemon/Pokemon';
import type { NamedApiResource } from '../../interfaces/pokeapi/Utility/NamedApiResourceList';

/**
 * An element to filter pokemon by type or other criteria (in the future maybe).
 */
@customElement('filter-element')
export class FilterElement extends LitElement {
  pokemonTypes?: Array<NamedApiResource<PokemonType>>;
  selectedTypeNames: string[] = [];
  error = '';

  @property({ type: Boolean })
  isLoading = false;

  connectedCallback() {
    super.connectedCallback();
    this.fetchPokemonTypes();
  }

  async fetchPokemonTypes() {
    this.isLoading = true;
    this.error = '';

    try {
      const response = await fetch('https://pokeapi.co/api/v2/type/');

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      this.pokemonTypes = result.results;
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  changeFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const typeName = input.value;

    if (input.checked) {
      if (!this.selectedTypeNames.includes(typeName)) {
        this.selectedTypeNames = [...this.selectedTypeNames, typeName];
      }
    } else {
      this.selectedTypeNames = this.selectedTypeNames.filter(
        (name) => name !== typeName
      );
    }

    this.dispatchEvent(
      new CustomEvent('filter-changed', {
        detail: { selectedTypeNames: this.selectedTypeNames },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (this.isLoading) {
      return html`<div>Loading...</div>`;
    }

    if (this.error) {
      return html`<div>Error: ${this.error}</div>`;
    }

    return html`
      <h2 class="filter-title">Filter</h2>
      <span class="types-title">Types</span>
      <ul>
        ${this.pokemonTypes?.map((type) => {
          const capitalizedTypeName =
            type.name.charAt(0).toUpperCase() + type.name.slice(1);

          return html`<li>
            <label>
              <input
                type="checkbox"
                value="${type.name}"
                @change=${this.changeFilter} />
              ${capitalizedTypeName}
            </label>
          </li>`;
        })}
      </ul>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      border: 1px solid #ccc;
      padding: 32px;
      border-radius: 8px;
      min-width: 180px;
    }

    .filter-title {
      margin-top: 0;
      margin-bottom: 8px;
    }

    .types-title {
      font-weight: bold;
      margin-bottom: 8px;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'filter-element': FilterElement;
  }
}
