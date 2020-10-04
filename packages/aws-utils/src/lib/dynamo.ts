import { DynamoDB } from 'aws-sdk';
import { ExpressionAttributeValueMap, ItemList } from 'aws-sdk/clients/dynamodb';
import { chunk } from 'lodash';
import { fromAWSAttributeMapArray, toAWSAttributeMap, toAWSAttributeMapArray } from './utils-aws';

const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
	options['endpoint'] = 'http://localhost:8000';
}
export const dynamodb = new DynamoDB(options);

export class DynamoWrapper {
	constructor(public dynamo: DynamoDB) { }

	async batchGet<T>(table: string, keys: object[]): Promise<T[]> {
		const responses: ItemList = await Promise.all(
			chunk(keys, 100).map(async (chunk) => {
				const response = await this.dynamo
					.batchGetItem({
						RequestItems: {
							[table]: { Keys: toAWSAttributeMapArray(chunk) },
						},
					})
					.promise();

				return response.Responses[table];
			})
		);

		return fromAWSAttributeMapArray(responses.reduce((prev, curr) => prev.concat(curr), []));
	}

	async query<T>(table: string, condition: string, values: object, projection?: string): Promise<T[]> {
		const colonValues = {};
		Object.keys(values).forEach((k) => {
			const keyColon = !k.startsWith(':') ? `:${k}` : k;
			colonValues[keyColon] = values[k];
		});
		const expressionValues: ExpressionAttributeValueMap = toAWSAttributeMap(colonValues);

		const response = await this.dynamo
			.query({
				TableName: table,
				KeyConditionExpression: condition,
				ExpressionAttributeValues: expressionValues,
				ProjectionExpression: projection,
			})
			.promise();

		return fromAWSAttributeMapArray(response.Items);
	}
}
export const dynamoWrapper = new DynamoWrapper(dynamodb);

export const batchGet = <T>(table: string, keys: object[]): Promise<T[]> => {
	return dynamoWrapper.batchGet(table, keys);
};
