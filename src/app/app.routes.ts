import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { ContactComponent } from './pages/contact.component';
import { DriverDashboardComponent } from './pages/driver-dashboard.component';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserDashboardComponent } from './pages/user-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'driver-dashboard', component: DriverDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
