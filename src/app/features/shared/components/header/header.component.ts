import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS } from '@common/dialogs/dialogs-swal.constants';
import { AuthService } from '@core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private readonly router: Router, private readonly authService: AuthService) {
  }

  goProfile() {
    const isOperator : boolean = this.authService.untilOperator();
    if(isOperator) {
      this.router.navigate(['/internal/dashboard/profile']);
    } else {
      this.router.navigate(['/public/home/profile']);
    }
  }


  logout(): void {
    Swal.fire( DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Estás seguro de que deseas cerrar sesión?","Sí, salir "))
      .then((result) => {
        if (result.isConfirmed) {
          const isOperator : boolean = this.authService.untilOperator();
          this.authService.logout();
          if(isOperator) {
            this.router.navigate(['/internal/auth/login']);
          } else {
            this.router.navigate(['/public/auth/login']);
          }
        }
      });
  }
}
