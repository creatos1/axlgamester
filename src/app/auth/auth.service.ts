import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, sendEmailVerification, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private securityService: SecurityService
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      console.log('Usuario autenticado:', user);
    });
  }

  async login(email: string, password: string) {
    // Validaciones de seguridad
    if (!this.securityService.validateEmail(email)) {
      throw new Error('Formato de email inválido');
    }

    const sanitizedEmail = this.securityService.sanitizeInput(email);
    const passwordValidation = this.securityService.validatePassword(password);

    if (!passwordValidation.isValid) {
      throw new Error('Contraseña no válida: ' + passwordValidation.errors.join(', '));
    }

    const userCredential = await signInWithEmailAndPassword(this.auth, sanitizedEmail, password);

    if (!userCredential.user.emailVerified) {
      await this.logout();
      throw new Error('Por favor, verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
    }

    return userCredential;
  }

  async register(email: string, password: string) {
    // Validaciones de seguridad estrictas
    if (!this.securityService.validateEmail(email)) {
      throw new Error('Formato de email inválido');
    }

    const sanitizedEmail = this.securityService.sanitizeInput(email);
    const passwordValidation = this.securityService.validatePassword(password);

    if (!passwordValidation.isValid) {
      throw new Error('Contraseña no válida: ' + passwordValidation.errors.join(', '));
    }

    // Paso 1: crea usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(this.auth, sanitizedEmail, password);

    // Paso 2: envía correo de verificación
    await this.sendVerificationEmail(userCredential.user);

    // Paso 3: guarda en Firestore usando uid (sin activar hasta verificar)
    const uid = userCredential.user.uid;
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      email: sanitizedEmail,
      createdAt: new Date(),
      role: 'user',
      emailVerified: false,
      lastLogin: new Date(),
      ipAddress: 'hidden' // No guardamos IP por privacidad
    });

    return userCredential;
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const actionCodeSettings = {
      url: `${window.location.origin}/essesion.es`,
      handleCodeInApp: true
    };
    await sendEmailVerification(user, actionCodeSettings);
  }

  async resendVerificationEmail(): Promise<void> {
    const user = this.getCurrentUser();
    if (user) {
      const actionCodeSettings = {
        url: `${window.location.origin}/essesion.es`,
        handleCodeInApp: true
      };
      await sendEmailVerification(user, actionCodeSettings);
    } else {
      throw new Error('No hay usuario o el email ya está verificado');
    }
  }

  isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return user ? user.emailVerified : false;
  }

  async logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async sendPasswordResetEmail(email: string) {
    try {
      // Validar email antes de enviar
      if (!this.securityService.validateEmail(email)) {
        throw new Error('Formato de email inválido');
      }

      const sanitizedEmail = this.securityService.sanitizeInput(email);

      // Enviar correo sin URL personalizada para evitar problemas de dominio
      await sendPasswordResetEmail(this.auth, sanitizedEmail);
      console.log('Correo de recuperación enviado');
    } catch (error) {
      console.error('Error enviando correo de recuperación:', error);
      throw error;
    }
  }
}