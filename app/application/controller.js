import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

import { COOKIE } from 'magellan/utils/constants';

export default Controller.extend({
  cookies:    service(),
  namespaces: service(),

  navGroup: null,

  init() {
    this._super(...arguments);
    set(this, 'navGroup', get(this, 'cookies').read(COOKIE.NAV_GROUP, { raw: true }) || 'group');
  },

  flat: computed('model.resources.[]', function() {
    const count = {};
    get(this, 'model.resources').forEach((r) => {
      count[r.name] = ( count[r.name] || 0 ) + 1;
    });

    const out = [];
    get(this, 'model.resources').forEach((r) => {
      out.push({
        duplicate: count[r.name] > 1,
        resource: r,
      });
    })

    return out.sortBy('resource.name','resource.group');
  }),

  grouped: computed('model.resources.[]', function() {
    const map = {};
    get(this, 'model.resources').forEach((r) => {
      let entry = map[r.group];
      if ( !entry ) {
        entry = [];
        map[r.group] = entry;
      }

      entry.push(r);
    });

    const out = [];
    Object.keys(map).forEach((key) => {
      out.push({ group: key, resources: map[key].sortBy('name') });
    })

    return out.sortBy('group');
  }),

  actions: {
    setNavGroup(group) {
      set(this, 'navGroup', group);
      get(this, 'cookies').write(COOKIE.NAV_GROUP, group, { raw: true, path: '/' });
    }
  }
});
