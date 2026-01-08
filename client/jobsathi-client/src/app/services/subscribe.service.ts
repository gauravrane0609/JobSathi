import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscribeService {
  private baseUrl = environment.apiUrl + '/subscribe';

  constructor(private http: HttpClient) {}

  subscribeEmail(email: string) {
  return this.http.post<{ message: string }>(
    `${environment.apiUrl}/subscribe`,
    { email }
  );
}


}
