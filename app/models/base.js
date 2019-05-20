import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Ember from 'ember';

export default EmberObject.extend(Ember.ActionHandler, {
  modalService: service('modal'),

  canClone:      true,
  canDelete:     true,
  canBulkDelete: alias('canDelete'),

  availableActions: computed(() => {
    /*
      For custom actions not in _availableActions below, Override me and return [
        {
          enabled: true/false,    // Whether it's shown or not.  Anything other than exactly false will be shown.
          bulkable: true/false,   // If true, the action is shown in bulk actions on sortable-tables
          single: true/false,     // If exactly false, the action is not shown on individual resource actions (with bulkable=true for a bulk-only action)
          label: 'Delete',        // Label shown on hover or in menu
          icon: 'icon icon-trash',// Icon shown on screen
          action: 'promptDelete', // Action to call on the controller when clicked
          altAction: 'delete'     // Action to call on the controller when alt+clicked
          divider: true,          // Just this will make a divider
        },
        ...
      ]
    */
    return [];
  }),

  _availableActions: computed('availableActions.[]', function() {
    const out = get(this, 'availableActions').slice();

    let nextSort = 1;

    out.forEach((entry) => {
      if ( !entry.sort ) {
        entry.sort = nextSort++;
      }
    });

    out.push({
      sort:    -100,
      label:   'action.edit',
      icon:    'icon icon-edit',
      action:  'edit',
      enabled: get(this, 'canEdit'),
    });

    out.push({
      sort:    -90,
      label:   'action.clone',
      action:  'clone',
      icon:    'icon icon-copy',
      enabled: get(this, 'canClone'),
    });

    // Normal actions go here in the sort order

    out.push({
      sort:    90,
      divider: true
    });

    out.push({
      sort:      100,
      label:     'action.delete',
      icon:      'icon icon-trash',
      action:    'promptDelete',
      altAction: 'delete',
      bulkable:  true,
      enabled:   get(this, 'canDelete'),
    });

    return out.sortBy('sort');
  }),

  actions: {
    promptDelete() {
      get(this, 'modalService').toggleModal('confirm-delete', {
        escToClose: true,
        resources:  [this]
      });
    },

    clone() {
      console.log('@TODO');
    },

    edit() {
      console.log('@TODO');
    },

    delete() {
      console.log('@TODO');
    },
  },

});
