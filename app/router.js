import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL:  config.rootURL
});

Router.map(function() {
  this.route('group', {path: '/g/:group/:version' }, function() {
    this.route('resource-list', { path: '/:resource' }, function() {
      this.route('resource', { path: '/:name' });
    });
  });
});

export default Router;
