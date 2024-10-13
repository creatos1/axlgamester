// nav.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/auth/auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html', // Ajusta esta ruta según tu estructura de carpetas
})
export class NavComponent implements OnInit {
  isVertical: boolean = false;
  toggleVertical() {
  this.isVertical = !this.isVertical;
  }
  user: any = null; // Asegúrate de que la propiedad user esté definida aquí

  constructor(private authService: AuthService, private auth: Auth) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.user = user; // Guarda la información del usuario
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.user = null; // Limpia la información del usuario al cerrar sesión
    });
  }
}
