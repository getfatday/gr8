Guaranteed Rate Dev Candidate Homework
--------------------------------------

GR8 parse and sort delimited output.

*Input*

```sh
> gr8 << EOF
Horwitz | Moses  | Male | Red   | 1897-06-19
Fine    , Larry  , Male , Green , 1902-08-05
Horwitz   Jerome   Male   Blue    1903-08-22
EOF
```

*Output*

```sh
Horwitz, Moses, Male, Red, 6/18/1897
Fine, Larry, Male, Green, 8/4/1902
Horwitz, Jerome, Male, Blue, 8/21/1903
```

## Install

```sh
npm install -g getfatday/gr8
```

## Usage

```sh
gr8 [options] [file ...]
```

## Options

**-f, --fields**

Comma delimited list of field headers to user
(default: 'LastName,FirstName,Gender,FavoriteColor,DateOfBirth' )

**-d, --delimiter**

Specify delimiter for delimited format
(default: ', ' )

**-s, --sort**

Comma delimited list of field headers to sort by

**--format**

Format outputted results (`delimited` or `json`)
(default: 'delimited')

**-h, --help**

Output usage information

## Examples

Read delimited files:

```sh
> gr8 foo.txt bar.txt
```

Out files as JSON:

```sh
> gr8 --format json foo.txt bar.txt
```

Map parsed files to custom fields:

```sh
> gr8 -f last,first,gender,color,birth foo.txt bar.txt
```

Sort fields ascending by DateOfBirth, then descending by LastName

```sh
> gr8 -s DateOfBirth,-LastName foo.txt bar.txt
```

## Programmatic Usage

```js
import gr8 from 'gr8';

const options = {
  format: 'delimited',
  delimiter: ' | ',
  sort: [['FirstName', true], ['LastName', false]],
  fields: [
    'last', 'first', 'gender', 'color', 'birthday'
  ],
  parser: () => line => JSON.parse(line)
};

let stream = gr8(options);
stream.write('Horwitz | Moses  | Male | Red   | 1897-06-19');
stream.end();
```

## Run tests

```sh
npm test
```

## Challenges

Sorted by gender (females before males) then by last name ascending.

```sh
gr8 -s Gender,LastName
```

Sorted by birth date, ascending

```sh
gr8 -s DateOfBirth
```

Sorted by last name, descending

```sh
gr8 -s -LastName
```
