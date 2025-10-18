
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private selectedLanguageSubject = new BehaviorSubject<string>(
    localStorage.getItem('selectedLanguage') || 'es'
  );
  
  selectedLanguage$ = this.selectedLanguageSubject.asObservable();

  constructor(private router: Router) {}

  setLanguage(language: string) {
    localStorage.setItem('selectedLanguage', language);
    this.selectedLanguageSubject.next(language);
  }

  getSelectedLanguage(): string {
    return this.selectedLanguageSubject.value;
  }
  
  getCurrentLanguage(): string {
    return this.selectedLanguageSubject.value;
  }
}
