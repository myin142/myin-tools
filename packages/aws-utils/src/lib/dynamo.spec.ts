import { DynamoWrapper } from './dynamo';
import { mock, MockProxy } from 'jest-mock-extended';
import { DynamoDB } from 'aws-sdk';
import { mockAWSResponsePromise } from '@myin/shared/tests';
import { toAWSAttributeMapArray } from './utils-aws';

describe('Dynamo', () => {
	let dynamoWrapper: DynamoWrapper;
	let dynamo: MockProxy<DynamoDB>;

	beforeEach(() => {
		dynamo = mock();
		dynamoWrapper = new DynamoWrapper(dynamo);
	});

	describe('Batch Get', () => {
		it('batch get items', async () => {
			dynamo.batchGetItem.mockImplementation(() =>
				mockAWSResponsePromise({ Responses: { Table: [] } })
			);
			await dynamoWrapper.batchGet('Table', [{ key: 'Value' }]);
			expect(dynamo.batchGetItem).toHaveBeenCalledWith({
				RequestItems: {
					Table: { Keys: [{ key: { S: 'Value' } }] },
				},
			});
		});

		it('batch get items return', async () => {
			dynamo.batchGetItem.mockImplementation(() =>
				mockAWSResponsePromise({ Responses: { Table: [{ data: { S: 'Data' } }] } })
			);
			const response = await dynamoWrapper.batchGet('Table', [{ key: 'Value' }]);
			expect(response).toEqual([{ data: 'Data' }]);
		});
	});

	describe('Query', () => {
		it('query key conditions', async () => {
			dynamo.query.mockImplementation(() => mockAWSResponsePromise({ Items: [] }));
			await dynamoWrapper.query('Table', 'column = :column', { column: 'Value' });
			expect(dynamo.query).toHaveBeenCalledWith({
				TableName: 'Table',
				KeyConditionExpression: 'column = :column',
				ExpressionAttributeValues: {
					':column': { S: 'Value' },
				},
			});
		});

		it('return query result', async () => {
			dynamo.query.mockImplementation(() =>
				mockAWSResponsePromise({ Items: toAWSAttributeMapArray([{ key: 'Value' }]) })
			);
			const result = await dynamoWrapper.query('Table', 'column = :column', {
				column: 'Value',
			});
			expect(result).toEqual([{ key: 'Value' }]);
		});
	});
});
