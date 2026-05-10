import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NoticeVariant = 'info' | 'success' | 'error';

export interface NoticeViewModel {
  message: string;
  variant: NoticeVariant;
  secondsLeft: number;
  progress: number;
}

const AUTO_MS = 7000;

@Injectable({ providedIn: 'root' })
export class NoticeDialogService {
  private readonly notice$ = new BehaviorSubject<NoticeViewModel | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly notice = this.notice$.asObservable();

  show(message: string, variant: NoticeVariant = 'info'): void {
    this.dismiss();
    const endAt = Date.now() + AUTO_MS;
    const tick = (): void => {
      const leftMs = Math.max(0, endAt - Date.now());
      const secondsLeft = Math.max(0, Math.ceil(leftMs / 1000));
      const progress = (leftMs / AUTO_MS) * 100;
      const cur = this.notice$.value;
      if (!cur) {
        return;
      }
      this.notice$.next({ ...cur, secondsLeft, progress });
      if (leftMs <= 0) {
        this.dismiss();
      }
    };
    this.notice$.next({ message, variant, secondsLeft: 7, progress: 100 });
    tick();
    this.intervalId = setInterval(tick, 200);
    this.timeoutId = setTimeout(() => this.dismiss(), AUTO_MS);
  }

  dismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notice$.next(null);
  }
}
