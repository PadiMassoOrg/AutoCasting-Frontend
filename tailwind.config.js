export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',

    // 👇 NPM
    // './node_modules/autocasting-ui-library/dist/**/*.{js,ts,jsx,tsx}',

    // 👇 LOCAL
    '../AutoCasting-UI-Library/dist/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};
