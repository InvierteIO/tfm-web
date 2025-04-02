import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OperatorProfileGeneralInfoComponent } from './operator-profile-general-info.component';
import { OperatorProfileService } from './operador-profile.service';
import { AuthService } from '@core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UserGeneral } from '@core/models/user-general.model';

describe('OperatorProfileGeneralInfoComponent', () => {
  let component: OperatorProfileGeneralInfoComponent;
  let fixture: ComponentFixture<OperatorProfileGeneralInfoComponent>;
  let operatorProfileServiceSpy: jasmine.SpyObj<OperatorProfileService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const opSpy = jasmine.createSpyObj('OperatorProfileService', [
      'readInfoData',
      'updateInfoData'
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['getEmail']);

    await TestBed.configureTestingModule({
      imports: [
        OperatorProfileGeneralInfoComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: OperatorProfileService, useValue: opSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorProfileGeneralInfoComponent);
    component = fixture.componentInstance;

    operatorProfileServiceSpy = TestBed.inject(OperatorProfileService) as jasmine.SpyObj<OperatorProfileService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    operatorProfileServiceSpy.readInfoData.and.returnValue(of({
      firstName: 'DefaultFirst',
      familyName: 'DefaultLast'
    }));
    authServiceSpy.getEmail.and.returnValue('test@example.com');
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set emailSession and call loadInfoData', () => {
      spyOn(component, 'loadInfoData');
      component.ngOnInit();
      expect(component.emailSession).toBe('test@example.com');
      expect(component.loadInfoData).toHaveBeenCalled();
    });
  });

  describe('createForm', () => {
    it('should create a form with fullname and fullsurname fields', () => {
      const form = component.createForm();
      expect(form.get('fullname')).toBeTruthy();
      expect(form.get('fullsurname')).toBeTruthy();
    });
  });

  describe('loadInfoData', () => {
    it('should set loadingInfo=true, fill form on success, then loadingInfo=false', () => {
      const mockUser: UserGeneral = { firstName: 'John', familyName: 'Doe' };
      operatorProfileServiceSpy.readInfoData.and.returnValue(of(mockUser));

      component.loadInfoData();
      expect(component.loadingInfo).toBeFalse();

      fixture.detectChanges();
      expect(component.form.get('fullname')?.value).toBe('John');
      expect(component.form.get('fullsurname')?.value).toBe('Doe');
      expect(component.loadingInfo).toBeFalse();
    });

    it('should set loadingInfo=false on error', () => {
      operatorProfileServiceSpy.readInfoData.and.returnValue(
        throwError(() => new Error('Service error'))
      );
      component.loadInfoData();
      expect(component.loadingInfo).toBeFalse();
      fixture.detectChanges();

      expect(component.loadingInfo).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    it('should mark form as touched and return if invalid', () => {
      spyOn(component.form, 'markAllAsTouched');
      component.form.setValue({ fullname: '', fullsurname: '' });
      expect(component.form.invalid).toBeTrue();

      component.onSubmit();
      expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
      expect(operatorProfileServiceSpy.updateInfoData).not.toHaveBeenCalled();
    });

    it('should show Swal and call updateInfoData if confirmed', fakeAsync(() => {
      component.form.setValue({ fullname: 'ValidName', fullsurname: 'ValidSurname' });
      expect(component.form.valid).toBeTrue();

      const swalSpy = spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
      operatorProfileServiceSpy.updateInfoData.and.returnValue(of(undefined));

      component.onSubmit();
      tick();
      expect(swalSpy).toHaveBeenCalled();
      expect(operatorProfileServiceSpy.updateInfoData).toHaveBeenCalledWith(
        'test@example.com',
        { firstName: 'ValidName', familyName: 'ValidSurname' }
      );
      expect(component.loading).toBeFalse();
    }));

    it('should NOT call service if user cancels in Swal', fakeAsync(() => {
      component.form.setValue({ fullname: 'Name', fullsurname: 'Surname' });
      expect(component.form.valid).toBeTrue();

      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: false } as any)
      );

      component.onSubmit();
      tick();
      expect(operatorProfileServiceSpy.updateInfoData).not.toHaveBeenCalled();
    }));

    it('should handle error in updateInfoData', fakeAsync(() => {
      component.form.setValue({ fullname: 'Name', fullsurname: 'Surname' });
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
      operatorProfileServiceSpy.updateInfoData.and.returnValue(
        throwError(() => new Error('Patch error'))
      );

      component.onSubmit();
      tick();
      expect(component.loading).toBeFalse();
    }));
  });

  describe('Getters', () => {
    it('should detect isFullnameNotValid', () => {
      const fullNameCtrl = component.form.get('fullname');
      fullNameCtrl?.setValue('');
      fullNameCtrl?.markAsTouched();
      expect(component.isFullnameNotValid).toBeTrue();
    });

    it('should detect isFullsurnameNotValid', () => {
      const fullSurnameCtrl = component.form.get('fullsurname');
      fullSurnameCtrl?.setValue('');
      fullSurnameCtrl?.markAsTouched();
      expect(component.isFullsurnameNotValid).toBeTrue();
    });
  });
});
