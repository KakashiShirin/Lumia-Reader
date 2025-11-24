/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Cinzel', 'serif'],
        lora: ['Lora', 'serif'],
      },
      colors: {
        background: '#0f0f12', // Deep dark
        surface: '#18181b', // Slightly lighter
        primary: '#6366f1', // Indigo
      }
    },
  },
  plugins: [],
}
