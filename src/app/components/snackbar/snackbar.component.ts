import { Component, Injectable, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SnackbarMessage {
  text: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private messages = signal<SnackbarMessage[]>([]);

  get current() {
    return this.messages();
  }

  show(msg: SnackbarMessage) {
    const duration = msg.duration ?? 3000;
    this.messages.update((arr) => [...arr, msg]);
    setTimeout(() => {
      this.messages.update((arr) => arr.slice(1));
    }, duration);
  }
}

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container">
      @for (m of snackbarService.current; track m.text) {
        <div class="snackbar">{{ m.text }}</div>
      }
    </div>
  `,
  styles: [
    `
      .snackbar-container {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        z-index: 1100;
      }

      .snackbar {
        background: var(--btn-primary-bg);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class SnackbarComponent {
  snackbarService = inject(SnackbarService);
}
