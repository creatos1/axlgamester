import { Component } from '@angular/core';
import { ImageUploadService } from '../../services/image-upload.service';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
    styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  uploadProgress$: Observable<number> | undefined; // Progreso de subida
  downloadURL$: Observable<string> | undefined;   // URL de la imagen subida
  selectedFile: File | null = null;  // Archivo de imagen seleccionado

  // Variables para los campos adicionales
  title: string = '';
  description: string = '';
  link: string = '';

  constructor(
    private imageUploadService: ImageUploadService, 
    private firestore: Firestore
  ) {}

  // Método para seleccionar archivo
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
    }
  }

  // Método para subir imagen y crear el documento en Firestore
  async uploadImage(): Promise<void> {
    if (this.selectedFile) {
      // Subir la imagen a Firebase Storage
      this.uploadProgress$ = this.imageUploadService.uploadImage(this.selectedFile);
  
      // Asegurarse de que selectedFile no es null usando el operador '!' 
      const filePath = `images/${this.selectedFile!.name}`;
  
      // Obtener la URL de descarga de la imagen subida
      this.imageUploadService.getDownloadURL(filePath).subscribe(async (downloadURL) => {
        // Crear el documento en Firestore con la URL de la imagen y los campos adicionales
        const cardData = {
          img: downloadURL,
          title: this.title,
          description: this.description,
          link: this.link
        };
  
        // Subir los datos del formulario a Firestore
        const cardCollection = collection(this.firestore, 'cards');
        await addDoc(cardCollection, cardData);
  
        // Asignar la URL para mostrarla en el componente
        this.downloadURL$ = this.imageUploadService.getDownloadURL(filePath);
  
        // Limpiar los campos después de la subida
        this.title = '';
        this.description = '';
        this.link = '';
        this.selectedFile = null;
      });
    }
  }
  
}
