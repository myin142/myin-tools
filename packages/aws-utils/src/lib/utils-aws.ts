import { } from 'aws-sdk';
import { AttributeMap, AttributeValue } from 'aws-sdk/clients/dynamodb';

class AWSAttributeMapAdapter {
    static toAttributeValue(value: any): AttributeValue {
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
                    }
                }
        }
    }

    static fromAttributeValue(value: AttributeValue): any {
        if (value == null) return null;

        const type = Object.keys(value)[0];
        switch (type) {
            case 'S':
            case 'SS':
                return value[type];
            case 'N': return parseInt(value[type]);
            case 'NS': return value[type].map(n => parseInt(n));
        }
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
