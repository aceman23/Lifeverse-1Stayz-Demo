/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--background)',
        surface: 'var(--surface)',
        ink: {
          DEFAULT: 'var(--text-primary)',
          2: 'var(--text-secondary)',
          3: 'var(--text-muted)',
        },
        line: 'var(--border)',
        btn: 'var(--button-primary)',
        teal: {
          DEFAULT: 'var(--brand-teal)',
          text: 'var(--brand-teal-text)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          tint: 'var(--danger-tint)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          tint: 'var(--warning-tint)',
        },
        success: {
          DEFAULT: 'var(--success)',
          tint: 'var(--success-tint)',
        },
        info: {
          DEFAULT: 'var(--info)',
          tint: 'var(--info-tint)',
        },
      },
      borderRadius: {
        '12': '12px',
        '20': '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,21,26,.04), 0 4px 16px rgba(16,21,26,.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
