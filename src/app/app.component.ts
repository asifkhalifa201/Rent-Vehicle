import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <div class="container nav">
        <a routerLink="/" class="brand">Car Rent</a>
        <nav>
          <a routerLink="/">Home</a>
          <a routerLink="/about">About Us</a>
          <a routerLink="/contact">Contact</a>
          <a *ngIf="!currentUser" routerLink="/login">Login</a>
          <a *ngIf="!currentUser" routerLink="/register">Register</a>
          <button class="btn btn-secondary" (click)="toggleTheme()">
            {{ theme === 'light' ? 'Dark Mode' : 'Light Mode' }}
          </button>
          <button *ngIf="currentUser" class="btn btn-secondary" (click)="logout()">Logout</button>
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
      .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
      }
      .brand {
        font-weight: 800;
        font-size: 1.1rem;
        color: var(--primary);
      }
      nav {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      nav a {
        padding: 7px 10px;
        border-radius: 8px;
      }
      nav a:hover {
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
