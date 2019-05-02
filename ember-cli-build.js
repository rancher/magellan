'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const AutoImport = require('ember-auto-import/babel-plugin');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    babel: { /* eslint-disable object-curly-newline */
      plugins: [AutoImport]
    },
    codemirror:        {
      modes:      ['yaml', 'dockerfile', 'shell', 'markdown'],
      themes:     ['xq-light','xq-dark'],
      addonFiles: [
        'lint/lint.css',        'lint/lint.js',       'lint/yaml-lint.js',
        'fold/foldgutter.css',  'fold/foldcode.js',   'fold/foldgutter.js', 'fold/indent-fold.js',
        'hint/show-hint.css',   'hint/show-hint.js',  'hint/anyword-hint.js'
      ],
      keyMaps: ['vim', 'emacs', 'sublime'],
    },
  });

  app.import('vendor/icons/fonts/icons.woff', { destDir: 'fonts/' });
  app.import('vendor/icons/fonts/icons.ttf',  { destDir: 'fonts/' });
  app.import('vendor/icons/fonts/icons.svg',  { destDir: 'fonts/' });

  return app.toTree();
};
