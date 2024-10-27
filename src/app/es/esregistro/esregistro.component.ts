import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-esregistro',
  templateUrl: './esregistro.component.html',
  styleUrls: ['./esregistro.component.css'],
})
export class EsregistroComponent {
  
  isVertical: boolean = false;
  private authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);

  successMessage: string | null = null;
  errorMessage: string | null = null;
  passwordStrength: string = '';

  // Form definition
  form = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control<string | null>(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: this._formBuilder.control<string | null>(null, Validators.required),
  });

  // Password strength logic
  calculatePasswordStrength(password: string | null | undefined) {
    const pass = password ?? '';
    if (pass.length <= 8) {
      this.passwordStrength = 'baja';
    } else if (pass.length <= 14) {
      this.passwordStrength = 'media';
    } else {
      this.passwordStrength = 'alta';
    }
  }

  passwordsMatch(): boolean {
    const password = this.form.get('password')?.value as string | null;
    const confirmPassword = this.form.get('confirmPassword')?.value as string | null;
    return password === confirmPassword;
  }

  submit() {
    const email = this.form.get('email')?.value as string | null;
    const password = this.form.get('password')?.value as string | null;

    if (email && password && this.passwordsMatch()) {
      this.authService.register(email, password)
        .then(() => {
          this.errorMessage = null;
          this.successMessage = 'Registrando Usuario...';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/essesion.es']);
          }, 3000);
        })
        .catch(error => {
          console.error('Error al registrar el usuario:', error);
          if (error.code === 'auth/email-already-in-use') {
            this.errorMessage = 'El usuario ya está registrado.';
          } else {
            this.errorMessage = 'Error al registrar el usuario. Intenta nuevamente.';
          }
        });
    }
  }
  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
}
