import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = 'es';

  setLanguage(language: string) {
    this.currentLanguage = language;
    // Aquí podrías guardar el idioma en el almacenamiento local o en una base de datos
  }

  getLanguage() {
    return this.currentLanguage;
  }
}

