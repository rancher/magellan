import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({
  model: null,
  type: null,
  definition: null,

  init() {
    this._super(...arguments);

    if ( !get(this, 'model') ){
      const model = [];
      set(this, 'model', model);
    }
  },

  actions: {
    add() {
      const type = get(this, 'type');
      const def = get(this, 'definition');
      let entry;
      if ( type ) {
        entry = '';
      } else {
        entry = def.createInstance();
      }

      get(this, 'model').addObject(entry);
    },

    remove(item) {
      get(this, 'model').removeObject(item);
    }
  }
});
