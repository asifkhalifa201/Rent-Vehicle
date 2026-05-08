import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking, Vehicle } from '../models/models';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="card">
      <h2>User Booking Panel</h2>
      <p>Only admin-approved vehicles are shown.</p>

      <label>Select Vehicle (Vehicle - Driver)</label>
      <select [(ngModel)]="selectedVehicleId">
        <option [ngValue]="''">Select</option>
        <option *ngFor="let v of approvedVehicles" [ngValue]="v.id">
          {{ v.vehicleName }} ({{ v.vehicleType }}) - {{ v.driverName }}
        </option>
      </select>

      <label>Booking Type</label>
      <select [(ngModel)]="tripType">
        <option value="wedding">Wedding</option>
        <option value="trip">Trip</option>
        <option value="transport">Transport</option>
      </select>

      <label>Start Date</label>
      <input [(ngModel)]="startDate" [min]="todayDate" type="date" />

      <label>End Date</label>
      <input [(ngModel)]="endDate" [min]="startDate || todayDate" type="date" />

      <label>Total KM</label>
      <input [(ngModel)]="totalKm" type="number" />

      <button class="btn btn-primary" style="margin-top: 12px;" (click)="bookVehicle()">Book Now</button>
      <p>{{ message }}</p>
      <p style="color: #6b7280;">Booking will stay pending until driver confirms or cancels.</p>
      <p *ngIf="previewAmount">Estimated Amount: Rs {{ previewAmount }}</p>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h3>My Bookings</h3>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>KM</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of myBookings">
            <td>{{ b.vehicleName }}</td>
            <td>{{ b.driverName }}</td>
            <td>{{ b.tripType }}</td>
            <td>{{ b.startDate }}</td>
            <td>{{ b.endDate }}</td>
            <td>{{ b.totalKm }}</td>
            <td>Rs {{ b.totalAmount }}</td>
            <td>{{ bookingStatusLabel(b.status) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class UserDashboardComponent {
  selectedVehicleId = '';
  tripType: 'wedding' | 'trip' | 'transport' = 'wedding';
  todayDate = new Date().toISOString().split('T')[0];
  startDate = '';
  endDate = '';
  totalKm = 200;
  message = '';

  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    if (!this.authService.hasRole('user')) {
      this.router.navigateByUrl('/login');
    }
  }

  get approvedVehicles(): Vehicle[] {
    return this.dataService.getVehicles().filter((v) => v.approvalStatus === 'approved' || v.approved);
  }

  get myBookings(): Booking[] {
    const me = this.authService.getCurrentUser();
    return this.dataService.getBookings().filter((b) => b.userId === me?.id);
  }

  get previewAmount(): number {
    const vehicle = this.approvedVehicles.find((v) => v.id === this.selectedVehicleId);
    if (!vehicle) return 0;
    return this.calculateAmount(vehicle, this.totalKm);
  }

  bookVehicle(): void {
    const me = this.authService.getCurrentUser();
    const vehicle = this.approvedVehicles.find((v) => v.id === this.selectedVehicleId);
    if (!me || me.role !== 'user' || !vehicle) {
      this.message = 'Please login as user and select a vehicle.';
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.message = 'Please select both start date and end date.';
      return;
    }
    if (this.startDate < this.todayDate) {
      this.message = 'Start date cannot be before today.';
      return;
    }
    if (this.endDate < this.startDate) {
      this.message = 'End date cannot be before start date.';
      return;
    }

    const bookings = this.dataService.getBookings();
    bookings.push({
      id: crypto.randomUUID(),
      userId: me.id,
      userName: me.fullName,
      vehicleId: vehicle.id,
      vehicleName: vehicle.vehicleName,
      driverId: vehicle.driverId,
      driverName: vehicle.driverName,
      tripType: this.tripType,
      startDate: this.startDate,
      endDate: this.endDate,
      totalKm: Number(this.totalKm),
      totalAmount: this.calculateAmount(vehicle, this.totalKm),
      status: 'pending_driver'
    });
    this.dataService.saveBookings(bookings);
    this.message = 'Vehicle booking request sent. Waiting for driver approval.';
  }

  private calculateAmount(vehicle: Vehicle, totalKm: number): number {
    const base = vehicle.basePrice200Km;
    if (totalKm <= 200) {
      return base;
    }
    const extraKm = totalKm - 200;
    return base + extraKm * vehicle.extraPricePerKm;
  }

  bookingStatusLabel(status: Booking['status']): string {
    if (status === 'pending_driver') return 'Pending Driver Approval';
    if (status === 'confirmed') return 'Confirmed by Driver';
    if (status === 'cancelled') return 'Cancelled by Driver';
    if (status === 'completed') return 'Completed';
    return status;
  }
}
