import { Injectable } from '@angular/core';

export interface Toast {
  text: string;
  title?: string | undefined;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(text: string ,options: Partial<Toast> = {}, title = "Notificación"): void {
    this.toasts.push({ text, title,...options });
  }

  success(text: string, delay = 5000): void {
    this.show(text, { classname: 'bg-success text-light', delay }, "Notificación: Ok");
  }

  error(text: string, delay = 5000) {
    this.show(text, { classname: 'bg-warning io-bg-yellow-primary text-light', delay }, "Notificación: Error");
  }

  remove(toast: Toast): void {
    this.toasts.splice(this.toasts.indexOf(toast), 1);
  }
}
