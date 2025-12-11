/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#0b0f19",
        },
        text: {
          light: "#111827",
          dark: "#e5e7eb",
        },
        primary: {
          light: "#3b82f6",
          dark: "#60a5fa",
        }
      }
    }
  }, 
  plugins: [],
}