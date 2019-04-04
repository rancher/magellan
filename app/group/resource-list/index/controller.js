import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { set } from '@ember/object';
import { and } from '@ember/object/computed';

export default Controller.extend({
  namespaces: service(),

  showNamespace: and('model.isAllNamespaces', 'model.resource.namespaced'),

  actions: {
    switchNamespace(name) {
      set(this, 'namespaces.current', name);
    }
  }
});
