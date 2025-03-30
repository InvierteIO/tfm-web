import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorProfileGeneralInfoComponent } from './operator-profile-general-info.component';

describe('OperatorProfileGeneralInfoComponent', () => {
  let component: OperatorProfileGeneralInfoComponent;
  let fixture: ComponentFixture<OperatorProfileGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorProfileGeneralInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorProfileGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
