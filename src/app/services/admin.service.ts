// admin.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async isAdmin(email: string): Promise<boolean> {
    const adminCollection = collection(this.firestore, 'admins'); // Colección de admins
    const q = query(adminCollection, where('email', '==', email)); // Buscar por email
    const querySnapshot = await getDocs(q); // Obtener documentos que coincidan
  
    return !querySnapshot.empty; // Retorna true si hay un documento que coincide
  }
  
}
