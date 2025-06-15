import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from "@angular/router";
import {IsInvalidFieldPipe} from "@common/pipes/is-invalid-field.pipe";
import {LoadingService} from '@core/services/loading.service';
import {ProjectMock} from '../../shared/models/project.mock.model';
import {ProjectService} from '../../shared/services/project.service';
import {finalize} from 'rxjs/operators';

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

  constructor(private readonly  router: Router,
              private readonly fb: FormBuilder,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    // Simulación asíncrona de carga
    setTimeout(() => {
      this.loadData();
    }, 500);
  }


  public next(): void {
    console.log(this.form);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    console.log(this.form.value);

    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/section2']);
      this.projectService.createDraft(this.captureData())
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe(project => this.project = project);
    }, 50);
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
