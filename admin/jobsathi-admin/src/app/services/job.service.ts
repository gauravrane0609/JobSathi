import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobService {
  private api = environment.apiUrl + '/jobs';

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      }),
    };
  }

  // =======================
  // ADMIN METHODS
  // =======================

  getJobs(): Observable<any> {
    return this.http.get<any>(this.api, this.authHeaders());
  }

  createJob(job: any): Observable<any> {
    return this.http.post(this.api, job, this.authHeaders());
  }

  updateJob(id: string, job: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, job, this.authHeaders());
  }

  deleteJob(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`, this.authHeaders());
  }

  // Cache helper: clear client cache key so client apps refresh on next load
  clearClientCache() {
    try {
      localStorage.removeItem('jobs_cache_v1');
    } catch (e) {
      // ignore
    }
  }

  // =======================
  // CLIENT METHODS (optional)
  // =======================

  searchJobs(query: string, page = 1, limit = 20): Observable<any> {
    return this.http.get<any>(
      `${this.api}?q=${query}&page=${page}&limit=${limit}`
    );
  }
}
