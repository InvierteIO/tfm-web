import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPersonalInfoComponent } from './register-personal-info.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

describe('RegisterPersonalInfoComponent', () => {
  let component: RegisterPersonalInfoComponent;
  let fixture: ComponentFixture<RegisterPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterPersonalInfoComponent,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with the correct controls', () => {
    expect(component.form.contains('fullname')).toBeTrue();
    expect(component.form.contains('fullsurname')).toBeTrue();
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
    expect(component.form.contains('repeatedpwd')).toBeTrue();
    expect(component.form.contains('numbercontact')).toBeTrue();
  });

  it('should initialize the form with empty values and loading set to false', () => {
    const formValues = component.form.value;
    expect(formValues.fullname).toEqual('');
    expect(formValues.fullsurname).toEqual('');
    expect(formValues.email).toEqual('');
    expect(formValues.password).toEqual('');
    expect(formValues.repeatedpwd).toEqual('');
    expect(formValues.numbercontact).toEqual('');
    expect(component.loading).toBeFalse();
  });

  it('should be invalid if fullname is empty', () => {
    const fullnameControl = component.form.get('fullname');
    fullnameControl?.setValue('');
    fullnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(fullnameControl?.invalid).toBeTrue();
    expect(component.fullnameNotValid).toBeTrue();
  });

  it('should be invalid if fullname is too short', () => {
    const fullnameControl = component.form.get('fullname');
    fullnameControl?.setValue('A');
    fullnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(fullnameControl?.invalid).toBeTrue();
    expect(component.fullnameNotValidMinMax).toBeTrue();
  });

  it('should be invalid if fullname is too long', () => {
    const fullnameControl = component.form.get('fullname');
    fullnameControl?.setValue('A'.repeat(101));
    fullnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(fullnameControl?.invalid).toBeTrue();
    expect(component.fullnameNotValidMinMax).toBeTrue();
  });

  it('should be valid if fullname has proper length', () => {
    const fullnameControl = component.form.get('fullname');
    fullnameControl?.setValue('John');
    expect(fullnameControl?.valid).toBeTrue();
  });


  it('should be invalid if fullsurname is empty', () => {
    const fullsurnameControl = component.form.get('fullsurname');
    fullsurnameControl?.setValue('');
    fullsurnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(fullsurnameControl?.invalid).toBeTrue();
    expect(component.fullsurnameNotValid).toBeTrue();
  });

  it('should be invalid if fullsurname is too short', () => {
    const fullsurnameControl = component.form.get('fullsurname');
    fullsurnameControl?.setValue('A');
    fullsurnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(fullsurnameControl?.invalid).toBeTrue();
    expect(component.fullsurnameNotValidMinMax).toBeTrue();
  });

  it('should be invalid if fullsurname is too long', () => {
    const fullsurnameControl = component.form.get('fullsurname');
    fullsurnameControl?.setValue('A'.repeat(101));
    fullsurnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(fullsurnameControl?.invalid).toBeTrue();
    expect(component.fullsurnameNotValidMinMax).toBeTrue();
  });

  it('should be valid if fullsurname has proper length', () => {
    const fullsurnameControl = component.form.get('fullsurname');
    fullsurnameControl?.setValue('Doe');
    expect(fullsurnameControl?.valid).toBeTrue();
  });

  it('should be invalid if email is empty', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(emailControl?.invalid).toBeTrue();
    expect(component.emailNotValid).toBeTrue();
  });

  it('should be invalid if email has incorrect format', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(emailControl?.invalid).toBeTrue();
    expect(component.emailNotValidMinMaxFormat).toBeTrue();
  });

  it('should be invalid if email is too short', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('a@');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(emailControl?.invalid).toBeTrue();
    expect(component.emailNotValidMinMaxFormat).toBeTrue();
  });

  it('should be invalid if email is too long', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('a'.repeat(101) + '@example.com');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    expect(emailControl?.invalid).toBeTrue();
    expect(component.emailNotValidMinMaxFormat).toBeTrue();
  });

  it('should be valid if email has correct format and length', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should be invalid if password is empty', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    expect(passwordControl?.invalid).toBeTrue();
    expect(component.passwordNotValid).toBeTrue();
  });

  it('should be invalid if password is too short', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('123');
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    expect(passwordControl?.invalid).toBeTrue();
    expect(component.passwordNotValidMinMax).toBeTrue();
  });

  it('should be invalid if password is too long', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('a'.repeat(51));
    passwordControl?.markAsTouched();
    fixture.detectChanges();
    expect(passwordControl?.invalid).toBeTrue();
    expect(component.passwordNotValidMinMax).toBeTrue();
  });

  it('should be valid if password has correct length', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('abcd');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('repeatedpwdNotValid should be true if it does not match the password', () => {
    component.form.get('password')?.setValue('abcd');
    component.form.get('repeatedpwd')?.setValue('abce');
    fixture.detectChanges();

    expect(component.repeatedpwdNotValid).toBeTrue();
  });

  it('repeatedpwdNotValid should be false if it matches the password', () => {
    component.form.get('password')?.setValue('abcd');
    component.form.get('repeatedpwd')?.setValue('abcd');
    fixture.detectChanges();

    expect(component.repeatedpwdNotValid).toBeFalse();
  });


  it('should be invalid if numbercontact does not match 9-digit pattern', () => {
    const numbercontactControl = component.form.get('numbercontact');
    numbercontactControl?.setValue('12345');
    numbercontactControl?.markAsTouched();
    fixture.detectChanges();
    expect(numbercontactControl?.invalid).toBeTrue();
    expect(component.numbercontactNotValid).toBeTrue();
  });

  it('should be valid if numbercontact matches 9-digit pattern', () => {
    const numbercontactControl = component.form.get('numbercontact');
    numbercontactControl?.setValue('123456789');
    expect(numbercontactControl?.valid).toBeTrue();
  });


  it('onSubmit() - if the form is invalid, it should log "Formulario inválido" and not set loading to true', () => {
    spyOn(console, 'log');

    component.form.get('fullname')?.setValue('');
    component.onSubmit();

    expect(component.form.invalid).toBeTrue();
    expect(console.log).toHaveBeenCalledWith('Formulario inválido');
    expect(component.loading).toBeFalse();
  });

  it('onSubmit() - if the form is valid, it should set loading to true and log values', () => {
    spyOn(console, 'log');

    component.form.get('fullname')?.setValue('John');
    component.form.get('fullsurname')?.setValue('Doe');
    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('abcd');
    component.form.get('repeatedpwd')?.setValue('abcd');

    component.onSubmit();

    expect(component.form.valid).toBeTrue();
    expect(component.loading).toBeTrue();
    expect(console.log).toHaveBeenCalledWith('Formulario válido:', component.form.value);
    expect(console.log).toHaveBeenCalledWith('fullname: John');
    expect(console.log).toHaveBeenCalledWith('fullname: Doe');
    expect(console.log).toHaveBeenCalledWith('email: test@example.com');
    expect(console.log).toHaveBeenCalledWith('password: abcd');
  });


  it('should mark nested FormGroup controls as touched if any exist', () => {
    const nestedGroup = new FormGroup({
      nestedField: new FormControl('', Validators.required)
    });

    component.form.addControl('nestedGroup', nestedGroup);
    component.onSubmit();

    expect(nestedGroup.get('nestedField')?.touched).toBeTrue();
  });

});
