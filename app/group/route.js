import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return {
      resources: this.modelFor('application').resources.filterBy('group', params.group).filterBy('groupVersion', params.version),
    }
  }
});
