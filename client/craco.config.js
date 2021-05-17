const path = require('path');
const {
  CracoAliasPlugin,
  configPaths,
} = require('react-app-rewire-alias/lib/aliasDangerous');

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
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: { alias: configPaths('./tsconfig.paths.json') },
    },
  ],
};
