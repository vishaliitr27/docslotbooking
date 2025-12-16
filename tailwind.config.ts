import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            50: '#f0fdf4',   /* This is your background color */
            100: '#dcfce7',
            500: '#22c55e',
            700: '#15803d',
          },
          purple: {
            50: '#faf5ff',
            500: '#a855f7',
            900: '#581c87',
          },
        }
      },
    },
  },
  plugins: [],
};
export default config;