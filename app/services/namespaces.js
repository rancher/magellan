import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get, set, computed, observer } from '@ember/object';

import { COOKIE } from 'magellan/utils/constants';

export default Service.extend({
  cookies: service(),
  router:  service(),

  all:     null,
  current: null,

  init() {
    this._super(...arguments);
    const current = get(this, 'cookies').read(COOKIE.NAMESPACE) || '';
    set(this, 'current', current);
  },

  switchTo(namespace) {
    console.log('Switch to', namespace);

    const prev = get(this, 'current');
    const router = get(this, 'router');
    const prevRoute = router.currentRoute;
    const keys = router._keysFor(prevRoute);
    const params = router._argsFor(prevRoute);
    let   newRouteName = prevRoute.name;
    let   changed = false;

    get(this, 'cookies').write(COOKIE.NAMESPACE, namespace, { path: '/' });
    set(this, 'current', namespace);

    switch ( prevRoute.name ) {
    case 'group.resource-list.index':
      if ( namespace ) {
        newRouteName = 'group.namespace.resource-list.index';
        params.splice(2, 0, namespace);
        changed = true;
      }
      break;
    case 'group.namespace.resource-list.index':
      changed = true;

      if ( namespace ) {
        params.splice(2, 1, namespace);
      } else {
        newRouteName = 'group.resource-list.index';
        params.splice(2, 1);
      }
      break;
    }

    if ( changed ) {
      console.log('Changed from', prevRoute.name, 'to', newRouteName);
      router.transitionTo(newRouteName, ...params);
    }
  },

  currentObj: computed('current', function() {
    return get(this, 'all').findBy('metadata.name', get(this, 'current'));
  }),

  isAll: computed('current', function() {
    return !get(this,'current');
  }),
});
