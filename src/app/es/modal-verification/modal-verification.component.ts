
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

  constructor(private authService: AuthService) {}

  close() {
    this.closeModal.emit();
  }
}
