import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section class="card">
      <h2>Contact Us</h2>
      <p><strong>Support Email:</strong> support&#64;rent.com</p>
      <p><strong>Phone:</strong> +91 98765 43210</p>
      <p><strong>Address:</strong> Pune, Maharashtra, India</p>
      <p>For urgent bookings or vehicle verification help, call us directly.</p>
    </section>
  `
})
export class ContactComponent {}
