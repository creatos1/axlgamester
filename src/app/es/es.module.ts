import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EsComponent } from './es.component';
import { SharedModule } from '../shared/shared.module'; 
import { routes } from '../app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AcercaesComponent } from './acercaes/acercaes.component'; 
import { DonacionesComponent } from './donaciones/donaciones.component'; 
import { GaleriaesComponent } from './galeriaes/galeriaes.component';
import { ModsesComponent } from './modses/modses.component';
import { EsregistroComponent } from './esregistro/esregistro.component'; 

@NgModule({
  declarations: [
    DonacionesComponent,
    EsComponent,
    AcercaesComponent,
    GaleriaesComponent,
    ModsesComponent,
    
  ],
  exports: [
    DonacionesComponent,
    EsComponent,
    AcercaesComponent,
    GaleriaesComponent,
    ModsesComponent,
    

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
  ]
})
export class EsModule { }
