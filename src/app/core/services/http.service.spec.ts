import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HttpService', () => {
  let service: HttpService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put', 'patch', 'delete']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        HttpService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    service = TestBed.inject(HttpService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set header and param', () => {
    const result = service.header('Test-Header', 'HeaderValue').param('k','v');
    expect(result).toBe(service);
  });

  it('should call http.post and return data', () => {
    const mockHeaders = new HttpHeaders({
      'content-type': 'application/json'
    });

    const mockHttpResponse = new HttpResponse({
      body: { success: true },
      headers: mockHeaders,
      status: 200,
      statusText: 'OK',
    });

    httpClientSpy.post.and.returnValue(of(mockHttpResponse));

    service.post('test-endpoint', { data: 'test' }).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    expect(httpClientSpy.post).toHaveBeenCalled();
  });
  it('should call http.get and return data', () => {
    const mockHeaders = new HttpHeaders({
      'content-type': 'application/json'
    });

    const mockHttpResponse = new HttpResponse({
      body: { success: true },
      headers: mockHeaders,
      status: 200,
      statusText: 'OK',
    });

    httpClientSpy.post.and.returnValue(of(mockHttpResponse));

    httpClientSpy.get.and.returnValue(of(mockHttpResponse));
    service.get('test-endpoint').subscribe(response => {
      expect(response.items).toEqual(undefined);
    });
    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should handle error 401 and navigate', () => {
    const errorResponse = { status: 401, error: { error: 'Unauthorized', message: 'Not allowed' } };
    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

    service.get('some-endpoint').subscribe({
      next: () => fail('expected an error'),
      error: err => {
        expect(err).toBeUndefined();
      }
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
  });

  it('should handle error connection refuse (status=0)', () => {
    const errorResponse = { status: 0, error: {} };
    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

    service.get('some-endpoint').subscribe({
      next: () => fail('expected an error'),
      error: err => {
        expect(err).toBeUndefined();
      }
    });
  });

  it('should handle other errors (e.g. 500)', () => {
    const errorResponse = { status: 500, error: { error: 'ServerError', message: 'something failed' } };
    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

    service.post('error-endpoint').subscribe({
      next: () => fail('expected an error'),
      error: err => {
        expect(err.error).toBe('ServerError');
        expect(err.message).toBe('something failed');
      }
    });
  });

  it('should open PDF if content-type is pdf', () => {
    const mockHeaders = new HttpHeaders({
      'content-type': 'application/pdf'
    });

    const mockHttpResponse = new HttpResponse({
      body: 'fake-pdf-content',
      headers: mockHeaders,
      status: 200,
      statusText: 'OK',
    });

    spyOn(window, 'open');
    httpClientSpy.get.and.returnValue(of(mockHttpResponse));

    service.get('pdf-endpoint').subscribe(() => {
      expect(window.open).toHaveBeenCalled();
    });
  });


  it('should do nothing if no content-type in response headers', () => {
    const mockHeaders = new HttpHeaders({
      'content-type': 'application/json'
    });

    const mockHttpResponse = new HttpResponse({
      body: { success: true },
      headers: mockHeaders,
      status: 200,
      statusText: 'OK',
    });

    httpClientSpy.post.and.returnValue(of(mockHttpResponse));
    httpClientSpy.get.and.returnValue(of(mockHttpResponse));

    service.get('no-content-type').subscribe(result => {
      expect(result).toEqual({ success: true });
    });
  });
});
