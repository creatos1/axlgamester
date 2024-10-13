import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private userService: UserService) {}

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.userService.setUserEmail(email); // Asegúrate de que UserService esté inyectado
    return userCredential;
  }
  // Método para registrar un nuevo usuario
  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Método para verificar si un correo ya está registrado
  async checkEmailExists(email: string): Promise<string[]> {
    try {
      return await fetchSignInMethodsForEmail(this.auth, email);
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  }

  // Método para cerrar sesión
  async logout() {
    return signOut(this.auth);
  }
}
