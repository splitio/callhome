process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');

describe('ping', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/admin/ping');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/admin/ping')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 200', async () => {
    request(app)
      .get('/admin/ping')
      .set('Authorization', 'test')
      .expect(200);
  });
});
