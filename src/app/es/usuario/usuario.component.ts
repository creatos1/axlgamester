import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {
  public email: string | null = ''; // Permitir que el email sea string o null

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.email = this.userService.getUserEmail(); // Obtener el email del usuario
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout().then(() => {
      this.userService.clearUser(); // Limpiar la información del usuario en el servicio
      this.router.navigate(['/home']); // Redirigir a la página de inicio
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}