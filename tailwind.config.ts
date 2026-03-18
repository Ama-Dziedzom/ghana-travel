import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF7F2',
        text: '#1C1C1C',
        accent: '#C9963A',
        'accent-2': '#B85C38',
        'accent-3': '#2D5016',
        muted: '#7A7162',
        border: '#E8E2D9',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      maxWidth: {
        article: '680px',
      },
    },
  },
  plugins: [],
}
export default config
