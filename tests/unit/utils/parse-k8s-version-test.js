import { compare } from 'magellan/utils/parse-k8s-version';
import { module, test } from 'qunit';

/* eslint-disable object-curly-newline */
/* eslint-disable object-curly-spacing */
/* eslint-disable object-property-newline */

const cases = [
  // Not really valid
  {a: 'v1foo',    b: 'v1foo',    expect: 0},
  {a: 'v1foo',    b: 'v1foo1',   expect: -1},

  // Basic equality
  {a: 'v1',       b: 'v1',       expect: 0},
  {a: 'v1alpha1', b: 'v1alpha1', expect: 0},
  {a: 'v1beta1',  b: 'v1beta1',  expect: 0},
  {a: 'v1foo1',   b: 'v1foo1',   expect: 0},

  // Basic comparison
  {a: 'v2',       b: 'v1',       expect: 1},
  {a: 'v1',       b: 'v2',       expect: -1},

  {a: 'v1',       b: 'v1alpha1', expect: 1},
  {a: 'v1alpha1', b: 'v1',       expect: -1},

  {a: 'v1',       b: 'v1beta1',  expect: 1},
  {a: 'v1beta1',  b: 'v1',       expect: -1},

  {a: 'v1beta1',  b: 'v1alpha1', expect: 1},
  {a: 'v1alpha1', b: 'v1beta1',  expect: -1},

  {a: 'v1',       b: 'v2beta1',  expect: -1},
  {a: 'v2',       b: 'v2beta1',  expect: 1},

  {a: 'v1alpha2',  b: 'v2alpha1',  expect: -1},
  {a: 'v2alpha2',  b: 'v2alpha1',  expect: 1},
  {a: 'v2alpha2',  b: 'v2alpha1',  expect: 1},
  {a: 'v2alpha2',  b: 'v2beta1',  expect: -1},
]

module('Unit | Utility | parse-k8s-version | compare', (/* hooks */) => {
  cases.forEach((c) => {
    test(`${ c.a } vs ${ c.b }`, (assert) => {
      let result = compare(c.a, c.b);

      assert.equal(result, c.expect, `${ result } is ${ c.expect }`);
    });
  });
});

