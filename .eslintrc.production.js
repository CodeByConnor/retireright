module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable problematic rules for production build
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-object-type': 'off',
  },
}
