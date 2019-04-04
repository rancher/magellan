import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL:  config.rootURL
});

Router.map(function() {
  this.route('group', { path: '/:group/:version' }, function() {
    // /api/v1/namespaces/cattle-system/pods/cattle-cluster-agent-f7959895f-k6tmw
    this.route('namespace', { path: '/namespaces/:namespace' }, function() {
      resourceList.apply(this);
    });

    resourceList.apply(this);
  });
});

function resourceList() {
  this.route('resource-list', { path: '/:resource' }, function() {
    this.route('create',   { path: '/_create' });
    this.route('resource', { path: '/:name' });
  });
}
export default Router;
