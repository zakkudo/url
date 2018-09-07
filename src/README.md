# @zakkudo/url

Make working with urls enjoyable.

[![Build Status](https://travis-ci.org/zakkudo/url.svg?branch=master)](https://travis-ci.org/zakkudo/url)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/url/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/url?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/zakkudo/url/badge.svg)](https://snyk.io/test/github/zakkudo/url)
[![Node](https://img.shields.io/node/v/@zakkudo/url.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why use this?

- Params are accepted as a separate object
- You can update the params on the fly before the string is serialized
- Supports interpolation of fragments of the url with the params
- Supports dynamic json stringification of complex options like `@zakkudo/query-string`

## Install

```console
# Install using npm
npm install @zakkudo/url
```

``` console
# Install using yarn
yarn add @zakkudo/url
```

## Examples

### Generate URL with interpolation
``` javascript
import Url from '@zakkudo/url';

const url = new Url('http://backend/v1/users/:id/detail', {
    page: 3,
    id: '1234'
});

String(url); // 'http://backend/v1/users/1234/detail?page=3'
url.toString(); // 'http://backend/v1/users/1234/detail?page=3'

//Update the params after the fact

url.param.id = '5678';

String(url); // 'http://backend/v1/users/5678/detail?page=3'

//Update the url base after the fact

url.base = 'http://frontend/v1/users/:id/detail';

String(url); // 'http://frontend/v1/users/5678/detail?page=3'
```

### Generate object using raw url
``` javascript
import Url from '@zakkudo/url';

const url = new Url('http://backend/v1/users?limit=20');

JSON.stringify(url); // {"base": "http://backend/v1/users", "params": {"limit": 20}}
```

### Error handling
``` javascript
import Url from '@zakkudo/url';
import UrlError from @zakkudo/url/UrlError;

const url = new Url('http://backend/v1/users/:userId', {});

try {
    String(url)
} catch (e) {
    if (e instanceof UrlError) {
        console.error(e.message); // `No replacement exists for userId in the params`
    }

    throw e;
}
```
