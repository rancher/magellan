import Base from './base';
import { get, computed } from '@ember/object';

const Table = Base.extend({
  rowObjects: computed('headers.[]', 'rows.[]', 'object.metadata.{namespace,creationTimestamp,selfLink}', function() {
    const columns = get(this, 'headers').map((x) => x.name);
    const rows = get(this, 'rows') || [];
    const list = [];

    for ( let i = 0 ; i < rows.length ; i++ ) {
      const row = rows[i];
      const entry = {};

      for ( let j = 0 ; j < columns.length ; j++ ) {
        entry[ columns[j] ] = row.cells[j];
      }

      entry.Id = row.object.metadata.uid;
      entry.Namespace = row.object.metadata.namespace;
      entry.Created = row.object.metadata.creationTimestamp;
      entry.selfLink = row.object.metadata.selfLink;
      entry._availableActions = get(this, '_availableActions');

      list.push(entry);
    }

    return list;
  }),

  headers: computed('columnDefinitions.[]', function() {
    const out = get(this, 'columnDefinitions').map((x) => {
      let name = x.name;

      if ( name === 'Age' ) {
        name = 'Created';
      }

      const out = {
        name,
        sort: name,
      }

      switch ( name ) {
      case 'Name':
        out.linkResource = true;
        break;
      case 'Created':
        out.component = 'live-date';
        break;
      }

      return out;
    });

    return out;
  }),

  headersWithNamespace: computed('headers.[]', function() {
    const out = get(this, 'headers').slice();

    out.insertAt(1, {
      name:         'Namespace',
      sort:         'Namespace',
      linkNamespace: true,
    });

    return out;
  }),
});

export default Table;
