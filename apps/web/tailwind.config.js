/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        "paper-dark": "var(--color-paper-dark)",
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        rule: "var(--color-rule)",
        margin: "var(--color-margin)",
        moss: "var(--color-moss)",
        rust: "var(--color-rust)",
        wax: "var(--color-wax)",
        leather: "var(--color-leather)",
        "leather-light": "var(--color-leather-light)",
        "leather-dark": "var(--color-leather-dark)",
        parchment: "var(--color-parchment)",
        "rise-accent": "var(--color-rise-accent)",
        "wilds-accent": "var(--color-wilds-accent)",
      },
      fontFamily: {
        serif: ["Libre Baskerville", "Georgia", "serif"],
        hand: ["Caveat", "cursive"],
        sans: ["Source Sans 3", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
