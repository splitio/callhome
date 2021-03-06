const { isObject } = require('../');

test('isObject', done => {
  expect(isObject('test')).toBe(false);
  expect(isObject(true)).toBe(false);
  expect(isObject([])).toBe(false);
  expect(isObject(12345)).toBe(false);
  expect(isObject(() => true)).toBe(false);
  expect(isObject(JSON.parse('{"test": 1}'))).toBe(true);
  expect(isObject({})).toBe(true);
  done();
});