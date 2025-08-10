
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  message: string = '';
  isResending: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    if (user.emailVerified) {
      this.message = 'Tu email ya está verificado.';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } else {
      this.message = 'Por favor, verifica tu email. Revisa tu bandeja de entrada y spam.';
    }
  }

  async resendVerificationEmail() {
    this.isResending = true;
    try {
      await this.authService.resendVerificationEmail();
      this.message = 'Correo de verificación reenviado. Revisa tu bandeja de entrada.';
    } catch (error) {
      console.error('Error reenviando correo:', error);
      this.message = 'Error al reenviar el correo. Intenta nuevamente.';
    } finally {
      this.isResending = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/essesion.es']);
  }
}
