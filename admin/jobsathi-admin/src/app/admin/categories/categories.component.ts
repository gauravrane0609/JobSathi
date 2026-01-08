import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];

  // add form
  name = '';

  // edit state
  editId: string | null = null;
  editName = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      }),
    };
  }

  load(): void {
    // admin should load ALL categories
    this.http
      .get<any[]>(environment.apiUrl + '/categories/all', this.headers())
      .subscribe(data => (this.categories = data));
  }

  // ADD CATEGORY
  add(): void {
    if (!this.name.trim()) return;

    this.http
      .post(
        environment.apiUrl + '/categories',
        { name: this.name },
        this.headers()
      )
      .subscribe(() => {
        this.name = '';
        this.load();
      });
  }

  // EDIT CATEGORY
  edit(cat: any): void {
    this.editId = cat._id;
    this.editName = cat.name;
  }

  save(cat: any): void {
    if (!this.editName.trim()) return;

    this.http
      .put(
        environment.apiUrl + '/categories/' + cat._id,
        { name: this.editName },
        this.headers()
      )
      .subscribe(() => {
        this.editId = null;
        this.editName = '';
        this.load();
      });
  }

  cancel(): void {
    this.editId = null;
    this.editName = '';
  }

  // ENABLE / DISABLE
  toggle(cat: any): void {
    this.http
      .put(
        environment.apiUrl + '/categories/' + cat._id,
        { active: !cat.active },
        this.headers()
      )
      .subscribe(() => this.load());
  }
}
