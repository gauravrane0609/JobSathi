import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  private TOKEN_KEY = 'admin_token';

  constructor(private http: HttpClient) {}

  // ================= LOGIN =================
 login(email: string, password: string) {
  return this.http.post<any>(this.api + '/login', {
    email,
    password,
  }).pipe(
    map(res => {
      if (res?.token) {
        localStorage.setItem('admin_token', res.token);
        return true;
      }
      return false;
    }),
    catchError(() => of(false))
  );
}


  // ================= FORGOT PASSWORD =================
  forgotPassword(email: string) {
  return this.http.post(
    environment.apiUrl + '/auth/forgot-password',
    { email }
  );
}

  // ================= LOGOUT =================
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ================= TOKEN =================
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ================= VERIFY TOKEN =================
  verify(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.api}/verify`, { headers }).pipe(
      map((res) => res?.valid === true),
      catchError(() => of(false))
    );
  }
}
