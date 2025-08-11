import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private firestore: Firestore) {}

  getCards(): Observable<any[]> {
    const cardsCollection = collection(this.firestore, 'cards');
    return from(getDocs(cardsCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        img: doc.data()['img'],
        title: doc.data()['title'],
        description: doc.data()['description'],
        link: doc.data()['link'],
        creationDate: doc.data()['creationDate']?.toDate() || new Date()
      })))
    );
  }
}
