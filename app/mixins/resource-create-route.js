import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { safeDump } from 'js-yaml';

export default Mixin.create({
  definitions: service(),
  namespaces:  service(),

  model(arams) {
    const parentModel = this.modelFor(get(this, 'resourceListRoute'));
    const resource = parentModel.resource;
    const isNamespaced = parentModel.isNamespaced;
    const kind = get(resource, 'definitionKey');

    const data = {
      apiVersion: `${ resource.group }/${ resource.groupVersion }`,
      kind:       resource.kind,
      metadata:   { name: '' },
    };

    if ( isNamespaced ) {
      data.metadata.namespace = get(this, 'namespaces.current') || 'default';
    }

    let body;
    const definition = get(this, 'definitions').getKind(kind);

    if ( definition ) {
      body = definition.createYaml(data);
    } else {
      body = safeDump(data);
      body += `#  annotations:
#    key: value
#  labels:
#    key: value
spec:
  # OpenAPI field definitions are not available for this kind of Resource
  # key: value
  `;
    }

    return {
      definition,
      resource,
      isNamespaced,
      body
    }
  },
});
