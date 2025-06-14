import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTypeDuplicationModalComponent } from './property-type-duplication-modal.component';

describe('PropertyTypeDuplicationModalComponent', () => {
  let component: PropertyTypeDuplicationModalComponent;
  let fixture: ComponentFixture<PropertyTypeDuplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyTypeDuplicationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyTypeDuplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
