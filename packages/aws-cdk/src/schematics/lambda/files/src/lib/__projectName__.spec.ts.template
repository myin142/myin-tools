import { handler } from './app';

describe('Tests index', function () {

    it('verifies successful response', async () => {
        let ev, context;
        const result = await handler(ev, context)

        expect(result).toBeInstanceOf('object');
        expect(result.statusCode).toEqual(200);
        expect(result.body).toBeInstanceOf('string');

        const response = JSON.parse(result.body);

        expect(response).toBeInstanceOf('object');
        expect(response.message).toEqual('hello world');
        // expect(response.location).toBeInstanceOf('string');
    });
});
