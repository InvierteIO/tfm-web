import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LoadingOverlayComponent } from '@common/components/loading-overlay.component';
import { LoadingService } from '@core/services/loading.service';
import {ToastContainerComponent} from '@common/components/toast-container.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingOverlayComponent, ToastContainerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'tfm-web';
  loading$!: Observable<boolean>;

  constructor(private readonly loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
