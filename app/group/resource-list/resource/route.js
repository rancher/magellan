import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  fetch:      service(),
  namespaces: service(),
  router:     service(),

  async model(params) {
    const fetch = get(this, 'fetch');
    const isNamespaced = get(this, 'isNamespaced');

    let url;
    let parent;
    if ( isNamespaced ) {
      parent = 'group.namespace.resource-list';
    } else {
      parent = 'group.resource-list';
    }

    const resource = this.modelFor(parent).resource;

    if ( isNamespaced ) {
      let namespace = this.modelFor('group.namespace').namespace;

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
