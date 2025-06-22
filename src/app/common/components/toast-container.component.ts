import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '@core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  templateUrl: './toast-container.component.html'
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
