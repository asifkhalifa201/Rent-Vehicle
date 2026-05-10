import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NoticeDialogService } from '../ui/notice-dialog.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="home-hero-bleed hero-section mb-4">
      <div class="container py-5 py-md-5">
        <div class="row align-items-center g-4">
          <div class="col-lg-6">
            <p class="hero-eyebrow mb-2">RideMitra — premium rides</p>
            <h1 class="hero-title text-white mb-3">
              Drive your journey with verified cars &amp; drivers
            </h1>
            <p class="hero-lead text-white-50 mb-4">
              Wedding, tour or transport — book admin-approved vehicles with transparent pricing
              and driver confirmation before you go.
            </p>
            <div class="d-flex flex-wrap gap-2 mb-4">
              <a routerLink="/register" class="btn btn-cta btn-lg px-4">Start booking</a>
              <a routerLink="/about" class="btn btn-outline-light btn-lg px-4">Learn more</a>
            </div>
            <div class="d-flex flex-wrap gap-3 hero-badges">
              <span class="hero-badge"><i class="bi bi-shield-check"></i> Document verified</span>
              <span class="hero-badge"><i class="bi bi-currency-rupee"></i> Clear pricing</span>
              <span class="hero-badge"><i class="bi bi-lightning-charge"></i> Fast requests</span>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="search-panel shadow-lg">
              <h3 class="search-panel-title mb-2">Find a ride</h3>
              <p class="small search-panel-lead mb-3">
                Enter trip details, then continue to your account. We keep these fields on the booking
                screen for logged-in users.
              </p>
              <div class="row g-2 mb-2">
                <div class="col-12">
                  <label class="form-label small fw-bold mb-0" for="home-trip">Trip type</label>
                  <select id="home-trip" class="form-select form-select-sm mt-1 home-form-control" [(ngModel)]="tripType">
                    <option value="wedding">Wedding</option>
                    <option value="trip">Trip</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-0" for="home-from">From</label>
                  <input
                    id="home-from"
                    type="date"
                    class="form-control form-control-sm mt-1 home-form-control"
                    [(ngModel)]="startDate"
                    [min]="todayDate"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold mb-0" for="home-to">To</label>
                  <input
                    id="home-to"
                    type="date"
                    class="form-control form-control-sm mt-1 home-form-control"
                    [(ngModel)]="endDate"
                    [min]="startDate || todayDate"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold mb-0" for="home-pax">Passengers</label>
                  <input
                    id="home-pax"
                    type="number"
                    min="1"
                    class="form-control form-control-sm mt-1 home-form-control"
                    [(ngModel)]="passengers"
                  />
                </div>
              </div>
              <button type="button" class="btn btn-cta w-100 py-2 mt-1" (click)="continueSearch()">
                {{ isUser ? 'Continue to booking' : 'Continue (login or register)' }}
              </button>
              <p class="small text-center search-panel-foot mt-2 mb-0">
                New here?
                <a routerLink="/register" [queryParams]="searchQueryParams" class="link-cta">Create account</a>
                ·
                <a routerLink="/login" [queryParams]="searchQueryParams" class="link-cta">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="row g-3 mb-4 text-center stats-row">
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-num">200<span class="stat-suffix">km</span></div>
          <div class="stat-label">Base day packages</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-num">5+</div>
          <div class="stat-label">Vehicle categories</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-num">24/7</div>
          <div class="stat-label">Support window</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-num">100%</div>
          <div class="stat-label">Admin doc check</div>
        </div>
      </div>
    </section>

    <section class="mb-2">
      <h2 class="section-heading">Choose your ride</h2>
      <p class="section-sub">From compact cars to heavy transport — all listed by verified drivers.</p>
    </section>
    <section class="row g-3 mb-4">
      <div class="col-md-6 col-lg-3">
        <div class="category-card h-100">
          <div class="category-icon"><i class="bi bi-car-front"></i></div>
          <h3>Cars</h3>
          <p class="small mb-0">Sedans &amp; SUVs for weddings and city travel.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="category-card h-100">
          <div class="category-icon"><i class="bi bi-bus-front"></i></div>
          <h3>Traveller 17</h3>
          <p class="small mb-0">Group tours and family outstation trips.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="category-card h-100">
          <div class="category-icon"><i class="bi bi-truck"></i></div>
          <h3>Bus &amp; Tempo</h3>
          <p class="small mb-0">Larger groups and logistics movement.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="category-card h-100">
          <div class="category-icon"><i class="bi bi-truck-flatbed"></i></div>
          <h3>Truck</h3>
          <p class="small mb-0">Goods transport and commercial loads.</p>
        </div>
      </div>
    </section>

    <section class="site-card mb-4">
      <h2 class="section-heading mb-3">How it works</h2>
      <div class="row g-3">
        <div class="col-6 col-md-3">
          <div class="step-card text-center h-100">
            <span class="step-num">1</span>
            <h3 class="mt-2">Sign up</h3>
            <p class="small mb-0">Create a user or driver account in minutes.</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="step-card text-center h-100">
            <span class="step-num">2</span>
            <h3 class="mt-2">Browse</h3>
            <p class="small mb-0">Only admin-approved vehicles appear for booking.</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="step-card text-center h-100">
            <span class="step-num">3</span>
            <h3 class="mt-2">Request</h3>
            <p class="small mb-0">Send dates &amp; trip details; driver confirms or cancels.</p>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="step-card text-center h-100">
            <span class="step-num">4</span>
            <h3 class="mt-2">Go</h3>
            <p class="small mb-0">Confirmed booking — ready for your event or route.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-lg-7">
        <div class="site-card h-100">
          <h2 class="section-heading"><i class="bi bi-receipt me-2 text-primary"></i>Pricing you can trust</h2>
          <p>
            Drivers set a base price for one day including 200 km. Beyond that, per-km charges apply
            so you always know how the total is built.
          </p>
          <p class="mb-0">
            <strong>Example:</strong> Base ₹5,000 + ₹15 × extra km after 200 km.
          </p>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="site-card h-100 cta-side">
          <h2 class="section-heading text-white">Need help?</h2>
          <p class="text-white-50">Our team helps with bookings, documents and account issues.</p>
          <p class="text-white mb-1"><i class="bi bi-telephone me-2"></i>+91 98765 43210</p>
          <p class="text-white mb-3"><i class="bi bi-envelope me-2"></i>support&#64;ridemitra.com</p>
          <a routerLink="/contact" class="btn btn-light btn-sm fw-bold">Contact us</a>
        </div>
      </div>
    </section>

    <section class="site-card">
      <h2 class="section-heading mb-3">Why RideMitra</h2>
      <div class="row g-3">
        <div class="col-md-4">
          <h3><i class="bi bi-patch-check-fill text-primary me-2"></i>Verified fleet</h3>
          <p class="small mb-0">RC, insurance, PUC, permit &amp; license reviewed before listing.</p>
        </div>
        <div class="col-md-4">
          <h3><i class="bi bi-people text-primary me-2"></i>Built for everyone</h3>
          <p class="small mb-0">Separate flows for users, drivers and admins with clear privacy.</p>
        </div>
        <div class="col-md-4">
          <h3><i class="bi bi-graph-up-arrow text-primary me-2"></i>Transparent status</h3>
          <p class="small mb-0">Track pending, confirmed or cancelled bookings in one place.</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-section {
        background: var(--hero-gradient);
        position: relative;
        overflow: hidden;
      }
      .hero-section::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.12), transparent 45%);
        pointer-events: none;
      }
      .hero-section .container {
        position: relative;
        z-index: 1;
      }
      .hero-eyebrow {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--accent-sky);
      }
      .hero-title {
        font-size: clamp(1.75rem, 4.5vw, 2.65rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }
      .hero-lead {
        font-size: 16px;
        max-width: 34rem;
        opacity: 0.92;
      }
      .text-white-50 {
        color: rgba(255, 255, 255, 0.75) !important;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 13px;
        font-weight: 600;
      }
      .search-panel {
        background: var(--surface);
        border-radius: 20px;
        padding: 1.5rem 1.5rem 1.25rem;
        border: 1px solid var(--border);
      }
      .search-panel-title {
        font-size: 18px;
        font-weight: 800;
        color: var(--text);
      }
      .search-panel-lead {
        color: var(--muted);
        line-height: 1.45;
      }
      .search-panel-foot {
        color: var(--muted);
      }
      .home-form-control,
      .search-panel .form-label {
        color: var(--text);
      }
      .home-form-control {
        background: var(--surface);
        border-color: var(--border);
      }
      .link-cta {
        color: var(--cta);
        font-weight: 700;
      }
      .link-cta:hover {
        text-decoration: underline;
      }
      .stats-row .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 1.25rem 1rem;
        box-shadow: var(--shadow);
      }
      .stat-num {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--text);
        line-height: 1;
      }
      .stat-suffix {
        font-size: 1rem;
        font-weight: 700;
      }
      .stat-label {
        font-size: 13px;
        color: var(--muted);
        margin-top: 6px;
        font-weight: 600;
      }
      .section-heading {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 0.25rem;
      }
      .section-sub {
        font-size: 15px;
        color: var(--muted);
        margin-bottom: 0;
      }
      .category-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 1.35rem;
        box-shadow: var(--shadow);
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .category-card:hover {
        transform: translateY(-4px);
        border-color: color-mix(in srgb, var(--cta) 35%, var(--border));
      }
      .category-icon {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--cta), var(--cta-dark));
        color: #fff;
        font-size: 1.35rem;
        margin-bottom: 12px;
      }
      .category-card h3 {
        font-size: 16px;
        font-weight: 800;
        margin-bottom: 8px;
      }
      .step-card {
        background: var(--hover);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 1rem 0.75rem;
      }
      .step-num {
        display: inline-flex;
        width: 36px;
        height: 36px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cta), var(--cta-dark));
        color: #fff;
        font-weight: 800;
        font-size: 15px;
      }
      .step-card h3 {
        font-size: 15px;
        font-weight: 800;
      }
      .cta-side {
        background: linear-gradient(135deg, #0c1929, #1e3a5f);
        border: none;
        color: #fff;
      }
      .cta-side .section-heading {
        color: #fff;
      }
      .text-primary {
        color: var(--cta) !important;
      }
    `
  ]
})
export class HomeComponent {
  tripType: 'wedding' | 'trip' | 'transport' = 'wedding';
  todayDate = new Date().toISOString().split('T')[0];
  startDate = '';
  endDate = '';
  passengers: number | string = 1;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notice: NoticeDialogService
  ) {}

  get isUser(): boolean {
    return this.authService.getCurrentUser()?.role === 'user';
  }

  get searchQueryParams(): Record<string, string> {
    const p = this.normalizedPassengers;
    const q: Record<string, string> = { p: String(p), trip: this.tripType };
    if (this.startDate) q['from'] = this.startDate;
    if (this.endDate) q['to'] = this.endDate;
    return q;
  }

  private get normalizedPassengers(): number {
    const n = Math.floor(Number(this.passengers));
    return !Number.isNaN(n) && n >= 1 ? n : 1;
  }

  continueSearch(): void {
    this.passengers = this.normalizedPassengers;
    if (!this.startDate || !this.endDate) {
      this.notice.show('Please choose both start and end dates.', 'error');
      return;
    }
    if (this.startDate < this.todayDate) {
      this.notice.show('Start date cannot be in the past.', 'error');
      return;
    }
    if (this.endDate < this.startDate) {
      this.notice.show('End date cannot be before start date.', 'error');
      return;
    }

    const queryParams = this.searchQueryParams;
    if (this.isUser) {
      this.router.navigate(['/user-dashboard'], { queryParams });
      return;
    }
    this.router.navigate(['/login'], { queryParams });
  }
}
