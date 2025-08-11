import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../src/app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { dev } from '../src/app/environment/environment';
import { inject } from '@vercel/analytics';
 
inject({ mode: dev ? 'development' : 'production' });

// Register service worker for caching
if ('serviceWorker' in navigator && !dev) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));