import Route from '@ember/routing/route';

import ResourceCreateRoute from 'magellan/mixins/resource-create-route';

export default Route.extend(ResourceCreateRoute, {
  resourceListRoute: 'api.resource-list',
});
