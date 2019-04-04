import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  fetch:      service(),
  namespaces: service(),

  async model(params) {
    const fetch = get(this, 'fetch');
    const resource = this.modelFor('group.resource-list').resource;
    const namespace = get(this, 'namespaces.current');

    let url;
    if ( resource.namespaced ) {
      url = resource.namespacedPath.replace('%NAMESPACE%', escape(namespace));
    } else {
      url = resource.basePath;
    }

    const res = await fetch.request(`${ url }/${ escape(params.name) }`);

    return {
      resource,
      body: res,
    };
  }
});
