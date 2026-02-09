import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ceramdent: {
          fucsia: '#E30052',
          navy: '#0F172A',
        }
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        ceramdent: {
          "primary": "#E30052",
          "secondary": "#0F172A",
          "accent": "#10b981",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
      },
      "light",
    ],
  },
}

export default config
