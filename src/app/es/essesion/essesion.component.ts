import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router'; // Import Router
import { UserService } from '../../auth/user.service'; // Ajusta la ruta

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
  private userService = inject(UserService); // Inyecta el UserService
  successMessage: string | null = null;  // Mensaje de éxito para el inicio de sesión
  errorMessage: string | null = null;    // Mensaje de error para el inicio de sesión
  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
  // Definición del formulario
  form: FormGroup = this._formBuilder.group({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor() {}

  // Método para manejar el envío del formulario
  submit() {
    const email = this.form.get('email')?.value as string | null;  // Convierte a string | null
    const password = this.form.get('password')?.value as string | null;

    // Procede si el correo y la contraseña son válidos
    if (email && password) {
      this.authService.login(email, password)
        .then(() => {
          this.errorMessage = null;
          this.successMessage = 'Iniciando Sesión...';
          this.userService.setUserEmail(email); // Guarda el email del usuario
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/home.es']); // Redirige a '/home.es'
          }, 3000);  // Limpia el mensaje de éxito después de 3 segundos
        })
        .catch(error => {
          console.error('Error al iniciar sesión:', error);
          // Maneja códigos de error específicos de Firebase
          if (error.code === 'auth/wrong-password') {
            this.errorMessage = 'La contraseña es incorrecta.';
          } else if (error.code === 'auth/user-not-found') {
            this.errorMessage = 'No se encontró un usuario con este correo.';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
          }
        });
    }
  }
}
