import Route from '@ember/routing/route';

import ResourceDetailRoute from 'magellan/mixins/resource-detail-route';

export default Route.extend(ResourceDetailRoute, {
  resourceListRoute: 'authed.apis.namespaced.resource-list',
  namespacedRoute:   'authed.apis.namespaced',
});
