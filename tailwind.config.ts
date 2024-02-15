import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#303031",
        secondary: "#544cc9",
        accent: "#145C9E",
        neutral: "#CBB9A8",
      },
    },
  },
  plugins: [],
};
export default config;
