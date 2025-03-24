import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  template: `<div class="spinner-border text-primary my-3" role="status"><span class="sr-only"></span></div>`,
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

}
