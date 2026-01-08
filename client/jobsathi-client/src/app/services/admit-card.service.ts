import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdmitCardService {
  private api = `${environment.apiUrl}/admit-cards`;

  constructor(private http: HttpClient) {}

  getAdmitCards() {
    return this.http.get<any[]>(this.api);
  }
}
