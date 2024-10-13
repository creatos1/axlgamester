import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EsComponent } from './es.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { SharedModule } from '../shared/shared.module'; 
import { NavbarComponent } from './navbar/navbar.component'; 

@NgModule({
  declarations: [
    EsComponent,
    UsuarioComponent,
    NavbarComponent  // Ensure this is declared
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule, 
  ],
  exports: [NavbarComponent]  // Ensure this is exported
})
export class EsModule {}
