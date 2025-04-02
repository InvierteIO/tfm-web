import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormPersonalData } from './form-personal-data.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterPersonalInfoService {
  private formPersonalDataSubject = new BehaviorSubject<FormPersonalData | null>(null);

  setFormData(data: FormPersonalData) {
    this.formPersonalDataSubject.next(data);
  }

  getFormData() {
    return this.formPersonalDataSubject.getValue();
  }
}
