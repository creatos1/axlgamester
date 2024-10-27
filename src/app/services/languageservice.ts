import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selectedLanguage: string = 'none';

  constructor(private router: Router) { }

  setLanguage(language: string) {
    this.selectedLanguage = language;
  }

  getSelectedLanguage(): string {
    return this.selectedLanguage;
  }
}
