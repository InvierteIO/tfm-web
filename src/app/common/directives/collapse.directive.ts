import {Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appCollapse]'
})
export class CollapseDirective implements OnChanges {

  @Input() isOpen = false;

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.toggleHeight(this.isOpen);
    }
  }

  private toggleHeight(open: boolean) {
    const element = this.el.nativeElement as HTMLElement;
    if (open) {
      this.renderer.setStyle(element, 'height', 'auto');
      const height = element.scrollHeight;
      this.renderer.setStyle(element, 'height', '0');
      setTimeout(() => {
        this.renderer.setStyle(element, 'height', height + 'px');
      });
    } else {
      const currentHeight = element.scrollHeight;
      this.renderer.setStyle(element, 'height', currentHeight + 'px');
      setTimeout(() => {
        this.renderer.setStyle(element, 'height', '0');
      });
    }
  }
}
