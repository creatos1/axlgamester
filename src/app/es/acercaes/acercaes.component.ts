import { Component, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acercaes',
  templateUrl: './acercaes.component.html',
  styleUrls: ['./acercaes.component.css']
})
export class AcercaesComponent implements OnInit {
  isVertical: boolean = false;
  public email: string | null = ''; 
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.email = this.userService.getUserEmail(); 

    // Función para redirigir según el tipo de dispositivo
    function redirigirCorreo() {
      // Verificar si es un dispositivo móvil
      const esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // URL del correo electrónico
      let correoURL: string;

      if (esDispositivoMovil) {
        // Redirigir a un enlace mailto:
        correoURL = 'mailto:www.gamercracks@gmail.com';
      } else {
        // Redirigir al cliente de correo de Gmail
        correoURL = 'https://mail.google.com/mail/?view=cm&fs=1&to=www.gamercracks@gmail.com';
      }

      // Redirigir
      window.location.href = correoURL;
    }

    // Agregar evento de clic al botón
    const botonEnviarCorreo = document.getElementById('enviarCorreo') as HTMLButtonElement;
    botonEnviarCorreo.addEventListener('click', redirigirCorreo);
  }

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
  logout() {
    this.authService.logout().then(() => {
      this.userService.clearUser(); 
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
