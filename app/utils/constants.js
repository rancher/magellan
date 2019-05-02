import { addCookies } from '@rancher/ember-shared/utils/constants';
export { COOKIE } from '@rancher/ember-shared/utils/constants';

addCookies({
  NAMESPACE: 'NAMESPACE',
  NAV_GROUP: 'NAV_GROUP',
  NAV_FAVORITES: 'NAV_FAVORITES',
});

export const DEFAULT_FAVORITES = [
  'api/nodes',
  'api/services',
  'apps/daemonsets',
  'apps/deployments',
  'apps/statefulsets',
];
