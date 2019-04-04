import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { set } from '@ember/object';

export default Controller.extend({
  namespaces: service(),
  isAllNamespaces: alias('namespaces.isAll'),

  actions: {
    switchNamespace(name) {
      set(this, 'namespaces.current', name);
    }
  }
});
