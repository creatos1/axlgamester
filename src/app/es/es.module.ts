import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EsComponent } from './es.component';
import { SharedModule } from '../shared/shared.module'; // Importa el SharedModule aquí
import { routes } from '../app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AcercaesComponent } from './acercaes/acercaes.component'; // Importa el componente aquí
import { DonacionesComponent } from './donaciones/donaciones.component'; // Importa el componente aquí
import { GaleriaesComponent } from './galeriaes/galeriaes.component';
import { ModsesComponent } from './modses/modses.component';
@NgModule({
  declarations: [
    DonacionesComponent,
    EsComponent,
    AcercaesComponent,
    GaleriaesComponent,
    ModsesComponent
  ],
  exports:[
    DonacionesComponent,
    EsComponent,
    AcercaesComponent,
    GaleriaesComponent,
    ModsesComponent
  ],
  imports: [
  
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule // Asegúrate de importar el SharedModule aquí
  ]
})
export class EsModule { }
