import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmPayload {
  title: string;
  message: string;
  danger: boolean;
  confirmText: string;
  cancelText: string;
  secondsLeft: number;
  progress: number;
  choose: (value: boolean) => void;
}

const AUTO_MS = 7000;

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly open$ = new BehaviorSubject<ConfirmPayload | null>(null);
  private autoTimer: ReturnType<typeof setTimeout> | null = null;
  private tickTimer: ReturnType<typeof setInterval> | null = null;

  readonly dialog = this.open$.asObservable();

  /** Treat backdrop / escape-style dismiss as cancel. */
  cancelCurrent(): void {
    const cur = this.open$.value;
    cur?.choose(false);
  }

  confirm(
    message: string,
    options?: { title?: string; danger?: boolean; confirmText?: string; cancelText?: string }
  ): Observable<boolean> {
    return new Observable((subscriber) => {
      let settled = false;
      const endAt = Date.now() + AUTO_MS;

      const clearTimers = (): void => {
        if (this.autoTimer) {
          clearTimeout(this.autoTimer);
          this.autoTimer = null;
        }
        if (this.tickTimer) {
          clearInterval(this.tickTimer);
          this.tickTimer = null;
        }
      };

      const finish = (value: boolean): void => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimers();
        this.open$.next(null);
        subscriber.next(value);
        subscriber.complete();
      };

      const tick = (): void => {
        const leftMs = Math.max(0, endAt - Date.now());
        const secondsLeft = Math.max(0, Math.ceil(leftMs / 1000));
        const progress = (leftMs / AUTO_MS) * 100;
        const cur = this.open$.value;
        if (!cur) {
          return;
        }
        this.open$.next({
          ...cur,
          secondsLeft,
          progress
        });
      };

      const existing = this.open$.value;
      if (existing) {
        existing.choose(false);
      }

      const payload: ConfirmPayload = {
        title: options?.title ?? 'Please confirm',
        message,
        danger: options?.danger ?? false,
        confirmText: options?.confirmText ?? 'Confirm',
        cancelText: options?.cancelText ?? 'Cancel',
        secondsLeft: 7,
        progress: 100,
        choose: (v) => finish(v)
      };

      this.open$.next(payload);
      tick();
      this.tickTimer = setInterval(tick, 200);
      this.autoTimer = setTimeout(() => finish(false), AUTO_MS);
    });
  }
}
