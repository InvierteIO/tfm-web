import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Membership} from './membership.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormUtil} from '@common/utils/form.util';
import {NgIf} from '@angular/common';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {MembershipService} from './membership.service';

@Component({
  selector: 'app-membership-save-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ButtonLoadingComponent
  ],
  templateUrl: './membership-save-modal.component.html'
})
export class MembershipSaveModalComponent implements OnInit {
  public form: FormGroup;
  @Input()
  private membership: Membership = {};
  @Input()
  title: string = '';
  loading:boolean = false;

  constructor(public readonly activeModal: NgbActiveModal,
              private readonly fb: FormBuilder,
              private readonly membreshipService: MembershipService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.loadDataForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      levelname: ['', [Validators.required, Validators.maxLength(50)]],
      shortdescription: ['', [Validators.required, Validators.maxLength(255)]],
      longdescription: ['', [Validators.maxLength(2000)]],
      monthlycost: ['', [ Validators.required, Validators.pattern('^\\d{1,7}(\\.\\d{1,2})?$')]],
      annualcost: ['', [ Validators.required, Validators.pattern('^\\d{1,7}(\\.\\d{1,2})?$')]],
      maxrealtors : ['', [Validators.required, Validators.pattern('^[1-9][0-9]{0,6}$')]],
      maxprojects: ['', [Validators.required,  Validators.pattern('^[1-9][0-9]{0,6}$')]]
    });
  }

  public save(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    this.loading= true;
    if (this.membership?.id) {
      this.update();
    } else {
      this.create();
    }
  }

  private create() : void {
    this.captureData();
    this.membreshipService.create(this.membership)
      .subscribe({
        next: () => {
          this.activeModal.close("OK");
          this.cleanData();
        },
        error: (err) => {
          this.loading = false;
        }});
  }

  private loadDataForm(): void {
    this.form?.reset({
      levelname: this.membership.levelName,
      shortdescription: this.membership.shortDescription,
      longdescription: this.membership.longDescription,
      monthlycost: this.membership.monthlyCost,
      annualcost: this.membership.annualCost,
      maxrealtors: this.membership.maxRealtors,
      maxprojects: this.membership.maxProjects
    });
  }

  private update() : void {
    this.captureData();
    this.membreshipService.update(this.membership.id!, this.membership)
      .subscribe({
        next: () => {
          this.activeModal.close("OK");
          this.cleanData();
        },
        error: (err) => {
          this.loading = false;
        }});
  }

  private captureData() : void {
    this.membership.levelName = this.form?.value.levelname;
    this.membership.shortDescription = this.form?.value.shortdescription;
    this.membership.longDescription = this.form?.value.longdescription;
    this.membership.monthlyCost = this.form?.value.monthlycost;
    this.membership.annualCost = this.form?.value.annualcost;
    this.membership.maxRealtors = this.form?.value.maxrealtors;
    this.membership.maxProjects = this.form?.value.maxprojects;
  }

  private cleanData(): void {
    this.loading = false;
    this.form?.reset();
    this.membership = {};
  }
  get formCurrent() {
    return this.form?.controls;
  }

  get isFieldNotValid() {
    return (field: string) =>
      this.form?.get(field)?.invalid && this.form?.get(field)?.touched;
  }

}
