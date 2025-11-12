import { html } from 'lit';
import './pokemon-element';

export default {
  title: 'PokemonElement',
  component: 'pokemon-element',
  args: {
    index: 3,
    name: 'venusaur',
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
  },
  argTypes: {
    index: { control: 'number' },
    name: { control: 'text' },
    spriteUrl: { control: 'text' },
  },
};

export const Default = (args: {
  index: number;
  name: string;
  spriteUrl: string;
}) =>
  html`
    <pokemon-element
      .index=${args.index}
      .name=${args.name}
      .spriteUrl=${args.spriteUrl}></pokemon-element>
  `;
