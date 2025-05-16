import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffProfileCompanyInfoComponent } from './staff-profile-company-info.component';
import { AuthService } from '@core/services/auth.service';
import { StaffProfileService } from './staff-profile.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Company } from '@core/models/company.model';

describe('StaffProfileCompanyInfoComponent', () => {
  let component: StaffProfileCompanyInfoComponent;
  let fixture: ComponentFixture<StaffProfileCompanyInfoComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let staffProfileServiceSpy: jasmine.SpyObj<StaffProfileService>;

  beforeEach(async () => {
    const aSpy = jasmine.createSpyObj('AuthService', [
      'getEmail',
      'getCompanyRoles'
    ]);

    const sSpy = jasmine.createSpyObj('StaffProfileService', [
      'readInfoCompany'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        StaffProfileCompanyInfoComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: aSpy },
        { provide: StaffProfileService, useValue: sSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffProfileCompanyInfoComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    staffProfileServiceSpy = TestBed.inject(StaffProfileService) as jasmine.SpyObj<StaffProfileService>;

    authServiceSpy.getEmail.and.returnValue('staff@example.com');
    authServiceSpy.getCompanyRoles.and.returnValue([{ taxIdentificationNumber: '12345678' }]);

    staffProfileServiceSpy.readInfoCompany.and.returnValue(of({
      taxIdentificationNumber: 'defaultRuc',
      name: 'DefaultName',
      address: 'DefaultAddress',
      phone: '000000000'
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set emailSession, companyRoles and call loadInfoCompany', () => {
      expect(component.emailSession).toBe('staff@example.com');
      expect(component.companyRoles).toEqual([{ taxIdentificationNumber: '12345678' }]);
    });
  });

  describe('createForm', () => {
    it('should create a form with companyname, ruc, address, phone', () => {
      const form = component.createForm();
      expect(form.get('companyname')).toBeTruthy();
      expect(form.get('ruc')).toBeTruthy();
      expect(form.get('address_company')).toBeTruthy();
      expect(form.get('phone')).toBeTruthy();
    });
  });

  describe('loadInfoCompany', () => {
    it('should do nothing if companyRoles is empty or undefined', () => {
      authServiceSpy.getCompanyRoles.and.returnValue([]);
      component.companyRoles = [];
      fixture.detectChanges();

      const readSpy = spyOn(component, 'loadInfoCompany').and.callThrough();
      component.loadInfoCompany();

      expect(staffProfileServiceSpy.readInfoCompany).toHaveBeenCalled();
      expect(readSpy).toHaveBeenCalled();
    });

    it('should call readInfoCompany and patch the form on success', () => {
      const mockCompany: Company = {
        taxIdentificationNumber: '99999999',
        name: 'MyCorp',
        address: 'My St 123',
        phone: '987654321'
      };
      staffProfileServiceSpy.readInfoCompany.and.returnValue(of(mockCompany));

      component.loadInfoCompany();
      expect(staffProfileServiceSpy.readInfoCompany).toHaveBeenCalledWith('12345678');
      fixture.detectChanges();

      expect(component.form.get('companyname')?.value).toBe('MyCorp');
      expect(component.form.get('ruc')?.value).toBe('99999999');
      expect(component.form.get('address_company')?.value).toBe('My St 123');
      expect(component.form.get('phone')?.value).toBe('987654321');
      expect(component.loadingInfo).toBeFalse();
    });

    it('should set loadingInfo false on error', () => {
      staffProfileServiceSpy.readInfoCompany.and.returnValue(
        throwError(() => new Error('CompanyError'))
      );
      component.loadInfoCompany();
      expect(component.loadingInfo).toBeFalse();
    });
  });
});
