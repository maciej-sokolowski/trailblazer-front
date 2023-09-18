const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./public/*.html",
    // "./app/helpers/**/*.rb",
    "./app/javascript/**/*.js",
    "./app/views/**/*.{erb,haml,html,slim}",
    "./app/concepts/**/*.{erb,haml,html,slim}",
    "./app/controllers/views_controller.rb"
  ],
  theme: {
    colors: {
      "neutral-500": "#1B2430",
      "text": "#211B3F",
      "blue": "#140F3F",
      "bg-blue": "#05012C",
      "dark-blue": "#17124A",
      "purple": "#582ABB",
      "purple-text": "#998FF8",
      "selected": "#4D4499",
      "bg-purple-1": "#AEAAF7",
      "bg-purple-2": "#D6D4FB",
      "bg-purple-3": "#CAC6F3",
      "light-purple": "#C5C0F5",
      "violet": "#5A1B4D",
      "magenta": "#E72456",
      "red": "#E72F2B",
      "orange": "#EC651A",
      "bg-orange": "#F5B18C",
      "grey": "#989CAA",
      "bg-grey": "#F2F2F2",
      "light-grey": "#F1F1F1",
      "light-bg": "#FEFEFE",
      "white": "#FFFFFF"

    },
    fontFamily: {
      sans: ["Open Sauce Sans", "sans-serif"]
    },
    fontSize: {
      "xs": ["0.75rem", { lineHeight: "1rem" }],
      "sm": ["0.875rem", { lineHeight: "1.25rem" }],
      "base": ["17px", { lineHeight: "20px" }],
      "lg": ["1.125rem", { lineHeight: "1.75rem" }],
      "xl": ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "1.4" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["2.75rem", { lineHeight: "1.3" }],
      "6xl": ["3rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    borderRadius: {
      "none": "0",
      DEFAULT: "10px",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "xxl": "1.25rem",
      "3xl": "1.5rem",
      "full": "9999px"
    },
    extend: {
      spacing: {
        "15": "3.75rem",
        "22": "5.5rem",
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ]
}
