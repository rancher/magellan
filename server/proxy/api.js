/* eslint-env node */

const path = require('path');
const HttpProxy = require('http-proxy');
// const ForeverAgent = require('forever-agent');

const config = require('../../config/environment')(process.env.EMBER_ENV);
const ProxyError = require('../error').ProxyError;

module.exports = function(app, options) {
  const httpServer = options.httpServer;

  const serverProxy = HttpProxy.createProxyServer({
    ws:     true,
    xfwd:   true,
    target: config.APP.apiServer,
    secure: false,
  });

  serverProxy.on('error', onProxyError);

  // WebSocket for Rancher
  httpServer.on('upgrade', (req, socket, head) => {
    if ( req.url.startsWith('/_lr/') ) {
      return;
    }

    req._source = 'Upgrade';

    // don't include the original host header
    let targetHost = config.APP.apiServer.replace(/^https?:\/\//, '');
    let host = req.headers['host'];
    let port;

    if ( socket.ssl ) {
      req.headers['x-forwarded-proto'] = 'https';
      port = 443;
    } else {
      req.headers['x-forwarded-proto'] = 'http';
      port = 80;
    }

    if ( host ) {
      idx = host.lastIndexOf(':');
      if ( ( host.startsWith('[') && host.includes(']:') || !host.startsWith('[') ) && idx > 0 ){
        port = host.substr(idx+1);
        host = host.substr(0, host.lastIndexOf(':'));
      }
    }

    req.headers['x-forwarded-host'] = host;
    req.headers['x-forwarded-port'] = port;
    req.headers['host'] = targetHost;
    req.headers['origin'] = config.APP.apiServer;
    req.socket.servername = targetHost;

    proxyLog('WS', req);
    try {
      serverProxy.ws(req, socket, head);
    } catch (err) {
      proxyError('WS', req, err);
    }
  });

  let map = {
    /* eslint-disable object-property-newline */
    'API UI':       { path: '/api-ui',                     proxy: serverProxy     },
    'API':          { path: config.APP.apiEndpoint,            proxy: serverProxy     },
  }


  app.use('/', (req, res, next) => {
    if ( (req.headers['user-agent'] || '').toLowerCase().includes('mozilla') ) {
      req._source = 'Browser';
    } else {
      req._source = 'Fastboot';
    }

    next();
  });

  console.log('Proxying API to', config.APP.apiServer);
  Object.keys(map).forEach((label) => {
    let base = map[label].path;
    let proxy = map[label].proxy;

    console.log(`Registering ${ base }`);
    app.use(base, (req, res /* , next */ ) => {
      if ( req.url === '/' ) {
        req.url = '';
      }

      // include root path in proxied request
      req.url = path.join(base, req.url);
      req.headers['X-Forwarded-Proto'] = req.protocol;

      // don't include the original host header
      req.headers['X-Forwarded-Host'] = req.headers['host'];
      delete req.headers['host'];

      req.headers['Authorization'] = 'Basic ' + Buffer.from(config.SERVER.apiToken).toString('base64');

      proxyLog(label, req);
      proxy.web(req, res);
    });
  });
}

function onProxyError(err, req, res) {
  console.log(`Proxy Error on ${ req.method } to ${ req.url }`, err);

  if ( req.upgrade ) {
    res.end();

    return;
  }

  const error = new ProxyError({ detail: err.toString() });

  error.respond(req, res);
}

function proxyLog(label, req) {
  console.log(`[${ label }][${ req._source }]`, req.method, req.url);
}

function proxyError(label, req, err) {
  console.error(`[${ label }][${ req._source }]`, req.method, req.url, err);
}
