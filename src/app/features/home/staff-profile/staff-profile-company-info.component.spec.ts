import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffProfileCompanyInfoComponent } from './staff-profile-company-info.component';

describe('StaffProfileCompanyInfoComponent', () => {
  let component: StaffProfileCompanyInfoComponent;
  let fixture: ComponentFixture<StaffProfileCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffProfileCompanyInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffProfileCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
