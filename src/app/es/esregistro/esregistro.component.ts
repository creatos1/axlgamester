import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service' // Asegúrate que el servicio esté importado
import { Router } from '@angular/router'; // Importa el Router para redirigir después de registro

@Component({
  selector: 'app-esregistro',
  templateUrl: './esregistro.component.html',
  styleUrl: './esregistro.component.scss'
})
export class EsregistroComponent {
  email: string = '';
  contrasena: string = '';
  constructor(private authService: AuthService) {}

  onSubmit(event: Event) {
    event.preventDefault();

    // Llama al método de registro de AuthService con los valores capturados
    this.authService.register(this.email, this.contrasena)
      .then(() => {
        console.log('Usuario registrado correctamente');
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }

  // Manejador de evento para los inputs
  onInputEmail(event: Event) {
    const target = event.target as HTMLInputElement; // Asegura que target es HTMLInputElement
    this.email = target.value; // Asigna el valor del input a la variable email
  }

  onInputPassword(event: Event) {
    const target = event.target as HTMLInputElement; // Asegura que target es HTMLInputElement
    this.contrasena = target.value; // Asigna el valor del input a la variable contrasena
  }

  isVertical: boolean = false;

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }

}
