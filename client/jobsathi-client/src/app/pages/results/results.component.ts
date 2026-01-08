import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  loading = true;
  allResults: any[] = [];
  visibleResults: any[] = [];
  page = 1;
  perPage = 9;
  search = '';
  categories: string[] = ['All'];
  selectedCategory = 'All';

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    this.resultService.getResults().subscribe({
      next: (data) => {
        this.allResults = data || [];
        // derive categories
        const cats = Array.from(
          new Set(
            this.allResults
              .map((r: any) => (r.category || '').trim())
              .filter(Boolean)
          )
        );
        this.categories = ['All', ...cats];
        this.applyFilters();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilters(reset = true) {
    const q = (this.search || '').trim().toLowerCase();
    let filtered = this.allResults.filter((r: any) => r.status === 'Published');
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      filtered = filtered.filter(
        (r: any) => (r.category || '').trim() === this.selectedCategory
      );
    }
    if (q)
      filtered = filtered.filter((r: any) =>
        (r.examName || r.title || '').toLowerCase().includes(q)
      );

    if (reset) this.page = 1;
    const start = 0;
    const end = this.page * this.perPage;
    this.visibleResults = filtered.slice(start, end);
  }

  loadMore() {
    this.page++;
    this.applyFilters(false);
  }

  get publishedCount(): number {
    return (this.allResults || []).filter((a: any) => a.status === 'Published')
      .length;
  }
}
