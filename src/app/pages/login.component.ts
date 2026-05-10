import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NoticeDialogService } from '../ui/notice-dialog.service';

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
    </section>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notice: NoticeDialogService
  ) {}

  login(): void {
    const result = this.authService.login(this.email, this.password);
    if (!result.ok) {
      this.notice.show(result.message, 'error');
      return;
    }
    this.notice.show(result.message, 'success');
    const role = this.authService.getCurrentUser()?.role;
    const q = { ...this.route.snapshot.queryParams };
    const hasQ = Object.keys(q).length > 0;
    if (role === 'admin') this.router.navigateByUrl('/admin-dashboard');
    if (role === 'driver') this.router.navigateByUrl('/driver-dashboard');
    if (role === 'user') {
      this.router.navigate(['/user-dashboard'], hasQ ? { queryParams: q } : {});
    }
  }
}
