import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-host',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgClass],
  template: `
    <div
      class="cd-overlay"
      *ngIf="confirm.dialog | async as d"
      (click)="onBackdrop($event)"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cd-title"
    >
      <div class="cd-panel" (click)="$event.stopPropagation()">
        <h3 id="cd-title" class="cd-title">{{ d.title }}</h3>
        <p class="cd-msg">{{ d.message }}</p>
        <p class="cd-timer">Auto-cancel in {{ d.secondsLeft }}s if you do not choose.</p>
        <div class="cd-actions">
          <button type="button" class="btn btn-secondary" (click)="d.choose(false)">{{ d.cancelText }}</button>
          <button
            type="button"
            class="btn"
            [ngClass]="d.danger ? 'btn-danger' : 'btn-primary'"
            (click)="d.choose(true)"
          >
            {{ d.confirmText }}
          </button>
        </div>
        <div class="cd-progress" aria-hidden="true">
          <div class="cd-progress-fill" [style.width.%]="d.progress"></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .cd-overlay {
        position: fixed;
        inset: 0;
        z-index: 1090;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
        background: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(2px);
      }
      .cd-panel {
        width: min(440px, 100%);
        background: var(--card);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 22px 20px 16px;
        box-shadow: var(--shadow);
      }
      .cd-title {
        margin: 0 0 10px;
        font-size: 18px;
        font-weight: 800;
        color: var(--text);
      }
      .cd-msg {
        margin: 0 0 8px;
        font-size: 15px;
        line-height: 1.45;
        color: var(--text);
      }
      .cd-timer {
        margin: 0 0 16px;
        font-size: 13px;
        font-weight: 600;
        color: var(--muted);
      }
      .cd-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-end;
        margin-bottom: 12px;
      }
      .cd-progress {
        height: 4px;
        border-radius: 999px;
        background: var(--hover);
        overflow: hidden;
      }
      .cd-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--cta), var(--cta-dark));
        transition: width 0.15s linear;
      }
    `
  ]
})
export class ConfirmHostComponent {
  constructor(readonly confirm: ConfirmDialogService) {}

  onBackdrop(ev: MouseEvent): void {
    if (ev.target === ev.currentTarget) {
      this.confirm.cancelCurrent();
    }
  }
}
