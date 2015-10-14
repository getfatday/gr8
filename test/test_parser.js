import { expect } from 'chai';
import parser from '../lib/parser';

describe('With Parser', () => {
  it('should parse all known delimiters', () => {
    const parse = parser();
    const output = {
      LastName: 'LastName',
      FirstName: 'FirstName',
      Gender: 'Gender',
      FavoriteColor: 'FavoriteColor',
      DateOfBirth: 'DateOfBirth'
    };
    expect(parse('LastName | FirstName | Gender | FavoriteColor | DateOfBirth'))
      .to.deep.equal(output);
    expect(parse('LastName, FirstName, Gender, FavoriteColor, DateOfBirth'))
      .to.deep.equal(output);
    expect(parse('LastName FirstName Gender FavoriteColor DateOfBirth'))
      .to.deep.equal(output);
    });
  it('should support unknown field mappings', () => {
    const parse = parser();
    const output = {
      LastName: 'LastName',
      FirstName: 'FirstName',
      Gender: 'Gender',
      FavoriteColor: 'FavoriteColor',
      DateOfBirth: 'DateOfBirth',
      field_5: 'City'
    };
    expect(parse('LastName | FirstName | Gender | FavoriteColor | DateOfBirth | City'))
      .to.deep.equal(output);
  });
  it('should support custom field mappings', () => {
    const fields = ['last', 'first', 'gender', 'color', 'birth'];
    const parse = parser(fields);
    const output = {
      last: 'LastName',
      first: 'FirstName',
      gender: 'Gender',
      color: 'FavoriteColor',
      birth: 'DateOfBirth'
    };
    expect(parse('LastName | FirstName | Gender | FavoriteColor | DateOfBirth'))
      .to.deep.equal(output);
  });
  it('should auto detect field types', () => {
    const fields = ['date'];
    const parse = parser(fields);

    expect(parse('1902-08-05').date).to.be.an.instanceof(Date);
  });
});
