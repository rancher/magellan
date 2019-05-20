import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { equal, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({

  namespaces: service(),

  tagName:    'LI',
  classNames: ['clip'],

  resource: null,

  isNamespaced: and('resource.namespaced', 'namespaces.current'),
  singular:     equal('resource.group', 'api'),

  params: computed('route', 'resource.{group,groupVersion,name}', 'isNamespaced', 'namespaces.current', function() {
    const singular = get(this, 'singular');
    const isNamespaced = get(this, 'isNamespaced');

    let route = `authed.${ singular ? 'api' : 'apis' }${ isNamespaced ? '.namespaced' : '' }.resource-list`;

    const out = [route];

    if ( !singular ) {
      out.push(get(this, 'resource.group'));
    }

    out.push(get(this, 'resource.groupVersion'));

    if ( isNamespaced ) {
      out.push(get(this, 'namespaces.current'));
    }

    out.push(get(this, 'resource.name'));

    return out;
  }),
});
