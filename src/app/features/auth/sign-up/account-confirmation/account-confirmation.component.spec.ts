import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountConfirmationComponent } from './account-confirmation.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';


describe('AccountConfirmationComponent', () => {
  let component: AccountConfirmationComponent;
  let fixture: ComponentFixture<AccountConfirmationComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      params: of({ token: 'dummy-token' })  // Replace 'dummy-token' with whatever token is needed for your test
    };

    await TestBed.configureTestingModule({
      imports: [AccountConfirmationComponent],
      providers: [       
        {provide: ActivatedRoute, useValue: activatedRouteMock }, 
        provideHttpClient(), 
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
