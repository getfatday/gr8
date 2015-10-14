import through from 'through2';
import { expect } from 'chai';
import { map } from '../lib';
import gr8 from '../lib';

describe('With GR8', () => {
  it('should map delimited input', done => {
    const stream = map();
    const output = {
      LastName: 'LastName',
      FirstName: 'FirstName',
      Gender: 'Gender',
      FavoriteColor: 'FavoriteColor',
      DateOfBirth: 'DateOfBirth'
    };

    stream.pipe(through.obj((data, enc, next) => {
      expect(data).to.deep.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write('LastName | FirstName | Gender | FavoriteColor | DateOfBirth\n');
    stream.write('LastName, FirstName, Gender, FavoriteColor, DateOfBirth\n');
    stream.write('LastName FirstName Gender FavoriteColor DateOfBirth');
    stream.end();
  });
  it('should support custom field mappings', done => {
    const fields = ['last', 'first', 'gender', 'color', 'birth'];
    const stream = map({ fields });
    const output = {
      last: 'LastName',
      first: 'FirstName',
      gender: 'Gender',
      color: 'FavoriteColor',
      birth: 'DateOfBirth'
    };

    stream.pipe(through.obj((data, enc, next) => {
      expect(data).to.deep.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write('LastName | FirstName | Gender | FavoriteColor | DateOfBirth');
    stream.end();
  });
  it('should support a custom parser', done => {
    const parser = () => line => JSON.parse(line);
    const stream = map({ parser });
    const output = {
      LastName: 'LastName',
      FirstName: 'FirstName',
      Gender: 'Gender',
      FavoriteColor: 'FavoriteColor',
      DateOfBirth: 'DateOfBirth'
    };

    stream.pipe(through.obj((data, enc, next) => {
      expect(data).to.deep.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write(JSON.stringify(output));
    stream.end();
  });
  it('should support delimited output', done => {
    const stream = gr8({ format: 'delimited' });
    const output = 'LastName, FirstName, Gender, FavoriteColor, DateOfBirth\n';

    stream.pipe(through.obj((chunk, enc, next) => {
      expect(chunk.toString()).to.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write(`LastName | FirstName | Gender | FavoriteColor | DateOfBirth
LastName, FirstName, Gender, FavoriteColor, DateOfBirth
LastName FirstName Gender FavoriteColor DateOfBirth`);
    stream.end();
  });
  it('should support custom delimiters', done => {
    const stream = gr8({ format: 'delimited', delimiter: ' | ' });
    const output = 'LastName | FirstName | Gender | FavoriteColor | DateOfBirth\n';

    stream.pipe(through.obj((chunk, enc, next) => {
      expect(chunk.toString()).to.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write(`LastName | FirstName | Gender | FavoriteColor | DateOfBirth
LastName, FirstName, Gender, FavoriteColor, DateOfBirth
LastName FirstName Gender FavoriteColor DateOfBirth`);
    stream.end();
  });
  it('should support JSON output', done => {
    const stream = gr8({ format: 'json' });
    const output = '{"LastName":"LastName","FirstName":"FirstName","Gender":"Gender","FavoriteColor":"FavoriteColor","DateOfBirth":"DateOfBirth"}\n';

    stream.pipe(through.obj((chunk, enc, next) => {
      expect(chunk.toString()).to.equal(output);
      next();
    }, next => {
      done();
    }));

    stream.write(`LastName | FirstName | Gender | FavoriteColor | DateOfBirth
LastName, FirstName, Gender, FavoriteColor, DateOfBirth
LastName FirstName Gender FavoriteColor DateOfBirth`);
    stream.end();
  });
  it('should sort output by field', done => {
    const stream = gr8({ sort: [['LastName', true], ['FirstName', false]]});
    const firstName = ['Larry', 'Larry', 'Moses', 'Jerome', 'Moe', 'Curly'];
    const lastName = ['Fine', 'Fine', 'Horwitz', 'Horwitz', 'Howard', 'Howard'];
    let results = {
      firstName: [],
      lastName: []
    };
    stream.pipe(through.obj((data, enc, next) => {
      results.firstName.push(data.FirstName);
      results.lastName.push(data.LastName);
      next();
    }, next => {
      expect(results.firstName).to.deep.equal(firstName);
      expect(results.lastName).to.deep.equal(lastName);
      done();
    }));

    stream.write(`Horwitz, Jerome, Male, Blue, 8/22/1903
Howard, Curly, Male, Blue, 8/22/1903
Horwitz, Moses, Male, Red, 6/19/1897
Howard, Moe, Male, Red, 6/19/1897
Fine, Larry, Male, Green, 8/5/1902
Fine, Larry, Male, Green, 8/5/1902`);
    stream.end();
  });
});
