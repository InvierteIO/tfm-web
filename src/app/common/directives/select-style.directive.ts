import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appSelectStyle]'
})
export class SelectStyleDirective implements OnInit, OnDestroy {
  private sub!: Subscription;

  constructor(
    private ngControl: NgControl,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.updateStyles(this.ngControl.control?.value);

    this.sub = this.ngControl.control!
      .valueChanges!
      .subscribe(v => this.updateStyles(v));
  }

  private updateStyles(value: any) {
    const color = value || (value === false)  ? '#1A202C' : '#A0A0A0';
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'background', '#FCFCFC');
    this.renderer.setStyle(this.el.nativeElement, 'border-color', '#D8D8D8');
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
