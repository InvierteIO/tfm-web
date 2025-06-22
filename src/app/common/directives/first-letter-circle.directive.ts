import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFirstLetterCircle]',
  standalone: true
})
export class FirstLetterCircleDirective implements OnChanges {
  @Input('appFirstLetterCircle') text = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    const letter = (this.text || '').trim().charAt(0).toUpperCase();
    const element = this.el.nativeElement as HTMLElement;
    this.renderer.setProperty(element, 'textContent', letter);
    this.renderer.setStyle(element, 'display', 'inline-flex');
    this.renderer.setStyle(element, 'justify-content', 'center');
    this.renderer.setStyle(element, 'align-items', 'center');
    this.renderer.setStyle(element, 'background', '#066B4B');
    this.renderer.setStyle(element, 'color', '#fff');
    this.renderer.setStyle(element, 'border-radius', '50%');
    this.renderer.setStyle(element, 'font-family', 'Poppins, sans-serif');
    this.renderer.setStyle(element, 'font-weight', '600');
    this.renderer.setStyle(element, 'font-size', '20px');
    this.renderer.setStyle(element, 'line-height', '100%');
    this.renderer.setStyle(element, 'vertical-align', 'middle');
    this.renderer.setStyle(element, 'width', '40px');
    this.renderer.setStyle(element, 'height', '40px');
  }
}
