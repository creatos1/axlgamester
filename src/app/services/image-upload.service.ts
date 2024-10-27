// image-upload.service.ts
import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  constructor(private storage: Storage) {}

  uploadImage(file: File): Observable<number> {
    const filePath = `images/${file.name}`;
    const storageRef = ref(this.storage, filePath);
    
    return new Observable((observer) => {
      uploadBytes(storageRef, file).then((snapshot) => {
        observer.next(100); // Porcentaje de subida (esto es un ejemplo, necesitarás un mejor manejo para calcularlo)
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  getDownloadURL(filePath: string): Observable<string> {
    const storageRef = ref(this.storage, filePath);
    return new Observable((observer) => {
      getDownloadURL(storageRef).then((url) => {
        observer.next(url);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}
