import Mixin from '@ember/object/mixin';
import { get } from '@ember/object'
import { inject as service } from '@ember/service';
import { safeLoad } from 'js-yaml';

export default Mixin.create({
  fetch:  service(),
  router: service(),

  actions: {
    async save(cb) {
      try {
        let url, namespace;
        const resource = get(this, 'model.resource');
        const body = get(this, 'model.body')
          .split(/\n/)
          .filter((x) => !x.startsWith('#'))
          .replace(/\s*#.*$/, '')
          .join('\n');
        const obj = safeLoad(body);

        if ( resource.namespaced ) {
          namespace = obj && obj.metadata && obj.metadata.namespace || 'default';
          url = resource.listUrl(namespace);
        } else {
          url = resource.listUrl();
        }

        const out = await get(this, 'fetch').request(url, {
          body,
          method:  'POST',
          headers: {
            'content-type': 'application/yaml',
          }
        });

        cb(true);
        get(this, 'router').transitionTo(out.metadata.selfLink);
      } catch (e) {
        debugger;
        cb(false);
      }
    }
  },
});
