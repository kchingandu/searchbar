// Folder paths that WebPack/ESLint will use to resolve imports
const modules = [
  'src',
  'node_modules',
];

module.exports = {
  resolve: {
    modulesDirectories: modules,
    modules,
    alias: {
      // required for enzyme to work properly
      sinon: 'sinon/pkg/sinon',
    },
  },
};
