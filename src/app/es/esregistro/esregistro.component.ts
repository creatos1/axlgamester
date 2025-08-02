import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  acceptTerms: FormControl<boolean | null>;
}

// Validador personalizado para contraseña
function customPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string;
  if (!password) return null;

  const errors: any = {};

  if (password.length < 8) {
    errors.minLength = true;
  }
  if (!/[A-Z]/.test(password)) {
    errors.uppercase = true;
  }
  if (!/[a-z]/.test(password)) {
    errors.lowercase = true;
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.specialChar = true;
  }

  // Validar números consecutivos (ej: 123, 456)
  const digits = password.match(/\d+/g);
  if (digits) {
    for (const group of digits) {
      for (let i = 0; i < group.length - 1; i++) {
        const a = parseInt(group[i]);
        const b = parseInt(group[i + 1]);
        if (b - a === 1) {
          errors.consecutiveNumbers = true;
        }
      }
    }
  }

  // Validar letras consecutivas (abc, def)
  const lowerPassword = password.toLowerCase();
  for (let i = 0; i < lowerPassword.length - 1; i++) {
    const a = lowerPassword.charCodeAt(i);
    const b = lowerPassword.charCodeAt(i + 1);
    if (b - a === 1 && /[a-z]/.test(lowerPassword[i]) && /[a-z]/.test(lowerPassword[i + 1])) {
      errors.consecutiveLetters = true;
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

@Component({
  selector: 'app-esregistro',
  templateUrl: './esregistro.component.html',
  styleUrls: ['./esregistro.component.css'],
})
export class EsregistroComponent {
  isVertical: boolean = false;
  mostrarTerminos: boolean = false;
mostrarAviso: boolean = false;

  private authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);

  successMessage: string | null = null;
  errorMessage: string | null = null;
  passwordStrength: string = '';

  form = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control<string | null>(null, [
      Validators.required,
      customPasswordValidator,
    ]),
    confirmPassword: this._formBuilder.control<string | null>(null, Validators.required),
    acceptTerms: this._formBuilder.control<boolean | null>(false, Validators.requiredTrue),
  });

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
    if (this.form.invalid || !this.passwordsMatch()) {
      this.errorMessage = 'Por favor corrige los errores en el formulario.';
      return;
    }

    const email = this.form.get('email')?.value as string | null;
    const password = this.form.get('password')?.value as string | null;

    if (email && password) {
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
