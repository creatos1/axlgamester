
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-modal-verification',
  templateUrl: './modal-verification.component.html',
  styleUrls: ['./modal-verification.component.scss']
})
export class ModalVerificationComponent {
  @Input() isVisible: boolean = false;
  @Input() userEmail: string = '';
  @Output() closeModal = new EventEmitter<void>();
  
  isResending: boolean = false;

  constructor(private authService: AuthService) {}

  close() {
    this.closeModal.emit();
  }

  async resendVerificationEmail() {
    this.isResending = true;
    try {
      await this.authService.resendVerificationEmail();
      alert('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error reenviando correo:', error);
      alert('Error al reenviar el correo. Intenta nuevamente.');
    } finally {
      this.isResending = false;
    }
  }
}
