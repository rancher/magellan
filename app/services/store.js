import Service from '@ember/service';
import { getOwner, setOwner } from '@ember/application';

function getOwnerKey() {
  const x = {};

  setOwner(x);

  return Object.keys(x)[0];
}

const ownerKey = getOwnerKey();

export default Service.extend({
  createRecord(type, data) {
    const owner = getOwner(this);

    let cls = owner.lookup(`model:${ type }`);

    if ( !cls ) {
      cls = owner.lookup(`model:base`);
    }

    const out = cls.constructor.create(data);

    Object.defineProperty(out, ownerKey, {
      enumerable: false,
      value:      getOwner(this)
    });

    return out;
  }
});
