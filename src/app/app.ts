import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleComponent, ConfirmModalComponent, SnackbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // the application title is used in the template and tests; update when renaming the project
  protected readonly title = signal('angular_crud_app');
  protected themeService = inject(ThemeService);
}
