import Mixin from '@ember/object/mixin';
import { get } from '@ember/object'
import { inject as service } from '@ember/service';

export default Mixin.create({
  fetch: service(),

  actions: {
    async save(cb) {
      const url = get(this, 'model.resource.basePath');
      const out = await get(this, 'fetch').request(url, {
        method: 'POST',
        data: get(this, 'model.body'),
        headers: {
          'content-type': 'application/yaml',
        }
      });

      debugger;
    }
  },
});
