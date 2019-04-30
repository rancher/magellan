import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

import ApplicationLoading from '@rancher/ember-shared/mixins/application-loading';
import ApplicationError from '@rancher/ember-shared/mixins/application-error';

export default Route.extend(ApplicationLoading, ApplicationError, {
  lang:        service(),

  async beforeModel() {
    await get(this, 'lang').switchLanguage();
  },
});
