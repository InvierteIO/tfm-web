import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountActivationComponent } from './account-activation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonLoadingComponent } from '@common/components/button-loading.component';

describe('AccountActivationComponent', () => {
  let component: AccountActivationComponent;
  let fixture: ComponentFixture<AccountActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountActivationComponent,
        FormsModule,
        ReactiveFormsModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading set to false initially', () => {
    expect(component.loading).toBeFalse();
  });

  it('onSubmit() should set loading to true', () => {
    component.onSubmit();
    expect(component.loading).toBeTrue();
  });
});
