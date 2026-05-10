import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking, UploadedFile, Vehicle } from '../models/models';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { ConfirmDialogService } from '../ui/confirm-dialog.service';
import { NoticeDialogService } from '../ui/notice-dialog.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="card">
      <h2>Driver Dashboard</h2>
      <p>Register your vehicle with all required RTO documents.</p>
      <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(220px,1fr));">
        <div>
          <label>Vehicle Type</label>
          <select [(ngModel)]="vehicleType">
            <option>Car</option>
            <option>Traveller 17 Seater</option>
            <option>Traveller Bus</option>
            <option>Tempo</option>
            <option>Truck</option>
          </select>
        </div>
        <div>
          <label>Vehicle Name</label>
          <input [(ngModel)]="vehicleName" placeholder="Ertiga" />
        </div>
        <div>
          <label>Number Plate</label>
          <input [(ngModel)]="numberPlate" />
        </div>
        <div>
          <label>Seating Capacity</label>
          <input [(ngModel)]="seating" type="number" />
        </div>
        <div>
          <label>Base Price (1 day / 200 KM)</label>
          <input [(ngModel)]="basePrice200Km" type="number" />
        </div>
        <div>
          <label>Extra Price per KM</label>
          <input [(ngModel)]="extraPricePerKm" type="number" />
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); margin-top: 12px;">
        <div>
          <label>RC Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'rc')" />
          <div class="upload-hint">Selected: {{ rcFile.fileName || 'Not uploaded' }}</div>
        </div>
        <div>
          <label>Insurance Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'insurance')" />
          <div class="upload-hint">Selected: {{ insuranceFile.fileName || 'Not uploaded' }}</div>
        </div>
        <div>
          <label>PUC Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'puc')" />
          <div class="upload-hint">Selected: {{ pucFile.fileName || 'Not uploaded' }}</div>
        </div>
        <div>
          <label>Permit Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'permit')" />
          <div class="upload-hint">Selected: {{ permitFile.fileName || 'Not uploaded' }}</div>
        </div>
        <div>
          <label>License Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'license')" />
          <div class="upload-hint">Selected: {{ licenseFile.fileName || 'Not uploaded' }}</div>
        </div>
      </div>

      <button class="btn btn-primary" style="margin-top: 12px;" (click)="saveVehicle()">
        {{ editingVehicleId ? 'Update Vehicle' : 'Register Vehicle' }}
      </button>
      <button *ngIf="editingVehicleId" class="btn btn-secondary" style="margin-top: 12px; margin-left: 8px;" (click)="cancelEdit()">
        Cancel Edit
      </button>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h3>My Registered Vehicles</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Price (200km)</th>
            <th>Extra/KM</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let v of myVehicles">
            <td>{{ v.vehicleName }}</td>
            <td>{{ v.vehicleType }}</td>
            <td>{{ v.basePrice200Km }}</td>
            <td>{{ v.extraPricePerKm }}</td>
            <td>{{ getStatusLabel(v) }}</td>
            <td><button class="btn btn-secondary" (click)="startEdit(v)">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h3>My Vehicle Bookings</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Vehicle</th>
            <th>Trip Type</th>
            <th>Passengers</th>
            <th>From</th>
            <th>To</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of myBookings">
            <td>{{ b.userName }}</td>
            <td>{{ b.vehicleName }}</td>
            <td>{{ b.tripType }}</td>
            <td>{{ b.passengerCount }}</td>
            <td>{{ b.startDate }}</td>
            <td>{{ b.endDate }}</td>
            <td>Rs {{ b.totalAmount }}</td>
            <td>{{ bookingStatusLabel(b.status) }}</td>
            <td>
              <button class="btn btn-primary" *ngIf="canTakeBookingAction(b.status)" (click)="acceptBooking(b)">Accept</button>
              <button class="btn btn-secondary" style="margin-left: 8px;" *ngIf="canTakeBookingAction(b.status)" (click)="rejectBooking(b)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `,
  styles: [
    `
      .upload-hint {
        display: inline-block;
        margin-top: 6px;
        padding: 4px 10px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: color-mix(in srgb, var(--surface) 86%, var(--primary) 14%);
        color: var(--text) !important;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.35;
      }
    `
  ]
})
export class DriverDashboardComponent {
  editingVehicleId: string | null = null;
  vehicleType = 'Car';
  vehicleName = '';
  numberPlate = '';
  seating = 4;
  basePrice200Km = 5000;
  extraPricePerKm = 15;

  rcFile: UploadedFile = this.emptyUpload();
  insuranceFile: UploadedFile = this.emptyUpload();
  pucFile: UploadedFile = this.emptyUpload();
  permitFile: UploadedFile = this.emptyUpload();
  licenseFile: UploadedFile = this.emptyUpload();

  constructor(
    private readonly authService: AuthService,
    private readonly dataService: DataService,
    private readonly router: Router,
    private readonly notice: NoticeDialogService,
    private readonly confirm: ConfirmDialogService
  ) {
    if (!this.authService.hasRole('driver')) {
      this.router.navigateByUrl('/login');
    }
  }

  get myVehicles(): Vehicle[] {
    const me = this.authService.getCurrentUser();
    return this.dataService.getVehicles().filter((v) => v.driverId === me?.id);
  }

  get myBookings(): Booking[] {
    const me = this.authService.getCurrentUser();
    return this.dataService.getBookings().filter((b) => b.driverId === me?.id);
  }

  acceptBooking(booking: Booking): void {
    const label = `${booking.userName} — ${booking.vehicleName}`;
    this.confirm
      .confirm(`Accept this booking for ${label}?`, {
        title: 'Accept booking',
        confirmText: 'Accept',
        cancelText: 'Go back'
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        const all = this.dataService.getBookings();
        const found = all.find((b) => b.id === booking.id);
        if (!found) {
          this.notice.show('Booking could not be found.', 'error');
          return;
        }
        found.status = 'confirmed';
        this.dataService.saveBookings(all);
        this.notice.show('Booking accepted. The user will see it as confirmed.', 'success');
      });
  }

  rejectBooking(booking: Booking): void {
    const label = `${booking.userName} — ${booking.vehicleName}`;
    this.confirm
      .confirm(`Reject this booking for ${label}?`, {
        title: 'Reject booking',
        danger: true,
        confirmText: 'Reject',
        cancelText: 'Keep pending'
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        const all = this.dataService.getBookings();
        const found = all.find((b) => b.id === booking.id);
        if (!found) {
          this.notice.show('Booking could not be found.', 'error');
          return;
        }
        found.status = 'cancelled';
        this.dataService.saveBookings(all);
        this.notice.show('Booking rejected. The user will see it as cancelled.', 'info');
      });
  }

  saveVehicle(): void {
    const me = this.authService.getCurrentUser();
    if (!me || me.role !== 'driver') {
      this.notice.show('Please login as a driver.', 'error');
      return;
    }
    if (!this.vehicleName || !this.numberPlate || !this.vehicleType) {
      this.notice.show('Vehicle name, type and number plate are required.', 'error');
      return;
    }
    if (
      !this.rcFile.fileName ||
      !this.rcFile.dataUrl ||
      !this.insuranceFile.fileName ||
      !this.insuranceFile.dataUrl ||
      !this.pucFile.fileName ||
      !this.pucFile.dataUrl ||
      !this.permitFile.fileName ||
      !this.permitFile.dataUrl ||
      !this.licenseFile.fileName ||
      !this.licenseFile.dataUrl
    ) {
      this.notice.show('All documents are required (RC, Insurance, PUC, Permit, License).', 'error');
      return;
    }

    const vehicles = this.dataService.getVehicles();
    if (this.editingVehicleId) {
      const index = vehicles.findIndex((v) => v.id === this.editingVehicleId && v.driverId === me.id);
      if (index === -1) {
        this.notice.show('Vehicle not found for update.', 'error');
        return;
      }
    }

    const isEdit = !!this.editingVehicleId;
    this.confirm
      .confirm(
        isEdit
          ? `Submit changes to ${this.vehicleName} and send for admin re-approval?`
          : `Register ${this.vehicleName} (${this.vehicleType}) and send all documents for admin approval?`,
        {
          title: isEdit ? 'Update vehicle' : 'Register vehicle',
          confirmText: isEdit ? 'Submit update' : 'Submit registration',
          cancelText: 'Go back'
        }
      )
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        const all = this.dataService.getVehicles();
        if (this.editingVehicleId) {
          const index = all.findIndex((v) => v.id === this.editingVehicleId && v.driverId === me.id);
          if (index === -1) {
            this.notice.show('Vehicle not found for update.', 'error');
            return;
          }
          all[index] = {
            ...all[index],
            vehicleType: this.vehicleType,
            vehicleName: this.vehicleName,
            numberPlate: this.numberPlate,
            seating: Number(this.seating),
            basePrice200Km: Number(this.basePrice200Km),
            extraPricePerKm: Number(this.extraPricePerKm),
            documents: {
              rcFile: this.rcFile,
              insuranceFile: this.insuranceFile,
              pucFile: this.pucFile,
              permitFile: this.permitFile,
              licenseFile: this.licenseFile
            },
            approved: false,
            approvalStatus: 'pending'
          };
          this.notice.show('Vehicle updated and sent for admin re-approval.', 'success');
        } else {
          all.push({
            id: crypto.randomUUID(),
            driverId: me.id,
            driverName: me.fullName,
            vehicleType: this.vehicleType,
            vehicleName: this.vehicleName,
            numberPlate: this.numberPlate,
            seating: Number(this.seating),
            basePrice200Km: Number(this.basePrice200Km),
            extraPricePerKm: Number(this.extraPricePerKm),
            documents: {
              rcFile: this.rcFile,
              insuranceFile: this.insuranceFile,
              pucFile: this.pucFile,
              permitFile: this.permitFile,
              licenseFile: this.licenseFile
            },
            approved: false,
            approvalStatus: 'pending'
          });
          this.notice.show('Vehicle registered and sent for admin approval.', 'success');
        }
        this.dataService.saveVehicles(all);
        this.resetForm();
      });
  }

  startEdit(vehicle: Vehicle): void {
    this.editingVehicleId = vehicle.id;
    this.vehicleType = vehicle.vehicleType;
    this.vehicleName = vehicle.vehicleName;
    this.numberPlate = vehicle.numberPlate;
    this.seating = vehicle.seating;
    this.basePrice200Km = vehicle.basePrice200Km;
    this.extraPricePerKm = vehicle.extraPricePerKm;
    this.rcFile = this.normalizeUpload(vehicle.documents.rcFile);
    this.insuranceFile = this.normalizeUpload(vehicle.documents.insuranceFile);
    this.pucFile = this.normalizeUpload(vehicle.documents.pucFile);
    this.permitFile = this.normalizeUpload(vehicle.documents.permitFile);
    this.licenseFile = this.normalizeUpload(vehicle.documents.licenseFile);
    this.notice.show('Editing vehicle. Update details and save.', 'info');
  }

  cancelEdit(): void {
    this.resetForm();
    this.notice.show('Edit cancelled.', 'info');
  }

  onFileChange(event: Event, field: 'rc' | 'insurance' | 'puc' | 'permit' | 'license'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const uploaded: UploadedFile = {
        fileName: file.name,
        dataUrl: String(reader.result ?? '')
      };
      if (field === 'rc') this.rcFile = uploaded;
      if (field === 'insurance') this.insuranceFile = uploaded;
      if (field === 'puc') this.pucFile = uploaded;
      if (field === 'permit') this.permitFile = uploaded;
      if (field === 'license') this.licenseFile = uploaded;
    };
    reader.readAsDataURL(file);
  }

  private resetForm(): void {
    this.editingVehicleId = null;
    this.vehicleType = 'Car';
    this.vehicleName = '';
    this.numberPlate = '';
    this.seating = 4;
    this.basePrice200Km = 5000;
    this.extraPricePerKm = 15;
    this.rcFile = this.emptyUpload();
    this.insuranceFile = this.emptyUpload();
    this.pucFile = this.emptyUpload();
    this.permitFile = this.emptyUpload();
    this.licenseFile = this.emptyUpload();
  }

  private emptyUpload(): UploadedFile {
    return { fileName: '', dataUrl: '' };
  }

  private normalizeUpload(input: unknown): UploadedFile {
    if (!input) {
      return this.emptyUpload();
    }
    if (typeof input === 'object' && input !== null && 'fileName' in input && 'dataUrl' in input) {
      const upload = input as UploadedFile;
      return { fileName: upload.fileName ?? '', dataUrl: upload.dataUrl ?? '' };
    }
    if (typeof input === 'string') {
      return { fileName: input, dataUrl: '' };
    }
    return this.emptyUpload();
  }

  getStatusLabel(vehicle: Vehicle): string {
    if (vehicle.approvalStatus === 'approved' || vehicle.approved) {
      return 'Approved';
    }
    if (vehicle.approvalStatus === 'rejected') {
      return 'Rejected by Admin';
    }
    return 'Pending Admin Approval';
  }

  bookingStatusLabel(status: Booking['status']): string {
    if (status === 'pending_driver') return 'Pending';
    if (status === 'confirmed') return 'Confirmed';
    if (status === 'cancelled') return 'Cancelled';
    if (status === 'completed') return 'Completed';
    return status;
  }

  canTakeBookingAction(status: Booking['status'] | string): boolean {
    return status === 'pending_driver' || status === 'booked';
  }
}
