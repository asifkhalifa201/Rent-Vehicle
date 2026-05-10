import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NoticeDialogService } from '../ui/notice-dialog.service';
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
      <a class="login-link" routerLink="/login" [queryParams]="bookingSearchQueryParams">Already registered? Login</a>
    </section>
  `,
  styles: [
    `
      .login-link {
        display: inline-block;
        margin-top: 2px;
        color: var(--cta);
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .login-link:hover {
        color: var(--cta-dark);
      }
    `
  ]
})
export class RegisterComponent {
  fullName = '';
  phone = '';
  email = '';
  password = '';
  role: Role = 'user';

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly notice: NoticeDialogService
  ) {}

  /** Pass through home search context (p, trip, from, to) to login. */
  get bookingSearchQueryParams(): Record<string, string> {
    const keys = ['p', 'passengers', 'trip', 'from', 'to'] as const;
    const src = this.route.snapshot.queryParams;
    const out: Record<string, string> = {};
    for (const k of keys) {
      const v = src[k];
      if (typeof v === 'string' && v !== '') {
        out[k] = v;
      }
    }
    return out;
  }

  register(): void {
    const result = this.authService.register({
      fullName: this.fullName,
      phone: this.phone,
      email: this.email,
      password: this.password,
      role: this.role
    });
    this.notice.show(result.message, result.ok ? 'success' : 'error');
  }
}
