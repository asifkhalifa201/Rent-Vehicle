import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, UploadedFile, Vehicle } from '../models/models';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { ConfirmDialogService } from '../ui/confirm-dialog.service';
import { NoticeDialogService } from '../ui/notice-dialog.service';

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
              <button class="btn btn-primary" *ngIf="v.approvalStatus !== 'approved'" (click)="approveVehicle(v)">Approve</button>
              <button class="btn btn-secondary" style="margin-left: 8px;" *ngIf="v.approvalStatus !== 'rejected'" (click)="rejectVehicle(v)">Reject</button>
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
            <th>Passengers</th>
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
            <td>{{ b.passengerCount }}</td>
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
    private readonly router: Router,
    private readonly notice: NoticeDialogService,
    private readonly confirm: ConfirmDialogService
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

  approveVehicle(vehicle: Vehicle): void {
    this.confirm
      .confirm(
        `Approve ${vehicle.vehicleName} (${vehicle.vehicleType}) submitted by ${vehicle.driverName}? Drivers can list it for users once approved.`,
        { title: 'Approve vehicle', confirmText: 'Approve' }
      )
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        const all = this.dataService.getVehicles();
        const found = all.find((v) => v.id === vehicle.id);
        if (!found) {
          this.notice.show('Vehicle not found.', 'error');
          return;
        }
        found.approved = true;
        found.approvalStatus = 'approved';
        this.dataService.saveVehicles(all);
        this.notice.show('Vehicle approved. It can now appear in user search when seats match.', 'success');
      });
  }

  rejectVehicle(vehicle: Vehicle): void {
    this.confirm
      .confirm(
        `Reject ${vehicle.vehicleName} (${vehicle.vehicleType}) for ${vehicle.driverName}? It will be hidden from booking until updated and re-reviewed.`,
        { title: 'Reject vehicle', danger: true, confirmText: 'Reject', cancelText: 'Keep pending' }
      )
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        const all = this.dataService.getVehicles();
        const found = all.find((v) => v.id === vehicle.id);
        if (!found) {
          this.notice.show('Vehicle not found.', 'error');
          return;
        }
        found.approved = false;
        found.approvalStatus = 'rejected';
        this.dataService.saveVehicles(all);
        this.notice.show('Vehicle rejected.', 'info');
      });
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
      this.notice.show('Document file is missing. Ask the driver to re-upload this document.', 'error');
      return;
    }

    const link = document.createElement('a');
    link.href = upload.dataUrl;
    link.download = upload.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.notice.show(`Downloading ${upload.fileName}…`, 'success');
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
