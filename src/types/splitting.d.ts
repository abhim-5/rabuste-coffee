declare module 'splitting' {
  interface SplittingOptions {
    target?: string | Element | Element[];
    by?: 'chars' | 'words' | 'lines' | 'items';
    key?: string;
  }

  interface SplittingResult {
    el: Element;
    words?: Element[];
    chars?: Element[];
    lines?: Element[];
  }

  function Splitting(options?: SplittingOptions): SplittingResult[];

  export default Splitting;
}

declare module 'splitting/dist/splitting.css';
declare module 'splitting/dist/splitting-cells.css';
