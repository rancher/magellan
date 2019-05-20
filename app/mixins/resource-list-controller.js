import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    /* eslint-disable object-property-newline */
    searchText: { as: 'q', scope: 'controller' },
    sortBy:     { as: 's', scope: 'controller' },
    descending: { as: 'd', scope: 'controller' },
    group:      { as: 'g', scope: 'controller' },
    line:       { as: 'l', scope: 'controller' },
  },

  searchText:  null,
  sortBy:      'Name',
  descending:  false,
  group:       'namespace',
  line:        'wrap',
});
