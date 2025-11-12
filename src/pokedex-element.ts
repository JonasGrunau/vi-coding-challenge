import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Pokemon } from './interfaces/pokeapi/Pokemon/Pokemon';
import './components/pokemon-element/pokemon-element';
import './components/filter-element/filter-element';

/**
 * An Element to display a list of Pokemon in a Pokedex format.
 */
@customElement('pokedex-element')
export class PokedexElement extends LitElement {
  allPokemons: Array<Pokemon> = [];
  error = '';

  @property({ type: String })
  headline: string = '';

  @property({ type: Array })
  visiblePokemons: Array<Pokemon> = [];

  @property({ type: Array })
  selectedTypeNames: Array<string> = [];

  @property({ type: Boolean })
  isLoading = false;

  connectedCallback() {
    super.connectedCallback();
    this.fetchPokedex();
  }

  async fetchPokedex() {
    this.isLoading = true;
    this.error = '';

    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=500&offset=0'
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      for (const shallowPokemon of data.results) {
        const pokemonResponse = await fetch(shallowPokemon.url);

        if (!pokemonResponse.ok) {
          throw new Error(`HTTP error ${pokemonResponse.status}`);
        }

        const pokemonData = await pokemonResponse.json();
        this.allPokemons.push(pokemonData);
        this.visiblePokemons.push(pokemonData);
      }
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  filterPokedexByTypes() {
    if (this.selectedTypeNames.length === 0) {
      this.visiblePokemons = [...this.allPokemons];
      return;
    }

    this.visiblePokemons = this.allPokemons.filter((pokemon: Pokemon) => {
      return this.selectedTypeNames.every((typeName) =>
        pokemon.types.some((typeInfo) => typeInfo.type.name === typeName)
      );
    });
  }

  handleFilterChanged(event: CustomEvent) {
    this.selectedTypeNames = event.detail.selectedTypeNames;
    this.filterPokedexByTypes();
  }

  render() {
    if (this.isLoading) {
      return html`<div>Loading...</div>`;
    }

    if (this.error) {
      return html`<div>Error: ${this.error}</div>`;
    }

    return html`
      ${this.headline.length > 0 ? html`<h2>${this.headline}</h2>` : ''}
      <div class="pokedex-container">
        <filter-element
          @filter-changed=${this.handleFilterChanged}></filter-element>
        <ul>
          ${this.visiblePokemons.map(
            (pokemon) =>
              html`<li>
                <pokemon-element
                  .index=${pokemon.id}
                  .name=${pokemon.name}
                  .spriteUrl=${pokemon.sprites.front_default ||
                  ''}></pokemon-element>
              </li>`
          )}
        </ul>
      </div>
    `;
  }

  static styles = css`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: solid 1px gray;
      border-radius: 8px;
      padding: 32px;
    }

    h2 {
      margin-top: 0;
    }

    .pokedex-container {
      display: flex;
      flex: 1;
      gap: 16px;
      flex-direction: row;
    }

    li {
      aspect-ratio: 1 / 1;
    }

    ul {
      flex: 1;
      align-self: baseline;
      margin: 0;
      padding: 0;
      list-style-type: none;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(214px, 1fr));
      gap: 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'pokedex-element': PokedexElement;
  }
}
