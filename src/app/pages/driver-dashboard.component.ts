import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking, UploadedFile, Vehicle } from '../models/models';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

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
          <small>Selected: {{ rcFile.fileName || 'Not uploaded' }}</small>
        </div>
        <div>
          <label>Insurance Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'insurance')" />
          <small>Selected: {{ insuranceFile.fileName || 'Not uploaded' }}</small>
        </div>
        <div>
          <label>PUC Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'puc')" />
          <small>Selected: {{ pucFile.fileName || 'Not uploaded' }}</small>
        </div>
        <div>
          <label>Permit Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'permit')" />
          <small>Selected: {{ permitFile.fileName || 'Not uploaded' }}</small>
        </div>
        <div>
          <label>License Upload (Required)</label>
          <input type="file" (change)="onFileChange($event, 'license')" />
          <small>Selected: {{ licenseFile.fileName || 'Not uploaded' }}</small>
        </div>
      </div>

      <button class="btn btn-primary" style="margin-top: 12px;" (click)="saveVehicle()">
        {{ editingVehicleId ? 'Update Vehicle' : 'Register Vehicle' }}
      </button>
      <button *ngIf="editingVehicleId" class="btn btn-secondary" style="margin-top: 12px; margin-left: 8px;" (click)="cancelEdit()">
        Cancel Edit
      </button>
      <p>{{ message }}</p>
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
            <td>{{ b.startDate }}</td>
            <td>{{ b.endDate }}</td>
            <td>Rs {{ b.totalAmount }}</td>
            <td>{{ bookingStatusLabel(b.status) }}</td>
            <td>
              <button class="btn btn-primary" *ngIf="canTakeBookingAction(b.status)" (click)="acceptBooking(b.id)">Accept</button>
              <button class="btn btn-secondary" style="margin-left: 8px;" *ngIf="canTakeBookingAction(b.status)" (click)="rejectBooking(b.id)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `
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
  message = '';

  constructor(
    private readonly authService: AuthService,
    private readonly dataService: DataService,
    private readonly router: Router
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

  acceptBooking(bookingId: string): void {
    const all = this.dataService.getBookings();
    const booking = all.find((b) => b.id === bookingId);
    if (!booking) {
      return;
    }
    booking.status = 'confirmed';
    this.dataService.saveBookings(all);
  }

  rejectBooking(bookingId: string): void {
    const all = this.dataService.getBookings();
    const booking = all.find((b) => b.id === bookingId);
    if (!booking) {
      return;
    }
    booking.status = 'cancelled';
    this.dataService.saveBookings(all);
  }

  saveVehicle(): void {
    const me = this.authService.getCurrentUser();
    if (!me || me.role !== 'driver') {
      this.message = 'Please login as driver.';
      return;
    }
    if (!this.vehicleName || !this.numberPlate || !this.vehicleType) {
      this.message = 'Vehicle name, type and number plate are required.';
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
      this.message = 'All documents are required (RC, Insurance, PUC, Permit, License).';
      return;
    }

    const vehicles = this.dataService.getVehicles();
    if (this.editingVehicleId) {
      const index = vehicles.findIndex((v) => v.id === this.editingVehicleId && v.driverId === me.id);
      if (index === -1) {
        this.message = 'Vehicle not found for update.';
        return;
      }
      vehicles[index] = {
        ...vehicles[index],
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
      this.message = 'Vehicle updated and sent for admin re-approval.';
    } else {
      vehicles.push({
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
      this.message = 'Vehicle registered and sent for admin approval.';
    }
    this.dataService.saveVehicles(vehicles);
    this.resetForm();
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
    this.message = 'Editing vehicle. Update details and save.';
  }

  cancelEdit(): void {
    this.resetForm();
    this.message = 'Edit cancelled.';
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
