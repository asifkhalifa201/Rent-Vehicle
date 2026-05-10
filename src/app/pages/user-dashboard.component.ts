import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Booking, Vehicle } from '../models/models';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { ConfirmDialogService } from '../ui/confirm-dialog.service';
import { NoticeDialogService } from '../ui/notice-dialog.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="card">
      <h2>User Booking Panel</h2>
      <p>Only admin-approved vehicles are shown.</p>

      <label>Total passengers</label>
      <input
        type="number"
        min="1"
        [(ngModel)]="passengerCount"
        (ngModelChange)="onPassengerChange()"
      />
      <p class="hint-line">
        Vehicle list shows only seats <strong>≥ {{ minPassengers }}</strong> (your passenger count).
      </p>

      <label>Select Vehicle (Vehicle — Driver — Seats)</label>
      <select [(ngModel)]="selectedVehicleId">
        <option [ngValue]="''">Select</option>
        <option *ngFor="let v of filteredVehicles" [ngValue]="v.id">
          {{ v.vehicleName }} ({{ v.vehicleType }}) — {{ v.driverName }} — {{ v.seating }} seats
        </option>
      </select>
      <p *ngIf="filteredVehicles.length === 0" class="warn-line">
        No approved vehicles match this passenger count. Try a lower number or check back later.
      </p>

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
      <p class="hint-line">Booking stays pending until the driver confirms or cancels.</p>
      <p *ngIf="previewAmount" class="preview-line">Estimated amount: Rs {{ previewAmount }}</p>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h3>My Bookings</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Type</th>
              <th>Passengers</th>
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
              <td>{{ b.passengerCount }}</td>
              <td>{{ b.startDate }}</td>
              <td>{{ b.endDate }}</td>
              <td>{{ b.totalKm }}</td>
              <td>Rs {{ b.totalAmount }}</td>
              <td>{{ bookingStatusLabel(b.status) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [
    `
      .hint-line {
        font-size: 14px;
        color: var(--muted);
        margin-top: 6px;
      }
      .warn-line {
        font-size: 14px;
        color: var(--warn, #ea580c);
        margin-top: 8px;
        font-weight: 600;
      }
      .preview-line {
        font-weight: 700;
        color: var(--text);
      }
      .table-wrap {
        overflow-x: auto;
      }
    `
  ]
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  selectedVehicleId = '';
  tripType: 'wedding' | 'trip' | 'transport' = 'wedding';
  todayDate = new Date().toISOString().split('T')[0];
  startDate = '';
  endDate = '';
  totalKm = 200;
  passengerCount: number | string = 1;

  private querySub?: Subscription;

  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notice: NoticeDialogService,
    private readonly confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    if (!this.authService.hasRole('user')) {
      const q = { ...this.route.snapshot.queryParams };
      this.router.navigate(['/login'], { queryParams: Object.keys(q).length ? q : {} });
      return;
    }
    this.querySub = this.route.queryParamMap.subscribe((pm) => {
      this.applyQueryPrefill(pm);
      this.onPassengerChange();
    });
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
  }

  get minPassengers(): number {
    const n = Math.floor(Number(this.passengerCount));
    return !Number.isNaN(n) && n >= 1 ? n : 1;
  }

  get approvedVehicles(): Vehicle[] {
    return this.dataService.getVehicles().filter((v) => v.approvalStatus === 'approved' || v.approved);
  }

  get filteredVehicles(): Vehicle[] {
    return this.approvedVehicles.filter((v) => v.seating >= this.minPassengers);
  }

  get myBookings(): Booking[] {
    const me = this.authService.getCurrentUser();
    return this.dataService.getBookings().filter((b) => b.userId === me?.id);
  }

  get previewAmount(): number {
    const vehicle = this.filteredVehicles.find((v) => v.id === this.selectedVehicleId);
    if (!vehicle) return 0;
    return this.calculateAmount(vehicle, this.totalKm);
  }

  onPassengerChange(): void {
    this.passengerCount = this.minPassengers;
    const sel = this.selectedVehicleId;
    if (sel && !this.filteredVehicles.some((v) => v.id === sel)) {
      this.selectedVehicleId = '';
    }
  }

  bookVehicle(): void {
    const me = this.authService.getCurrentUser();
    const vehicle = this.filteredVehicles.find((v) => v.id === this.selectedVehicleId);
    if (!me || me.role !== 'user' || !vehicle) {
      this.notice.show('Please select a vehicle that fits your passenger count.', 'error');
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.notice.show('Please select both start date and end date.', 'error');
      return;
    }
    if (this.startDate < this.todayDate) {
      this.notice.show('Start date cannot be before today.', 'error');
      return;
    }
    if (this.endDate < this.startDate) {
      this.notice.show('End date cannot be before start date.', 'error');
      return;
    }
    if (vehicle.seating < this.minPassengers) {
      this.notice.show('Selected vehicle does not have enough seats.', 'error');
      return;
    }

    this.confirm
      .confirm(
        `Send booking request to ${vehicle.driverName} for ${vehicle.vehicleName} (${this.tripType}, ${this.minPassengers} passengers)?`,
        { title: 'Confirm booking', confirmText: 'Send request', cancelText: 'Go back' }
      )
      .subscribe((ok) => {
        if (!ok) {
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
          passengerCount: this.minPassengers,
          totalKm: Number(this.totalKm),
          totalAmount: this.calculateAmount(vehicle, this.totalKm),
          status: 'pending_driver'
        });
        this.dataService.saveBookings(bookings);
        this.notice.show('Booking request sent. Waiting for driver approval.', 'success');
      });
  }

  private applyQueryPrefill(q: ParamMap): void {
    const p = q.get('p') ?? q.get('passengers');
    if (p) {
      const n = Math.floor(Number(p));
      if (!Number.isNaN(n) && n >= 1) {
        this.passengerCount = n;
      }
    }
    const trip = q.get('trip');
    if (trip === 'wedding' || trip === 'trip' || trip === 'transport') {
      this.tripType = trip;
    }
    const from = q.get('from');
    const to = q.get('to');
    if (from) this.startDate = from;
    if (to) this.endDate = to;
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
    if (status === 'pending_driver') return 'Pending driver approval';
    if (status === 'confirmed') return 'Confirmed by driver';
    if (status === 'cancelled') return 'Cancelled by driver';
    if (status === 'completed') return 'Completed';
    return status;
  }
}
