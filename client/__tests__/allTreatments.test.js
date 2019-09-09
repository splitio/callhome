process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, getLongKey } = require('../../utils/testWrapper/index');

describe('get-all-treatments', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"test","trafficType":"localhost"}]');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"test","trafficType":"localhost"}]')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  // Testing Input Validation.
  // The following tests are going to check null parameters, wrong types or lengths.
  test('should be 400 if keys is not passed', async (done) => {
    const expected = [
      'you passed null or undefined keys, keys must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-all-treatments')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is empty', async (done) => {
    const expected = [
      'keys must be a valid format.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is not an array', async (done) => {
    const expected = [
      'keys must be a valid format.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys={}')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is an empty array', async (done) => {
    const expected = [
      'There should be at least one matchingKey-trafficType element.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is an invalid array', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[1, 2, 3, 4]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is missing trafficType', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"my-key"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending invalid trafficType', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"my-key", "trafficType":true}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending empty trafficType', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"my-key", "trafficType":""}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is missing matchingKey', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending an invalid matchingKey', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":true,"trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending an empty matchingKey', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"","trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending an empty matchingKey when is trimmed', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"    ","trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending a long matchingKey', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-all-treatments?keys=[{"matchingKey":"${key}","trafficType":"my-tt"}]`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending an invalid bucketingKey', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"my-key", "trafficType":"my-tt", "bucketingKey":[]}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending an empty bucketingKey', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"my=key","trafficType":"my-tt", "bucketingKey":""}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending an empty bucketingKey when is trimmed', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"my-key","trafficType":"my-tt", "bucketingKey":"   "}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if keys is sending a long bucketingKey', async (done) => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-all-treatments?keys=[{"matchingKey":"my-key", "bucketingKey":"${key}","trafficType":"my-tt"}]`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is invalid', async (done) => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":12345,"trafficType":"localhost"}]&attributes=lalala')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  // Testing number convertion for matchingKey
  test('should be 200 if matching key passes a number', async (done) => {
    const expected = [{
      splitName: 'my-experiment',
      treatment: 'control',
    },{
      splitName: 'other-experiment-3',
      treatment: 'off',
    },{
      splitName: 'other-experiment',
      treatment: 'control',
    },{
      splitName: 'other-experiment-2',
      treatment: 'on',
    }];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":12345,"trafficType":"localhost"}]')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(expected));
    done();
  });

  // Testing YML evaluations
  test('should be 200 if keys is valid', async (done) => {
    const expected = [{
      splitName: 'my-experiment',
      treatment: 'on',
    },{
      splitName: 'other-experiment-3',
      treatment: 'off',
    },{
      splitName: 'other-experiment',
      treatment: 'control',
    },{
      splitName: 'other-experiment-2',
      treatment: 'on',
    }];
    const response = await request(app)
      .get('/get-all-treatments?keys=[{"matchingKey":"test","trafficType":"localhost"}]')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(expected));
    done();
  });
});