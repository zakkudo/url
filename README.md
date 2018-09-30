# @zakkudo/url

Make working with urls enjoyable.

[![Build Status](https://travis-ci.org/zakkudo/url.svg?branch=master)](https://travis-ci.org/zakkudo/url)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/url/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/url?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/zakkudo/url/badge.svg)](https://snyk.io/test/github/zakkudo/url)
[![Node](https://img.shields.io/node/v/@zakkudo/url.svg)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/@zakkudo/url.svg)](https://opensource.org/licenses/BSD-3-Clause)

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

## API

<a name="module_@zakkudo/url"></a>

<a name="module_@zakkudo/url..Url"></a>

### @zakkudo/url~Url ⏏

**Kind**: Exported class

<a name="new_module_@zakkudo/url..Url_new"></a>

#### new Url(url, [params], [options])
**Throws**:

- [<code>UrlError</code>](#module_@zakkudo/url/UrlError..UrlError) On issues during serialization or construction of the url
- [<code>QueryStringError</code>](#module_@zakkudo/url/QueryStringError..QueryStringError) On issues
during serialization or construction of the query string

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | The url pattern |
| [params] | <code>Object</code> |  | Params to interpolate or append to the url as a query string when serialized. |
| [options] | <code>Object</code> |  | Modifiers for how the query string object is contructed |
| [options.unsafe] | <code>Boolean</code> | <code>false</code> | Disable url escaping of key/value pairs. Useful for servers that use unsafe characters as delimiters |

<a name="module_@zakkudo/url/UrlError"></a>

<a name="module_@zakkudo/url/UrlError..UrlError"></a>

### @zakkudo/url/UrlError~UrlError ⇐ <code>Error</code> ⏏
Error class used by Url for raising errors generated
for invalid errors.

**Kind**: Exported class

**Extends**: <code>Error</code>  

* [~UrlError](#module_@zakkudo/url/UrlError..UrlError) ⇐ <code>Error</code>
    * [new UrlError(message, url)](#new_module_@zakkudo/url/UrlError..UrlError_new)
    * [.url](#module_@zakkudo/url/UrlError..UrlError+url)

<a name="new_module_@zakkudo/url/UrlError..UrlError_new"></a>

#### new UrlError(message, url)

| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | A message describing the reason for the error. |
| url | <code>String</code> | The related url fragment when the error was generated |

<a name="module_@zakkudo/url/UrlError..UrlError+url"></a>

#### urlError.url
The related url fragment when the error was generated

**Kind**: instance property of [<code>UrlError</code>](#module_@zakkudo/url/UrlError..UrlError)  
<a name="module_@zakkudo/url/QueryStringError"></a>

<a name="module_@zakkudo/url/QueryStringError..QueryStringError"></a>

### @zakkudo/url/QueryStringError~QueryStringError ⏏
Aliased error from package `@zakkudo/query-string/QueryStringError`

**Kind**: Exported class

