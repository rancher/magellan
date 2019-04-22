import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Mixin.create({
  definitions: service(),
  namespaces: service(),

  model() {
    const parentModel = this.modelFor(get(this, 'resourceListRoute'));
    const resource = parentModel.resource;
    const isNamespaced = parentModel.isNamespaced;
    const definition = get(this, 'definitions').getKind( get(resource, 'definitionKey') );

    const data = {};

    if ( isNamespaced ) {
      data.metadata = {};
      data.metadata.namespace = get(this, 'namespaces.current') || 'default';
    }

    const body = definition.createYaml(data);

    return {
      definition,
      resource,
      isNamespaced,
      body
    }
  },
});
