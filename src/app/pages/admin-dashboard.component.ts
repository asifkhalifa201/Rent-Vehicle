import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, UploadedFile, Vehicle } from '../models/models';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <h2>Admin Dashboard</h2>
      <p>Approve vehicles after reviewing all submitted documents.</p>
      <table>
        <thead>
          <tr>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Docs</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let v of vehicles">
            <td>{{ v.driverName }}</td>
            <td>{{ v.vehicleName }} ({{ v.vehicleType }})</td>
            <td>
              RC:
              <a href="javascript:void(0)" (click)="downloadDocument(v.documents.rcFile)">
                {{ toUpload(v.documents.rcFile).fileName || 'Not uploaded' }}
              </a>
              <br />
              Insurance:
              <a href="javascript:void(0)" (click)="downloadDocument(v.documents.insuranceFile)">
                {{ toUpload(v.documents.insuranceFile).fileName || 'Not uploaded' }}
              </a>
              <br />
              PUC:
              <a href="javascript:void(0)" (click)="downloadDocument(v.documents.pucFile)">
                {{ toUpload(v.documents.pucFile).fileName || 'Not uploaded' }}
              </a>
              <br />
              Permit:
              <a href="javascript:void(0)" (click)="downloadDocument(v.documents.permitFile)">
                {{ toUpload(v.documents.permitFile).fileName || 'Not uploaded' }}
              </a>
              <br />
              License:
              <a href="javascript:void(0)" (click)="downloadDocument(v.documents.licenseFile)">
                {{ toUpload(v.documents.licenseFile).fileName || 'Not uploaded' }}
              </a>
            </td>
            <td>Rs {{ v.basePrice200Km }} + {{ v.extraPricePerKm }}/km</td>
            <td>{{ getStatusLabel(v) }}</td>
            <td>
              <button class="btn btn-primary" *ngIf="v.approvalStatus !== 'approved'" (click)="approve(v.id)">Approve</button>
              <button class="btn btn-secondary" style="margin-left: 8px;" *ngIf="v.approvalStatus !== 'rejected'" (click)="reject(v.id)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h3>All Transactions / Bookings</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Trip Type</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of bookings">
            <td>{{ b.userName }}</td>
            <td>{{ b.driverName }}</td>
            <td>{{ b.vehicleName }}</td>
            <td>{{ b.tripType }}</td>
            <td>{{ b.startDate }}</td>
            <td>{{ b.endDate }}</td>
            <td>Rs {{ b.totalAmount }}</td>
            <td>{{ bookingStatusLabel(b.status) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class AdminDashboardComponent {
  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    if (!this.authService.hasRole('admin')) {
      this.router.navigateByUrl('/login');
    }
  }

  get vehicles(): Vehicle[] {
    return this.dataService.getVehicles();
  }

  get bookings(): Booking[] {
    return this.dataService.getBookings();
  }

  approve(vehicleId: string): void {
    const all = this.dataService.getVehicles();
    const vehicle = all.find((v) => v.id === vehicleId);
    if (!vehicle) return;
    vehicle.approved = true;
    vehicle.approvalStatus = 'approved';
    this.dataService.saveVehicles(all);
  }

  reject(vehicleId: string): void {
    const all = this.dataService.getVehicles();
    const vehicle = all.find((v) => v.id === vehicleId);
    if (!vehicle) return;
    vehicle.approved = false;
    vehicle.approvalStatus = 'rejected';
    this.dataService.saveVehicles(all);
  }

  toUpload(input: unknown): UploadedFile {
    if (!input) return { fileName: '', dataUrl: '' };
    if (typeof input === 'object' && input !== null && 'fileName' in input && 'dataUrl' in input) {
      return input as UploadedFile;
    }
    if (typeof input === 'string') {
      return { fileName: input, dataUrl: '' };
    }
    return { fileName: '', dataUrl: '' };
  }

  downloadDocument(input: unknown): void {
    const upload = this.toUpload(input);
    if (!upload.fileName || !upload.dataUrl) {
      alert('Document file is missing. Ask driver to re-upload this document.');
      return;
    }

    const link = document.createElement('a');
    link.href = upload.dataUrl;
    link.download = upload.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStatusLabel(vehicle: Vehicle): string {
    if (vehicle.approvalStatus === 'approved' || vehicle.approved) {
      return 'Approved';
    }
    if (vehicle.approvalStatus === 'rejected') {
      return 'Rejected';
    }
    return 'Pending';
  }

  bookingStatusLabel(status: Booking['status']): string {
    if (status === 'pending_driver') return 'Pending Driver';
    if (status === 'confirmed') return 'Confirmed';
    if (status === 'cancelled') return 'Cancelled';
    if (status === 'completed') return 'Completed';
    return status;
  }
}
