import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminSubscriberService {
  constructor(private http: HttpClient) {}

  getSubscribers() {
    return this.http.get<any[]>('/api/admin/subscribers');
  }

  deleteSubscriber(id: string) {
    return this.http.delete(`/api/admin/subscribers/${id}`);
  }
}
