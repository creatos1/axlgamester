import { NgModule,ApplicationRef  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner'; 
import { EsModule } from './es/es.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; // Asegúrate de que esto esté aquí
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; // Importa FormsModule
import { environment } from '../../src/app/environment/environment';
@NgModule({
  declarations: [
    
  ],
  imports: [
    
    FormsModule,
    BrowserModule,
    EsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    RouterModule.forRoot([]),SharedModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [] // No se especifica ningún componente para arrancar la aplicación aquí
})
export class AppModule {
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent);
  }
}