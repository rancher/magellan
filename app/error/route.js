import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  loadingError: service(),

  redirect() {
    const err = get(this, 'loadingError.error');

    if ( !err ) {
      this.transitionTo('authed');

      return true;
    }
  }
});
