import {TextStyle} from 'react-native';
// These names to be changed to just the multiple of 8 equivalents in Sketch
export type Size =
  | 'xSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xLarge'
  | 'xxLarge'
  | 'xxxLarge'
  | 'xxxxLarge';
export type Sizes = {[key in Size]: number};

export type Color = keyof typeof import('./Colors');
export type Colors = {[key in Color]: string};

/**
 * Some components will render on a dark background.
 * Rather than use a dark mode boolean, let's from the
 * start use a type so that later on we can easily
 * extend this type on a component by component basis
 * enabling us to have different color themes without
 * having to refactor anything.
 */
export type BaseColorTheme = 'light' | 'dark';

export type TypeStyle = Pick<
  TextStyle,
  'fontWeight' | 'fontFamily' | 'fontStyle' | 'fontSize'
>;

export type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

interface RegularTypeWeightStyles {
  bold: TypeStyle; // 700
  regular: TypeStyle; // 400
  light: TypeStyle; // 300
}

interface AlternateTypeWeightStyles {
  bold: TypeStyle; // Condensed gothic no3 considered 'regular'
}

export interface TypeStyles {
  // Unica
  regular: RegularTypeWeightStyles;

  // Condensed Gothic
  alternative: AlternateTypeWeightStyles;
}
