import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface FormPersonalData {
  firstName: string;
  familyName: string;
  email: string;
  password: string;
  companyName: string;
  ruc: string;
  rolname: string;
  numberUsers: number;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterPersonalInfoService {
  private formPersonalDataSubject = new BehaviorSubject<FormPersonalData | null>(null);
  formData$ = this.formPersonalDataSubject.asObservable();

  setFormData(data: FormPersonalData) {
    this.formPersonalDataSubject.next(data);
  }

  getFormData() {
    return this.formPersonalDataSubject.getValue();
  }
}
