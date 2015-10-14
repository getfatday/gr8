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

**--server**

Create an API server

**-p, --port**

Port API server should listen to
(default: `0`)

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

## API

### GET /records/{sort}

- Parameters

    - sort: `lastname,-name` (string) - Comma delimited list of field headers to sort by

- Response 200 (application/json)

        {
          "records" : [
            {
              "lastname" : "Horwitz",
              "birthdate" : "1903-08-22T10:00:00.000Z",
              "name" : "Jerome",
              "color" : "Blue",
              "gender" : "Male"
            }
          ]
        }

### POST /records

- Request (text/plain)

        Horwitz, Jerome, Male, Blue, 8/22/1903
        Howard, Curly, Male, Blue, 8/22/1903

- Response 200 (application/json)

        {
          "lastCount" : 2,
          "count" : 4
        }

## Run tests

```sh
npm test
```

## Challenges

### CLI

Sorted by gender (females before males) then by last name ascending.

```sh
gr8 -s Gender,LastName << EOF
Horwitz, Jerome, Male, Blue, 8/22/1903
Howard, Curly, Male, Blue, 8/22/1903
Horwitz, Moses, Male, Red, 6/19/1897
Howard, Moe, Male, Red, 6/19/1897
Fine, Larry, Male, Green, 8/5/1902
Howard, Shemp, Female, Yellow, 3/11/1895
Horwitz, Samuel, Female, Yellow, 3/11/1895
EOF
```

Sorted by birth date, ascending

```sh
gr8 -s DateOfBirth << EOF
Horwitz, Jerome, Male, Blue, 8/22/1903
Howard, Curly, Male, Blue, 8/22/1903
Horwitz, Moses, Male, Red, 6/19/1897
Howard, Moe, Male, Red, 6/19/1897
Fine, Larry, Male, Green, 8/5/1902
Howard, Shemp, Male, Yellow, 3/11/1895
Horwitz, Samuel, Male, Yellow, 3/11/1895
EOF
```

Sorted by last name, descending

```sh
gr8 -s -LastName << EOF
Horwitz, Jerome, Male, Blue, 8/22/1903
Howard, Curly, Male, Blue, 8/22/1903
Horwitz, Moses, Male, Red, 6/19/1897
Howard, Moe, Male, Red, 6/19/1897
Fine, Larry, Male, Green, 8/5/1902
Howard, Shemp, Male, Yellow, 3/11/1895
Horwitz, Samuel, Male, Yellow, 3/11/1895
EOF
```

### API

Initialize server

```sh
gr8 --server --port 8080 -f lastname,name,gender,color,birthdate << EOF
Horwitz, Jerome, Male, Blue, 8/22/1903
Howard, Curly, Male, Blue, 8/22/1903
Horwitz, Moses, Male, Red, 6/19/1897
Howard, Moe, Male, Red, 6/19/1897
Fine, Larry, Male, Green, 8/5/1902
Howard, Shemp, Male, Yellow, 3/11/1895
Horwitz, Samuel, Male, Yellow, 3/11/1895
EOF
```

POST /records

```sh
curl -sS -X POST --data-binary @- 0.0.0.0:8080/records << EOF
White, Marjorie, Female, Purple, 6/22/1904
Guthrie, Marjorie, Female, Purple, 6/22/1904
EOF
```

GET /records sorted by `gender`

```sh
curl 0.0.0.0:8080/records/gender
```

GET /records sorted by `birthdate`

```sh
curl 0.0.0.0:8080/records/birthdate
```

GET /records sorted by `name`

```sh
curl 0.0.0.0:8080/records/name
```
