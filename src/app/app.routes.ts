import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import {
  RegisterPersonalInfoComponent
} from './features/login/sign-up/register-personal-info/register-personal-info.component';

export const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'login'
    },
    {
        path : 'home', component: HomeComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'signup', component: RegisterPersonalInfoComponent
    }
];
