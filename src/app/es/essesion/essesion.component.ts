import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../auth/user.service';

@Component({
  standalone: true,
  selector: 'app-iniciar-sesion',
  templateUrl: './essesion.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./essesion.component.css'],
})
export class EssesionComponent {
  isVertical: boolean = false;
  private authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Inicializa el formulario de inicio de sesión
  form: FormGroup = this._formBuilder.group({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(8)]),
  });

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }

  submit() {
    const email = this.form.get('email')?.value as string | null;  
    const password = this.form.get('password')?.value as string | null;

    if (email && password) {
      this.authService.login(email, password)
        .then(() => {
          this.errorMessage = null;
          this.successMessage = 'Iniciando Sesión...';
          this.userService.setUserEmail(email); // Guarda el email del usuario

          // Verifica si el usuario es admin
          if (email === 'www.gamercracks@gmail.com') {
            setTimeout(() => {
              this.successMessage = null;
              this.router.navigate(['/admin.es']); // Redirige al panel admin
            }, 3000);
          } else {
            setTimeout(() => {
              this.successMessage = null;
              this.router.navigate(['/home.es']); // Redirige a la página principal
            }, 3000);
          }
        })
        .catch(error => {
          console.error('Error al iniciar sesión:', error);
          this.errorMessage = this.handleAuthError(error); // Manejo de errores
        });
    }
  }

  private handleAuthError(error: any): string {
    if (error.code === 'auth/wrong-password') {
      return 'La contraseña es incorrecta.';
    } else if (error.code === 'auth/user-not-found') {
      return 'No se encontró un usuario con este correo.';
    } else {
      return 'Error al iniciar sesión. Intenta nuevamente.';
    }
  }
}
