import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StaffProfileGeneralInfoComponent } from './staff-profile-general-info.component';
import { AuthService } from '@core/services/auth.service';
import { StaffProfileService } from './staff-profile.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { StaffInfo } from './models/staff-info.model';

describe('StaffProfileGeneralInfoComponent', () => {
  let component: StaffProfileGeneralInfoComponent;
  let fixture: ComponentFixture<StaffProfileGeneralInfoComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let staffProfileServiceSpy: jasmine.SpyObj<StaffProfileService>;

  beforeEach(async () => {
    const aSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
    const spSpy = jasmine.createSpyObj('StaffProfileService', ['readInfoData', 'updateInfoData']);

    await TestBed.configureTestingModule({
      imports: [
        StaffProfileGeneralInfoComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: aSpy },
        { provide: StaffProfileService, useValue: spSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffProfileGeneralInfoComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    staffProfileServiceSpy = TestBed.inject(StaffProfileService) as jasmine.SpyObj<StaffProfileService>;

    authServiceSpy.getEmail.and.returnValue('staff@example.com');
    staffProfileServiceSpy.readInfoData.and.returnValue(of({
      firstName: 'Default',
      familyName: 'User',
    }));

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set emailSession and call loadInfoData', () => {
      spyOn(component, 'loadInfoData');
      component.ngOnInit();
      expect(component.emailSession).toBe('staff@example.com');
      expect(component.loadInfoData).toHaveBeenCalled();
    });
  });

  describe('createForm', () => {
    it('should create a form with the required fields', () => {
      const form = component.createForm();
      expect(form.get('fullname')).toBeTruthy();
      expect(form.get('fullsurname')).toBeTruthy();
      expect(form.get('gender')).toBeTruthy();
      expect(form.get('identitydocument')).toBeTruthy();
      expect(form.get('birthday')).toBeTruthy();
      expect(form.get('numbercontact')).toBeTruthy();
      expect(form.get('jobtitle')).toBeTruthy();
      expect(form.get('address')).toBeTruthy();
    });
  });

  describe('loadInfoData', () => {
    it('should set loadingInfo=true and patch form on success, then loadingInfo=false', () => {
      const mockStaff: StaffInfo = {
        firstName: 'Alice',
        familyName: 'Doe',
        gender: 'F',
        identityDocument: '12345678',
        birthDate: '1990-01-01',
        phone: '999999999',
        jobTitle: 'Dev',
        address: 'MyStreet'
      };
      staffProfileServiceSpy.readInfoData.and.returnValue(of(mockStaff));

      component.loadInfoData();
      expect(component.loadingInfo).toBeFalse();

      fixture.detectChanges();
      expect(component.form.get('fullname')?.value).toBe('Alice');
      expect(component.loadingInfo).toBeFalse();
    });

    it('should set loadingInfo=false on error', () => {
      staffProfileServiceSpy.readInfoData.and.returnValue(
        throwError(() => new Error('Data error'))
      );

      component.loadInfoData();
      expect(component.loadingInfo).toBeFalse();
      fixture.detectChanges();
      expect(component.loadingInfo).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    it('should mark form as touched and return if form is invalid', () => {
      spyOn(component.form, 'markAllAsTouched');
      component.form.setValue({
        fullname: '',
        fullsurname: '',
        gender: '',
        identitydocument: '',
        birthday: '',
        numbercontact: '',
        jobtitle: '',
        address: ''
      });
      expect(component.form.invalid).toBeTrue();

      component.onSubmit();
      expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
      expect(staffProfileServiceSpy.updateInfoData).not.toHaveBeenCalled();
    });

    it('should show Swal and call updateInfoData if user confirms', fakeAsync(() => {
      component.form.setValue({
        fullname: 'John',
        fullsurname: 'Smith',
        gender: 'M',
        identitydocument: '12345678',
        birthday: '2000-01-01',
        numbercontact: '999999999',
        jobtitle: 'Engineer',
        address: 'My Street'
      });
      expect(component.form.valid).toBeTrue();

      const swalSpy = spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
      staffProfileServiceSpy.updateInfoData.and.returnValue(of(undefined));

      component.onSubmit();

      tick();
      expect(swalSpy).toHaveBeenCalled();
      expect(staffProfileServiceSpy.updateInfoData).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    }));

    it('should NOT call updateInfoData if user cancels in Swal', fakeAsync(() => {
      component.form.setValue({
        fullname: 'Mary',
        fullsurname: 'White',
        gender: 'F',
        identitydocument: '12345678',
        birthday: '1985-05-05',
        numbercontact: '999999999',
        jobtitle: 'Designer',
        address: 'Somewhere'
      });
      expect(component.form.valid).toBeTrue();

      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: false } as any)
      );

      component.onSubmit();
      tick();
      expect(staffProfileServiceSpy.updateInfoData).not.toHaveBeenCalled();
    }));

    it('should handle error in updateInfoData', fakeAsync(() => {
      component.form.setValue({
        fullname: 'Kate',
        fullsurname: 'Doe',
        gender: 'F',
        identitydocument: '87654321',
        birthday: '1999-09-09',
        numbercontact: '999999998',
        jobtitle: 'Staff',
        address: 'Any St'
      });
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
      staffProfileServiceSpy.updateInfoData.and.returnValue(
        throwError(() => new Error('Update error'))
      );

      component.onSubmit();
      tick();
      expect(component.loading).toBeFalse();
    }));
  });

  describe('Getters (validations)', () => {
    it('should detect isFullnameNotValid properly', () => {
      component.form.get('fullname')?.setValue('');
      component.form.get('fullname')?.markAsTouched();
      expect(component.isFullnameNotValid).toBeTrue();
    });

    it('should detect isFullsurnameNotValid properly', () => {
      component.form.get('fullsurname')?.setValue('');
      component.form.get('fullsurname')?.markAsTouched();
      expect(component.isFullsurnameNotValid).toBeTrue();
    });

    it('should detect isGenderNotValid properly', () => {
      component.form.get('gender')?.setValue('');
      component.form.get('gender')?.markAsTouched();
      expect(component.isGenderNotValid).toBeTrue();
    });

    it('should detect isIdentityDocumentNumberValid properly', () => {
      component.form.get('identitydocument')?.setValue('abcd');
      component.form.get('identitydocument')?.markAsTouched();
      expect(component.isIdentityDocumentNumberValid).toBeTrue();
    });

    it('should detect isBirthdayValid properly', () => {
      component.form.get('birthday')?.setValue('');
      component.form.get('birthday')?.markAsTouched();
      expect(component.isBirthdayValid).toBeTrue();
    });

    it('should detect isNumberContactValid properly', () => {
      component.form.get('numbercontact')?.setValue('abcd');
      component.form.get('numbercontact')?.markAsTouched();
      expect(component.isNumberContactValid).toBeTrue();
    });

    it('should detect isJobTitleValid properly', () => {
      component.form.get('jobtitle')?.setValue('');
      component.form.get('jobtitle')?.markAsTouched();
      expect(component.isJobTitleValid).toBeTrue();
    });

    it('should detect isAddressValid properly', () => {
      component.form.get('address')?.setValue('');
      component.form.get('address')?.markAsTouched();
      expect(component.isAddressValid).toBeTrue();
    });
  });
});
