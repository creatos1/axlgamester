import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EsComponent } from './es.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { SharedModule } from '../shared/shared.module'; 
import { NavbarComponent } from './navbar/navbar.component'; 
import { ModsesComponent } from './modses/modses.component';
import { GaleriaesComponent } from './galeriaes/galeriaes.component';

import { DonacionesComponent } from './donaciones/donaciones.component';
import { AcercaesComponent } from './acercaes/acercaes.component';
import { EssesionComponent } from './essesion/essesion.component';
@NgModule({
  declarations: [
    EsComponent,
    UsuarioComponent,
    NavbarComponent,
    ModsesComponent,
    GaleriaesComponent,
    DonacionesComponent,
    AcercaesComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  exports: [NavbarComponent]
})
export class EsModule {}

