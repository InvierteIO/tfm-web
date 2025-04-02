import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Membership} from './membership.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-membership-view-modal',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './membership-view-modal.component.html'
})
export class MembershipViewModalComponent implements OnInit {
  public form: FormGroup;
  @Input()
  private readonly membership: Membership = {};
  @Input()
  title: string = '';

  constructor(public readonly activeModal: NgbActiveModal,
              private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      levelname: [''],
      shortdescription: [''],
      longdescription: [''],
      monthlycost: [''],
      annualcost: [''],
      maxrealtors: [''],
      maxprojects:['']
    });
  }

  ngOnInit(): void {
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
}
