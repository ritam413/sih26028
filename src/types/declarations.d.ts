declare module 'next/font/google' {
  export interface FontOptions {
    subsets?: string[];
    weight?: string | string[];
    style?: string | string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    variable?: string;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
  }

  export interface FontConfig {
    className: string;
    style: { fontFamily: string; fontWeight?: number; fontStyle?: string };
    variable: string;
  }

  export function Inter(options?: FontOptions): FontConfig;
  export function JetBrains_Mono(options?: FontOptions): FontConfig;
  export function Cormorant_Garamond(options?: FontOptions): FontConfig;
  export function Roboto(options?: FontOptions): FontConfig;
}
