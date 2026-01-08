import { Component, OnInit } from '@angular/core';
import { SyllabusService } from '../../services/syllabus.service';

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.css'],
})
export class SyllabusComponent implements OnInit {
  syllabusList: any[] = [];
  loading = true;

  allItems: any[] = [];
  visibleItems: any[] = [];
  page = 1;
  perPage = 9;
  search = '';
  categories: string[] = ['All'];
  selectedCategory = 'All';

  constructor(private syllabusService: SyllabusService) {}

  ngOnInit(): void {
    this.syllabusService.getSyllabus().subscribe({
      next: (data) => {
        this.allItems = (data || []).map((d: any) => ({
          ...d,
          pdfUrl: d.syllabusPdfUrl,
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
        ((i.examName || '') + (i.title || '') + (i.description || ''))
          .toLowerCase()
          .includes(q)
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
