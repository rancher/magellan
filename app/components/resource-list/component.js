import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { set } from '@ember/object';
import { and } from '@ember/object/computed';

export default Component.extend({
  namespaces: service(),

  resource:         null,
  isAllNamespaces:  null,
  isNamespaced:     null,
  body:             null,

  tagName: '',

  showNamespace: and('isAllNamespaces', 'isNamespaced'),

  actions: {
    switchNamespace(name) {
      set(this, 'namespaces.current', name);
    }
  }
});
