import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  codeMirror: service(),

  didInsertElement() {
    const id = this.$('TEXTAREA[id]')[0].id;
    const cm = get(this, 'codeMirror').instanceFor(id);

    cm.execCommand('foldAll');
  },

  actions: {
    save() {
      if ( this.save ) {
        this.save(...arguments);
      } else {
        throw new Error('"save" action must be provided for resource-edit');
      }
    },
  }
});
