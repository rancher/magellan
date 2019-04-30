import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Mixin.create({
  definitions: service(),

  model() {
    const parentModel = this.modelFor(get(this, 'resourceDetailRoute'));
    const resource = parentModel.resource;
    const isNamespaced = parentModel.isNamespaced;
    const body = parentModel.body;
    const definition = get(this, 'definitions').getKind( get(resource, 'definitionKey') );

    return {
      definition,
      resource,
      isNamespaced,
      body
    }
  },
});
