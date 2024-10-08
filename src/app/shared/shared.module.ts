import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
  ],
  exports: [
    FormsModule,
    BrowserModule,
    FooterComponent,
    NavbarComponent,
  ],

  imports:[    RouterModule.forChild(routes),
    BrowserModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule]
})
export class SharedModule { }
