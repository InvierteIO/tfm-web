import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffProfileGeneralInfoComponent } from './staff-profile-general-info.component';

describe('StaffProfileGeneralInfoComponent', () => {
  let component: StaffProfileGeneralInfoComponent;
  let fixture: ComponentFixture<StaffProfileGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffProfileGeneralInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffProfileGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
