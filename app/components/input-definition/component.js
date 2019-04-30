import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  definitions: service(),

  model: null,

  tagName: '',

  properties: alias('definition.properties'),

  fields: computed('keys.[]', function() {
    const fields = get(this, 'properties');

    return Object.keys(fields).map((key) => {
      const field = fields[key];

      if ( field.type ) {
        return {
          key,
          fieldType: field.type,
          component: `input-${ field.type }`,
        }
      } else if ( field['$ref'] ) {
        const subDef = get(this, 'definitions').getRef(field['$ref']);

        return {
          key,
          definition: subDef,
          component:  'input-definition',
        }
      } else if ( field.items ) {
        if ( field.items.type ) {
          return {
            key,
            fieldType: field.items.type,
            component: 'input-array',
          }
        } else if ( field.items['$ref'] ) {
          const subDef = get(this, 'definitions').getRef(field.items['$ref']);

          return {
            key,
            definition: subDef,
            component:  'input-array',
          }
        }
      } else {
        return {
          key,
          component: 'input-unknown',
        }
      }
    });
  }),
});
