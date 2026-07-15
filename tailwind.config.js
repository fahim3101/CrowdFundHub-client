/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10231C',
        paper: '#FBFAF6',
        mist: '#EDEBE2',
        pine: {
          DEFAULT: '#1F5C4E',
          light: '#2F7A68',
          dark: '#153F35',
        },
        gold: {
          DEFAULT: '#D9A441',
          light: '#EAC373',
          dark: '#B5822C',
        },
        brick: '#C1533B',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
