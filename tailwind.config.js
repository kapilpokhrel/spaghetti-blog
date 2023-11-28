/** @type {import('tailwindcss').Config} */
const night_owl_bg = '#011627';
const site_blue = '#10dbff';

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      typography: {
        myblue: {
          css: {
            '--tw-prose-quote-borders': site_blue,
            '--tw-prose-invert-quote-borders': site_blue,
            '--tw-prose-links': site_blue,
            '--tw-prose-invert-links': site_blue,
          },
        },
        DEFAULT: {
          css: {
            p: {
              'line-height': '1.8rem',
            },
            pre: {
              'padding-right': '10px',
              'padding-left': '10px',
              'padding-top': '0',
              'padding-bottom': '0',
              'background-color': night_owl_bg,
            },
            code: {
              padding: '3px 5px 3px 5px',
              'border-radius': '5px',
              'background-color': night_owl_bg,
            },
            'code::before': false,
            'code::after': false,
          },
        },
        lg: {
          css: {
            p: {
              'line-height': '1.8rem',
            },
            pre: {
              'padding-right': '10px',
              'padding-left': '10px',
              'padding-top': '0',
              'padding-bottom': '0',
              'background-color': night_owl_bg,
            },
            code: {
              padding: '3px 5px 3px 5px',
              'border-radius': '5px',
              'background-color': night_owl_bg,
            },
            'code::before': false,
            'code::after': false,
          },
        },
        xl: {
          css: {
            p: {
              'line-height': '1.8rem',
            },
            pre: {
              'padding-right': '10px',
              'padding-left': '10px',
              'padding-top': '0',
              'padding-bottom': '0',
              'background-color': night_owl_bg,
            },
            code: {
              padding: '3px 5px 3px 5px',
              'border-radius': '5px',
              'background-color': night_owl_bg,
            },
            'code::before': false,
            'code::after': false,
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
