const httpMocks = require('node-mocks-http')
const logger = require('../../util/logger');
const errorCodes = require('../../util/errorCodes');
const errorMiddleware = require('.');

const setup = (errorCode = '') => {
  const error = new Error();
  error.code = errorCode;
  const request = httpMocks.createRequest();
  const response = httpMocks.createResponse();
  const next = jest.fn();

  return { error, request, response, next };
}


describe('Error middleware: errorResponse', () => {
  test('When recieve UNKNONWN_ROUTE error, then returns 404 status code', () => {
    const { error, request, response, next } = setup(errorCodes.UNKNOWN_ROUTE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._getStatusCode()).toBe(404);
  });

  test('When recieve UNKNONWN_ROUTE error, then returns JSON format', () => {
    const { error, request, response, next } = setup(errorCodes.UNKNOWN_ROUTE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._isJSON()).toBeTruthy();
  });

  test('When recieve UNKNONWN_ROUTE error, then returns a message', () => {
    const { error, request, response, next } = setup(errorCodes.UNKNOWN_ROUTE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._getJSONData()).toEqual({ message: expect.any(String) });
  });
  test('When recieve unhandled error, then returns 500 status code', () => {
    const { error, request, response, next } = setup();
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._getStatusCode()).toBe(500);
  });

  test('When recieve unhandled error, then returns JSON format', () => {
    const { error, request, response, next } = setup();
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._isJSON()).toBeTruthy();
  });
  
  test('When recieve unhandled error, then returns "Server Error" message', () => {
    const { error, request, response, next } = setup();
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._getJSONData()).toEqual({ message: 'Server Error' });
  });
});