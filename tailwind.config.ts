import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const tailwindScrollbar = require('tailwind-scrollbar');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbar],
};