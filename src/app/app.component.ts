import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ConfirmHostComponent } from './ui/confirm-host.component';
import { NoticeDialogService } from './ui/notice-dialog.service';
import { NoticeHostComponent } from './ui/notice-host.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NoticeHostComponent, ConfirmHostComponent],
  template: `
    <app-notice-host />
    <app-confirm-host />
    <header class="topbar shadow-sm">
      <div class="container d-flex justify-content-between align-items-center py-2 gap-3 flex-wrap">
        <a routerLink="/" class="brand d-flex align-items-center gap-2">
          <span class="logo-badge"><i class="bi bi-car-front-fill"></i></span>
          <span>Car Rent</span>
        </a>
        <nav class="d-flex align-items-center gap-1 flex-wrap">
          <a routerLink="/" class="nav-pill">Home</a>
          <a routerLink="/about" class="nav-pill">About</a>
          <a routerLink="/contact" class="nav-pill">Contact</a>
          <a *ngIf="!currentUser" routerLink="/login" class="nav-pill">Login</a>
          <a *ngIf="!currentUser" routerLink="/register" class="btn btn-cta btn-sm px-3">Get started</a>
          <a *ngIf="currentUser?.role === 'user'" routerLink="/user-dashboard" class="btn btn-cta btn-sm px-3">Book now</a>
          <button class="btn btn-outline-secondary btn-sm border-0" type="button" (click)="toggleTheme()" title="Theme">
            <i class="bi" [ngClass]="theme === 'light' ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill'"></i>
            {{ theme === 'light' ? 'Dark' : 'Light' }}
          </button>
          <button *ngIf="currentUser" class="btn btn-secondary btn-sm" (click)="logout()">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="page-main">
      <div class="container page">
        <router-outlet></router-outlet>
      </div>
    </main>

    <footer class="footer site-footer">
      <div class="container">
        <div class="row g-4 py-4 text-start">
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="logo-badge logo-badge-sm"><i class="bi bi-car-front-fill"></i></span>
              <strong class="footer-brand">Car Rent</strong>
            </div>
            <p class="small mb-0">Verified vehicles for wedding, trip and transport. Book with confidence.</p>
          </div>
          <div class="col-md-4">
            <h6 class="text-uppercase small fw-bold mb-3">Quick links</h6>
            <ul class="list-unstyled small mb-0">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/about">About</a></li>
              <li><a routerLink="/contact">Contact</a></li>
              <li><a routerLink="/register">Register</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h6 class="text-uppercase small fw-bold mb-3">Contact</h6>
            <p class="small mb-1">support&#64;rent.com</p>
            <p class="small mb-0">+91 98765 43210</p>
          </div>
        </div>
        <div class="footer-bottom text-center small py-3">
          © {{ year }} Car Rent Platform. All rights reserved.
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .topbar {
        position: sticky;
        top: 0;
        z-index: 30;
        background: color-mix(in srgb, var(--surface) 92%, transparent);
        border-bottom: 1px solid var(--border);
        backdrop-filter: blur(12px);
      }
      .brand {
        font-weight: 800;
        font-size: 1.2rem;
        color: var(--nav-text);
        letter-spacing: -0.02em;
      }
      .logo-badge {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--cta), var(--cta-dark));
        color: #fff;
        font-size: 1.1rem;
      }
      .logo-badge-sm {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        font-size: 0.95rem;
      }
      .nav-pill {
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 600;
        color: var(--nav-muted);
      }
      .nav-pill:hover {
        color: var(--nav-text);
        background: var(--hover);
      }
      .page-main {
        flex: 1;
      }
      .page {
        min-height: calc(100vh - 220px);
        padding-top: 20px;
        padding-bottom: 32px;
      }
      .site-footer {
        background: var(--footer-bg);
        color: var(--footer-text);
        border-top: 1px solid var(--border);
      }
      .site-footer a {
        color: var(--footer-muted);
      }
      .site-footer a:hover {
        color: var(--cta);
      }
      .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        color: var(--footer-muted);
      }
      .footer-brand {
        color: var(--footer-text);
        font-size: 1.05rem;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  theme: 'light' | 'dark' = 'light';
  readonly year = new Date().getFullYear();
  private readonly themeKey = 'app_theme';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notice: NoticeDialogService
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem(this.themeKey);
    this.theme = savedTheme === 'dark' ? 'dark' : 'light';
    this.applyTheme();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.notice.show('You have been logged out.', 'info');
    this.router.navigateByUrl('/');
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(this.themeKey, this.theme);
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme);
  }
}
