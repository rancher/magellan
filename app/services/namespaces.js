import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get, set, computed, observer } from '@ember/object';

import { COOKIE } from 'magellan/utils/constants';

export default Service.extend({
  cookies: service(),

  all:     null,
  current: null,

  init() {
    this._super(...arguments);
    const current = get(this, 'cookies').read(COOKIE.NAMESPACE) || '';
    set(this, 'current', current);
  },

  currentChanged: observer('current', function() {
    get(this, 'cookies').write(COOKIE.NAMESPACE, get(this, 'current'), { path: '/' });
  }),

  currentObj: computed('current', function() {
    return get(this, 'all').findBy('metadata.name', get(this, 'current'));
  }),

  isAll: computed('current', function() {
    return !get(this,'current');
  }),
});
