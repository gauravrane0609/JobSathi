import { Component, OnInit } from '@angular/core';
import { AdmitCardService } from '../../services/admit-card.service';

@Component({
  selector: 'app-admit-card',
  templateUrl: './admit-card.component.html',
  styleUrls: ['./admit-card.component.css'],
})
export class AdmitCardComponent implements OnInit {
  admitCards: any[] = [];
  loading = true;
  allItems: any[] = [];
  visibleItems: any[] = [];
  page = 1;
  perPage = 9;
  search = '';
  categories: string[] = ['All'];
  selectedCategory = 'All';

  constructor(private admitCardService: AdmitCardService) {}

  ngOnInit(): void {
    this.admitCardService.getAdmitCards().subscribe({
      next: (data) => {
        this.allItems = (data || []).map((d: any) => ({
          ...d,
          releaseDate: d.admitCardDate,
          pdfUrl: d.downloadLink,
        }));
        const cats = Array.from(
          new Set(
            this.allItems
              .map((i: any) => (i.category || '').trim())
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
    let items = this.allItems.filter((i) => i.status === 'Published');
    if (this.selectedCategory && this.selectedCategory !== 'All')
      items = items.filter(
        (i) => (i.category || '').trim() === this.selectedCategory
      );
    if (q)
      items = items.filter((i) =>
        ((i.examName || '') + (i.title || '')).toLowerCase().includes(q)
      );
    if (reset) this.page = 1;
    this.visibleItems = items.slice(0, this.page * this.perPage);
  }

  loadMore() {
    this.page++;
    this.applyFilters(false);
  }

  get publishedCount(): number {
    return (this.allItems || []).filter((i: any) => i.status === 'Published')
      .length;
  }
}
