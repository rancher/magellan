import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { safeLoad } from 'js-yaml';

export default Mixin.create({
  fetch:      service(),
  namespaces: service(),

  // Populate these in your route
  resourceListRoute: null,
  namespacedRoute:   null,

  async model(params) {
    const fetch = get(this, 'fetch');
    const listModel = this.modelFor(get(this, 'resourceListRoute'));
    const resource = listModel.resource;
    const isNamespaced = listModel.isNamespaced;
    let url;

    if ( isNamespaced ) {
      const namespacedModel = this.modelFor(get(this, 'namespacedRoute'));
      const namespace = namespacedModel.namespace;
      url = resource.resourceUrl(namespace, params.name);
    } else {
      url = resource.resourceUrl(null, params.name);;
    }

    const body = await fetch.request(url, {
      headers: {
        'accept': 'application/yaml',
      }
    });

    const parsed = safeLoad(body);

    return {
      resource,
      isNamespaced,
      body,
      originalBody: body,
      parsed,
    };
  },

  actions: {
    reloadModel() {
      this.refresh();
    }
  }

});
