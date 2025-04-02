import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CompanyRole } from '@core/models/company-role.model';
import { Company } from '@core/models/company.model';
import { AuthService } from '@core/services/auth.service';
import { StaffProfileService } from './staff-profile.service';
import { LoadingComponent } from "@common/components/loading.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-staff-profile-company-info',
  standalone: true,
  imports: [
    LoadingComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './staff-profile-company-info.component.html'
})
export class StaffProfileCompanyInfoComponent implements OnInit {
  form: FormGroup;
  loading:boolean = false;
  emailSession:string = "";
  loadingInfo:boolean = false;
  companyRoles:CompanyRole[] | undefined = undefined;

  constructor(private readonly  fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly staffProfileService: StaffProfileService) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.emailSession = this.authService.getEmail();
    this.companyRoles = this.authService.getCompanyRoles();
    this.loadInfoCompany();
  }

  createForm() : FormGroup {
    return this.fb.group({
      companyname: [''],
      ruc: [''],
      address: [''],
      phone: ['']
    });
  }

  public loadInfoCompany(): void {
    if(!this.companyRoles || this.companyRoles.length == 0) {
      return;
    }
    let ruc = this.companyRoles[0].taxIdentificationNumber!;

    this.staffProfileService.readInfoCompany(ruc)
    .subscribe({
      next: (company: Company) => {
        console.log(company);
        this.form?.reset({
          companyname : company.name,
          ruc: company.taxIdentificationNumber,
          address: company.address,
          phone: company.phone
        });
      },
      error: () => {
        this.loadingInfo = false;
      },
      complete: () => {
       this.loadingInfo = false;
    }})
  }
}
