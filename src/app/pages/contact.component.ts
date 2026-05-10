import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-hero mb-4">
      <div class="container py-4">
        <p class="eyebrow mb-2">Get in touch</p>
        <h1 class="hero-h1 text-white mb-2">We’re here to help</h1>
        <p class="lead text-white-50 mb-0">Bookings, verification, accounts — reach us anytime during service hours.</p>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <div class="contact-tile h-100 text-center">
          <div class="icon-wrap mx-auto mb-3"><i class="bi bi-envelope-fill"></i></div>
          <h3>Email</h3>
          <p class="small mb-0"><a class="link-cta" href="mailto:support@ridemitra.com">support&#64;ridemitra.com</a></p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="contact-tile h-100 text-center">
          <div class="icon-wrap mx-auto mb-3"><i class="bi bi-telephone-fill"></i></div>
          <h3>Phone</h3>
          <p class="small mb-0"><a class="link-cta" href="tel:+919876543210">+91 98765 43210</a></p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="contact-tile h-100 text-center">
          <div class="icon-wrap mx-auto mb-3"><i class="bi bi-geo-alt-fill"></i></div>
          <h3>Office</h3>
          <p class="small mb-0">Pune, Maharashtra, India</p>
        </div>
      </div>
    </div>

    <section class="card mt-3">
      <h2>Service hours</h2>
      <p class="mb-2"><strong>Daily:</strong> 8:00 AM – 10:00 PM (IST)</p>
      <p class="mb-0">
        For urgent wedding or transport bookings, call the helpline. For document verification status, email us with
        your registered phone number.
      </p>
    </section>

    <div class="text-center mt-3">
      <a routerLink="/register" class="btn btn-cta btn-sm px-4">Create account</a>
    </div>
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
        max-width: 36rem;
      }
      .text-white-50 {
        color: rgba(255, 255, 255, 0.78) !important;
      }
      .contact-tile {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 1.5rem 1rem;
        box-shadow: var(--shadow);
      }
      .icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--cta), var(--cta-dark));
        color: #fff;
        font-size: 1.35rem;
      }
      .link-cta {
        color: var(--cta);
        font-weight: 700;
      }
      .link-cta:hover {
        text-decoration: underline;
      }
    `
  ]
})
export class ContactComponent {}
