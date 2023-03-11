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

afterEach(() => jest.resetAllMocks());

describe('Error middleware: errorLogger', () => {
  test('When recieve an error, then pass the error print error information', () => {
    const { error, request, response, next } = setup();
    const loggerSpy = jest.spyOn(logger, 'error');

    errorMiddleware.errorLogger(error, request, response, next);
    
    expect(loggerSpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledWith(expect.any(String));
  });  

  test('When recieve an error, then pass the error to next error middleware', () => {
    const { error, request, response, next } = setup();

    errorMiddleware.errorLogger(error, request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });  
});

describe('Error middleware: errorResponse', () => {
  test('When recieve UNKNOWN_ROUTE error, then returns 404 status code', () => {
    const { error, request, response, next } = setup(errorCodes.UNKNOWN_ROUTE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._getStatusCode()).toBe(404);
  });

  test('When recieve UNKNOWN_ROUTE error, then returns JSON format', () => {
    const { error, request, response, next } = setup(errorCodes.UNKNOWN_ROUTE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._isJSON()).toBeTruthy();
  });

  test('When recieve UNKNOWN_ROUTE error, then returns a message', () => {
    const { error, request, response, next } = setup(errorCodes.UNKNOWN_ROUTE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._getJSONData()).toEqual({ message: expect.any(String) });
  });

  test('When recieve UNAVAILABLE_SERVICE error, then returns 503 status code', () => {
    const { error, request, response, next } = setup(errorCodes.UNAVAILABLE_SERVICE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._getStatusCode()).toBe(503);
  });

  test('When recieve UNAVAILABLE_SERVICE error, then returns JSON format', () => {
    const { error, request, response, next } = setup(errorCodes.UNAVAILABLE_SERVICE);
    errorMiddleware.errorResponse(error, request, response, next);
    expect(response._isJSON()).toBeTruthy();
  });

  test('When recieve UNAVAILABLE_SERVICE error, then returns a message', () => {
    const { error, request, response, next } = setup(errorCodes.UNAVAILABLE_SERVICE);
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