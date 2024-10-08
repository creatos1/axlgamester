import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EsComponent } from './es.component';
import { SharedModule } from '../shared/shared.module'; // Importa el SharedModule aquí
import { routes } from '../app.routes';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AcercaesComponent } from './acercaes/acercaes.component'; // Importa el componente aquí
import { DonacionesComponent } from './donaciones/donaciones.component'; // Importa el componente aquí
import { GaleriaesComponent } from './galeriaes/galeriaes.component';
import { ModsesComponent } from './modses/modses.component';
import { EssesionComponent } from './essesion/essesion.component';
import { EsregistroComponent } from './esregistro/esregistro.component';
import { initializeApp, provideFirebaseApp, FirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Nueva forma de usar Firestore
import { environment } from '../../envoronments/environment';
import { AuthService } from '../services/auth.service'; 
@NgModule({
  declarations: [
    DonacionesComponent,
    EsComponent,
    AcercaesComponent,
    GaleriaesComponent,
    ModsesComponent,
    EssesionComponent,
    EsregistroComponent
    
  ],
  exports:[
    DonacionesComponent,
    EsComponent,
    AcercaesComponent,
    GaleriaesComponent,
    ModsesComponent,
    EssesionComponent,
    EsregistroComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,

  ],
  providers: [
    AuthService, // Añade AuthService aquí
    { provide: FirebaseApp, useFactory: () => initializeApp(environment.firebase) }, // Proveedor de FirebaseApp
    { provide: getFirestore, useFactory: () => getFirestore() } // Proveedor de Firestore
  ],
})
export class EsModule { }
