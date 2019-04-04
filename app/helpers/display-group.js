import { helper } from '@ember/component/helper';

export function displayGroup([name]) {
  return (name || '').replace(/\.k8s\.io$/,'');
}

export default helper(displayGroup);
