let mix = require('laravel-mix');

mix.setPublicPath('app')
   .js('src/js/index.js', 'main.js')
   .sass('src/sass/main.scss', 'main.css')
   .webpackConfig({
      node: {
        __dirname: false
      },
      externals: {
        "dualshock": "commonjs dualshock",
        "node-hid": 'commonjs node-hid'
      },
    target: 'electron-renderer'
  });