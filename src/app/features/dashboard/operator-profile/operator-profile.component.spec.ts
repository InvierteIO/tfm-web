import { TestBed, ComponentFixture } from '@angular/core/testing';
import { OperatorProfileComponent } from './operator-profile.component';
import { AuthService } from '@core/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OperatorProfileComponent', () => {
  let component: OperatorProfileComponent;
  let fixture: ComponentFixture<OperatorProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const aSpy = jasmine.createSpyObj('AuthService', [
      'getName',
      'getEmail'
    ]);

    aSpy.getName.and.returnValue('Operator Test');
    aSpy.getEmail.and.returnValue('operator@example.com');

    await TestBed.configureTestingModule({
      imports: [
        OperatorProfileComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: aSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorProfileComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading = false by default', () => {
    expect(component.loading).toBeFalse();
  });

  it('should return the name from AuthService', () => {
    expect(component.name).toBe('Operator Test');
    expect(authServiceSpy.getName).toHaveBeenCalled();
  });

  it('should return the email from AuthService', () => {
    expect(component.email).toBe('operator@example.com');
    expect(authServiceSpy.getEmail).toHaveBeenCalled();
  });
});
