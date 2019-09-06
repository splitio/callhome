const { uniq } = require('../lang');

test('uniq', async (done) => {
  expect(uniq([])).toEqual([]);
  expect(uniq(['test'])).toEqual(['test']);
  expect(uniq(['test', 'test'])).toEqual(['test']);
  expect(uniq(['test', 'test2', 'test'])).toEqual(['test', 'test2']);
  done();
});