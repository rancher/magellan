import Route from '@ember/routing/route';

import ResourceDetailRoute from 'magellan/mixins/resource-detail-route';

export default Route.extend(ResourceDetailRoute, {
  resourceListRoute: 'authed.api.namespaced.resource-list',
  namespacedRoute:   'authed.api.namespaced',
});
