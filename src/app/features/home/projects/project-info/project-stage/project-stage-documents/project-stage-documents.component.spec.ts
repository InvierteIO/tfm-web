import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageDocumentsComponent } from './project-stage-documents.component';

describe('ProjectStageDocumentsComponent', () => {
  let component: ProjectStageDocumentsComponent;
  let fixture: ComponentFixture<ProjectStageDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStageDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStageDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
