import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPropertyTypesComponent } from './project-property-types.component';

describe('ProjectPropertyTypesComponent', () => {
  let component: ProjectPropertyTypesComponent;
  let fixture: ComponentFixture<ProjectPropertyTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPropertyTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPropertyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
