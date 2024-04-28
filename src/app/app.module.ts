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

@NgModule({
  declarations: [
    
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
SharedModule
  ],
  providers: [],
  bootstrap: [] // No se especifica ningún componente para arrancar la aplicación aquí
})
export class AppModule { }
