import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userEmail: string | null = null;

  constructor() {
    this.userEmail = localStorage.getItem('userEmail'); // Recupera el correo del almacenamiento local
  }

  setUserEmail(email: string) {
    this.userEmail = email;
    localStorage.setItem('userEmail', email); // Guarda el correo en el almacenamiento local
  }

  getUserEmail(): string | null {
    return this.userEmail; // Retorna el correo del usuario
  }

  clearUser() {
    this.userEmail = null;
    localStorage.removeItem('userEmail'); // Limpia el correo del almacenamiento local
  }

  isLoggedIn(): boolean {
    return this.userEmail !== null; // Verifica si hay un usuario conectado
  }
}
