import Route from '@ember/routing/route';
import ResourceListRoute from 'magellan/mixins/resource-list-route';

export default Route.extend(ResourceListRoute, {
  versionRoute: 'authed.apis',
});
