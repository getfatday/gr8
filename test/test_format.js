import through from 'through2';
import { expect } from 'chai';
import { delimited, json } from '../lib/format';

describe('With format', () => {
  it('should format data to delimited output', done => {
    const stream = delimited();
    const input = {
      foo: 'bar',
      bar: 'foo',
      date: new Date(-2127322800000)
    };
    const output = 'bar, foo, 8/4/1902\n';

    stream.pipe(through.obj((chunk, enc, next) => {
      expect(chunk.toString()).to.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write(input);
    stream.end();
  });
  it('should support custom delimiters', done => {
    const stream = delimited({ delimiter: ' | '});
    const date = new Date(-2127322800000);
    const input = {
      foo: 'bar',
      bar: 'foo',
      date
    };
    const output = 'bar | foo | 8/4/1902\n';

    stream.pipe(through.obj((chunk, enc, next) => {
      expect(chunk.toString()).to.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write(input);
    stream.end();
  });
  it('should format data to JSON output', done => {
    const stream = json();
    const date = new Date(-2127322800000);
    const input = {
      foo: 'bar',
      bar: 'foo',
      date
    };
    const output = `{"foo":"bar","bar":"foo","date":"${date.toISOString()}"}\n`;

    stream.pipe(through.obj((chunk, enc, next) => {
      expect(chunk.toString()).to.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write(input);
    stream.end();
  });
});
