import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service'; 
import { Router } from '@angular/router';
import { UserService } from '../../auth/user.service';
@Component({
  selector: 'app-nav',  // Ensure this selector is correct
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public userService = inject(UserService); 
  isVertical: boolean = false;
  audio = new Audio();
  audioIconSrc = '../../assets/img/sound.png'; // Cambia la ruta al icono de audio activado
  email: string = ''; // Inicializa como una cadena vacía
  password: string = ''; // Agrega la propiedad password
  isDropdownOpen: boolean = false; // Estado del menú desplegable

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
   
    const storedEmail = this.userService.getUserEmail(); // Obtener el correo del usuario
    this.email = storedEmail ? storedEmail : ''; // Asignar el correo si no es null

    // Agregar evento de clic al botón para enviar correo
    const botonEnviarCorreo = document.getElementById('enviarCorreo') as HTMLButtonElement;



  }

  login() {
    this.authService.login(this.email, this.password).then(() => {
      this.router.navigate(['/home']);
      this.userService.setUserEmail(this.email); // Asegúrate de guardar el email aquí
    }).catch(error => {
      console.error('Error al iniciar sesión:', error);
    });
  }

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
  toggleDropdown(event: MouseEvent) {
    event.stopPropagation(); // Previene que el clic se propague a otros elementos
    this.isDropdownOpen = !this.isDropdownOpen; // Alterna la visibilidad del menú desplegable
  }
  
  

  

  logout() {
    this.authService.logout().then(() => {
      this.userService.clearUser(); // Limpia el usuario del servicio
      this.email = ''; // Limpia el correo localmente
      this.router.navigate(['/home']); // Redirige a la página de inicio
    });
  }
}