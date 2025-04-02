import { TestBed } from '@angular/core/testing';
import { StaffProfileService } from './staff-profile.service';
import { HttpService } from '@core/services/http.service';
import { of, throwError } from 'rxjs';
import { EndPoints } from '@core/end-points';
import { StaffInfo } from './models/staff-info.model';
import { Company } from '@core/models/company.model';

describe('StaffProfileService', () => {
  let service: StaffProfileService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpService', [
      'error', 'successful', 'patch', 'get'
    ]);

    TestBed.configureTestingModule({
      providers: [
        StaffProfileService,
        { provide: HttpService, useValue: httpSpy }
      ]
    });

    service = TestBed.inject(StaffProfileService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateInfoData', () => {
    it('should call patch with the correct endpoint and staffInfo', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.successful.and.returnValue(httpServiceSpy);
      httpServiceSpy.patch.and.returnValue(of(undefined));

      const mockStaff: StaffInfo = {
        firstName: 'John',
        familyName: 'Doe'
      };

      service.updateInfoData('john@example.com', mockStaff).subscribe(res => {
        expect(res).toBeUndefined();
      });

      expect(httpServiceSpy.error).toHaveBeenCalledWith('Hubo problemas al consultar los datos del perfil');
      expect(httpServiceSpy.successful).toHaveBeenCalledWith('Se actualizó correctamente la información general');
      expect(httpServiceSpy.patch).toHaveBeenCalledWith(
        `${EndPoints.STAFF}/john%40example.com/general-info`,
        mockStaff
      );
    });

    it('should handle error from patch', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.successful.and.returnValue(httpServiceSpy);
      httpServiceSpy.patch.and.returnValue(throwError(() => new Error('Patch error')));

      service.updateInfoData('fail@example.com', {} as StaffInfo).subscribe({
        next: () => fail('expected error'),
        error: err => {
          expect(err.message).toBe('Patch error');
        }
      });
    });
  });

  describe('readInfoData', () => {
    it('should call get with the correct endpoint and return StaffInfo', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      const mockStaff: StaffInfo = {
        firstName: 'Alice',
        familyName: 'Smith'
      };
      httpServiceSpy.get.and.returnValue(of(mockStaff));

      service.readInfoData('alice@example.com').subscribe(staff => {
        expect(staff).toEqual(mockStaff);
      });

      expect(httpServiceSpy.get).toHaveBeenCalledWith(
        `${EndPoints.STAFF}/alice%40example.com/general-info`
      );
      expect(httpServiceSpy.error).toHaveBeenCalledWith('Hubo problemas al consultar los datos del perfil');
    });

    it('should handle error from get', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.get.and.returnValue(throwError(() => new Error('Get error')));

      service.readInfoData('nope@example.com').subscribe({
        next: () => fail('expected error'),
        error: err => {
          expect(err.message).toBe('Get error');
        }
      });
    });
  });

  describe('readInfoCompany', () => {
    it('should call get with correct endpoint and return a Company', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      const mockCompany: Company = {
        taxIdentificationNumber: '12345678',
        name: 'Acme Inc',
        address: 'Some St 123',
        phone: '999999999'
      };
      httpServiceSpy.get.and.returnValue(of(mockCompany));

      service.readInfoCompany('12345678').subscribe(company => {
        expect(company).toEqual(mockCompany);
      });

      expect(httpServiceSpy.get).toHaveBeenCalledWith(
        `${EndPoints.REAL_STATE_COMPANIES}/12345678/profile`
      );
      expect(httpServiceSpy.error).toHaveBeenCalledWith('Hubo problemas al consultar los datos de la compañía');
    });

    it('should handle error from get in readInfoCompany', () => {
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.get.and.returnValue(throwError(() => new Error('Company error')));

      service.readInfoCompany('failCompany').subscribe({
        next: () => fail('expected error'),
        error: err => {
          expect(err.message).toBe('Company error');
        }
      });
    });
  });
});
