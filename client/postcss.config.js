module.exports = {
  plugins: [
    [
      'postcss-preset-env',
      {
        // Options
      },
    ],
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
