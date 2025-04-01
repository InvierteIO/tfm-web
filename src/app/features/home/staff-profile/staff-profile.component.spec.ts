import { TestBed, ComponentFixture } from '@angular/core/testing';
import { StaffProfileComponent } from './staff-profile.component';
import { AuthService } from '@core/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StaffProfileComponent', () => {
  let component: StaffProfileComponent;
  let fixture: ComponentFixture<StaffProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const aSpy = jasmine.createSpyObj('AuthService', [
      'getName',
      'getEmail',
      'getCompanyRoles'
    ]);

    aSpy.getName.and.returnValue('John Doe');
    aSpy.getEmail.and.returnValue('john@example.com');
    aSpy.getCompanyRoles.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [
        StaffProfileComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: aSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffProfileComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return name from AuthService', () => {
    expect(component.name).toBe('John Doe');
    expect(authServiceSpy.getName).toHaveBeenCalled();
  });

  it('should return email from AuthService', () => {
    expect(component.email).toBe('john@example.com');
    expect(authServiceSpy.getEmail).toHaveBeenCalled();
  });
});
