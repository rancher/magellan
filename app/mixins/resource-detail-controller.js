import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: ['edit'],
  edit:        false,

  actions: {
    reload() {
      this.send('reloadModel');
    }
  },
});
