import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero card">
      <h1>Book Verified Vehicles for Wedding, Tour and Transport</h1>
      <p>
        Reliable rental platform for families, event planners, businesses and travelers.
        Explore cars, traveller 17-seater, traveller bus, tempo and truck with verified drivers.
      </p>
      <p>
        Every vehicle is document-checked by admin before listing, so users can book with confidence and transparent pricing.
      </p>
    </section>

    <section class="grid" style="grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); margin-top: 16px;">
      <article class="card">
        <h3>Wedding Rentals</h3>
        <p>Luxury and family cars with professional drivers for bride, groom and guests.</p>
      </article>
      <article class="card">
        <h3>Trip Rentals</h3>
        <p>Outstation and city trip options for family vacations, group tours and corporate travel.</p>
      </article>
      <article class="card">
        <h3>Transport Rentals</h3>
        <p>Tempo and truck bookings for shifting, business delivery and goods transportation.</p>
      </article>
      <article class="card">
        <h3>Verified Documents</h3>
        <p>RC, Insurance, PUC, Permit and License are checked before vehicle approval.</p>
      </article>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h2>How Booking Works</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(220px,1fr));">
        <div>
          <h3>1. Register & Login</h3>
          <p>Create an account as user, then login to start booking verified vehicles.</p>
        </div>
        <div>
          <h3>2. Select Vehicle</h3>
          <p>Choose vehicle type and driver from approved list, then add trip details and dates.</p>
        </div>
        <div>
          <h3>3. Driver Confirmation</h3>
          <p>Driver receives your request and confirms or cancels based on availability.</p>
        </div>
        <div>
          <h3>4. Start Journey</h3>
          <p>Once confirmed, your booking is secured and ready for wedding, trip or transport.</p>
        </div>
      </div>
    </section>

    <section class="grid" style="grid-template-columns: 1.2fr 1fr; margin-top: 16px;">
      <article class="card">
        <h2>Pricing Transparency</h2>
        <p>
          Base fare is set by driver per day for 200 KM. If total distance crosses 200 KM,
          extra per-KM charges are added automatically so users always know expected cost.
        </p>
        <p>
          Example: Base Rs 5000 (200 KM) + Rs 15 per extra KM. For 240 KM trip: Rs 5000 + (40 x 15) = Rs 5600.
        </p>
      </article>
      <article class="card">
        <h2>Coverage & Support</h2>
        <p>Support available for booking help, vehicle verification questions and account issues.</p>
        <p><strong>Customer Care:</strong> +91 98765 43210</p>
        <p><strong>Email:</strong> support&#64;rent.com</p>
        <p><strong>Service Hours:</strong> 8:00 AM - 10:00 PM</p>
      </article>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h2>Why Choose Our Platform</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(220px,1fr));">
        <div>
          <h3>Safety First</h3>
          <p>Admin review ensures only valid and complete document vehicles are visible to users.</p>
        </div>
        <div>
          <h3>Role-Based Privacy</h3>
          <p>User sees only own bookings, driver sees only own vehicles and requests, admin sees all.</p>
        </div>
        <div>
          <h3>Simple Workflow</h3>
          <p>Easy registration, quick booking request, driver confirmation and transparent status tracking.</p>
        </div>
        <div>
          <h3>Built for Multiple Needs</h3>
          <p>One platform for marriage events, tours, office travel and transport logistics.</p>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {}
