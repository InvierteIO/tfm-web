import { Injectable } from '@angular/core';
import { UserGeneral } from '@core/models/user-general.model';
import { HttpService } from '@core/services/http.service';
import { Observable } from 'rxjs';
import { EndPoints } from '@core/end-points';
import { Staff } from '@core/models/staff.model';
import { StaffInfo } from './models/staff-info.model';
import { Company } from '@core/models/company.model';

@Injectable({
  providedIn: 'root'
})
export class StaffProfileService {  
  
  constructor(private readonly httpService: HttpService) {    
  }

  updateInfoData(email: string, staffInfo: StaffInfo): Observable<void> {     
    return this.httpService      
      .error("Hubo problemas al consultar los datos del perfil")
      .successful("Se actualizó correctamente la información general")
      .patch(`${EndPoints.STAFF}/${encodeURIComponent(email)}/general-info`, staffInfo);
  }  

  readInfoData(email: string): Observable<StaffInfo> {     
    return this.httpService      
      .error("Hubo problemas al consultar los datos del perfil")
      .get(`${EndPoints.STAFF}/${encodeURIComponent(email)}/general-info`);
  }  

  readInfoCompany(ruc: string): Observable<Company> {
    return this.httpService      
      .error("Hubo problemas al consultar los datos de la compañía")      
      .get(`${EndPoints.REAL_STATE_COMPANIES}/${ruc}/profile`);
  }

}
