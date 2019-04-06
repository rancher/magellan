import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object'

import { eachLimit } from '@rancher/ember-shared/utils/promise-limit';

import { compare } from 'magellan/utils/parse-k8s-version';
import Resource from 'magellan/models/resource';
import Namespace from 'magellan/models/namespace';

export default Route.extend({
  fetch:      service(),
  namespaces: service(),

  async model() {
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
          resources.push(Resource.create(res));
        });
      });
    });

    const str = await fetch.request('/openapi/v2');
    const schemas = JSON.parse(str);

    delete schemas.paths;

    const definitionsByKind = {};
    Object.keys(schemas.definitions).forEach((id) => {
      const obj = schemas.definitions[id];
      const entries = obj['x-kubernetes-group-version-kind'];

      if ( !entries ) {
        return;
      }

      entries.forEach((entry) => {
        const key = `${ entry.group || 'api' }/${ entry.version }/${ entry.kind }`;
        definitionsByKind[key] = obj;
      });
    });

    const namespaceResource = resources.filterBy('name','namespaces').filterBy('group','api')[0];
    const list = await fetch.request(namespaceResource.basePath);
    const namespaces = list.items.map(x => Namespace.create(x));

    set(this, 'namespaces.all', namespaces);

    return {
      resources: resources.sortBy('name'),
      schemas,
      definitionsByKind
    }
  },
});
