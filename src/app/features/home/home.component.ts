import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private readonly authService: AuthService) {     
  }

  ngOnInit(): void {
    this.authService.listUser()
    .subscribe(response => console.log(response));
  }
}
