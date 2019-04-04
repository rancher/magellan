import Base from './base';
import { get, computed } from '@ember/object';

export default Base.extend({
  canCreate: canVerb('create'),
  canList:   canVerb('list'),
  canGet:    canVerb('get'),
});

function canVerb(verb) {
  return computed('verbs.[]', function() {
    return get(this, 'verbs').includes(verb);
  });
}
