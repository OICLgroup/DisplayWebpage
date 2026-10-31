declare module 'hypher' {
  export default class Hypher {
    constructor(patterns: unknown);
    hyphenateText(text: string, hyphenChar?: string): string;
  }
}

declare module 'hyphenation.en-us' {
  const patterns: unknown;
  export default patterns;
}
