import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({

  // @TODO THIS SHOULDN'T BE NESTED UNDER RESOURCES, loads all and then one.
  resourceListRoute: null,

  model() {
    const defs = this.modelFor('application').definitionsByKind;
    const resource = this.modelFor(get(this, 'resourceListRoute')).resource;

    const def = defs[ get(resource, 'definitionKey') ];

    debugger;

    return {
      definition: def,
    }
  }
});
