export function initialize(instance) {
  const fastboot = instance.lookup('service:fastboot');
  const shoebox = fastboot.shoebox;

  shoebox.reopen({
    remove(key) {
      if ( fastboot.isFastBoot ) {
        return;
      }

      this.set(key, undefined);

      const el = document.querySelector(`#shoebox-${key}`);
      if ( el ) {
        el.parentNode.removeChild(el);
      }
    },
  });
}

export default {
  name: 'extend-shoebox',
  initialize,
};
