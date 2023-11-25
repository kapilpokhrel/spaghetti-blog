/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    //extend: {},
    extend: {
      typography: {
        sm: {
          css: {
            p: {
              'line-height': '1.625rem',
            },
          },
        },

        md: {
          css: {
            p: {
              'line-height': '1.625rem',
            },
          },
        },

        lg: {
          css: {
            p: {
              'line-height': '1.625rem',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
