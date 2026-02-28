import { Component, inject, signal, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private visible = signal(false);
  private options = signal<ConfirmOptions>({ message: '' });
  private resolveFn: ((result: boolean) => void) | null = null;

  get isVisible() {
    return this.visible();
  }
  get currentOptions() {
    return this.options();
  }

  open(opts: ConfirmOptions): Promise<boolean> {
    this.options.set(opts);
    this.visible.set(true);
    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  respond(result: boolean) {
    if (this.resolveFn) {
      this.resolveFn(result);
      this.resolveFn = null;
    }
    this.visible.set(false);
  }
}

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmService.isVisible) {
      <div class="overlay">
        <div class="modal">
          <p>{{ confirmService.currentOptions.message }}</p>
          <div class="actions">
            <button class="btn btn-secondary" (click)="confirmService.respond(false)">
              {{ confirmService.currentOptions.cancelText || 'Cancel' }}
            </button>
            <button class="btn btn-primary" (click)="confirmService.respond(true)">
              {{ confirmService.currentOptions.confirmText || 'OK' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal {
        background: var(--bg-primary);
        padding: 20px;
        border-radius: 8px;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
    `,
  ],
})
export class ConfirmModalComponent {
  confirmService = inject(ConfirmService);
}
