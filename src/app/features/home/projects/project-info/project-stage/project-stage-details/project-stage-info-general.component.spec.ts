import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageInfoGeneralComponent } from './project-stage-info-general.component';

describe('ProjectStageInfoGeneralComponent', () => {
  let component: ProjectStageInfoGeneralComponent;
  let fixture: ComponentFixture<ProjectStageInfoGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStageInfoGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStageInfoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
