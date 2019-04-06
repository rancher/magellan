import Mixin from '@ember/object/mixin';
import { get, observer } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  fetch:      service(),
  namespaces: service(),

  // Populate these in your route
  versionRoute: null,

  async model(params) {
    const fetch = get(this, 'fetch');
    const resources = this.modelFor(get(this, 'versionRoute')).resources;
    const resource = resources.findBy('name', params.resource);
    const isNamespaced = resource.namespaced;

    let isAllNamespaces = null;
    let url;

    if ( isNamespaced ) {
      const namespace = get(this, 'namespaces.current');

      if ( namespace ) {
        isAllNamespaces = false;
        url = resource.namespacedPath.replace('%NAMESPACE%', escape(namespace));
      } else {
        isAllNamespaces = true;
        url = resource.basePath;
      }
    } else {
      url = resource.basePath;
    }

    const res = await fetch.request(url)

    return {
      resource,
      isNamespaced,
      isAllNamespaces,
      body: res,
    };
  },

  namespaceChanged: observer('namespaces.current', function() {
    this.refresh();
  }),

});
