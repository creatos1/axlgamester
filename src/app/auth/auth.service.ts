import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, sendEmailVerification } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';  // 🔑 AÑADE ESTO
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore   // 🔑 AÑADE ESTO
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      console.log('Usuario autenticado:', user); 
    });
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    
    if (!userCredential.user.emailVerified) {
      await this.logout(); // Cerrar sesión si no está verificado
      throw new Error('Por favor, verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
    }
    
    return userCredential;
  }

  async register(email: string, password: string) {
    // Paso 1: crea usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    // Paso 2: envía correo de verificación
    await this.sendVerificationEmail(userCredential.user);

    // Paso 3: guarda en Firestore usando uid (sin activar hasta verificar)
    const uid = userCredential.user.uid;
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      email: email,
      createdAt: new Date(),
      role: 'user',
      emailVerified: false
    });

    return userCredential; // por si quieres usarlo en el componente
  }

  async sendVerificationEmail(user: User) {
    try {
      await sendEmailVerification(user, {
        url: window.location.origin + '/email-verified', // URL a la que redirige después de verificar
        handleCodeInApp: true
      });
      console.log('Correo de verificación enviado');
    } catch (error) {
      console.error('Error enviando correo de verificación:', error);
      throw error;
    }
  }

  async resendVerificationEmail() {
    const user = this.getCurrentUser();
    if (user && !user.emailVerified) {
      await this.sendVerificationEmail(user);
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
}
