'use strict';
var pkg = require('../package.json');
var fs   = require('fs');
var YAML = require('js-yaml');

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'magellan',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    fastboot: {
      hostWhitelist: [
        /^localhost:\d+$/,
        /^10\.\d+\.\d+\.\d+(:\d+)?/
      ]
    },

    // *** PUBLIC INFORMATION sent to the client ***
    APP: {
      version:               pkg.version,
      apiServer:             'https://localhost', // Where requests are proxied to
      apiEndpoint:           '/k8s',              // Only requests starting with this are proxied
      apiPrefix:             '/k8s-api',                  // This will be added after the endpoint and before the path the user requests
      locales:               readLocales(),
      prefPrefix:            'm-',
    },

    // *** PRIVATE INFORMATION not pushed to client ***
    SERVER: {
      apiToken:              '',
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if ( process.env.API_TOKEN ) {
    ENV.SERVER.apiToken = process.env.API_TOKEN;
  }

  if ( process.env.API_PREFIX ) {
    ENV.APP.apiPrefix = process.env.API_PREFIX;
  }

  // Override the API server/endpoint with environment var
  let server = process.env.API;

  if ( server ) {
    ENV.APP.apiServer = normalizeHost(server, 443);
  } else if (environment === 'production') {
    ENV.APP.apiServer = '';
  }

  return ENV;
};

// host can be an ip "1.2.3.4" -> https://1.2.3.4:30443
// or a URL+port
function normalizeHost(host, defaultPort) {
  if ( host.indexOf('http') === 0 ) {
    return host;
  }

  if ( host.indexOf(':') >= 0 || defaultPort === 443 ) {
    host = `https://${  host }`;
  } else {
    host = `https://${  host  }${ defaultPort ? `:${ defaultPort }` : '' }`;
  }

  return host;
}

function readLocales() {
  /* Parse the translations from the translations folder*/
  const files = fs.readdirSync('./translations');
  const out = {};

  files.forEach((filename) => {
    if ( !filename.match(/\.ya?ml$/) && !filename.match(/\.json$/) ) {
      // Ignore non-YAML files
      return;
    }

    const yamlFile = YAML.safeLoad(fs.readFileSync(`./translations/${  filename }`));
    const label  = yamlFile.languageName;
    const locale = filename.replace(/\.[^.]+$/, '');

    out[locale] = label || locale;
  });

  return out;
}
