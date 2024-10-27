import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component'; // Importa el componente de inicio
import { EsComponent } from './es/es.component'; // Importa el componente EsComponent
import { ModsesComponent } from './es/modses/modses.component';
import { GaleriaesComponent } from './es/galeriaes/galeriaes.component';
import { DonacionesComponent } from './es/donaciones/donaciones.component';
import { AcercaesComponent } from './es/acercaes/acercaes.component';
import { EssesionComponent } from './es/essesion/essesion.component';
import { EsregistroComponent } from './es/esregistro/esregistro.component';
import { NgModule } from '@angular/core';
import { UsuarioComponent } from './es/usuario/usuario.component';
import { AdminComponent } from './es/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'admin.es', component: AdminComponent },
  { path: 'home.es', component: EsComponent },
  { path: 'mods.es', component: ModsesComponent },
  { path: 'galeria.es', component: GaleriaesComponent },
  { path: 'donacion.es', component: DonacionesComponent },
  { path: 'acerca.es', component: AcercaesComponent },
  { path: 'essesion.es', component: EssesionComponent },
  { path: 'esregistro.es', component: EsregistroComponent },
  { path: 'usuario.es', component: UsuarioComponent },
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }