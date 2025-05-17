import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoGeneralComponent } from './project-info-general.component';

describe('ProjectInfoGeneralComponent', () => {
  let component: ProjectInfoGeneralComponent;
  let fixture: ComponentFixture<ProjectInfoGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectInfoGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectInfoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
