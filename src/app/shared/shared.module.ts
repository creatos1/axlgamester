import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import { ImageUploadComponent } from './image-upload/image-upload.component'; // Asegúrate de que la ruta sea correcta
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Importa MatProgressBarModule


@NgModule({
  declarations: [
    
    ImageUploadComponent  
  ],
  exports: [
    FormsModule,
    BrowserModule,

    ImageUploadComponent 
  ],

  imports:[    RouterModule.forChild(routes),
    BrowserModule, 
    RouterModule, 
    FormsModule, 
    MatProgressBarModule,
    ReactiveFormsModule]
})
export class SharedModule { }
