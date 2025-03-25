import {Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-auth-layout',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  @Input() subtitleWelcome: string = '';
}
