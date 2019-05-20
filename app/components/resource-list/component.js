import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';

const BY_NONE = 'none';
const BY_NAMESPACE = 'namespace';

const WRAP = 'wrap';
// const CLIP = 'clip';

export default Component.extend({
  namespaces: service(),

  resource:         null,
  isAllNamespaces:  null,
  isNamespaced:     null,
  body:             null,
  searchText:       null,
  sortBy:           'name',
  descending:       false,
  group:            BY_NAMESPACE,
  line:             WRAP,

  tagName: '',

  showNamespace: and('isAllNamespaces', 'isNamespaced'),
  groupByRef:    alias('groupByKey'),

  actions: {
    setGroup(key) {
      set(this, 'group', key);

      if ( key === 'namespace' ) {
        this.send('switchNamespace', '');
      }
    },

    setLine(key) {
      set(this, 'line', key);
    },

    switchNamespace(name) {
      set(this, 'namespaces.current', name);
    }
  },

  headers: computed('showNamespaceColumn', 'body.headers.[]', function() {
    if ( get(this, 'showNamespaceColumn') ) {
      return get(this, 'body.headersWithNamespace');
    }

    return get(this, 'body.headers');
  }),

  showNamespaceGrouping: computed('showNamespace', 'group', function() {
    return get(this, 'showNamespace') && get(this, 'group') === BY_NAMESPACE;
  }),

  showNamespaceColumn: computed('showNamespace', 'group', function() {
    return get(this, 'showNamespace') && get(this, 'group') === BY_NONE;
  }),

  groupByKey: computed('showNamespaceGrouping', function() {
    if ( get(this, 'showNamespaceGrouping') ) {
      return 'Namespace';
    }

    return null;
  }),
});
