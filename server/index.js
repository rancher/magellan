// To use it create some files under `routes/`
// e.g. `server/routes/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };
/* eslint-env node */

const globSync      = require('glob').sync;

const proxies       = globSync('./proxy/**/*.js', { cwd: __dirname }).map(require);
const config        = require('../config/environment')(process.env.EMBER_ENV);

if ( config.environment === 'development' ) {
  require('longjohn');
}

module.exports = function(app, options) {
  proxies.forEach((route) => {
    route(app, options);
  });
};

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err, err.stack);
});

