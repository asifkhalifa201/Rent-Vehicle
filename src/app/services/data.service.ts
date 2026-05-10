import { Injectable } from '@angular/core';
import { AppUser, Booking, Vehicle } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly usersKey = 'app_users';
  private readonly vehiclesKey = 'app_vehicles';
  private readonly bookingsKey = 'app_bookings';

  constructor() {
    this.ensureSeedData();
  }

  getUsers(): AppUser[] {
    return this.read<AppUser>(this.usersKey);
  }

  saveUsers(users: AppUser[]): void {
    this.write(this.usersKey, users);
  }

  getVehicles(): Vehicle[] {
    return this.read<Vehicle>(this.vehiclesKey);
  }

  saveVehicles(vehicles: Vehicle[]): void {
    this.write(this.vehiclesKey, vehicles);
  }

  getBookings(): Booking[] {
    const bookings = this.read<Booking>(this.bookingsKey).map((booking) => {
      const normalizedStatus = this.normalizeBookingStatus(String(booking.status ?? 'pending_driver'));
      const pc = Number((booking as { passengerCount?: number }).passengerCount);
      return {
        ...booking,
        endDate: booking.endDate ?? booking.startDate ?? '',
        passengerCount: !Number.isNaN(pc) && pc >= 1 ? pc : 1,
        status: normalizedStatus
      };
    });
    this.saveBookings(bookings);
    return bookings;
  }

  saveBookings(bookings: Booking[]): void {
    this.write(this.bookingsKey, bookings);
  }

  private ensureSeedData(): void {
    if (this.getUsers().length === 0) {
      this.saveUsers([
        {
          id: 'admin-1',
          fullName: 'System Admin',
          email: 'admin@rent.com',
          password: 'admin123',
          phone: '9000000000',
          role: 'admin'
        }
      ]);
    }
  }

  private read<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  }

  private write<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private normalizeBookingStatus(status: string): Booking['status'] {
    if (status === 'accepted') return 'confirmed';
    if (status === 'rejected') return 'cancelled';
    if (status === 'booked') return 'pending_driver';
    if (status === 'pending_driver' || status === 'confirmed' || status === 'cancelled' || status === 'completed') {
      return status;
    }
    return 'pending_driver';
  }
}
