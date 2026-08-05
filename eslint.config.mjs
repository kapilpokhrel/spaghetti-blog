import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

const config = [
  {
    ignores: ['out/**', '.next/**', 'node_modules/**'],
  },
  ...nextCoreWebVitals,
  prettier,
];

export default config;
