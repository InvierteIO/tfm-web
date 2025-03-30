import {Component, OnInit} from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-staff-profile-company-info',
  standalone: true,
  imports: [
  ],
  templateUrl: './staff-profile-company-info.component.html'
})
export class StaffProfileCompanyInfoComponent implements OnInit {
  form: FormGroup;
  loading:boolean = false;

  constructor(private readonly  fb: FormBuilder) {
    this.form = this.createForm();
  }
  createForm() : FormGroup {
    return this.fb.group({
      companyname: [''],
      ruc: [''],
      address: [''],
      phone: ['']
    });
  }
  ngOnInit(): void {
    this.form?.reset({});
  }
}
