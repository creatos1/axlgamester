import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { SecurityInterceptor } from '../auth/security.interceptor';
import { SafeInputDirective } from '../auth/safe-input.directive';
import { SafeUrlPipe } from './safe-url.pipe';

import { EsComponent } from './es.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ModsesComponent } from './modses/modses.component';
import { GaleriaesComponent } from './galeriaes/galeriaes.component';
import { DonacionesComponent } from './donaciones/donaciones.component';
import { AcercaesComponent } from './acercaes/acercaes.component';
import { EssesionComponent } from './essesion/essesion.component';
import { CardListComponent } from '../shared/card-list-component/card-list-component.component'; // Importa tu componente
import { AdminComponent } from './admin/admin.component';
import { FooterComponent } from './footer/footer.component';
import { EsregistroComponent } from './esregistro/esregistro.component';
import { ModalVerificationComponent } from './modal-verification/modal-verification.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
  declarations: [
    EsComponent,
    UsuarioComponent,
    NavbarComponent,
    ModsesComponent,
    GaleriaesComponent,
    DonacionesComponent,
    AcercaesComponent,
    CardListComponent,
    AdminComponent,
    FooterComponent,
    EsregistroComponent,
    EssesionComponent,
    SafeUrlPipe,
    SafeInputDirective,
    ModalVerificationComponent,
    PasswordResetComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild([]),
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi: true }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,// Agrega esto para permitir Web Components,
  exports: [NavbarComponent, CardListComponent,FooterComponent,EsregistroComponent,EssesionComponent] // Exporta el componente si es necesario
})
export class EsModule {}