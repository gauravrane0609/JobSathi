import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css'],
})
export class SubscribersComponent implements OnInit {
  subscribers: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSubscribers();
  }

  fetchSubscribers() {
    this.loading = true;
    this.error = null;

    // ✅ CORRECT ADMIN ENDPOINT
    const url = `${environment.apiUrl}/admin/subscribers`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        console.log('Subscribers response:', data);
        this.subscribers = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Subscribers fetch error:', err);
        const status = err?.status;
        const msg =
          err?.error?.message ||
          err?.statusText ||
          'Failed to load subscribers';
        this.error = status ? `${status} — ${msg}` : msg;
        this.loading = false;
      },
    });
  }

  removeSubscriber(id: string) {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;

    const url = `${environment.apiUrl}/admin/subscribers/${id}`;

    this.http.delete(url).subscribe({
      next: () => {
        this.subscribers = this.subscribers.filter(s => s._id !== id);
      },
      error: () => {
        alert('Failed to remove subscriber');
      },
    });
  }
}
