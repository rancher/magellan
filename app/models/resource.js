import Base from './base';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

const Resource = Base.extend({
  definitions:  service(),
  fetch:        service(),
  router:       service(),
  modalService: service('modal'),

  basePath:       null,
  namespacedPath: null,
  resourcePath:   null,

  canCreate: canVerb('create'),
  canList:   canVerb('list'),
  canGet:    canVerb('get'),

  actions: {
    promptDelete(model, after) {
      get(this, 'modalService').show('confirm-delete', {
        resources:  [model],
        after,
      });
    },

    clone() {
      debugger;
    },

    edit(model) {
      get(this, 'router').transitionTo(model.selfLink + '?edit=true');
    },

    async delete(model) {
      await get(this, 'fetch').request(model.metadata.selfLink, {
        method:  'DELETE',
        headers: {
          'content-type': 'application/yaml',
        }
      });
    },
  },

  definitionKey: computed('apiVersion', 'kind', function() {
    // io.k8s.api.apps.v1.Deployment
    // io.k8s.api.core.v1.Node

    const apiVersion = get(this, 'apiVersion');
    const kind       = get(this, 'kind');

    return `${ apiVersion }/${ kind }`;
  }),

  uniqueName: computed('group', 'name', function() {
    return `${ get(this, 'group') }/${ get(this, 'name') }`;
  }),

  apiVersion: computed('group', 'groupVersion', function() {
    const group   = get(this, 'group');
    const version = get(this, 'groupVersion');

    return `${ group }/${ version }`;
  }),

  baseUrl() {
    return get(this, 'basePath');
  },

  namespacedUrl(namespace) {
    return get(this, 'namespacedPath').replace('{namespace}', escape(namespace));
  },

  listUrl(namespace) {
    if ( namespace ) {
      return get(this, 'listPath').replace('{namespace}', escape(namespace));
    } else {
      return get(this, 'basePath');
    }
  },

  resourceUrl(namespace, name) {
    return get(this, 'resourcePath')
      .replace('{namespace}', escape(namespace))
      .replace('{name}', escape(name));
  }
});

// Resource.reopenClass({
// });

export default Resource;

function canVerb(verb) {
  return computed('verbs.[]', function() {
    return get(this, 'verbs').includes(verb);
  });
}
