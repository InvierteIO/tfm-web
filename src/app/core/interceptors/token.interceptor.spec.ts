import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { runInInjectionContext, Injector } from '@angular/core';

import { AuthService } from '../services/auth.service';
import {tokenInterceptor} from '@core/interceptors/token.interceptor';

describe('tokenInterceptor', () => {
  let injector: Injector;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: spy }]
    });
    injector = TestBed.inject(Injector);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should add Authorization header when token exists', () => {
    authServiceSpy.getToken.and.returnValue('mytoken');

    const request = new HttpRequest('GET', '/test');

    const nextSpy = jasmine.createSpy('next').and.callFake((req: HttpRequest<any>) => req);

    runInInjectionContext(injector, () => {
      tokenInterceptor(request, nextSpy);
    });

    expect(nextSpy).toHaveBeenCalled();
    const modifiedRequest = nextSpy.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.get('Authorization')).toEqual('Bearer mytoken');
  });

  it('should not add Authorization header when token is absent', () => {
    authServiceSpy.getToken.and.returnValue(undefined);

    const request = new HttpRequest('GET', '/test');
    const nextSpy = jasmine.createSpy('next').and.callFake((req: HttpRequest<any>) => req);

    runInInjectionContext(injector, () => {
      tokenInterceptor(request, nextSpy);
    });

    expect(nextSpy).toHaveBeenCalled();
    const modifiedRequest = nextSpy.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.has('Authorization')).toBeFalse();
  });
});
