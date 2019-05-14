import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';

export default Controller.extend({
  themeSvc: service('theme'),

  theme: computed('themeSvc.current', function() {
    return `theme-${ get(this, 'themeSvc.current') }`;
  }),
});
