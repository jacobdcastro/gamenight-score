const path = require('path');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@images': path.resolve(__dirname, 'src/images/'),
      '@lib': path.resolve(__dirname, 'src/lib/'),
      '@views': path.resolve(__dirname, 'src/views/'),
    },
  },
};
