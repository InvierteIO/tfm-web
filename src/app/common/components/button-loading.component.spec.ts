import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonLoadingComponent } from './button-loading.component';

describe('ButtonLoadingComponent', () => {
  let component: ButtonLoadingComponent;
  let fixture: ComponentFixture<ButtonLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonLoadingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.type).toBe('submit');
    expect(component.btnclasses).toBe('btn button-tp');
    expect(component.loading).toBeFalse();
    expect(component.msgLoading).toBe('Cargando...');
    expect(component.msgButton).toBe('');
  });

  it('should accept new input values', () => {
    component.type = 'reset';
    component.btnclasses = 'btn custom-class';
    component.loading = true;
    component.msgLoading = 'Please wait...';
    component.msgButton = 'Submit';
    fixture.detectChanges();

    expect(component.type).toBe('reset');
    expect(component.btnclasses).toBe('btn custom-class');
    expect(component.loading).toBeTrue();
    expect(component.msgLoading).toBe('Please wait...');
    expect(component.msgButton).toBe('Submit');
  });
});
