import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,njk,md,js}'],
  theme: {
    // 2026-08-20 rebrand: token KEYS unchanged (navy.*, gold.*, paper.*, ink.*)
    // so every existing utility class (bg-navy-deep, text-gold-text, ...) keeps
    // working — only the VALUES moved from the recovered navy/gold identity to
    // a blue-led palette, a deliberate direction change (see CLAUDE.md §5).
    // `navy` now carries the primary brand blue; `gold` is demoted to a rare,
    // deliberate warm accent (the ventures-register line, the confirmation
    // check) rather than the default accent everywhere. All pairs below are
    // freshly contrast-verified, not eyeballed — see CLAUDE.md §5 for ratios.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      // Ground — cool, near-neutral document stock
      paper: {
        DEFAULT: '#F4F5FB',
        raised: '#FFFFFF',
        sunk: '#EAEBF6',
      },

      // Ink — never pure black
      ink: {
        DEFAULT: '#151833',
        muted: '#4A5068',
        faint: '#868DA6',
      },

      // Brand blue (token key stays `navy`) — ink, punctuation and the two
      // full-bleed bookend bands; still never the default page canvas.
      navy: {
        DEFAULT: '#3D5AFE',
        deep: '#161B4D',
        soft: '#2B3FA0',
        on: '#EDEFFC',
        'on-muted': '#AEB4E8',
        accent: '#7C93FF', // lighter emphasis blue — headline em-phrases on navy (5.76:1)
      },

      // Gold — demoted secondary accent, used sparingly and deliberately now.
      // DEFAULT corrected 2026-08-25: sampled directly from the real logo
      // file (mark-navy.png) rather than left at the rebrand's invented
      // #F2B33D, which turned out not to match the actual brand asset —
      // #FDD63F is what's really in the mark (and matches the original
      // pre-rebrand palette CLAUDE.md documents, confirming it's correct).
      gold: {
        DEFAULT: '#FDD63F',
        text: '#8A5E10', // 5.23:1 on paper — AA on light, matches the old ratio's spirit
        sunk: '#FFF3DC',
      },

      rule: {
        DEFAULT: '#E1E2ED',
        strong: '#C7C9DC',
      },

      // Semantic — separate from the accent, per the design system
      good: { DEFAULT: '#14603F', bg: '#E9F3EE' },
      crit: { DEFAULT: '#A8231B', bg: '#FBEDEC' },
    },

    // Tight radii scaled to element size. Uniform rounded-2xl is the loudest
    // template tell of 2026, so the scale tops out low and deliberately.
    borderRadius: {
      none: '0',
      sm: '2px',
      DEFAULT: '3px',
      md: '4px',
      lg: '8px',
      xl: '14px',
      full: '9999px',
    },

    extend: {
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Chivo Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      // Fluid scale. Every step keeps max <= 2.5x min so WCAG 1.4.4 holds under zoom.
      fontSize: {
        'display-1': ['clamp(2.75rem, 1.6rem + 5.2vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.018em' }],
        'display-2': ['clamp(2.1rem, 1.4rem + 3.2vw, 4rem)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        h1: ['clamp(1.9rem, 1.35rem + 2.5vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.013em' }],
        h2: ['clamp(1.55rem, 1.2rem + 1.6vw, 2.4rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        h3: ['clamp(1.2rem, 1.05rem + 0.7vw, 1.55rem)', { lineHeight: '1.2', letterSpacing: '-0.006em' }],
        h4: ['1.0625rem', { lineHeight: '1.3' }],
        'body-lg': ['clamp(1rem, 0.95rem + 0.3vw, 1.1875rem)', { lineHeight: '1.55' }],
        body: ['0.9375rem', { lineHeight: '1.62', letterSpacing: '0.15px' }], // 15px, positive tracking
        small: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.12px' }],
        label: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.12em' }],
        micro: ['0.625rem', { lineHeight: '1.3', letterSpacing: '0.1em' }],
      },

      // Non-integer variable weights — free de-templating with a variable font.
      fontWeight: {
        light: '320',
        normal: '380',
        book: '460',
        medium: '530',
        semibold: '590',
        bold: '680',
      },

      spacing: {
        section: 'clamp(3.5rem, 8vw, 8rem)',
        'section-sm': 'clamp(2.5rem, 5vw, 4.5rem)',
        gutter: 'clamp(1.25rem, 4vw, 3rem)',
      },

      maxWidth: {
        shell: '1240px',
        measure: '68ch',
        'measure-tight': '54ch',
      },

      transitionTimingFunction: {
        // The one signature curve. At most one secondary.
        signature: 'cubic-bezier(.23, 1, .32, 1)',
        exit: 'cubic-bezier(.4, 0, 1, 1)',
      },

      transitionDuration: {
        press: '100ms',   // hover / press / focus — slower than ~120ms reads as lag
        enter: '480ms',   // entrances and reveals
        reveal: '620ms',  // scroll reveals — longer than `enter` so the 28px
                          // travel reads as movement rather than a jump
        slow: '720ms',
      },

      boxShadow: {
        raised: '0 1px 2px rgba(16,25,43,.04), 0 8px 24px -14px rgba(16,25,43,.16)',
        lift: '0 2px 4px rgba(16,25,43,.05), 0 18px 40px -20px rgba(16,25,43,.24)',
      },
    },
  },
  plugins: [typography],
};
