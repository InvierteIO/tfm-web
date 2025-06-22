import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageClientsComponent } from './project-stage-clients.component';

describe('ProjectStageClientsComponent', () => {
  let component: ProjectStageClientsComponent;
  let fixture: ComponentFixture<ProjectStageClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStageClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStageClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
