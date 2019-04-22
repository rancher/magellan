import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object'

import { eachLimit } from '@rancher/ember-shared/utils/promise-limit';
import ApplicationLoading from '@rancher/ember-shared/mixins/application-loading';
import ApplicationError from '@rancher/ember-shared/mixins/application-error';

import { compare } from 'magellan/utils/parse-k8s-version';

export default Route.extend(ApplicationLoading, ApplicationError, {
  lang:        service(),
  fetch:       service(),
  namespaces:  service(),
  definitions: service(),

  async beforeModel() {
    await get(this, 'lang').switchLanguage();
  },

  async model() {
    const store = get(this, 'store');
    const fetch = get(this, 'fetch');
    const roots = await fetch.request('/');
    const versions = {};
    const paths = {};
    const resources = [];

    roots.paths.forEach((path) => {
      let [base, group, version] = path.replace(/^\/+/, '').split('/');

      if ( base === 'api' ) {
        versions[base] = group;
        paths[base] = path;
      } else if ( base === 'apis' && group && version ) {
        if ( paths[group] ) {
          if ( compare(version, versions[group] ) > 0 ) {
            versions[group] = version;
            paths[group] = path;
          }
        } else {
          versions[group] = version;
          paths[group] = path;
        }
      }
    });

    await eachLimit(Object.keys(paths), 4, (group) => {
      return fetch.request(paths[group]).then((result) => {
        result.resources.forEach((res) => {
          // Skip subresources
          if ( res.name.includes('/') ) {
            return;
          }

          res.basePath = `${ paths[group] }/${ res.name }`
          if ( res.namespaced ) {
            res.namespacedPath = `${ paths[group] }/namespaces/%NAMESPACE%/${ res.name }`;
          }
          res.group = group;
          res.groupVersion = versions[group];
          resources.push(store.createRecord('resource', res));
        });
      });
    });

    const definitions = {};
    let schemas = await fetch.request('/openapi/v2');

    if ( typeof schemas === 'string' ) {
      schemas = JSON.parse(schemas);
    }

    Object.keys(schemas.definitions).forEach((key) => {
      const obj = store.createRecord('definition', schemas.definitions[key]);

      obj.setKey(key);
      definitions[key] = obj;
    });

    set(this, 'definitions.all', definitions);

    const namespaceResource = resources.filterBy('name', 'namespaces').filterBy('group', 'api')[0];
    const list = await fetch.request(namespaceResource.basePath);
    const namespaces = list.items.map((x) => store.createRecord('namespace', x));

    set(this, 'namespaces.all', namespaces);

    return {
      resources: resources.sortBy('name'),
    }
  },
});
