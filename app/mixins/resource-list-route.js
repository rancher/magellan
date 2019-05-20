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

    const namespace = get(this, 'namespaces.current');

    isAllNamespaces = isNamespaced && !namespace;
    url = resource.listUrl(namespace)

    const opt = {
      headers: {
        'accept': 'application/json;as=Table;g=meta.k8s.io;v=v1beta1',
      }
    };

    let res;

    try {
      res = await fetch.request(url, opt)
      res = get(this, 'store').createRecord('table', res);
    } catch (e) {
      delete opt.headers.accept;
      const objects = await fetch.request(url, opt)

      let hasCreated = false;

      const rows = objects.items.map((x) => {
        const out = {
          cells: [
            x.metadata.name,
          ],
          object: { metadata: x.metadata }
        };

        if ( x.metadata.creationTimestamp ) {
          out.cells.push(x.metadata.creationTimestamp);
          hasCreated = true;
        }

        return out;
      });

      const columnDefinitions = [
        {
          name:   'Name',
          type:   'string',
          format: 'name'
        },
      ];

      if ( hasCreated ) {
        columnDefinitions.push({
          name:   'Created',
          type:   'string',
          format: 'string'
        });
      }

      res = get(this, 'store').createRecord('table', {
        columnDefinitions,
        rows
      });
    }

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
