import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private api = `${environment.apiUrl}/results`;

  constructor(private http: HttpClient) {}

  getResults() {
    return this.http.get<any[]>(this.api);
  }
}
