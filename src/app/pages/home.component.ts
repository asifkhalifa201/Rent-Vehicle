import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero card mb-3">
      <div>
        <div>
          <h1><i class="bi bi-stars me-2"></i>Book Verified Vehicles for Wedding, Tour and Transport</h1>
          <p>
        Reliable rental platform for families, event planners, businesses and travelers.
        Explore cars, traveller 17-seater, traveller bus, tempo and truck with verified drivers.
          </p>
          <p>
        Every vehicle is document-checked by admin before listing, so users can book with confidence and transparent pricing.
          </p>
          <div class="d-flex gap-2 flex-wrap mt-2">
            <span class="badge text-bg-dark"><i class="bi bi-shield-check me-1"></i>Verified Vehicles</span>
            <span class="badge text-bg-primary"><i class="bi bi-cash-coin me-1"></i>Transparent Pricing</span>
            <span class="badge text-bg-secondary"><i class="bi bi-clock-history me-1"></i>Quick Booking</span>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-3">
      <article class="col-md-6 col-lg-3">
        <div class="card h-100">
        <h3><i class="bi bi-gem me-2"></i>Wedding Rentals</h3>
        <p>Luxury and family cars with professional drivers for bride, groom and guests.</p>
        </div>
      </article>
      <article class="col-md-6 col-lg-3">
        <div class="card h-100">
        <h3><i class="bi bi-geo-alt-fill me-2"></i>Trip Rentals</h3>
        <p>Outstation and city trip options for family vacations, group tours and corporate travel.</p>
        </div>
      </article>
      <article class="col-md-6 col-lg-3">
        <div class="card h-100">
        <h3><i class="bi bi-truck-front-fill me-2"></i>Transport Rentals</h3>
        <p>Tempo and truck bookings for shifting, business delivery and goods transportation.</p>
        </div>
      </article>
      <article class="col-md-6 col-lg-3">
        <div class="card h-100">
        <h3><i class="bi bi-file-earmark-check-fill me-2"></i>Verified Documents</h3>
        <p>RC, Insurance, PUC, Permit and License are checked before vehicle approval.</p>
        </div>
      </article>
    </section>

    <section class="card mt-3">
      <h2>How Booking Works</h2>
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <div class="step-box">
          <h3><i class="bi bi-person-check-fill me-2"></i>1. Register & Login</h3>
          <p>Create an account as user, then login to start booking verified vehicles.</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="step-box">
          <h3><i class="bi bi-ui-checks-grid me-2"></i>2. Select Vehicle</h3>
          <p>Choose vehicle type and driver from approved list, then add trip details and dates.</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="step-box">
          <h3><i class="bi bi-person-badge-fill me-2"></i>3. Driver Confirmation</h3>
          <p>Driver receives your request and confirms or cancels based on availability.</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="step-box">
          <h3><i class="bi bi-rocket-takeoff-fill me-2"></i>4. Start Journey</h3>
          <p>Once confirmed, your booking is secured and ready for wedding, trip or transport.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-3 mt-1">
      <article class="col-lg-7">
        <div class="card h-100">
        <h2><i class="bi bi-receipt-cutoff me-2"></i>Pricing Transparency</h2>
        <p>
          Base fare is set by driver per day for 200 KM. If total distance crosses 200 KM,
          extra per-KM charges are added automatically so users always know expected cost.
        </p>
        <p>
          Example: Base Rs 5000 (200 KM) + Rs 15 per extra KM. For 240 KM trip: Rs 5000 + (40 x 15) = Rs 5600.
        </p>
        </div>
      </article>
      <article class="col-lg-5">
        <div class="card h-100">
        <h2><i class="bi bi-headset me-2"></i>Coverage & Support</h2>
        <p>Support available for booking help, vehicle verification questions and account issues.</p>
        <p><strong>Customer Care:</strong> +91 98765 43210</p>
        <p><strong>Email:</strong> support&#64;rent.com</p>
        <p><strong>Service Hours:</strong> 8:00 AM - 10:00 PM</p>
        </div>
      </article>
    </section>

    <section class="card mt-3">
      <h2>Why Choose Our Platform</h2>
      <div class="row g-3">
        <div class="col-md-6 col-lg-3">
          <div class="feature-box">
          <h3><i class="bi bi-shield-lock-fill me-2"></i>Safety First</h3>
          <p>Admin review ensures only valid and complete document vehicles are visible to users.</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="feature-box">
          <h3><i class="bi bi-person-lock me-2"></i>Role-Based Privacy</h3>
          <p>User sees only own bookings, driver sees only own vehicles and requests, admin sees all.</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="feature-box">
          <h3><i class="bi bi-lightning-fill me-2"></i>Simple Workflow</h3>
          <p>Easy registration, quick booking request, driver confirmation and transparent status tracking.</p>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="feature-box">
          <h3><i class="bi bi-collection-fill me-2"></i>Built for Multiple Needs</h3>
          <p>One platform for marriage events, tours, office travel and transport logistics.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .step-box,
      .feature-box {
        border: 1px dashed var(--border);
        border-radius: 12px;
        padding: 14px;
        height: 100%;
        background: color-mix(in srgb, var(--surface) 92%, var(--primary) 8%);
      }
    `
  ]
})
export class HomeComponent {}
