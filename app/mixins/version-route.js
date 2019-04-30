import Mixin from '@ember/object/mixin';

export default Mixin.create({
  defaultGroup: 'api',

  model(params) {
    const group   = params.group || this.defaultGroup;
    const version = params.version;

    const resources = this.modelFor('authed').resources
      .filterBy('group', group)
      .filterBy('groupVersion', version);

    return {
      group,
      version,
      resources
    }
  }
});
