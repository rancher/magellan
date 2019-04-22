/* eslint-env node */

module.exports = function(/* env */) {
  return {
    locales:          null,
    autoPolyfill:     false,
    disablePolyfill:  false,
    publicOnly:       true,
    inputPath:        'translations',

    throwMissingTranslations: false,
  };
};
