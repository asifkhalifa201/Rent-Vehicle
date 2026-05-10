import { Component, Input } from '@angular/core';

/**
 * RideMitra wordmark mark: road + vehicle + twin arcs (“mitra” / together).
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
    <svg
      class="rm-mark"
      [class.rm-mark--sm]="size === 'sm'"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M5 37c7-7 31-7 38 0"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        opacity="0.95"
      />
      <rect x="13" y="20" width="22" height="12" rx="3.5" fill="currentColor" />
      <path d="M16 20 18.5 12.5h11L32 20Z" fill="currentColor" />
      <circle cx="18" cy="34.5" r="2.35" fill="currentColor" />
      <circle cx="30" cy="34.5" r="2.35" fill="currentColor" />
      <path
        d="M9 16.5Q14 10.5 19 16.5"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        opacity="0.9"
      />
      <path
        d="M29 16.5Q34 10.5 39 16.5"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        opacity="0.9"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      .rm-mark {
        width: 26px;
        height: 26px;
        flex-shrink: 0;
      }
      .rm-mark--sm {
        width: 20px;
        height: 20px;
      }
    `
  ]
})
export class BrandLogoComponent {
  @Input() size: 'sm' | 'md' = 'md';
}
