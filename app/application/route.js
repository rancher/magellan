import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { get } from '@ember/object'

import { compare } from 'magellan/utils/parse-k8s-version';
import { eachLimit } from '@rancher/ember-shared/utils/promise-limit';

export default Route.extend({
  fetch:      service(),

  async model() {
    const fetch = get(this, 'fetch');
    const roots = await fetch.request('/');
    const versions = {};
    const paths = {};
    const resources = [];

    roots.paths.forEach((path) => {
      let [base, group, version] = path.replace(/^\/+/,'').split('/');

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

    console.log('LOADING', paths, versions);

    await eachLimit(Object.keys(paths), 4, (group) => {
      return fetch.request(paths[group]).then((result) => {
        result.resources.forEach((res) => {
          // Skip subresources
          if ( res.name.includes('/') ) {
            return;
          }

          res.basePath = paths[group];
          res.group = group;
          res.groupVersion = versions[group];
          resources.push(res);
        });
      });
    });

    const str = await fetch.request('/openapi/v2');
    const schemas = JSON.parse(str);
    delete schemas.paths;

    return {
      resources: resources.sortBy('name'),
      schemas
    }
  },
});
