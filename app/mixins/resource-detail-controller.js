import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';

export default Mixin.create({
  queryParams: ['edit'],
  edit:        false,
});
