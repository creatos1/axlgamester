import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router'; // Import Router

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;  // Field for confirming password
}

@Component({
  standalone: true,
  selector: 'app-esregistro',
  templateUrl: './esregistro.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./esregistro.component.css'],
})
export class EsregistroComponent {
  isVertical: boolean = false;
  private authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router); // Inject the Router
  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
  successMessage: string | null = null;  // Success message for registration
  errorMessage: string | null = null;    // Error message for user registration
  passwordStrength: string = '';         // Password strength indicator

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
    confirmPassword: this._formBuilder.control<string | null>(null, Validators.required), // Confirm password
  });

  // Password strength indicator logic
// Password strength indicator logic
calculatePasswordStrength(password: string | null | undefined) {
  const pass = password ?? '';  // Default to empty string if null or undefined
  if (pass.length <= 8) {
    this.passwordStrength = 'baja';
  } else if (pass.length <= 14) {
    this.passwordStrength = 'media';
  } else {
    this.passwordStrength = 'alta';
  }
}


  // Check if password and confirmPassword match
  passwordsMatch(): boolean {
    const password = this.form.get('password')?.value as string | null;  // Cast to string | null
    const confirmPassword = this.form.get('confirmPassword')?.value as string | null;  // Cast to string | null
    return password === confirmPassword;
  }

  // Submit the form for registration
  submit() {
    const email = this.form.get('email')?.value as string | null;  // Cast to string | null
    const password = this.form.get('password')?.value as string | null ;
    
    // Proceed if both email and password are valid and passwords match
    if (email && password && this.passwordsMatch()) {
      this.authService.register(email, password)
        .then(() => {
          this.errorMessage = null;
          this.successMessage = 'Registrando Usuario...';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/essesion.es']); // Redirect to '/inicio.es'
          }, 3000);  // Clear the success message after 3 seconds
        })
        .catch(error => {
          console.error('Error al registrar el usuario:', error);
          // Check if the error code indicates that the email is already in use
          if (error.code === 'auth/email-already-in-use') {
            this.errorMessage = 'El usuario ya está registrado.';
          } else {
            this.errorMessage = 'Error al registrar el usuario. Intenta nuevamente.';
          }
        });
    }
  }
}