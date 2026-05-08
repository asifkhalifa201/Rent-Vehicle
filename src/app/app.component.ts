import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header class="topbar shadow-sm">
      <div class="container d-flex justify-content-between align-items-center py-2 gap-3 flex-wrap">
        <a routerLink="/" class="brand d-flex align-items-center gap-2">
          <span class="logo-badge"><i class="bi bi-car-front-fill"></i></span>
          <span>Car Rent</span>
        </a>
        <nav class="d-flex align-items-center gap-2 flex-wrap">
          <a routerLink="/" class="nav-pill"><i class="bi bi-house-door me-1"></i>Home</a>
          <a routerLink="/about" class="nav-pill"><i class="bi bi-info-circle me-1"></i>About</a>
          <a routerLink="/contact" class="nav-pill"><i class="bi bi-envelope me-1"></i>Contact</a>
          <a *ngIf="!currentUser" routerLink="/login" class="nav-pill"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a>
          <a *ngIf="!currentUser" routerLink="/register" class="nav-pill"><i class="bi bi-person-plus me-1"></i>Register</a>
          <button class="btn btn-secondary btn-sm" (click)="toggleTheme()">
            <i class="bi" [ngClass]="theme === 'light' ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill'"></i>
            {{ theme === 'light' ? 'Dark' : 'Light' }}
          </button>
          <button *ngIf="currentUser" class="btn btn-secondary btn-sm" (click)="logout()">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="container page">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <div class="container">
        <p><strong>Car Rent Platform</strong> | Safe vehicles for wedding, trip and transport.</p>
        <p>Email: support&#64;rent.com | Phone: +91 98765 43210</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .topbar {
        position: sticky;
        top: 0;
        z-index: 30;
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        backdrop-filter: blur(8px);
      }
      .brand {
        font-weight: 800;
        font-size: 1.15rem;
        color: var(--primary);
      }
      .logo-badge {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary), var(--primary-strong));
        color: #fff;
      }
      .nav-pill {
        padding: 7px 10px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
      }
      .nav-pill:hover {
        background: var(--hover);
      }
      .page {
        min-height: calc(100vh - 170px);
        padding-top: 24px;
        padding-bottom: 28px;
      }
      .footer {
        background: var(--surface);
        color: var(--muted);
        border-top: 1px solid var(--border);
        padding: 20px 0;
        text-align: center;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  theme: 'light' | 'dark' = 'light';
  private readonly themeKey = 'app_theme';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
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
