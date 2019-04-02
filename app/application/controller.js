import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

import { COOKIE } from 'magellan/utils/constants';

export default Controller.extend({
  cookies: service(),

  navGroup: null,

  init() {
    set(this, 'navGroup', get(this, 'cookies').read(COOKIE.NAV_GROUP, {raw: true}) || 'none');
  },

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
      get(this, 'cookies').write(COOKIE.NAV_GROUP, group, {raw: true});
    }
  }
});
