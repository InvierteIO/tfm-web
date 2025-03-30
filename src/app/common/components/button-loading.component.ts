import {Component, Input} from '@angular/core';
@Component({
  selector: 'app-button-loading',
  imports: [
  ],
  templateUrl: './button-loading.component.html',
  styleUrl: './button-loading.component.css'
})
export class ButtonLoadingComponent {
  @Input() type: string = 'submit';
  @Input() btnClasses: string = 'btn button-tp';
  @Input() iconGoogle: string | undefined = undefined;
  @Input() loading: boolean = false;
  @Input() msgLoading: string = 'Cargando...';
  @Input() msgButton: string = '';
}
