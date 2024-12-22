import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  settings = {
    notifications: true,
    darkMode: false,
    language: 'es',
  };

  constructor(private platform: Platform) {
    this.loadSettings();
  }

  loadSettings() {
    // Cargar configuraciones desde almacenamiento local o establecer valores predeterminados
    const darkMode = localStorage.getItem('darkMode') === 'true';
    this.settings.darkMode = darkMode;
    this.applyTheme(darkMode);
  }

  saveSettings() {
    localStorage.setItem('darkMode', this.settings.darkMode.toString());
    this.applyTheme(this.settings.darkMode);
  }

  applyTheme(isDark: boolean) {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}
