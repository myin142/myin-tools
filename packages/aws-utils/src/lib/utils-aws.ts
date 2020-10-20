import { } from 'aws-sdk';
import { AttributeMap, AttributeValue } from 'aws-sdk/clients/dynamodb';

class AWSAttributeMapAdapter {
	static toAttributeValue(value: any): AttributeValue {
		if (value == null) return null;

		switch (typeof value) {
			case 'string':
				return { S: value };
			case 'number':
				return { N: `${value}` };
			case 'object':
				if (Array.isArray(value) && value.length > 0) {
					switch (typeof value[0]) {
						case 'string': return { SS: value };
						case 'number': return { NS: value.map(n => `${n}`) };
						case 'object': return { SS: value.map(s => JSON.stringify(s)) };
					}
				} else {
					return { S: JSON.stringify(value) };
				}
		}
	}

	static fromAttributeValue(value: AttributeValue): any {
		if (value == null) return null;

		const type = Object.keys(value)[0];
		switch (type) {
			case 'S':
				return this.parseOptionalObject(value[type]);
			case 'SS':
				return value[type].map(v => this.parseOptionalObject(v));
			case 'N': return parseInt(value[type]);
			case 'NS': return value[type].map(n => parseInt(n));
		}
	}

	private static parseOptionalObject(s: string): any {
		if (this.enclosedByCurlyBrackets(s) || this.enclosedBySquareBrackets(s)) {
			return JSON.parse(s);
		}
		return s;
	}

	private static enclosedBySquareBrackets(s: string): boolean {
		return s.startsWith('[') && s.endsWith(']')
	}

	private static enclosedByCurlyBrackets(s: string): boolean {
		return s.startsWith('{') && s.endsWith('}')
	}
}

export const toAWSAttributeMap = <T>(obj: T): AttributeMap => {
	if (obj == null) return null;

	const attributeMap = {};

	Object.keys(obj).forEach((key) => {
		const value = AWSAttributeMapAdapter.toAttributeValue(obj[key]);
		if (value) {
			attributeMap[key] = value;
		}
	});

	return attributeMap;
};

export const toAWSAttributeMapArray = (arr: Array<object>): AttributeMap[] => {
	return arr.map(toAWSAttributeMap);
};

export const fromAWSAttributeMap = <T>(attributeMap: AttributeMap): T => {
	if (attributeMap == null) return null;

	const result = {};

	Object.keys(attributeMap).forEach((key) => {
		const value = AWSAttributeMapAdapter.fromAttributeValue(attributeMap[key]);
		if (value) {
			result[key] = value;
		}
	});

	return result as T;
};

export const fromAWSAttributeMapArray = <T>(arr: Array<AttributeMap>): T[] => {
	return arr.map<T>(fromAWSAttributeMap);
};
