
const request = require('supertest');
const app = require('../../app');

describe('get-treatments', () => {
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment');
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment')
      .set('Authorization', 'invalid');
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  test('should be 400 if key is not passed', async () => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments?split-names=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if key is empty', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=&split-names=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=     &split-names=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if key is too long', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/get-treatments?key=${key}&split-names=test`)
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });


  test('should be 400 if bucketing-key is empty', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=key&bucketing-key=&split-names=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if bucketing-key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=key&bucketing-key=    &split-names=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if bucketing-key is too long', async () => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/get-treatments?key=key&bucketing-key=${key}&split-names=test`)
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-names is not passed', async () => {
    const expected = [
      'you passed a null or undefined split-names, split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-names is empty', async () => {
    const expected = [
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-names is empty trimmed', async () => {
    const expected = [
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=    ')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if there are errors in key and split-names', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=&split-names=    ')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment&attributes=lalala')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment&attributes="lalala"')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if there are multiple errors', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.',
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatments?key=     &split-names=&attributes="lalala"')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if there are multiple errors in every input', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.',
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/get-treatments?bucketing-key=${key}&key=     &split-names=&attributes="lalala"`)
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 200 if is valid attributes', async () => {
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(Object.keys(response.body.evaluation).length).toEqual(1);
    expect(response.body.evaluation).toHaveProperty('my-experiment', 'on');
  });

  test('should be 200 if auth is valid', async () => {
    const response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment,my-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(Object.keys(response.body.evaluation).length).toEqual(1);
    expect(response.body.evaluation).toHaveProperty('my-experiment', 'on');
  });

  test('should be 200 with multiple evaluation', async () => {
    let response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment,other-experiment-3,my-experiment,nonexistant-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(Object.keys(response.body.evaluation).length).toEqual(3);
    expect(response.body.evaluation).toHaveProperty('my-experiment', 'on');
    expect(response.body.evaluation).toHaveProperty('other-experiment-3', 'off');
    expect(response.body.evaluation).toHaveProperty('nonexistant-experiment', 'control');
  });
});