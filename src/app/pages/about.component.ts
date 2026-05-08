import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="card">
      <h2>About Us</h2>
      <p>
        Car Rent is a trusted booking platform for wedding travel, family tours and transport needs.
        We connect users with registered drivers who list cars, traveller 17-seater, traveller bus,
        tempo and truck with clear pricing and verified documents.
      </p>
      <p>
        Our goal is to make rentals simple, transparent and secure for both customers and drivers.
        Before any vehicle goes live, admin verifies RC, Insurance, PUC, Permit and License details.
      </p>
    </section>

    <section class="grid" style="grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); margin-top: 16px;">
      <article class="card">
        <h3>Our Mission</h3>
        <p>
          Deliver safe and verified transport options with easy booking and fair pricing
          for every wedding, trip and transport requirement.
        </p>
      </article>
      <article class="card">
        <h3>Our Vision</h3>
        <p>
          Build a strong digital mobility network where users, drivers and admins work
          together through transparent and trusted workflows.
        </p>
      </article>
      <article class="card">
        <h3>Our Promise</h3>
        <p>
          Accurate booking status, role-based privacy, and document-verified vehicle availability
          so customers book confidently.
        </p>
      </article>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h2>What Makes Us Different</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(220px,1fr));">
        <div>
          <h3>Admin Verification</h3>
          <p>Only approved vehicles appear in user booking list.</p>
        </div>
        <div>
          <h3>Driver Control</h3>
          <p>Drivers manage their own vehicles, pricing and booking requests.</p>
        </div>
        <div>
          <h3>User Protection</h3>
          <p>Users can see only their own bookings and booking statuses.</p>
        </div>
        <div>
          <h3>Practical Pricing</h3>
          <p>Base fare for 200 KM + extra per KM charges gives transparent billing.</p>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h2>Platform Roles and Responsibilities</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(240px,1fr));">
        <div>
          <h3>User</h3>
          <p>
            Register, browse verified vehicles, send booking requests, and track whether driver confirmed or cancelled.
          </p>
        </div>
        <div>
          <h3>Driver</h3>
          <p>
            Register vehicle details, upload documents, set rental pricing, and approve/reject booking requests.
          </p>
        </div>
        <div>
          <h3>Admin</h3>
          <p>
            Validate documents, approve/reject vehicles, and monitor all transactions and booking activity.
          </p>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top: 16px;">
      <h2>Contact and Support</h2>
      <p><strong>Email:</strong> support&#64;rent.com</p>
      <p><strong>Phone:</strong> +91 98765 43210</p>
      <p><strong>Address:</strong> Pune, Maharashtra, India</p>
      <p>
        Need help with booking, profile setup or document verification? Our team is available daily to assist.
      </p>
    </section>
  `
})
export class AboutComponent {}
