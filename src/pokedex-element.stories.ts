import { html } from 'lit';
import './pokedex-element';

export default {
  title: 'PokedexElement',
  component: 'pokedex-element',
  args: {
    headline: 'Pokedex',
  },
  argTypes: {
    headline: { control: 'text' },
  },
};

export const Default = (args: { headline: string }) =>
  html` <pokedex-element .headline=${args.headline}></pokedex-element> `;
