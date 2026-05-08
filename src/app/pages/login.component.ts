import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="card" style="max-width: 520px; margin: 0 auto;">
      <h2>Login</h2>
      <label>Email</label>
      <input [(ngModel)]="email" type="email" />

      <label>Password</label>
      <input [(ngModel)]="password" type="password" />

      <button class="btn btn-primary" style="margin-top: 12px;" (click)="login()">Login</button>
      <p style="color: #b91c1c;">{{ message }}</p>
    </section>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    const result = this.authService.login(this.email, this.password);
    this.message = result.message;
    if (!result.ok) {
      return;
    }
    const role = this.authService.getCurrentUser()?.role;
    if (role === 'admin') this.router.navigateByUrl('/admin-dashboard');
    if (role === 'driver') this.router.navigateByUrl('/driver-dashboard');
    if (role === 'user') this.router.navigateByUrl('/user-dashboard');
  }
}
