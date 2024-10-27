import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private firestore: Firestore) {}

  // Method to get cards without using a separate Card model
  getCards(): Observable<any[]> {
    const cardsCollection = collection(this.firestore, 'cards'); // Access Firestore collection
    return from(getDocs(cardsCollection)).pipe( // Fetch documents
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          img: doc.data()['img'],
          title: doc.data()['title'],
          description: doc.data()['description'],
          link: doc.data()['link'],
          creationDate: doc.data()['creationDate']?.toDate() || new Date() // Convert to Date if necessary
        })); // Map Firestore document data to appropriate format
      })
    );
  }
}
