import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-hero mb-4">
      <div class="container py-4">
        <p class="eyebrow mb-2">About Car Rent</p>
        <h1 class="hero-h1 text-white mb-2">We connect people with verified vehicles</h1>
        <p class="lead text-white-50 mb-0">
          Wedding travel, family tours and transport — simple booking, clear pricing, and documents you can trust.
        </p>
      </div>
    </div>

    <section class="card mb-3">
      <p>
        Car Rent is a booking platform where users find admin-approved vehicles listed by registered drivers.
        Every listing is backed by RC, insurance, PUC, permit and license checks before it goes live.
      </p>
      <p class="mb-0">
        Our goal is transparent pricing, driver confirmation on each request, and privacy: users see only their
        bookings; drivers see only their fleet and requests.
      </p>
    </section>

    <div class="row g-3 mb-3">
      <div class="col-md-4">
        <div class="mini-tile h-100">
          <h3><i class="bi bi-bullseye text-primary me-2"></i>Mission</h3>
          <p class="small mb-0">
            Safe, verified transport for every wedding, trip and logistics need — with fair, understandable pricing.
          </p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="mini-tile h-100">
          <h3><i class="bi bi-eye text-primary me-2"></i>Vision</h3>
          <p class="small mb-0">
            A trusted digital network where customers, drivers and admins collaborate with clarity and confidence.
          </p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="mini-tile h-100">
          <h3><i class="bi bi-hand-thumbs-up text-primary me-2"></i>Promise</h3>
          <p class="small mb-0">
            Honest statuses, document-verified vehicles, and support when you need it.
          </p>
        </div>
      </div>
    </div>

    <section class="card mb-3">
      <h2>What makes us different</h2>
      <div class="row g-3">
        <div class="col-md-6">
          <h3>Admin verification</h3>
          <p class="small mb-0">Only approved vehicles appear in the user booking list.</p>
        </div>
        <div class="col-md-6">
          <h3>Driver control</h3>
          <p class="small mb-0">Drivers manage vehicles, pricing, and accept or decline booking requests.</p>
        </div>
        <div class="col-md-6">
          <h3>User protection</h3>
          <p class="small mb-0">Users see only their own bookings and statuses.</p>
        </div>
        <div class="col-md-6">
          <h3>Practical pricing</h3>
          <p class="small mb-0">Base package for 200 km plus per-km extras — no surprises.</p>
        </div>
      </div>
    </section>

    <section class="card mb-3">
      <h2>Roles on the platform</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <h3>User</h3>
          <p class="small mb-0">
            Register, browse verified vehicles, send requests, and track driver confirmation.
          </p>
        </div>
        <div class="col-md-4">
          <h3>Driver</h3>
          <p class="small mb-0">
            Register vehicles, upload documents, set rates, and respond to booking requests.
          </p>
        </div>
        <div class="col-md-4">
          <h3>Admin</h3>
          <p class="small mb-0">
            Review documents, approve or reject vehicles, and monitor bookings and activity.
          </p>
        </div>
      </div>
    </section>

    <section class="card cta-strip d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
      <div>
        <h2 class="text-white mb-1">Questions?</h2>
        <p class="text-white-50 small mb-0">We’re here for bookings, verification and account help.</p>
      </div>
      <a routerLink="/contact" class="btn btn-light btn-sm fw-bold px-4">Contact support</a>
    </section>
  `,
  styles: [
    `
      .page-hero {
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        width: 100vw;
        max-width: 100vw;
        background: var(--hero-gradient);
      }
      .eyebrow {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--accent-sky);
      }
      .hero-h1 {
        font-size: clamp(1.5rem, 3.5vw, 2rem);
        font-weight: 800;
      }
      .lead {
        font-size: 16px;
        max-width: 40rem;
      }
      .text-white-50 {
        color: rgba(255, 255, 255, 0.78) !important;
      }
      .cta-strip {
        background: linear-gradient(135deg, #0c1929, #1e3a5f);
        border: none;
        color: #fff;
      }
      .cta-strip h2 {
        color: #fff;
        font-size: 18px;
      }
      .text-primary {
        color: var(--cta) !important;
      }
      .mini-tile {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 1.25rem;
        box-shadow: var(--shadow);
      }
    `
  ]
})
export class AboutComponent {}
