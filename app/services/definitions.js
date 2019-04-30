import Service from '@ember/service';
import { get, computed } from '@ember/object';

export default Service.extend({
  all: null,

  getKey(key) {
    return get(this, 'all')[key];
  },

  getKind(kind) {
    return get(this, 'byKind')[kind];
  },

  getRef(ref) {
    const key = ref.replace(/^#\/definitions\//, '');

    return get(this, 'all')[key];
  },

  byKind: computed('all.@each.x-kubernetes-group-version-kind', function() {
    const all = get(this, 'all') || [];
    const out = {};

    Object.keys(all).forEach((id) => {
      const obj = all[id];
      const entries = obj['x-kubernetes-group-version-kind'];

      if ( !entries ) {
        return;
      }

      entries.forEach((entry) => {
        const key = `${ entry.group || 'api' }/${ entry.version }/${ entry.kind }`;

        out[key] = obj;
      });
    });

    return out;
  }),
});
