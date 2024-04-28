import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component'; // Importa el componente de inicio
import { EsComponent } from './es/es.component'; // Importa el componente EsComponent
import { ModsesComponent } from './es/modses/modses.component';
import { GaleriaesComponent } from './es/galeriaes/galeriaes.component';
import { DonacionesComponent } from './es/donaciones/donaciones.component';
import { AcercaesComponent } from './es/acercaes/acercaes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'home.es', component: EsComponent }, // Ruta para la página de inicio en español
  { path: 'mods.es', component: ModsesComponent }, // Ruta para la página de inicio en español
  { path: 'galeria.es', component: GaleriaesComponent }, // Ruta para la página de inicio en español
  { path: 'donacion.es', component: DonacionesComponent }, // Ruta para la página de inicio en español
  { path: 'acerca.es', component: AcercaesComponent }, // Ruta para la página de inicio en español
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' }, // Redirige a '/inicio' cuando no se encuentra ninguna ruta
];
