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
import {finalize} from 'rxjs/operators';
import {ProjectDraftStatus} from '../../shared/models/project-draft-status';
import {ProjectStoreService} from '../../shared/services/project-store.service';
import { SectionOneService } from './section-one.service';
import {Project} from "@core/models/project.model";
import {Observable, throwError, of} from "rxjs";
import { catchError, concatMap, finalize } from 'rxjs/operators';

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
  public project?: ProjectMock;
  public projectDraftStatus:ProjectDraftStatus = ProjectDraftStatus.NEW;

  constructor(private readonly  router: Router,
              private readonly fb: FormBuilder,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService,
              protected readonly projectStore: ProjectStoreService,
              private readonly sectionOneService: SectionOneService) {
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
    }, 500);
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
    setTimeout(() => {
      this.projectService.createDraft(this.captureData())
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe(project => this.project = project);

      this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/section2`]);
    }, 50);
    this.createProject();
  }


  private createProject(): void {
    const name = this.form.get('project_name')?.value;
    const officeAddress = this.form.get('office_address')?.value;
    const officeNumber = this.form.get('office_number')?.value;
    const supervisor = this.form.get('supervisor')?.value;
    const stages = this.form.get('stages')?.value;
    const taxIdentificationNumber = '10449080004';

    const projectDto: Project = {
      name: name,
      officeAddress: officeAddress,
      officeNumber: officeNumber,
      supervisor: supervisor,
      stages: stages
    };

    this.sectionOneService.createProject(projectDto, taxIdentificationNumber)
    .subscribe({
      next: () => {
        this.router.navigate(['/public/home/project-new/infrastructure-installation']);
      },
      error: (err) => {
        console.error('Error during project creation:', err);
      }
    });

    this.loadingService.hide();

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
      id: 10,
      name: this.form.get('project_name')!.value,
      officeAddress: this.form.get('office_address')!.value,
      description: this.form.get('description')!.value,
      officeNumber: this.form.get('office_number')!.value,
      supervisor: this.form.get('supervisor')!.value,
      stages: this.form.get('stages')!.value,
      ...this.project
    } as ProjectMock;
  }

  private loadData(): void {
    this.loadingService.show();
    this.projectService.readDraft()
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
