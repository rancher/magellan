import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  namespaces: service(),

  resource:      null,
  rows:          null,
  showNamespace: true,

  tagName: 'table',

  actions: {
    switchNamespace(name) {
      get(this, 'namespaces').switchTo(name);
    }
  }
});
