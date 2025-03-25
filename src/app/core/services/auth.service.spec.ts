import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpService } from '@core/services/http.service';
import { of } from 'rxjs';
import { User } from '@core/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const fakeUser: User = {
    token: 'abc123',
    name: 'Test',
    firstName: 'Test',
    familyName: 'User',
    isActive: true
  };

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpService', ['authBasic', 'post', 'get']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: httpSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('login', () => {
    it('should call authBasic and post to return an observable of user', (done) => {
      // Simula el encadenamiento: authBasic retorna el mismo httpServiceSpy
      httpServiceSpy.authBasic.and.returnValue(httpServiceSpy);
      httpServiceSpy.post.and.returnValue(of(fakeUser));

      const mobile = 123;
      const password = 'secret';

      service.login(mobile, password).subscribe(user => {
        expect(user).toEqual(fakeUser);
        expect(httpServiceSpy.authBasic).toHaveBeenCalledWith(mobile, password);
        expect(httpServiceSpy.post).toHaveBeenCalledWith(AuthService.END_POINT);
        done();
      });
    });
  });

  describe('logout', () => {
    it('should clear user and navigate to root', async () => {
      (service as any).user = fakeUser;
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      service.logout();

      expect(service.getToken()).toBeUndefined();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('getToken', () => {
    it('should return token when user exists', () => {
      (service as any).user = fakeUser;
      expect(service.getToken()).toEqual(fakeUser.token);
    });

    it('should return undefined when user does not exist', () => {
      (service as any).user = undefined;
      expect(service.getToken()).toBeUndefined();
    });
  });

  describe('listUser', () => {
    it('should call httpService.get and return an observable of user array', (done) => {
      const fakeUserList: User[] = [fakeUser];
      httpServiceSpy.get.and.returnValue(of(fakeUserList));

      service.listUser().subscribe(users => {
        expect(users).toEqual(fakeUserList);
        expect(httpServiceSpy.get).toHaveBeenCalledWith(AuthService.END_POINT);
        done();
      });
    });
  });
});
