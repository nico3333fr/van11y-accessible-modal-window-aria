/** Babel config for dist ES5 builds (IE9+), matching prior gulp-babel usage. */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { ie: '9' },
        modules: false,
      },
    ],
  ],
};
