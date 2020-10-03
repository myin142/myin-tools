import { Path } from './path';


describe('Path', () => {

	describe('Join', () => {
		it('join single value', () => {
			expect(Path.join('/path/')).toEqual('/path/');
		});

		it('join multiple values', () => {
			expect(Path.join('path', 'sub', 'dir')).toEqual('path/sub/dir');
		});

		it('join with all slashes', () => {
			expect(Path.join('/path/', '/sub/')).toEqual('/path/sub/');
		});

		it('join with undefined', () => {
			expect(Path.join('/path/', undefined, null)).toEqual('/path/');
		});

		it('keep starting slash', () => {
			expect(Path.join('/path', 'sub')).toEqual('/path/sub');
		});

		it('keep ending slash', () => {
			expect(Path.join('path', 'sub/')).toEqual('path/sub/');
		});
	});

	describe('Query', () => {
		it('create single query param', () => {
			expect(Path.query({ param: 'Value' })).toEqual('param=Value');
		});

		it('create multiple query param', () => {
			expect(
				Path.query({
					param1: 'Value1',
					param2: 'Value2',
				})
			).toEqual('param1=Value1&param2=Value2');
		});

		it('create empty if undefined', () => {
			expect(Path.query(null)).toEqual('');
		});

		it('create empty if empty object', () => {
			expect(Path.query({})).toEqual('');
		});
	});
});