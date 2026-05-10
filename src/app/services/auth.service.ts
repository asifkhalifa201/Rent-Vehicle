import { Injectable } from '@angular/core';
import { AppUser, Role } from '../models/models';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserKey = 'current_user';

  constructor(private readonly dataService: DataService) {}

  register(user: Omit<AppUser, 'id'>): { ok: boolean; message: string } {
    const users = this.dataService.getUsers();
    if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { ok: false, message: 'Email already registered.' };
    }
    users.push({ ...user, id: crypto.randomUUID() });
    this.dataService.saveUsers(users);
    return { ok: true, message: 'Registration successful. Please login.' };
  }

  login(email: string, password: string): { ok: boolean; message: string } {
    const user = this.dataService
      .getUsers()
      .find((u) => u.email === email && u.password === password);
    if (!user) {
      return { ok: false, message: 'Invalid email or password.' };
    }
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return { ok: true, message: 'Login successful.' };
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): AppUser | null {
    const raw = localStorage.getItem(this.currentUserKey);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  }

  hasRole(role: Role): boolean {
    return this.getCurrentUser()?.role === role;
  }
}
