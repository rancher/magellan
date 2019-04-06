import Base from './base';
import { get, computed } from '@ember/object';

export default Base.extend({
  canCreate: canVerb('create'),
  canList:   canVerb('list'),
  canGet:    canVerb('get'),

  definitionKey: computed('group', 'groupVersion', 'kind', function() {
    // io.k8s.api.apps.v1.Deployment
    // io.k8s.api.core.v1.Node

    const group   = get(this, 'group');
    const version = get(this, 'groupVersion');
    const kind    = get(this, 'kind');

    return `${ group }/${ version }/${ kind }`;
  }),
});

function canVerb(verb) {
  return computed('verbs.[]', function() {
    return get(this, 'verbs').includes(verb);
  });
}
