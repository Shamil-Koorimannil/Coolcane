export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-light': 'var(--color-bg-light)',
        accent: 'var(--color-accent)',
        'text-dark': 'var(--color-text-dark)',
        'text-light': 'var(--color-text-light)',
        star: 'var(--color-star)',
        bubble: 'var(--color-bubble)',
      },
      fontFamily: {
        syne: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
