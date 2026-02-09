import type { Config } from 'tailwindcss'

// Force Vercel Rebuild: Liquid Glass v2

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ceramdent: {
          fucsia: '#E30052',
          blue: '#3B82F6', // Modern Blue for accents
          navy: '#030712', // Background color (Almost black)
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
          "secondary": "#3B82F6",
          "accent": "#F472B6",
          "neutral": "#1F2937",
          "base-100": "#030712",
          "info": "#3B82F6",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
    ],
  },
}

export default config
