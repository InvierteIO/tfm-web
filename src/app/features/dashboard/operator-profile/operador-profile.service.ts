import { Injectable } from '@angular/core';
import { UserGeneral } from '@core/models/user-general.model';
import { HttpService } from '@core/services/http.service';
import { Observable } from 'rxjs';
import { EndPoints } from '@core/end-points';

@Injectable({
  providedIn: 'root'
})
export class OperatorProfileService {  
  
  constructor(private readonly httpService: HttpService) {    
  }

  readInfoData(email: string): Observable<UserGeneral> {     
    return this.httpService      
      .error("Hubo problemas al consultar los datos del perfil")
      .get(`${EndPoints.OPERATORS}/${encodeURIComponent(email)}/general-info`);
  }  

  updateInfoData(email: string, userGeneral: UserGeneral): Observable<void> {     
    return this.httpService      
      .error("Hubo problemas al consultar los datos del perfil")
      .successful("Se actualizó correctamente la información general")
      .patch(`${EndPoints.OPERATORS}/${encodeURIComponent(email)}/general-info`, userGeneral);
  }  
}
