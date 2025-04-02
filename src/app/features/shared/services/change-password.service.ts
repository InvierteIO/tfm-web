import { Injectable } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { HttpService } from '@core/services/http.service';
import { PasswordChange } from '../models/password-change.model';
import { EndPoints } from '@core/end-points';
import Swal from 'sweetalert2';
import { DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS } from '@common/dialogs/dialogs-swal.constants';
import { Router } from '@angular/router';
import { EMPTY, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private readonly httpService: HttpService, readonly router: Router,
    private authService: AuthService) {}

  updatePassword(email: string, passwordChange: PasswordChange): Observable<void> {
    let userType = this.authService.untilOperator() ? "operator": (this.authService.untilStaff() ? "staff": undefined);
    if (!userType) {
      Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("Ha caducado la sesion","Salir" ))
         .then((result) => this.router.navigate(['/public/auth/login']));
         return EMPTY;
    }

    return this.httpService
      .error("Hubo problemas al actualizar el password")
      .successful("Se cambió correctamente la contraseña")
      .patch(`${EndPoints.USERS}/${userType}/${encodeURIComponent(email)}/change-password`, passwordChange);
  }

}
