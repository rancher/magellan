import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';

export default EmberObject.extend({
  displayName: alias('metadata.name'),
});
