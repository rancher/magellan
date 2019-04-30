import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  namespaces: service(),
  router:     service(),

  isNamespaced: null,

  actions: {
    create() {
      const router = get(this, 'router');
      const parent = router.currentRouteName
        .replace(/\.index$/, '')
        .replace(/\.detail/, '')
        .replace(/\.index$/, '');

      get(this, 'router').transitionTo(`${ parent }.create`);
    },

    switchNamespace(neu) {
      get(this, 'namespaces').switchTo(neu);
    },
  }
});
