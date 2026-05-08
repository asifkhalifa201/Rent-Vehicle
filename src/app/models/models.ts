export type Role = 'user' | 'driver' | 'admin';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}

export interface VehicleDocuments {
  rcFile: UploadedFile;
  insuranceFile: UploadedFile;
  pucFile: UploadedFile;
  permitFile: UploadedFile;
  licenseFile: UploadedFile;
}

export interface UploadedFile {
  fileName: string;
  dataUrl: string;
}

export interface Vehicle {
  id: string;
  driverId: string;
  driverName: string;
  vehicleType: string;
  vehicleName: string;
  numberPlate: string;
  seating: number;
  basePrice200Km: number;
  extraPricePerKm: number;
  documents: VehicleDocuments;
  approved: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  tripType: 'wedding' | 'trip' | 'transport';
  startDate: string;
  endDate: string;
  totalKm: number;
  totalAmount: number;
  status: 'pending_driver' | 'confirmed' | 'cancelled' | 'completed';
}
