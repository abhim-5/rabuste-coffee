declare module 'hover-effect' {
  interface HoverEffectOptions {
    parent: HTMLElement;
    intensity?: number;
    image1: string;
    image2: string;
    displacementImage: string;
    speedIn?: number;
    speedOut?: number;
    hover?: boolean;
    easing?: string;
    imagesRatio?: number;
  }

  class HoverEffect {
    constructor(options: HoverEffectOptions);
    next(): void;
    previous(): void;
    renderer: {
      dispose(): void;
    };
  }

  export default HoverEffect;
}
