import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,njk,md,js}'],
  theme: {
    // 2026-08-30 revert: the 2026-08-20 rebrand above replaced the documented
    // navy/gold identity with #3D5AFE — Material Design's Indigo A400, a
    // framework default, not a brand color. That's exactly what CLAUDE.md §2's
    // anti-template rule bans. Token KEYS are unchanged (navy.*, gold.*,
    // paper.*, ink.*) so no template needed editing — only the VALUES move
    // back to the recovered identity: #002856 and #FDD63F are both sampled
    // from real brand assets (the logo mark), not invented. All pairs below
    // are freshly contrast-verified per docs/briefs/A-palette-revert.md.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      // Ground — warm, near-neutral document stock (not cool/blue-tinted)
      paper: {
        DEFAULT: '#F6F6F3',
        raised: '#FFFFFF',
        sunk: '#EDEDE7',
      },

      // Ink — never pure black
      ink: {
        DEFAULT: '#10192B',
        muted: '#454E60',
        faint: '#666E80', // fixes an AA failure: the old value measured 3.03:1 on paper
      },

      // Navy — ink, punctuation and the two full-bleed bookend bands;
      // still never the default page canvas.
      // 2026-08-30: DEFAULT and gold.DEFAULT below moved to an EXACT match
      // of admizzeducation.com's live brand colors (#0D1282 / #FFD800,
      // confirmed via firecrawl branding scrape), at the user's explicit
      // request, superseding the "sampled from the group logo" values this
      // revert used minutes earlier. deep/soft re-derived by preserving the
      // old ramp's HSL-lightness deltas against the new hue (not guessed) —
      // see the contrast check below. navy.on/on-muted left as-is: still
      // AA-safe against the new navy, and admizzeducation.com doesn't
      // publish light-on-navy tokens to match against.
      navy: {
        DEFAULT: '#0D1282',
        deep: '#0B0F69',
        soft: '#131ABB',
        on: '#EAF0F6',
        'on-muted': '#A9BDD1',
        accent: '#FFD800', // gold — headline em-phrases on navy
      },

      // Gold — foil / accent ONLY. Never text on a light ground (1.41:1,
      // fails). Use gold.text for gold-toned text on paper/white.
      // DEFAULT is admizzeducation.com's exact #FFD800 (was #FDD63F,
      // sampled from the group logo — nearly identical, but this request
      // is for pixel parity with the sister site specifically).
      gold: {
        DEFAULT: '#FFD800',
        text: '#8A6200', // 5.49:1 on white — AA; hue/lightness relationship to
                          // the new gold unchanged, so the contrast math still holds
        sunk: '#FBF0D2',
      },

      rule: {
        DEFAULT: '#E2E1DA',
        strong: '#C9C7BD',
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
