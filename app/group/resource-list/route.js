import Route from '@ember/routing/route';
import { get, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { addQueryParam } from '@rancher/ember-shared/utils/url';

export default Route.extend({
  fetch:      service(),
  namespaces: service(),

  async model(params) {
    const fetch = get(this, 'fetch');
    const resources = this.modelFor('group').resources;
    const resource = resources.findBy('name', params.resource);
    const ns = get(this, 'namespaces.current');

    let url = resource.basePath;
    let isAllNamespaces = true;
    if ( resource.namespaced && ns ) {
      isAllNamespaces = false,
      url = addQueryParam(url, 'fieldSelector', `metadata.namespace=${ ns }`);
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
