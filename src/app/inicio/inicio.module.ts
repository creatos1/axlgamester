import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { InicioComponent } from './inicio.component';
import { routes } from '../app.routes'; // Importa las rutas desde app.routes.ts
import { BrowserModule } from '@angular/platform-browser';

import { LanguageService } from '../../app/services/languageservice';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  providers: [LanguageService], // Agrega el servicio aquí
})
export class InicioModule { }
