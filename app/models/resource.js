import Base from './base';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

const Resource = Base.extend({
  definitions: service(),

  basePath:       null,
  namespacedPath: null,

  canCreate: canVerb('create'),
  canList:   canVerb('list'),
  canGet:    canVerb('get'),

  definitionKey: computed('apiVersion', 'kind', function() {
    // io.k8s.api.apps.v1.Deployment
    // io.k8s.api.core.v1.Node

    const apiVersion = get(this, 'apiVersion');
    const kind       = get(this, 'kind');

    return `${ apiVersion }/${ kind }`;
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
    return get(this, 'namespacedPath').replace('%NAMESPACE%', escape(namespace));
  },
});

// Resource.reopenClass({
// });

export default Resource;

function canVerb(verb) {
  return computed('verbs.[]', function() {
    return get(this, 'verbs').includes(verb);
  });
}
