import { globMatch } from './regex';

describe('Regex', () => {
    describe('Glob Match', () => {
        it('match exact', () => {
            expect(globMatch('file', 'file')).toBeTruthy();
        });

        it('match with asterix', () => {
            expect(globMatch('/folder/file', '**/file')).toBeTruthy();
        });
    });
});
