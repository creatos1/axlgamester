
import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { SecurityService } from '../services/security.service';

@Directive({
  selector: '[appSafeInput]'
})
export class SafeInputDirective {
  
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private securityService: SecurityService
  ) {}
  
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitized = this.securityService.sanitizeInput(input.value);
    
    if (sanitized !== input.value) {
      this.renderer.setProperty(input, 'value', sanitized);
      // Mostrar advertencia visual
      this.renderer.addClass(input, 'security-warning');
      setTimeout(() => {
        this.renderer.removeClass(input, 'security-warning');
      }, 2000);
    }
  }
  
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const sanitized = this.securityService.sanitizeInput(paste);
    
    const input = event.target as HTMLInputElement;
    this.renderer.setProperty(input, 'value', sanitized);
  }
}
