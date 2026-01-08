import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];
  loading = true;
  categories: string[] = ['All'];
  selectedCategory = 'All';

  // Debounced search inputs
  private keywordInput$ = new Subject<string>();
  private locationInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  private _searchKeyword = '';
  private _searchLocation = '';

  get searchKeyword() {
    return this._searchKeyword;
  }
  set searchKeyword(v: string) {
    this.keywordInput$.next(v || '');
  }

  get searchLocation() {
    return this._searchLocation;
  }
  set searchLocation(v: string) {
    this.locationInput$.next(v || '');
  }

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe({
      next: (data) => {
        const normalized = (data || []).map((j: any) => ({
          ...j,
          category: (j.category || '').trim(),
          qualification: (j.qualification || '').trim(),
        }));
        this.jobs = normalized;
        const cats = Array.from(
          new Set(
            (this.jobs || [])
              .map((j: any) => (j.category || '').trim())
              .filter(Boolean)
          )
        );
        this.categories = ['All', ...cats];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });

    // wire debounced input handling
    this.keywordInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((v) => {
        this._searchKeyword = (v || '').trim();
      });

    this.locationInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((v) => {
        this._searchLocation = (v || '').trim();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openJob(jobId: string) {
    this.router.navigate(['/job', jobId]);
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  get filteredJobs() {
    let list =
      this.selectedCategory === 'All'
        ? this.jobs || []
        : (this.jobs || []).filter(
            (j) => (j.category || '').trim() === this.selectedCategory
          );

    const kw = (this._searchKeyword || '').trim().toLowerCase();
    if (kw) {
      list = list.filter((j: any) => {
        const fields = [j.title, j.organization, j.location, j.category];
        return fields.some((f) =>
          (f || '').toString().toLowerCase().includes(kw)
        );
      });
    }

    const loc = (this._searchLocation || '').trim().toLowerCase();
    if (loc) {
      list = list.filter((j: any) =>
        (j.location || '').toString().toLowerCase().includes(loc)
      );
    }

    return list;
  }

  // ================= PAGINATION =================
itemsPerPage = 9;
currentPage = 1;

get totalPages(): number {
  return Math.ceil(this.filteredJobs.length / this.itemsPerPage);
}

get paginatedJobs() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredJobs.slice(start, start + this.itemsPerPage);
}

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
}

}
