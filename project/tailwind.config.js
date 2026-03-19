/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // === SISTEMA SEMÁNTICO — roles formales ===
        primary: {
          DEFAULT: '#003087',
          dark:    '#001f5a',
          light:   '#1a4ba0',
          subtle:  '#eef2fb',
        },
        accent: {
          DEFAULT: '#fdb913',
          dark:    '#e6a610',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt:     '#f8f9fc',
          muted:   '#f0f4fa',
        },
        content: {
          primary:   '#0f172a',
          secondary: '#475569',
          muted:     '#94a3b8',
          inverse:   '#ffffff',
        },
        border: {
          DEFAULT: '#e2e8f0',
          subtle:  '#f1f5f9',
        },

        // === LEGACY — backward compat (no eliminar) ===
        bauhaus: {
          red:    '#E53935',
          blue:   '#2f2382',
          yellow: '#FFD700',
          black:  '#1a1a1a',
        },
        'uasd-blue': {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },

      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'display': ['clamp(2.5rem,5vw,4rem)',    { lineHeight: '1.05', letterSpacing: '-0.035em' }],
        'h1':      ['clamp(2rem,4vw,3rem)',       { lineHeight: '1.12', letterSpacing: '-0.028em' }],
        'h2':      ['clamp(1.5rem,3vw,2.25rem)', { lineHeight: '1.18', letterSpacing: '-0.022em' }],
        'h3':      ['clamp(1.125rem,2vw,1.5rem)',{ lineHeight: '1.30', letterSpacing: '-0.015em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem',  { lineHeight: '1.65' }],
        'caption': ['0.75rem',   { lineHeight: '1.5', letterSpacing: '0.04em' }],
        'label':   ['0.6875rem', { lineHeight: '1',   letterSpacing: '0.10em' }],
      },

      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
      },

      borderRadius: {
        sm:      '4px',
        DEFAULT: '8px',
        md:      '8px',
        lg:      '12px',
        xl:      '16px',
        '2xl':   '24px',
        '3xl':   '32px',
        hero:    '20px',
      },

      boxShadow: {
        // 3 niveles formales
        subtle:       '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        medium:       '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        elevated:     '0 20px 48px rgba(0,0,0,0.10), 0 8px 20px rgba(0,0,0,0.06)',
        // Brand
        'primary-sm': '0 4px 14px rgba(0,48,135,0.22)',
        'primary-md': '0 8px 28px rgba(0,48,135,0.30)',
        // Card hover
        'card-hover': '0 12px 36px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06)',
        // Nav
        nav:          '0 2px 20px rgba(0,0,0,0.06)',
      },

      animation: {
        'slide-up':   'slideUp 0.5s cubic-bezier(0.4,0,0.2,1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.4,0,0.2,1)',
        'fade-in':    'fadeIn 0.4s cubic-bezier(0.4,0,0.2,1)',
        'scale-up':   'scaleUp 0.3s cubic-bezier(0.4,0,0.2,1)',
        'dropdown':   'dropdownIn 0.16s cubic-bezier(0.4,0,0.2,1)',
      },

      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%':   { transform: 'scale(0.97)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        dropdownIn: {
          '0%':   { transform: 'translateY(-8px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0)    scale(1)',    opacity: '1' },
        },
      },

      transitionTimingFunction: {
        premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring:  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      transitionDuration: {
        '220': '220ms',
        '350': '350ms',
      },

      lineHeight: {
        tight:   '1.15',
        snug:    '1.3',
        relaxed: '1.7',
        loose:   '1.9',
      },

      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.025em',
        tight:    '-0.015em',
        wide:     '0.04em',
        wider:    '0.08em',
        widest:   '0.12em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
