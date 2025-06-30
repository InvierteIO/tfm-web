import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Router} from "@angular/router";
import {IsInvalidFieldPipe} from "@common/pipes/is-invalid-field.pipe";
import {LoadingService} from '@core/services/loading.service';
import {ProjectMock} from '../../shared/models/project.mock.model';
import {ProjectService} from '../../shared/services/project.service';
import {ProjectDraftStatus} from '../../shared/models/project-draft-status';
import {ProjectStoreService} from '../../shared/services/project-store.service';
import {Project} from "@core/models/project.model";
import {Observable, throwError, of} from "rxjs";
import { catchError, concatMap, finalize } from 'rxjs/operators';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-section-one',
  imports: [
    ReactiveFormsModule,
    FormErrorMessagesPipe,
    ButtonLoadingComponent,
    NgForOf,
    NgIf,
    IsInvalidFieldPipe
  ],
  templateUrl: './section-one.component.html'
})
export class SectionOneComponent  implements OnInit  {
  public form: FormGroup;
  loading:boolean = false;
  public project: ProjectMock = {  };
  public projectDraftStatus:ProjectDraftStatus = ProjectDraftStatus.NEW;
  public taxIdentificationNumber? : string = "";

  constructor(private readonly  router: Router,
              private readonly fb: FormBuilder,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService,
              private readonly authService: AuthService,
              protected readonly projectStore: ProjectStoreService) {
    this.taxIdentificationNumber = this.authService.getTexIdentificationNumber();
    this.form = this.buildForm();
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
    this.projectDraftStatus  = this.projectStore.draftStatus();
  }

  ngOnInit(): void {
    if(this.projectDraftStatus == ProjectDraftStatus.VIEW){
      this.form.disable({ emitEvent: false });
    }
    setTimeout(() => {
      this.loadData();
    }, 0);
  }

  public goToProjects(): void {
    this.router.navigate([`/public/home/projects`]);
  }

  public next(): void {
    if(this.projectDraftStatus == ProjectDraftStatus.VIEW) {
        this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/section2`, { state: { project: this.project } }]);
    }

    console.log(this.form);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    console.log(this.form.value);
    this.loadingService.show();

    this.projectService.createDraft(this.captureData(), this.taxIdentificationNumber!)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (project: ProjectMock) => {
          this.project = project;
          this.projectStore.setProjectId(this.project.id!);
          console.log('Project draft successfully:', this.project);
          this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/section2`],
          {state: {project: this.project}});
        },
        error: (err : string) => {
          console.error('Error during project creation:', err);
        }
      });
  }


  private buildForm(): FormGroup {
    return this.fb.group({
      project_name: ['', [Validators.required, Validators.minLength(3) , Validators.maxLength(100)]],
      office_address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      office_number: ['', [Validators.maxLength(6)]],
      supervisor: ['', [Validators.minLength(3), Validators.maxLength(200)]],
      stages: ['', [Validators.required,  Validators.min(1), Validators.max(5), Validators.pattern('^[1-5]$')]]
    });
  }

  private captureData(): ProjectMock {
    return {
      ...this.project,
      name: this.form.get('project_name')!.value,
      officeAddress: this.form.get('office_address')!.value,
      description: this.form.get('description')!.value,
      officeNumber: this.form.get('office_number')!.value,
      supervisor: this.form.get('supervisor')!.value,
      stages: this.form.get('stages')!.value,
      taxIdentificationNumber: this.taxIdentificationNumber!
    } as ProjectMock;
  }

  private loadData(): void {
    this.loadingService.show();
    this.projectService.readDraft(this.taxIdentificationNumber!, this.project)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((projectDraft ) => {
        if(projectDraft) {
          this.project = projectDraft;
          this.resetForm();
        }
    });
  }

  private resetForm(): void {
    this.form?.reset({
      project_name : this.project?.name,
      office_address:  this.project?.officeAddress,
      description:  this.project?.description,
      office_number:  this.project?.officeNumber,
      supervisor:  this.project?.supervisor,
      stages:  this.project?.stages
    });
  }
}
