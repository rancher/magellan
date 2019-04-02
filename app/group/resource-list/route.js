import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  fetch:      service(),
  model(params) {
    const fetch = get(this, 'fetch');
    const resources = this.modelFor('group').resources;
    const resource = resources.findBy('name', params.resource);

    return fetch.request(`${ resource.basePath }/${ resource.name }`)
  }
});
