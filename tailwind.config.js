/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // Include all EJS files
    "./public/js/**/*.js", // If you use JavaScript for dynamic classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
