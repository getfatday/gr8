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

Comma delimited list of field headers to user.
(default: 'LastName,FirstName,Gender,FavoriteColor,DateOfBirth' )

**-d, --delimiter**

Specify delimiter for delimited format.
(default: ', ' )

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

## Programmatic Usage

```js
import gr8 from 'gr8';

let stream = gr8();
stream.write('Horwitz | Moses  | Male | Red   | 1897-06-19');
stream.end();
```

## Run tests

```sh
npm test
```
