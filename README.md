<a name="module_Url"></a>

## Url
Make working with urls enjoyable.

Why use this?

- Params are accepted as a separate object
- You can update the params on the fly before the string is serialized
- Supports interpolation of fragments of the url with the params
- Supports dynamic json stringification of complex options like `@zakkudo/query-string`

Install with:

```console
yarn add @zakkudo/url
```

**Throws**:

- <code>UrlError</code> On issues during serialization or construction of the url
- <code>QueryStringError</code> On issues during serialization or construction of the query string

**Example** *(Generate URL with interpolation)*  
```js
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
**Example** *(Generate object using raw url)*  
```js

const url = new Url('http://backend/v1/users?limit=20');

JSON.stringify(url); // {"base": "http://backend/v1/users", "params": {"limit": 20}}
```

* [Url](#module_Url)
    * [module.exports](#exp_module_Url--module.exports) ⏏
        * [new module.exports(url, params)](#new_module_Url--module.exports_new)
        * [.toString()](#module_Url--module.exports+toString) ⇒ <code>String</code>

<a name="exp_module_Url--module.exports"></a>

### module.exports ⏏
**Kind**: Exported class  
<a name="new_module_Url--module.exports_new"></a>

#### new module.exports(url, params)

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The url pattern |
| params | <code>Object</code> | Params to interpolate or append to the url when serialized to a string. |

<a name="module_Url--module.exports+toString"></a>

#### module.exports.toString() ⇒ <code>String</code>
Stringifies the current url settings

**Kind**: instance method of [<code>module.exports</code>](#exp_module_Url--module.exports)  
**Returns**: <code>String</code> - The string form of the url  
