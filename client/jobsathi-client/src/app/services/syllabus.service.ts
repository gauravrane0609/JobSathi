import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SyllabusService {
  private api = `${environment.apiUrl}/syllabus`;

  constructor(private http: HttpClient) {}

  getSyllabus() {
    return this.http.get<any[]>(this.api);
  }
}
