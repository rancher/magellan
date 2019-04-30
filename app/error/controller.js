import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  fastboot:     service(),
  loadingError: service(),

  isFastBoot:   alias('fastboot.isFastBoot'),
  error:        alias('loadingError.error'),
});
