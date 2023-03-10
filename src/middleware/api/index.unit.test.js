const httpMocks = require('node-mocks-http');
const apiMiddeware = require('.');
const logger = require('../../util/logger');

const setup = () => {
  const requestConfig = {
    method: 'GET',
    url: '/random',
    body: {}
  };
  const request = httpMocks.createRequest(requestConfig);
  const response = httpMocks.createResponse();
  const next = jest.fn();
  return { requestConfig, request, response, next };
}

afterEach(() => jest.resetAllMocks());

describe('API middleware: requestLogger', () => {
  test('When request is recieved, then print request info', () => {
    const { requestConfig, request, response, next } = setup();
    const loggerSpy = jest.spyOn(logger, 'info');

    apiMiddeware.requestLogger(request, response, next);
    const { mock } = loggerSpy;
    const { calls } = mock;

    expect(loggerSpy).toHaveBeenCalledTimes(6);
    expect(calls[0][0]).toBe('-----------------------------------');
    expect(calls[1][0]).toBe('Incoming request');
    expect(calls[2]).toEqual(['Method  : ', requestConfig.method]);
    expect(calls[3]).toEqual(['Path    : ', requestConfig.url]);
    expect(calls[4]).toEqual(['Body    : ', requestConfig.body]);
    expect(calls[5]).toEqual(['DateTime: ', expect.any(String)]);
  })

  test('When request is recieved, then call to next middleware', () => {
    const { request, response, next } = setup();

    apiMiddeware.requestLogger(request, response, next);

    expect(next).toBeCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined();
  });
});

describe('API middleware: unknownRoute', () => {
  test('When request for an unknown route is recieve, then call to error middleware', () => {
    const { request, response, next } = setup();

    apiMiddeware.unknownRoute(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});