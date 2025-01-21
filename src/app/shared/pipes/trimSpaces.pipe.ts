import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[trimSpaces]',
})
export class TrimSpacesDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const trimmedValue = input.value.replace(/\s+/g, '');
    input.value = trimmedValue;
  }
}
