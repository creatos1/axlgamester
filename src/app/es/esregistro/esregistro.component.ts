import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { isRequired, hasemailerror, customPasswordValidator, noInjectionValidator } from '../../auth/validators';

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  acceptTerms: FormControl<boolean | null>;
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
  private securityService = inject(SecurityService);
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);

  successMessage: string | null = null;
  errorMessage: string | null = null;
  passwordStrength: string = '';
  showVerificationModal: boolean = false;
  registeredEmail: string = '';
  isLoading: boolean = false;

  form = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control<string | null>(null, [
      Validators.required,
      Validators.email,
      noInjectionValidator
    ]),
    password: this._formBuilder.control<string | null>(null, [
      Validators.required,
      customPasswordValidator,
      noInjectionValidator
    ]),
    confirmPassword: this._formBuilder.control<string | null>(null, [
      Validators.required,
      noInjectionValidator
    ]),
    acceptTerms: this._formBuilder.control<boolean | null>(false),
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

    // Sanitizar los datos antes de enviarlos
    const email = this.securityService.sanitizeInput(this.form.get('email')?.value as string);
    const password = this.securityService.sanitizeInput(this.form.get('password')?.value as string);

    if (email && password) {
      this.isLoading = true;
      this.errorMessage = null;
      
      this.authService.register(email, password)
        .then(() => {
          this.isLoading = false;
          this.registeredEmail = email;
          this.showVerificationModal = true;
        })
        .catch(error => {
          console.error('Error al registrar el usuario:', error);
          this.isLoading = false;
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

  closeVerificationModal() {
    this.showVerificationModal = false;
    this.router.navigate(['/essesion.es']);
  }
}