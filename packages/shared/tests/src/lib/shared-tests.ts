import { Request, AWSError, Response } from 'aws-sdk';
import { mock } from 'jest-mock-extended';
import { sign } from 'jsonwebtoken';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const mockAWSResponsePromise = <T>(value: T): Request<T, AWSError> => {
    const response = mock<Request<T, AWSError>>();

    response.promise.mockResolvedValueOnce({
        ...value,
        $response: mock<Response<T, AWSError>>(),
    });

    return response;
};

export const emptyGatewayEvent = (tokenPayload?: object): APIGatewayProxyEvent => {
    const ev: APIGatewayProxyEvent = {
        body: '',
        httpMethod: 'GET',
        headers: {},
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: '',
        pathParameters: {},
        queryStringParameters: {},
        requestContext: null,
        resource: '',
        stageVariables: {},
    };

    if (tokenPayload) {
        ev.headers.Authorization = `Bearer ${sign(tokenPayload, 'TEST-SECRET')}`;
    }

    return ev;
};
