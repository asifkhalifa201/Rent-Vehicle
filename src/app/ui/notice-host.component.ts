import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NoticeDialogService } from './notice-dialog.service';

@Component({
  selector: 'app-notice-host',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgClass],
  template: `
    <div
      class="notice-overlay"
      *ngIf="notice.notice | async as vm"
      (click)="onBackdrop($event)"
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
    >
      <div class="notice-panel" [ngClass]="'variant-' + vm.variant" (click)="$event.stopPropagation()">
        <button type="button" class="notice-x" (click)="close()" aria-label="Close">×</button>
        <p class="notice-text">{{ vm.message }}</p>
        <div class="notice-foot">
          <span class="notice-timer">Auto-close in {{ vm.secondsLeft }}s</span>
          <button type="button" class="btn btn-secondary btn-sm" (click)="close()">Close</button>
        </div>
        <div class="notice-progress" aria-hidden="true">
          <div class="notice-progress-fill" [style.width.%]="vm.progress"></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .notice-overlay {
        position: fixed;
        inset: 0;
        z-index: 1080;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 72px 16px 16px;
        background: rgba(15, 23, 42, 0.45);
        backdrop-filter: blur(2px);
      }
      .notice-panel {
        position: relative;
        width: min(420px, 100%);
        background: var(--card);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px 18px 14px;
        box-shadow: var(--shadow);
      }
      .notice-panel.variant-success {
        border-color: color-mix(in srgb, #22c55e 45%, var(--border));
      }
      .notice-panel.variant-error {
        border-color: color-mix(in srgb, #ef4444 45%, var(--border));
      }
      .notice-x {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 10px;
        background: var(--hover);
        color: var(--text);
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
      }
      .notice-x:hover {
        filter: brightness(1.05);
      }
      .notice-text {
        margin: 0 40px 12px 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--text);
        line-height: 1.45;
      }
      .notice-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }
      .notice-timer {
        font-size: 13px;
        color: var(--muted);
        font-weight: 600;
      }
      .notice-progress {
        height: 4px;
        border-radius: 999px;
        background: var(--hover);
        overflow: hidden;
      }
      .notice-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--cta), var(--cta-dark));
        transition: width 0.15s linear;
      }
      .variant-error .notice-progress-fill {
        background: linear-gradient(90deg, #ef4444, #b91c1c);
      }
      .variant-success .notice-progress-fill {
        background: linear-gradient(90deg, #22c55e, #15803d);
      }
    `
  ]
})
export class NoticeHostComponent {
  constructor(readonly notice: NoticeDialogService) {}

  close(): void {
    this.notice.dismiss();
  }

  onBackdrop(ev: MouseEvent): void {
    if (ev.target === ev.currentTarget) {
      this.close();
    }
  }
}
