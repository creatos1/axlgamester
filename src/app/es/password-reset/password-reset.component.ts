
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  private authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);

  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  form = this._formBuilder.group({
    email: this._formBuilder.control<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
  });

  async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor ingresa un email válido.';
      return;
    }

    const email = this.form.get('email')?.value as string;
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      await this.authService.sendPasswordResetEmail(email);
      this.successMessage = 'Se ha enviado un correo de recuperación a tu email. Revisa tu bandeja de entrada y spam.';
      this.form.reset();
    } catch (error: any) {
      console.error('Error al enviar correo de recuperación:', error);
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No existe una cuenta con este correo electrónico.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El formato del correo electrónico no es válido.';
      } else {
        this.errorMessage = 'Error al enviar el correo de recuperación. Intenta nuevamente.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/essesion.es']);
  }
}
