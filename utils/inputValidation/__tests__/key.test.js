const keyValidator = require('../key');
const { getLongKey } = require('../../testWrapper/index');

describe('key validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined key, key must be a non-empty string.';

    const result = keyValidator(null, 'key');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'you passed an empty string, key must be a non-empty string.';

    const result = keyValidator('', 'key');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on trim', async () => {
    const expected = 'you passed an empty string, key must be a non-empty string.';

    const result = keyValidator('   ', 'key');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when key is too long', async () => {
    let keyInput = getLongKey();
    const expected = 'key too long, key must be 250 characters or less.';

    const result = keyValidator(keyInput, 'key');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = keyValidator('key', 'key');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'key');
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when ok and should trim', async () => {
    const result = keyValidator('   key ', 'key');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'key');
    expect(result).not.toHaveProperty('error');
  });
});
