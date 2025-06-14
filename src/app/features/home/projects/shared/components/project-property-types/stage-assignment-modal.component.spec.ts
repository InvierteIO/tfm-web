import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageAssignmentModalComponent } from './stage-assignment-modal.component';

describe('StageAssignmentModalComponent', () => {
  let component: StageAssignmentModalComponent;
  let fixture: ComponentFixture<StageAssignmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageAssignmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StageAssignmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
