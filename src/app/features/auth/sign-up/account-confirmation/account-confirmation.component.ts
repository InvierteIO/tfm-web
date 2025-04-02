import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountConfirmationService } from './account-confirmation.service'
import {AuthLayoutComponent} from '../../shared/components/auth-layout.component';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-account-confirmation',
  imports: [
    AuthLayoutComponent,
    NgIf
  ],
  templateUrl: './account-confirmation.component.html'
})
export class AccountConfirmationComponent implements OnInit {

  activationToken: string = '';
  activationSuccess: boolean | null = null;
  loading: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly accountConfirmationService: AccountConfirmationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.activationToken = params['token'];
      this.activateAccount();
    });
  }

  activateAccount(): void {
    this.loading = true;
    this.accountConfirmationService.activateStaffUser(this.activationToken).subscribe({
      next: () => {
        this.activationSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/public/auth/login']);
        }, 3000);
      },
      error: () => {
        this.activationSuccess = false;
        this.loading = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/public/auth/login']);
  }

}
