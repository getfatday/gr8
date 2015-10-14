import { expect } from 'chai';
import { application } from '../lib/api';
import api from '../lib/api';
import request from 'supertest';

const {
  records
} = require('./fixtures/records.json');
const {
  records: sorted
} = require('./fixtures/records-sorted.json');
const fields = ['lastname','name','gender','color','birthdate'];
const input = `
Horwitz, Jerome, Male, Blue, 8/22/1903
Howard, Curly, Male, Blue, 8/22/1903
Horwitz, Moses, Male, Red, 6/19/1897
Howard, Moe, Male, Red, 6/19/1897
Fine, Larry, Male, Green, 8/5/1902
Howard, Shemp, Male, Yellow, 3/11/1895
Horwitz, Samuel, Male, Yellow, 3/11/1895
White, Marjorie, Female, Purple, 6/22/1904
Guthrie, Marjorie, Female, Purple, 6/22/1904
`;

describe('With API', () => {
  it('should get all records', done => {
    let app = application({
      data: [records[0]],
      fields
    });
    app.push(records[1]);
    request(app)
      .get('/records')
      .expect('Content-Type', /json/)
      .expect(200, { records: [records[0], records[1]] }, done);
  });
  it('should raw post new records', done => {
    let app = application({ fields });
    let req = request(app).post('/records');
    req.write(new Buffer(input));
    req.expect(200, { count: 9, lastCount: 0 }, done);
  });
  it('should get sorted results', done => {
    let app = application({ fields, data: records });
    request(app)
      .get('/records/lastname,-name')
      .expect('Content-Type', /json/)
      .expect(200, { records: sorted }, done);
  });
  it('should initialize with streamed data', done => {
    let stream = api({ fields, verbose: false });
    records.forEach(record => stream.write(record));
    request(stream.app)
      .get('/records')
      .expect('Content-Type', /json/)
      .expect(200, { records: records }, function () {
        stream.end();
        stream.server.close();
        done();
      });
  });
});
