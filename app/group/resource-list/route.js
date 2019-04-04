import Route from '@ember/routing/route';
import { get, observer } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  fetch:      service(),
  namespaces: service(),

  async model(params) {
    const fetch = get(this, 'fetch');
    const resources = this.modelFor('group').resources;
    const resource = resources.findBy('name', params.resource);
    const namespace = get(this, 'namespaces.current');
    let isAllNamespaces = true;
    let url;

    if ( resource.namespaced && namespace ) {
      isAllNamespaces = false;
      url = resource.namespacedPath.replace('%NAMESPACE%', escape(namespace));
    } else {
      url = resource.basePath;
    }

    const res = await fetch.request(url)

    return {
      resource,
      isAllNamespaces,
      body: res,
    };
  },

  namespaceChanged: observer('namespaces.current', function() {
    this.refresh();
  }),

});
