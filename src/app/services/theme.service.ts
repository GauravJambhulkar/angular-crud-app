import { Injectable, inject, effect } from '@angular/core';
import { signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private themeSignal = signal<Theme>(this.getInitialTheme());
  theme = this.themeSignal.asReadonly();

  constructor() {
    // Apply theme changes to document
    effect(() => {
      if (this.isBrowser) {
        const currentTheme = this.theme();
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('app-theme', currentTheme);
      }
    });
  }

  private getInitialTheme(): Theme {
    // Only access localStorage and window in browser environment
    if (!this.isBrowser) {
      return 'light';
    }

    // Check localStorage first
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  toggleTheme() {
    this.themeSignal.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
  }
}
