import { HttpService } from './http.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, EMPTY, throwError } from 'rxjs';

describe('HttpService', () => {
  let service: HttpService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put', 'patch', 'delete']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    service = new HttpService(httpClientSpy, routerSpy);
  });

  describe('Chaining methods', () => {
    it('should chain param() and append parameters', () => {
      service.param('test', 'value');
      const options = (service as any).createOptions();
      expect(options.params.get('test')).toEqual('value');
    });

    it('should chain paramsFrom() and add all dto properties', () => {
      service.paramsFrom({ a: '1', b: '2' });
      const options = (service as any).createOptions();
      expect(options.params.get('a')).toEqual('1');
      expect(options.params.get('b')).toEqual('2');
    });

    it('should chain successful() and set notification', () => {
      const result = service.successful('Custom success');
      expect(result).toBe(service);

      spyOn(console, 'log');
      const fakeResponse = {
        headers: new HttpHeaders({ 'content-type': 'application/json' }),
        body: { data: 'value' }
      };
      (service as any).extractData(fakeResponse);
      expect(console.log).toHaveBeenCalledWith('Custom success');
    });

    it('should chain error() and set error notification', () => {
      const result = service.error('Custom error');
      expect(result).toBe(service);

      spyOn(console, 'error');
      const errorResponse = { status: 500, error: { error: 'TestError', message: 'Error occurred' } };
      (service as any).handleError(errorResponse);
      expect(console.error).toHaveBeenCalledWith('Custom error');
    });

    it('should chain header() and append header', () => {
      service.header('Auth', 'token');
      const options = (service as any).createOptions();
      expect(options.headers.get('Auth')).toEqual('token');
    });
  });

  describe('authBasic method', () => {
    it('should add Authorization header with Basic scheme', () => {
      const email = 'admin@admin.com';
      const password = 'secret';
      service.authBasic(email, password);
      const options = (service as any).createOptions();
      const expected = 'Basic ' + btoa(email + ':' + password);
      expect(options.headers.get('Authorization')).toEqual(expected);
    });
  });

  describe('createOptions and resetOptions', () => {
    it('should return options with current headers, params, responseType and then reset them', () => {
      service.header('Test', 'value');
      service.param('key', 'val');
      const options = (service as any).createOptions();
      expect(options.headers.get('Test')).toEqual('value');
      expect(options.params.get('key')).toEqual('val');

      const options2 = (service as any).createOptions();
      expect(options2.headers.keys().length).toEqual(0);
      expect(options2.params.keys().length).toEqual(0);
      expect(options2.responseType).toEqual('json');
      expect(options2.observe).toEqual('response');
    });
  });

  describe('extractData method', () => {
    it('should log successfulNotification and return body for JSON response', () => {
      spyOn(console, 'log');
      service.successful('Success Message');
      const fakeResponse = {
        headers: new HttpHeaders({ 'content-type': 'application/json' }),
        body: { result: 'ok' }
      };
      const data = (service as any).extractData(fakeResponse);
      expect(console.log).toHaveBeenCalledWith('Success Message');
      expect(data).toEqual({ result: 'ok' });
    });

    it('should open PDF in a new window for PDF response', () => {
      spyOn(window, 'open');
      const fakeResponse = {
        headers: new HttpHeaders({ 'content-type': 'application/pdf' }),
        body: 'pdf content'
      };
      (service as any).extractData(fakeResponse);
      expect(window.open).toHaveBeenCalled();
    });

    it('should return the full response if no content-type header is present', () => {
      const fakeResponse = {
        headers: { get: (key: string) => null },
        body: 'no content type'
      };
      const result = (service as any).extractData(fakeResponse);
      expect(result).toEqual(fakeResponse);
    });
  });

  describe('HTTP methods', () => {
    const fakeJsonResponse = {
      headers: new HttpHeaders({ 'content-type': 'application/json' }),
      body: { data: 'value' }
    };

    it('post() should return response body on success', (done) => {
      httpClientSpy.post.and.returnValue(of(fakeJsonResponse));
      service.post('testEndpoint', { dummy: true }).subscribe(result => {
        expect(result).toEqual(fakeJsonResponse.body);
        done();
      });
    });

    it('get() should return response body on success', (done) => {
      httpClientSpy.get.and.returnValue(of(fakeJsonResponse));
      service.get('testEndpoint').subscribe(result => {
        expect(result).toEqual(fakeJsonResponse.body);
        done();
      });
    });

    it('put() should return response body on success', (done) => {
      httpClientSpy.put.and.returnValue(of(fakeJsonResponse));
      service.put('testEndpoint', { dummy: true }).subscribe(result => {
        expect(result).toEqual(fakeJsonResponse.body);
        done();
      });
    });

    it('patch() should return response body on success', (done) => {
      httpClientSpy.patch.and.returnValue(of(fakeJsonResponse));
      service.patch('testEndpoint', { dummy: true }).subscribe(result => {
        expect(result).toEqual(fakeJsonResponse.body);
        done();
      });
    });

    it('delete() should return response body on success', (done) => {
      httpClientSpy.delete.and.returnValue(of(fakeJsonResponse));
      service.delete('testEndpoint').subscribe(result => {
        expect(result).toEqual(fakeJsonResponse.body);
        done();
      });
    });
  });

  describe('handleError method', () => {
    it('should handle unauthorized (401) error', (done) => {
      spyOn(console, 'error');
      routerSpy.navigate.and.returnValue(Promise.resolve(true));
      const errorResponse = { status: HttpService.UNAUTHORIZED };
      const result = (service as any).handleError(errorResponse);
      result.subscribe({
        next: () => fail('should not emit any value'),
        error: () => fail('should not error'),
        complete: () => {
          expect(console.error).toHaveBeenCalledWith('Unauthorized');
          expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
          done();
        }
      });
    });

    it('should handle connection refuse (0) error', (done) => {
      spyOn(console, 'error');
      const errorResponse = { status: HttpService.CONNECTION_REFUSE };
      const result = (service as any).handleError(errorResponse);
      result.subscribe({
        next: () => fail('should not emit any value'),
        error: () => fail('should not error'),
        complete: () => {
          expect(console.error).toHaveBeenCalledWith('Connection Refuse');
          done();
        }
      });
    });

    it('should handle error with valid error property', (done) => {
      spyOn(console, 'error');
      const errorObj = { error: 'Server Error', message: 'Something went wrong' };
      const errorResponse = { status: 500, error: errorObj };
      const result = (service as any).handleError(errorResponse);
      result.subscribe({
        next: () => fail('should not emit any value'),
        error: (err: any) => {
          expect(console.error).toHaveBeenCalledWith('Server Error (500): Something went wrong');
          expect(err).toEqual(errorObj);
          done();
        },
        complete: () => fail('should not complete')
      });
    });

    it('should handle error when error extraction fails', (done) => {
      spyOn(console, 'error');
      const errorResponse: any = { status: 500 };
      Object.defineProperty(errorResponse, 'error', {
        get: () => { throw new Error('forced error'); }
      });
      const result = (service as any).handleError(errorResponse);
      result.subscribe({
        next: () => fail('should not emit any value'),
        error: (err: any) => {
          expect(console.error).toHaveBeenCalledWith('Not response');
          expect(err.message).toEqual('forced error');
          done();
        },
        complete: () => fail('should not complete')
      });
    });
  });
});
