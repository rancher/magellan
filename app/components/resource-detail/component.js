import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { safeLoad } from 'js-yaml';

export default Component.extend({
  codeMirror: service(),
  fetch:      service(),
  router:     service(),

  resource:          null,
  isAllNamespaces:   null,
  isNamespaced:      null,
  overrideNamespace: null,
  body:              null,

  originalBody:      null,

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'originalBody', get(this, 'body'));

  },

  didInsertElement() {
    const id = this.$('TEXTAREA[id]')[0].id;
    const cm = get(this, 'codeMirror').instanceFor(id);

    cm.execCommand('foldAll');
  },

  actions: {
    cancelEdit() {
      set(this, 'body', get(this, 'originalBody'));
      set(this, 'edit', false);
    },

    async create(cb) {
      try {
        let url, namespace;
        const resource = get(this, 'resource');
        const body = get(this, 'body')
          .split(/\n/)
          .filter((x) => !x.startsWith('#'))
          .replace(/\s*#.*$/, '')
          .join('\n');
        const obj = safeLoad(body);

        if ( resource.namespaced ) {
          namespace = obj && obj.metadata && obj.metadata.namespace || 'default';
          url = resource.namespacedUrl(namespace);
        } else {
          url = resource.baseUrl();
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
