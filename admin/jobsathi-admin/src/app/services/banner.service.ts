import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BannerService {
  constructor(private http: HttpClient) {}

  headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      }),
    };
  }

  getAll() {
    return this.http.get<any[]>(environment.apiUrl + '/banners/all', this.headers());
  }

  upload(form: FormData) {
    return this.http.post(environment.apiUrl + '/banners', form, this.headers());
  }

  toggle(id: string) {
    return this.http.put(
      environment.apiUrl + '/banners/' + id + '/toggle',
      {},
      this.headers()
    );
  }
}
