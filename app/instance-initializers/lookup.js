export function initialize(application) {
  // Shortcuts for debugging.  These should never be used in code.
  window.l = function(name) {
    return application.lookup(name);
  };

  window.lc = function(name) {
    return application.lookup(`controller:${ name }`);
  };

  window.ls = function(name) {
    return application.lookup(`service:${ name }`);
  };
}

export default {
  name: 'lookup',
  initialize,
};
