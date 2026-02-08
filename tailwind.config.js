/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#020617',
        'steel-gray': '#3a3a3a',
        cta: '#22C55E',
        amber: '#ffb000',
        danger: '#ff4444',
      },
      fontFamily: {
        heading: ['"Press Start 2P"', 'monospace'],
        terminal: ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
}
