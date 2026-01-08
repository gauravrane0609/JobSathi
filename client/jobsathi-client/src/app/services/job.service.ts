import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobService {
  private api = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs() {
    // server may return { data, total, page, limit } or raw array; normalize to array
    return this.http
      .get<any>(this.api)
      .pipe(map((res: any) => (res && res.data ? res.data : res)));
  }

  // Cache helpers using localStorage (simple, shared key)
  getCachedJobs(): any[] | null {
    try {
      const raw = localStorage.getItem('jobs_cache_v1');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts || !parsed.data) return null;
      const age = Date.now() - parsed.ts;
      if (age > 60 * 1000) {
        localStorage.removeItem('jobs_cache_v1');
        return null;
      }
      return parsed.data;
    } catch (e) {
      return null;
    }
  }
  setReminder(jobId: string, email: string) {
  return this.http.post(
    '/api/reminders',
    { jobId, email }
  );
}


  saveJobsToCache(jobs: any[]) {
    try {
      localStorage.setItem(
        'jobs_cache_v1',
        JSON.stringify({ ts: Date.now(), data: jobs })
      );
    } catch (e) {
      // ignore
    }
  }

  clearCache() {
    try {
      localStorage.removeItem('jobs_cache_v1');
    } catch (e) {}
  }
  getJobById(id: string) {
    return this.http.get<any>(`${this.api}/${id}`);
  }
}
