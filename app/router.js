import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL:  config.rootURL
});

Router.map(function() {
  this.route('error');

  this.route('authed', { path: '/' }, function() {
    this.route('index', { path: '/' });

    // There's 4 different ways to get to different resources..
    // /api/<version>/<resource>
    // /api/<version>/namespaces/<namespace>/<resource>
    // /apis/<group>/<version>/<resource>
    // /apis/<group>/<version>/namespaces/<namespace>/<resource>
    this.route('apis', { path: '/apis/:group/:version' }, function() {
      apiVersion.apply(this);
    });

    this.route('api', { path: '/api/:version' }, function() {
      apiVersion.apply(this);
    });
  });
});

function apiVersion() {
  this.route('namespaced', { path: '/namespaces/:namespace' }, function() {
    resourceList.apply(this);
  });

  resourceList.apply(this);
}

function resourceList() {
  this.route('resource-list', { path: '/:resource' }, function() {
    this.route('create',   { path: '/_create' });
    this.route('detail', { path: '/:name' });
  });
}
export default Router;
