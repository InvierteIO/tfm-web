import { TestBed } from '@angular/core/testing';
import { HttpService } from '@core/services/http.service';
import { of, throwError } from 'rxjs';
import { UserGeneral } from '@core/models/user-general.model';
import { EndPoints } from '@core/end-points';
import {OperatorProfileService} from './operador-profile.service';

describe('OperatorProfileService', () => {
  let service: OperatorProfileService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['error', 'successful', 'get', 'patch']);

    TestBed.configureTestingModule({
      providers: [
        OperatorProfileService,
        { provide: HttpService, useValue: spy },
      ]
    });

    service = TestBed.inject(OperatorProfileService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('readInfoData', () => {
    it('should call HttpService.get with correct URL and return an Observable<UserGeneral>', () => {
      const mockUser: UserGeneral = { firstName: 'John', familyName: 'Doe' };
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.get.and.returnValue(of(mockUser));

      service.readInfoData('test@example.com').subscribe(result => {
        expect(result).toEqual(mockUser);
      });

      expect(httpServiceSpy.get).toHaveBeenCalledWith(
        `${EndPoints.OPERATORS}/${encodeURIComponent('test@example.com')}/general-info`
      );
      expect(httpServiceSpy.error).toHaveBeenCalledWith('Hubo problemas al consultar los datos del perfil');
    });

    it('should handle error scenario (throwError)', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.get.and.returnValue(throwError(() => new Error('HTTP Error')));

      service.readInfoData('fail@example.com').subscribe({
        next: () => fail('expected an error, not a success'),
        error: (err) => {
          expect(err).toBeDefined();
          expect(err.message).toBe('HTTP Error');
        }
      });
    });
  });

  describe('updateInfoData', () => {
    it('should call HttpService.patch with correct URL and body', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.successful.and.returnValue(httpServiceSpy);
      httpServiceSpy.patch.and.returnValue(of({}));

      const mockUser: UserGeneral = { firstName: 'Mary', familyName: 'Jane' };

      service.updateInfoData('test@example.com', mockUser).subscribe(result => {
        console.log(result);
      });

      expect(httpServiceSpy.error).toHaveBeenCalledWith('Hubo problemas al consultar los datos del perfil');
      expect(httpServiceSpy.successful).toHaveBeenCalledWith('Se actualizó correctamente la información general');
      expect(httpServiceSpy.patch).toHaveBeenCalledWith(
        `${EndPoints.OPERATORS}/${encodeURIComponent('test@example.com')}/general-info`,
        mockUser
      );
    });

    it('should handle error scenario (throwError) in patch', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.successful.and.returnValue(httpServiceSpy);
      httpServiceSpy.patch.and.returnValue(throwError(() => new Error('Patch Error')));

      const mockUser: UserGeneral = { firstName: 'Error', familyName: 'Test' };

      service.updateInfoData('error@example.com', mockUser).subscribe({
        next: () => fail('expected an error'),
        error: err => {
          expect(err).toBeDefined();
          expect(err.message).toBe('Patch Error');
        }
      });
    });
  });

});
