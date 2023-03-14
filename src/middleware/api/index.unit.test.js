const httpMocks = require('node-mocks-http');
const logger = require('../../util/logger');
const apiMiddeware = require('.');
const mongoose = require('mongoose');

jest.mock('mongoose', () => ({
  connection: {
    readyState: null
  }
}));

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

afterEach(() => jest.restoreAllMocks());

describe('API middleware: requestLogger', () => {
  test('When recieve a request, then print request information', () => {
    const { requestConfig, request, response, next } = setup();
    const loggerSpy = jest.spyOn(logger, 'info');

    apiMiddeware.requestLogger(request, response, next);
    const { mock } = loggerSpy;
    const { calls } = mock; // params reciebed per call

    expect(loggerSpy).toHaveBeenCalledTimes(6);
    expect(calls[0][0]).toBe('-----------------------------------');
    expect(calls[1][0]).toBe('Incoming request');
    expect(calls[2]).toEqual(['Method  : ', requestConfig.method]);
    expect(calls[3]).toEqual(['Path    : ', requestConfig.url]);
    expect(calls[4]).toEqual(['Body    : ', requestConfig.body]);
    expect(calls[5]).toEqual(['DateTime: ', expect.any(String)]);
  })

  test('When recieve a request, then call to next middleware', () => {
    const { request, response, next } = setup();

    apiMiddeware.requestLogger(request, response, next);
    const recievedArgument = next.mock.calls[0][0];

    expect(next).toBeCalledTimes(1);
    expect(recievedArgument).toBeUndefined(); // evaluate empty props
  });
});

describe('API middleware: unknownRoute', () => {
  test('When recieve request for an unknown route, then call to error middleware', () => {
    const { request, response, next } = setup();

    apiMiddeware.unknownRoute(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('API middleware: mongooseConnection', () => {
  test('When recieve a request and database is connected, then calls to next middleware', () => {
    const { request, response, next } = setup();
    mongoose.connection.readyState = 1 // connected === 1

    apiMiddeware.mongooseConnection(request, response, next);
    const recievedARgument =  next.mock.calls[0][0];

    expect(next).toHaveBeenCalledTimes(1);
    expect(recievedARgument).toBeUndefined()
  });

  test('When recieve a request and database still not connected, then calls to error middleware', () => {
    const { request, response, next } = setup();
    mongoose.connection.readyState = 0 // disconnected !== 1
    
    apiMiddeware.mongooseConnection(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});