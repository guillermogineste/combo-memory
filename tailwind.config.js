/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ['logic-monospace', 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Courier New', 'monospace'],
        'heading': ['logic-monoscript', 'Roboto Mono', 'Space Mono', 'Fira Code', 'Courier New', 'monospace'],
        'mono': ['logic-monospace', 'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'Courier New', 'monospace'],
      },
      fontWeight: {
        'body': '400',
        'interactive': '500',
      },
      letterSpacing: {
        'heading': '-0.05em',
        'display': '-0.04em',
      },
      wordSpacing: {
        'heading': '-5px',
      }
    },
  },
} 