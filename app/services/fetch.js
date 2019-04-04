import Service from '@ember/service'
import { inject as service } from '@ember/service';
import { resolve, reject } from 'rsvp';
import { get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import _nativeFetch from 'fetch';
import setCookieParser from 'set-cookie-parser';
import config from 'ember-get-config';
import { md5 } from '../utils/crypto';

import Error from '../models/error';

export default Service.extend({
  cookies:      service(),
  fastboot:     service(),
  isFastBoot:   alias('fastboot.isFastBoot'),
  headers:      null,
  baseUrl:      null,
  shoeboxCache: null,

  init() {
    this._super();

    set(this, 'baseUrl', config.APP.apiPrefix);

    if ( !get(this, 'headers') ) {
      set(this, 'headers', {});
    }
  },

  request(url, opt) {
    const shoebox = get(this, 'fastboot.shoebox');

    if ( arguments.length === 1 ) {
      if ( typeof url === 'object' ) {
        opt = url;
        url = opt.url;
      } else {
        opt = {};
      }
    }

    const hash = md5(`${ url }|${ JSON.stringify(opt) }`, 'hex');
    const cacheKey = `fetch-${ hash }`;

    opt.url = this._normalizeUrl(url);

    if ( shoebox ) {
      let cached = shoebox.retrieve(cacheKey);
      if ( opt.persistentCache !== true ) {
        shoebox.remove(cacheKey);
      }

      if ( cached ) {
        return resolve(cached);
      }
    }

    return this.fetch(opt).then((xhr) => {
      return this._requestSuccess(xhr, opt).then((result) => {
        if ( get(this, 'isFastBoot') && shoebox ) {
          shoebox.put(cacheKey, result);
        }

        return result;
      });
    }).catch((xhr) => {
      return this._requestFailed(xhr, opt);
    });
  },

  _requestSuccess(xhr, opt) {
    opt.responseStatus = xhr.status;

    if ( xhr.status === 204 ) {
      return resolve();
    }

    return resolve(xhr.body);
  },

  _requestFailed(xhr, opt) {
    var body;

    if ( xhr.err ) {
      if ( xhr.err === 'timeout' ) {
        body = Error.create({
          code:    'Timeout',
          status:  xhr.status,
          message: `API request timeout (${ opt.timeout / 1000 } sec)`,
          detail:  ` ${ opt.method || 'GET' } ${ opt.url }`,
        });
      } else {
        body = Error.create({
          code:    'Xhr',
          status:  xhr.status,
          message: xhr.err
        });
      }

      return finish(body);
    } else {
      body = Error.create({
        status:  xhr.status,
        message: xhr.body || xhr.message,
      });

      return finish(body);
    }

    function finish(body) {
      delete xhr.body;
      Object.defineProperty(body, 'xhr', {
        value:        xhr,
        configurable: true
      });

      return reject(body);
    }
  },

  _normalizeUrl(url, includingAbsolute = false) {
    let fastboot = get(this, 'fastboot');
    let origin;

    if ( fastboot && fastboot.isFastBoot ) {
      origin = `${ fastboot.request.protocol }//${ fastboot.request.host }`;
    } else {
      origin = window.location.origin;
    }

    // Make absolute URLs to ourselves root-relative
    if ( includingAbsolute && url.indexOf(origin) === 0 ) {
      url = url.substr(origin.length);
    }

    // Make relative URLs root-relative
    if ( !url.match(/^https?:/) ) {
      const baseUrl = get(this, 'baseUrl').replace(/\/+$/, '');

      if ( !url.startsWith('/') || !url.startsWith(baseUrl) ) {
        url = `${ baseUrl }/${ url.replace(/^\/+/, '') }`;
      }
    }

    // For fastboot everything has to be absolute
    if ( fastboot.isFastBoot && !url.match(/^https?:/) ) {
      url = `${ origin }${ url }`
    }

    return url;
  },

  // or fetch(url) or fetch(opt)
  fetch(url, opt) {
    const cookieSvc = get(this, 'cookies');
    const fastboot = get(this, 'fastboot');

    if ( arguments.length === 1 ) {
      if ( typeof url === 'object' ) {
        opt = url;
        url = opt.url;
      }
    }

    opt = opt || {};
    opt.url = this._normalizeUrl(opt.url);
    opt.processData = false;

    opt.headers = normalizeHeaders(opt.headers || {});
    applyHeaders(get(this, 'headers'), opt.headers);

    if (!opt.credentials) {
      opt.credentials = 'same-origin';
    }

    if ( fastboot && fastboot.isFastBoot ) {
      const cookies = cookieSvc.read(null, { raw: true });
      const ary = [];

      Object.keys(cookies).forEach((k) => {
        ary.push(`${ k }=${ cookies[k] }`);
      });

      opt.headers['cookie'] = ary.join('; ');
    }

    if ( typeof opt.dataType === 'undefined' ) {
      opt.dataType = 'text'; // Don't let jQuery JSON parse
    }

    if ( opt.timeout !== null && !opt.timeout ) {
      opt.timeout = this.defaultTimeout;
    }

    if ( opt.data ) {
      if ( !opt.contentType ) {
        opt.contentType = 'application/json';
      }

      if ( typeof opt.data === 'object' ) {
        opt.data = JSON.stringify(opt.data);
      }
    }

    const promise = _nativeFetch(opt.url, opt);

    if ( fastboot && fastboot.isFastBoot ) {
      const method = opt.method || 'GET';

      return promise.then((res) => {
        copyCookies(res, cookieSvc);
        console.log('[Fastboot Fetch]', method, opt.url, res.status);

        return done(res);
      }).catch((err) => {
        copyCookies(err, cookieSvc);
        console.log('[Fastboot Fetch Error]', method, opt.url, err.status);

        return reject(err);
      });
    } else {
      return promise.then(done);
    }
  },
});

// Copy cookies from the request's response to the fastboot response
function copyCookies(obj, cookieSvc) {
  if ( !obj || !obj.headers ) {
    return;
  }

  const headers = obj.headers.get('set-cookie');

  if ( headers ) {
    setCookieParser(headers).forEach((opts) => {
      const name = opts.name;
      const value = opts.value;

      delete opts.name;
      delete opts.value
      opts.raw = true;

      cookieSvc.write(name, value, opts);
    });
  }
}

function done(res) {
  let ct = '';

  if ( res && res.headers ) {
    ct = res.headers.get('content-type');
  }

  if ( res.status === 204 ) {
    return respond(res);
  } else {
    return res.text().then((body) => {
      if (body.length) {
        if (ct && ct.toLowerCase().indexOf('application/json') >= 0) {
          // return res.json().then(function(body) {
          return respond(res, JSON.parse(body));
          // });
        } else {
          return respond(res, body);
        }
      } else {
        // return res.text().then(function(body) {
        return respond(res, null);
        // });
      }
    });
  }
}

function respond(res, body) {
  let out = {
    body,
    status:     res.status,
    statusText: res.statusText,
    headers:    res.headers
  };

  if (res.ok) {
    return out;
  } else {
    return reject(out);
  }
}

function normalizeKey(key) {
  return (key || '').toLowerCase();
}

function normalizeHeaders(obj) {
  obj = obj || {};

  Object.keys(obj).forEach((key) => {
    const normalizedKey = normalizeKey(key);

    if ( normalizedKey !== key ) {
      const val = get(obj, key);

      obj[normalizedKey] = val;
      delete obj[key];
    }
  });

  return obj;
}

function applyHeaders(more, dest, copyUndefined = false) {
  if ( !more || typeof more !== 'object' ) {
    return;
  }

  Object.keys(more).forEach((key) =>  {
    const normalizedKey = normalizeKey(key);
    const val = get(more, key);

    if ( val === undefined && copyUndefined !== true ) {
      delete dest[normalizedKey];
    } else {
      dest[normalizedKey] = val;
    }
  });
}
