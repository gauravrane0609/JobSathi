import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      }),
    };
  }

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  create(name: string) {
    return this.http.post(this.api, { name }, this.headers());
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`, this.headers());
  }
}
