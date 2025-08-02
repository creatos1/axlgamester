import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
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
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    // Paso 1: crea usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    // Paso 2: guarda en Firestore usando uid
    const uid = userCredential.user.uid;
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      email: email,
      createdAt: new Date(),
      role: 'user'
    });

    return userCredential; // por si quieres usarlo en el componente
  }

  async logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
