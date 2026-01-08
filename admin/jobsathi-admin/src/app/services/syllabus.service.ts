import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SyllabusService {
  private api = `${environment.apiUrl}/syllabus`;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      }),
    };
  }

  getSyllabus() {
    return this.http.get<any>(`${this.api}/admin`, this.authHeaders());
  }

  createSyllabus(form: FormData) {
    return this.http.post(this.api, form, this.authHeaders());
  }

  updateSyllabus(id: string, form: FormData) {
    return this.http.put(`${this.api}/${id}`, form, this.authHeaders());
  }

  deleteSyllabus(id: string) {
    return this.http.delete(`${this.api}/${id}`, this.authHeaders());
  }

  clearClientCache() {
    try {
      localStorage.removeItem('syllabus_cache_v1');
    } catch (e) {}
  }
}
