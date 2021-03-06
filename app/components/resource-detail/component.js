import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { safeLoad } from 'js-yaml';

export default Component.extend({
  codeMirror: service(),
  fetch:      service(),
  router:     service(),

  model:      null,
  create:     null,
  edit:       null,

  editBody: null,

  resource:          alias('model.resource'),
  isAllNamespaces:   alias('model.isAllNamespaces'),
  isNamespaced:      alias('model.isNamespaced'),
  overrideNamespace: alias('model.overrideNamespace'),
  parsed:            alias('model.parsed'),
  body:              alias('model.body'),

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'editBody', get(this, 'body'));
  },

  didInsertElement() {
    const id = this.$('TEXTAREA[id]')[0].id;
    const cm = get(this, 'codeMirror').instanceFor(id);

    cm.execCommand('foldAll');
  },

  actions: {
    reload() {
      this.reload();
    },

    showEdit() {
      set(this, 'edit', true);
    },

    cancel() {
      get(this, 'router').goToPrevious();
    },

    cancelEdit() {
      set(this, 'editBody', get(this, 'body'));
      set(this, 'edit', false);
    },

    async create(cb) {
      try {
        let url, namespace;
        const resource = get(this, 'resource');

        // Strip out all the comments
        const body = get(this, 'editBody')
          .split(/\n/)
          .filter((x) => !x.startsWith('#'))
          .replace(/\s*#.*$/g, '')
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
        window.scrollTo(0, 0);
        set(this, 'errors', [e.message.message || e]);
        cb(false);
      }
    },

    async save(cb) {
      const body = get(this, 'editBody');
      const url = get(this, 'parsed.metadata.selfLink');

      try {
        await get(this, 'fetch').request(url, {
          body,
          method:  'PUT',
          headers: {
            'content-type': 'application/yaml',
          }
        });

        cb(true);
        set(this, 'body', body);
        set(this, 'edit', false);
        this.send('reload');
      } catch (e) {
        window.scrollTo(0, 0);
        set(this, 'errors', [e.message.message || e]);
        cb(false);
      }
    },

    async delete() {
      get(this, 'resource').send('promptDelete', get(this, 'parsed'), () => {
        get(this, 'router').goToParent();
      });
    }
  },

  view: computed('create', 'edit', function() {
    return !get(this, 'create') && !get(this, 'edit');
  }),
});
