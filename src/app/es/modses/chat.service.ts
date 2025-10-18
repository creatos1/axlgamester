import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private chatCollection = collection(this.firestore, 'chatMessages');

  constructor(private firestore: Firestore, private authService: AuthService) {}

  sendMessage(message: string): Promise<void> {
    const userEmail = this.authService.getCurrentUserEmail();
    if (!userEmail) return Promise.reject('Usuario no autenticado');

    return addDoc(this.chatCollection, {
      text: message,
      email: userEmail,
      timestamp: new Date()
    }).then(() => {});
  }

  getMessages(): Observable<any[]> {
    const q = query(this.chatCollection, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: 'id' });
  }
}
