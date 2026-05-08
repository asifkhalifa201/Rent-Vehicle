import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="card" style="max-width: 620px; margin: 0 auto;">
      <h2>Register (User or Driver)</h2>
      <label>Full Name</label>
      <input [(ngModel)]="fullName" />

      <label>Phone</label>
      <input [(ngModel)]="phone" />

      <label>Email</label>
      <input [(ngModel)]="email" type="email" />

      <label>Password</label>
      <input [(ngModel)]="password" type="password" />

      <label>Role</label>
      <select [(ngModel)]="role">
        <option value="user">User</option>
        <option value="driver">Driver</option>
      </select>

      <button class="btn btn-primary" style="margin-top: 12px;" (click)="register()">Create Account</button>
      <p>{{ message }}</p>
      <a routerLink="/login">Already registered? Login</a>
    </section>
  `
})
export class RegisterComponent {
  fullName = '';
  phone = '';
  email = '';
  password = '';
  role: Role = 'user';
  message = '';

  constructor(private readonly authService: AuthService) {}

  register(): void {
    const result = this.authService.register({
      fullName: this.fullName,
      phone: this.phone,
      email: this.email,
      password: this.password,
      role: this.role
    });
    this.message = result.message;
  }
}
