 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private api = environment.apiUrl + '/banners';

  constructor(private http: HttpClient) {}

  /**
   * Get only ACTIVE banners (for client home page)
   */
  getActiveBanners(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
}
