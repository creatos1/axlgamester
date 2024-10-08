import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner'; 
import { EsModule } from './es/es.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Nueva forma de usar Firestore
import { environment } from '../envoronments/environment'; // Corrige la ruta aquí
import { AuthService } from './services/auth.service'; 

@NgModule({
  declarations: [
     // Asegúrate de declarar tu AppComponent aquí
  ],
  imports: [
    BrowserModule,
    EsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    RouterModule.forRoot([]),
    SharedModule,
  ],
  providers: [
    AuthService, // Añade AuthService aquí
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Proveedor de FirebaseApp
    provideFirestore(() => getFirestore()), // Proveedor de Firestore
  ],
  bootstrap: [] // Asegúrate de bootstrap el componente principal
})
export class AppModule { }
