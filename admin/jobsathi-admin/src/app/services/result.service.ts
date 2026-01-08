import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private api = `${environment.apiUrl}/results`;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      }),
    };
  }

  getResults() {
    return this.http.get<any>(`${this.api}/admin`, this.authHeaders());
  }

  createResult(form: FormData) {
    return this.http.post(this.api, form, this.authHeaders());
  }

  updateResult(id: string, form: FormData) {
    return this.http.put(`${this.api}/${id}`, form, this.authHeaders());
  }

  deleteResult(id: string) {
    return this.http.delete(`${this.api}/${id}`, this.authHeaders());
  }

  clearClientCache() {
    try {
      localStorage.removeItem('results_cache_v1');
    } catch (e) {}
  }
}
