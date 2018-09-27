import Url from '.';
import UrlError from './UrlError';

class Helper {
    static assert(url, asserts) {
        if (asserts.hasOwnProperty('asObject')) {
            expect(JSON.parse(JSON.stringify(url))).toEqual(asserts.asObject);
        }

        if (asserts.hasOwnProperty('asString')) {
            expect(String(url)).toEqual(asserts.asString);
        }
    }
}

describe('lib/Url', () => {
    it('stringifies the url with no options', () => {
        const url = new Url('http://backend/v1');

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1',
                params: {},
            },
            asString: 'http://backend/v1',
        });
    });

    it('stringifies the url with params', () => {
        const url = new Url('http://backend/v1', {
            'testString': 'value1',
        });

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1',
                params: {
                    'testString': 'value1',
                },
            },
            asString: 'http://backend/v1?testString=value1',
        });
    });

    it('encodes the url params', () => {
        const url = new Url('http://backend/v1', {
            'testString': '{}',
        });

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1',
                params: {
                    'testString': '{}',
                },
            },
            asString: 'http://backend/v1?testString=%7B%7D',
        });
    });

    it('unsafe makes url params not be encoded', () => {
        const url = new Url('http://backend/v1', {
            'testString': '{}',
        }, {unsafe: true});

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1',
                params: {
                    'testString': '{}',
                },
            },
            asString: 'http://backend/v1?testString={}',
        });
    });

    it('stringifies the url with preserialized params', () => {
        const url = new Url('http://backend/v1', 'teststring=2');

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1',
                params: {teststring: 2}
            },
            asString: 'http://backend/v1?teststring=2',
        });
    });

    it('strips keys with no values', () => {
        const url = new Url('http://backend/v1', 'teststring');

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1',
                params: {},
            },
            asString: 'http://backend/v1',
        });
    });

    it('updates url after param updated', () => {
        const url = new Url('http://backend/v1/users/:id/detail', {
            'id': '1234',
        });

        url.params.id = '5678';

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1/users/:id/detail',
                params: {
                    'id': '5678'
                },
            },
            asString: 'http://backend/v1/users/5678/detail',
        });
    });

    it('updates url after base updated', () => {
        const url = new Url('http://backend/v1/users/:id/detail', {
            'id': '1234',
        });

        url.base = 'http://frontend/v1/users/:id/detail';

        Helper.assert(url, {
            asObject: {
                base: 'http://frontend/v1/users/:id/detail',
                params: {
                    'id': '1234'
                },
            },
            asString: 'http://frontend/v1/users/1234/detail',
        });
    });

    it('stringifies the url with replacement patterns and with params', () => {
        const url = new Url('http://backend/v1/users/:id/detail', {
            'testString': 'value1',
            'id': '1234',
        });

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1/users/:id/detail',
                params: {
                    'testString': 'value1',
                    'id': '1234',
                },
            },
            asString: 'http://backend/v1/users/1234/detail?testString=value1',
        });
    });

    it('stringifies the url with multiple replacement patterns and with params', () => {
        const url = new Url('http://backend/v1/users/:userId/roles/:roleId', {
            'testString': 'value1',
            'userId': '1234',
            'roleId': '5678',
        });

        Helper.assert(url, {
            asObject: {
                base: 'http://backend/v1/users/:userId/roles/:roleId',
                params: {
                    'testString': 'value1',
                    'userId': '1234',
                    'roleId': '5678',
                },
            },
            asString: 'http://backend/v1/users/1234/roles/5678?testString=value1',
        });
    });

    it('throws an exception when there is a replacement pattern but no matching param', () => {
        expect(() => String(new Url('http://backend/v1/users/:id/detail', {}))).toThrow(
            new UrlError(
                'No replacement exists for :id in the params',
                'http://backend/v1/users/:id/detail'
            )
        );
    });

    it('parses an inline query string', () => {
        const url = new Url('http://backend/v1/users?limit=20');

        expect(url.params).toEqual({limit: 20});
    });

    it('throws an exception when there are params and an inline query string', () => {
        expect(() => String(new Url('http://backend/v1/users?limit=20', {offset: 5}))).toThrow(
            new UrlError(
                'Trying to add duplicate query param when already exists',
                'http://backend/v1/users?limit=20'
            )
        );
    });

    it('throws an exception when query string added after initialization', () => {
        const url = new Url('http://backend/v1/users', {offset: 5});
        url.base = url.base + '?invalid=true';

        expect(() => String(url)).toThrow(
            new UrlError(
                'Trying to add duplicate query param when already exists',
                'http://backend/v1/users?invalid=true'
            )
        );
    });
});
