import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import { ImageUploadComponent } from './image-upload/image-upload.component'; // Asegúrate de que la ruta sea correcta
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Importa MatProgressBarModule


@NgModule({
  declarations: [
    FooterComponent,
    ImageUploadComponent  
  ],
  exports: [
    FormsModule,
    BrowserModule,
    FooterComponent,
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
