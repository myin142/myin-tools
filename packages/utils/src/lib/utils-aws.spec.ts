import { toAWSAttributeMap, toSimpleAWSKeyConditionExpressions } from './utils-aws';
import { fromAWSAttributeMap } from './utils-aws';

describe('Utils AWS', () => {
    describe('To AWS AttributeMap', () => {
        it('skip null', () => {
            expect(toAWSAttributeMap(null)).toEqual(null);
        });

        it('skip null value', () => {
            expect(toAWSAttributeMap({ text: null })).toEqual({});
        });

        it('skip invalid type', () => {
            expect(toAWSAttributeMap({ text: {} })).toEqual({});
        });

        it('map string', () => {
            expect(toAWSAttributeMap({ text: 'Text' })).toEqual({
                text: { S: 'Text' },
            });
        });

        it('map number', () => {
            expect(toAWSAttributeMap({ num: 1 })).toEqual({
                num: { N: '1' },
            });
        });

        it('map string array', () => {
            expect(toAWSAttributeMap({ texts: ['hello', 'world'] })).toEqual({
                texts: { SS: ['hello', 'world'] },
            });
        });

        it('map number array', () => {
            expect(toAWSAttributeMap({ nums: [1, 2] })).toEqual({
                nums: { NS: ['1', '2'] },
            });
        });
    });

    describe('From AWS AttributeMap', () => {
        it('skip null', () => {
            expect(fromAWSAttributeMap(null)).toEqual(null);
        });

        it('skip null value', () => {
            expect(fromAWSAttributeMap({ text: null })).toEqual({});
        });

        it('skip empty', () => {
            expect(fromAWSAttributeMap({ text: {} })).toEqual({});
        });

        it('map string', () => {
            expect(fromAWSAttributeMap({ text: { S: 'Text' } })).toEqual({
                text: 'Text',
            });
        });

        it('map number', () => {
            expect(fromAWSAttributeMap({ num: { N: '1' } })).toEqual({
                num: 1,
            });
        });

        it('map string array', () => {
            expect(fromAWSAttributeMap({ texts: { SS: ['hello', 'world'] } })).toEqual({
                texts: ['hello', 'world']
            });
        });

        it('map number array', () => {
            expect(fromAWSAttributeMap({ texts: { NS: ['1', '2'] } })).toEqual({
                texts: [1, 2],
            });
        });
    });

    describe('To AWS Key Condition Expressions', () => {

        it('simple', () => {
            expect(toSimpleAWSKeyConditionExpressions({ key1: 'Value1', key2: 'Value2' })).toEqual({
                KeyConditionExpression: 'key1 = :key1, key2 = :key2',
                ExpressionAttributeValues: {
                    ':key1': { S: 'Value1' },
                    ':key2': { S: 'Value2' },
                },
            });
        });

    });

});
