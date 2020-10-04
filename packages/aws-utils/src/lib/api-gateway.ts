import { APIGatewayProxyResult } from 'aws-lambda';
import { decode } from 'jsonwebtoken';

export function statusAndBody(statusCode, body): APIGatewayProxyResult {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(body),
    };
}

export function successAndBody(body = {}): APIGatewayProxyResult {
    return statusAndBody(200, body);
}

export function statusAndError(statusCode, error): APIGatewayProxyResult {
    return statusAndBody(statusCode, { error });
}

export function getSubjectFromToken(token: string): string {
    return token ? decode(token.substr(token.indexOf(' ') + 1)).sub : '';
}
