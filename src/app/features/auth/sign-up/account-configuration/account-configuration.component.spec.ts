import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountConfigurationComponent } from './account-configuration.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

describe('AccountConfigurationComponent', () => {
  let component: AccountConfigurationComponent;
  let fixture: ComponentFixture<AccountConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountConfigurationComponent,
        ReactiveFormsModule,
      ],
      providers: [        
        provideHttpClient(), 
        provideHttpClientTesting(),
      ]      
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with the correct controls', () => {
    expect(component.form.contains('companyname')).toBeTrue();
    expect(component.form.contains('ruc')).toBeTrue();
    expect(component.form.contains('rolname')).toBeTrue();
    expect(component.form.contains('numberusers')).toBeTrue();
  });

  it('should initialize the form with empty values and loading set to false', () => {
    const formValues = component.form.value;
    expect(formValues.companyname).toEqual('');
    expect(formValues.ruc).toEqual('');
    expect(formValues.rolname).toEqual('');
    expect(formValues.numberusers).toEqual('');
    expect(component.loading).toBeFalse();
  });

  // Tests for companyname field
  it('should be invalid if companyname is empty', () => {
    const companynameControl = component.form.get('companyname');
    companynameControl?.setValue('');
    companynameControl?.markAsTouched();
    fixture.detectChanges();
    expect(companynameControl?.invalid).toBeTrue();
    expect(component.companynameEmpty).toBeTrue();
  });

  it('should be invalid if companyname is too short', () => {
    const companynameControl = component.form.get('companyname');
    companynameControl?.setValue('A'); // less than 2 characters
    companynameControl?.markAsTouched();
    fixture.detectChanges();
    expect(companynameControl?.invalid).toBeTrue();
    expect(component.companynameNotValidMinMax).toBeTrue();
  });

  it('should be invalid if companyname is too long', () => {
    const companynameControl = component.form.get('companyname');
    companynameControl?.setValue('A'.repeat(151)); // more than 150 characters
    companynameControl?.markAsTouched();
    fixture.detectChanges();
    expect(companynameControl?.invalid).toBeTrue();
    expect(component.companynameNotValidMinMax).toBeTrue();
  });

  it('should be valid if companyname has proper length', () => {
    const companynameControl = component.form.get('companyname');
    companynameControl?.setValue('Valid Company');
    expect(companynameControl?.valid).toBeTrue();
  });

  // Tests for ruc field
  it('should be invalid if ruc is empty', () => {
    const rucControl = component.form.get('ruc');
    rucControl?.setValue('');
    rucControl?.markAsTouched();
    fixture.detectChanges();
    expect(rucControl?.invalid).toBeTrue();
    expect(component.rucEmpty).toBeTrue();
  });

  it('should be invalid if ruc is too short', () => {
    const rucControl = component.form.get('ruc');
    rucControl?.setValue('1234567890'); // 10 characters instead of 11
    rucControl?.markAsTouched();
    fixture.detectChanges();
    expect(rucControl?.invalid).toBeTrue();
    expect(component.rucNotValidMinMax).toBeTrue();
  });

  it('should be invalid if ruc is too long', () => {
    const rucControl = component.form.get('ruc');
    rucControl?.setValue('123456789012'); // 12 characters instead of 11
    rucControl?.markAsTouched();
    fixture.detectChanges();
    expect(rucControl?.invalid).toBeTrue();
    expect(component.rucNotValidMinMax).toBeTrue();
  });

  it('should be valid if ruc has exactly 11 characters', () => {
    const rucControl = component.form.get('ruc');
    rucControl?.setValue('12345678901');
    expect(rucControl?.valid).toBeTrue();
  });

  // Tests for rolname field
  it('should be invalid if rolname is empty', () => {
    const rolnameControl = component.form.get('rolname');
    rolnameControl?.setValue('');
    rolnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(rolnameControl?.invalid).toBeTrue();
    expect(component.rolnameEmpty).toBeTrue();
  });

  it('should be invalid if rolname is too short', () => {
    const rolnameControl = component.form.get('rolname');
    rolnameControl?.setValue('AB'); // less than 3 characters
    rolnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(rolnameControl?.invalid).toBeTrue();
    expect(component.rolnameNotValidMinMax).toBeTrue();
  });

  it('should be invalid if rolname is too long', () => {
    const rolnameControl = component.form.get('rolname');
    rolnameControl?.setValue('A'.repeat(51)); // more than 50 characters
    rolnameControl?.markAsTouched();
    fixture.detectChanges();
    expect(rolnameControl?.invalid).toBeTrue();
    expect(component.rolnameNotValidMinMax).toBeTrue();
  });

  it('should be valid if rolname has proper length', () => {
    const rolnameControl = component.form.get('rolname');
    rolnameControl?.setValue('Manager');
    expect(rolnameControl?.valid).toBeTrue();
  });

  // Tests for numberusers field
  it('should be invalid if numberusers is empty', () => {
    const numberusersControl = component.form.get('numberusers');
    numberusersControl?.setValue('');
    numberusersControl?.markAsTouched();
    fixture.detectChanges();
    expect(numberusersControl?.invalid).toBeTrue();
    expect(component.numberusersEmpty).toBeTrue();
  });

  it('should be invalid if numberusers does not match the pattern', () => {
    const numberusersControl = component.form.get('numberusers');
    numberusersControl?.setValue('0123'); // invalid: starts with 0
    numberusersControl?.markAsTouched();
    fixture.detectChanges();
    expect(numberusersControl?.invalid).toBeTrue();
    expect(component.numberusersNotValid).toBeTrue();
  });

  it('should be valid if numberusers matches the pattern', () => {
    const numberusersControl = component.form.get('numberusers');
    numberusersControl?.setValue('12345'); // valid according to the pattern
    expect(numberusersControl?.valid).toBeTrue();
  });

  // Tests for onSubmit()
  it('onSubmit() - should log "Formulario inválido" and mark controls as touched when form is invalid', () => {
    spyOn(console, 'log');
    // Make the form invalid by leaving companyname empty
    component.form.get('companyname')?.setValue('');
    component.onSubmit();
    expect(component.form.invalid).toBeTrue();
    expect(console.log).toHaveBeenCalledWith('Formulario inválido');
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
