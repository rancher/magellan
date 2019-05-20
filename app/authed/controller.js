import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

import { COOKIE, DEFAULT_FAVORITES } from 'magellan/utils/constants';

export default Controller.extend({
  cookies:    service(),
  namespaces: service(),
  themeSvc:   service('theme'),

  navGroup:      null,
  favoriteNames: null,

  init() {
    this._super(...arguments);
    set(this, 'navGroup', get(this, 'cookies').read(COOKIE.NAV_GROUP, { raw: true }) || 'group');

    const str = get(this, 'cookies').read(COOKIE.NAV_FAVORITES);
    let favoriteNames = DEFAULT_FAVORITES.slice();

    if ( str ) {
      favoriteNames = JSON.parse(str);
    }

    set(this, 'favoriteNames', favoriteNames);
  },

  actions: {
    setNavGroup(group) {
      set(this, 'navGroup', group);
      get(this, 'cookies').write(COOKIE.NAV_GROUP, group, COOKIE.SESSION_SCOPED_RAW);
    },

    addFavorite(name) {
      get(this, 'favoriteNames').addObject(name);
      this.saveFavorites();
    },

    removeFavorite(name) {
      get(this, 'favoriteNames').removeObject(name);
      this.saveFavorites();
    },

    setTheme(name) {
      get(this, 'themeSvc').set('current', name);
    }
  },

  favorites: computed('favoriteNames.[]', 'model.resources.[]', function() {
    const resources = get(this, 'model.resources');
    const out = [];

    get(this, 'favoriteNames').forEach((uniqueName) => {
      const r = resources.findBy('uniqueName', uniqueName);

      if ( r ) {
        out.push(r);
      }
    });

    return out;
  }),

  flat: computed('favoriteNames.[]', 'model.resources.[]', function() {
    const count = {};

    get(this, 'model.resources').forEach((r) => {
      count[r.name] = ( count[r.name] || 0 ) + 1;
    });

    const out = [];
    const favoriteNames = get(this, 'favoriteNames');

    get(this, 'model.resources').forEach((r) => {
      if ( favoriteNames.includes(r.uniqueName) ) {
        return;
      }

      out.push({
        duplicate: count[r.name] > 1,
        resource:  r,
      });
    })

    return out.sortBy('resource.name', 'resource.group');
  }),

  grouped: computed('favoriteNames.[]', 'model.resources.[]', function() {
    const map = {};
    const favoriteNames = get(this, 'favoriteNames');

    get(this, 'model.resources').forEach((r) => {
      if ( favoriteNames.includes(r.uniqueName) ) {
        return;
      }

      let entry = map[r.group];

      if ( !entry ) {
        entry = [];
        map[r.group] = entry;
      }

      entry.push(r);
    });

    const out = [];

    Object.keys(map).forEach((key) => {
      out.push({
        group:      key,
        resources:  map[key].sortBy('name')
      });
    })

    return out.sortBy('group');
  }),

  saveFavorites() {
    get(this, 'cookies').write(COOKIE.NAV_FAVORITES, JSON.stringify(get(this, 'favoriteNames')), COOKIE.LONG_LIVED);
  }
});
