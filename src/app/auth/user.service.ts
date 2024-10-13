// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userEmailSubject = new BehaviorSubject<string | null>(null);
  userEmail$ = this.userEmailSubject.asObservable();

  constructor() {}

  setUserEmail(email: string) {
    this.userEmailSubject.next(email);
  }

  getUserEmail(): string | null {
    return this.userEmailSubject.value;
  }

  clearUser() {
    this.userEmailSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.userEmailSubject.value !== null; // Verifica si hay un usuario conectado
  }
}
