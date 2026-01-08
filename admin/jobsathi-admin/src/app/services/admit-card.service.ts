import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdmitCardService {
  private api = `${environment.apiUrl}/admit-cards`;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      }),
    };
  }

  getAdmitCards() {
    return this.http.get<any>(`${this.api}/admin`, this.authHeaders());
  }

  createAdmitCard(form: FormData) {
    return this.http.post(this.api, form, this.authHeaders());
  }

  updateAdmitCard(id: string, form: FormData) {
    return this.http.put(`${this.api}/${id}`, form, this.authHeaders());
  }

  deleteAdmitCard(id: string) {
    return this.http.delete(`${this.api}/${id}`, this.authHeaders());
  }

  clearClientCache() {
    try {
      localStorage.removeItem('admit_cache_v1');
    } catch (e) {}
  }
}
