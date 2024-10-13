import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { FooterComponent } from './footer/footer.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    FooterComponent,
    
  ],
  exports: [
    FormsModule,
    BrowserModule,
    FooterComponent,
    
  ],

  imports:[    RouterModule.forChild(routes),
    BrowserModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule]
})
export class SharedModule { }
