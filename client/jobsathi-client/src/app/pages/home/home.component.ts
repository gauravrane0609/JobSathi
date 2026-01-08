import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { JobService } from '../../services/job.service';
import { BannerService } from '../../services/banner.service';
import { SubscribeService } from '../../services/subscribe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobSearchPipe } from '../../shared/pipes/job-search.pipe';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,JobSearchPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'Jobsathi – Government Jobs';

  /* ================= BASIC STATE ================= */
  categories: string[] = ['All'];
  selectedCategory = 'All';

  notifications: string[] = [];
  jobs: any[] = [];
  loading = true;
  errorMessage: string | null = null;

  /* ================= STATS ================= */
  totalJobs = 0;
  policeJobs = 0;
  bankJobs = 0;
  railwayJobs = 0;

  /* ================= SEARCH (DEBOUNCED) ================= */
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

// UI inputs (typed values)
searchKeywordInput: string = '';
searchLocationInput: string = '';

onSearch(): void {
  // Push values into existing debounced setters
  this.searchKeyword = this.searchKeywordInput;
  this.searchLocation = this.searchLocationInput;

  // reset pagination if you have it
  this.currentPage = 1;
}




  /* ================= BANNERS ================= */
  banners: any[] = [];
  currentBanner = 0;
  private bannerTimer: any;

  // swipe
  private startX = 0;
  private dragging = false;

  /* ================= SUBSCRIBE ================= */
  email = '';
  emailValid = false;
  submitting = false;
  

  private routerSub: Subscription | null = null;

  constructor(
    private jobService: JobService,
    private bannerService: BannerService,
    private subscribeService: SubscribeService,
    private router: Router
  ) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadJobs();
    this.loadBanners();
    this.loadNotifications();

    // Debounced keyword search
    this.keywordInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(val => (this._searchKeyword = val.trim().toLowerCase()));

    // Debounced location search
    this.locationInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(val => (this._searchLocation = val.trim().toLowerCase()));

    // Reload jobs when user comes back to home
    this.routerSub = this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || ev.url;
        if (url === '/' || url === '') {
          this.loadJobs();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    this.clearBannerTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ================= BANNER LOGIC ================= */
  loadBanners() {
    this.bannerService.getActiveBanners().subscribe({
      next: (data: any[]) => {
        this.banners = data || [];
        this.currentBanner = 0;

        if (this.banners.length > 1) {
          this.startBannerAutoSlide();
        }
      },
    });
  }

  startBannerAutoSlide() {
    this.clearBannerTimer();
    if (!this.banners.length) return;

    this.bannerTimer = setInterval(() => {
      this.currentBanner =
        (this.currentBanner + 1) % this.banners.length;
    }, 3500);
  }

  clearBannerTimer() {
    if (this.bannerTimer) {
      clearInterval(this.bannerTimer);
      this.bannerTimer = null;
    }
  }

  goToBanner(i: number) {
    this.currentBanner = i;
  }

  onBannerMouseEnter() {
    this.clearBannerTimer();
  }

  onBannerMouseLeave() {
    if (this.banners.length > 1) {
      this.startBannerAutoSlide();
    }
  }

  onTouchStart(e: TouchEvent) {
    this.clearBannerTimer();
    this.dragging = true;
    this.startX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent) {
    if (!this.dragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = this.startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.currentBanner =
          (this.currentBanner + 1) % this.banners.length;
      } else {
        this.currentBanner =
          (this.currentBanner - 1 + this.banners.length) %
          this.banners.length;
      }
    }

    this.dragging = false;
    this.startBannerAutoSlide();
  }

  /* ================= JOBS Section================= */
  // ================= JOB MODAL =================
selectedJob: any = null;

openJobModal(job: any) {
  this.selectedJob = job;
}

closeJobModal() {
  this.selectedJob = null;
}


  loadJobs() {
    this.errorMessage = null;
    this.loading = true;

    this.jobService.getJobs().subscribe({
      next: data => {
        this.jobs = (data || []).map((j: any) => ({
          ...j,
          category: (j.category || '').trim(),
          qualification: (j.qualification || '').trim(),
        }));

        const cats = Array.from(
          new Set(
            this.jobs
              .map(j => j.category)
              .filter(Boolean)
          )
        );

        this.categories = ['All', ...cats];
        this.calculateStats();
        this.loadNotifications();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to load jobs';
      },
    });
  }

  calculateStats() {
    this.totalJobs = this.jobs.length;
    this.policeJobs = this.jobs.filter(j => j.category === 'Police').length;
    this.bankJobs = this.jobs.filter(j => j.category === 'Bank').length;
    this.railwayJobs = this.jobs.filter(j => j.category === 'Railways').length;
  }

  get filteredJobs() {
    let list = [...this.jobs];

    if (this.selectedCategory !== 'All') {
      list = list.filter(j => j.category === this.selectedCategory);
    }

    if (this._searchKeyword) {
      list = list.filter(j =>
        j.title?.toLowerCase().includes(this._searchKeyword) ||
        j.organization?.toLowerCase().includes(this._searchKeyword)
      );
    }

    if (this._searchLocation) {
      list = list.filter(j =>
        j.location?.toLowerCase().includes(this._searchLocation)
      );
    }

    return list;
  }

  // 🔥 NEW JOBS FIRST (latest posted on top)
get sortedJobs() {
  return [...this.filteredJobs].sort((a, b) => {
    const aTime = new Date(a.createdAt || a._id).getTime();
    const bTime = new Date(b.createdAt || b._id).getTime();
    return bTime - aTime; // DESC → newest first
  });
}
// 🆕 show NEW badge for jobs posted in last 3 days
isNewJob(job: any): boolean {
  const posted = new Date(job.createdAt || job._id).getTime();
  const days = (Date.now() - posted) / (1000 * 60 * 60 * 24);
  return days <= 3;
}


  isClosingSoon(job: any): boolean {
    const days =
      (new Date(job.lastDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);
    return days <= 3;
  }

  /* ================= INTERACTIONS ================= */
  shareJob(job: any) {
    const url = `${window.location.origin}/jobs/${job._id}`;
    const text = `${job.title} – Apply before ${new Date(
      job.lastDate
    ).toDateString()}`;

    if (navigator.share) {
      navigator.share({ title: job.title, text, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied');
    }
  }

  remindMe(job: any) {
    if (!this.emailValid) {
      alert('Enter email to get reminder');
      return;
    }

    this.jobService.setReminder(job._id, this.email).subscribe(() => {
      alert(`Reminder set for ${job.title}`);
    });
  }

  toggleBookmark(job: any) {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const exists = saved.find((j: any) => j._id === job._id);

    const updated = exists
      ? saved.filter((j: any) => j._id !== job._id)
      : [...saved, job];

    localStorage.setItem('savedJobs', JSON.stringify(updated));
  }

  isBookmarked(job: any): boolean {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    return saved.some((j: any) => j._id === job._id);
  }

  goToDetails(job: any) {
    this.router.navigate(['/jobs', job._id]);
  }

  /* ================= NOTIFICATIONS ================= */
  loadNotifications() {
    try {
      const now = new Date().getTime();
      const ms = 1000 * 60 * 60 * 24;

      const reminders = this.jobs
        .map(j => ({ job: j, d: new Date(j.lastDate) }))
        .filter(x => (x.d.getTime() - now) / ms <= 7)
        .map(x => `⏰ ${x.job.title} – Last Date: ${x.d.toDateString()}`);

      if (reminders.length) {
        this.notifications = reminders;
        return;
      }
    } catch {}

    this.notifications = [
      '🔥 SSC CGL 2025 notification released',
      '🚆 Railway Bharti 2025 – Last date coming soon',
    ];
  }

  /* ================= SUBSCRIBE ================= */
  validateEmail() {
    const v = (this.email || '').trim().toLowerCase();
    this.emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  
 subscribe() {
  if (!this.emailValid || this.submitting) return;

  this.submitting = true;

  this.subscribeService.subscribeEmail(this.email).subscribe({
    next: () => {
      alert('Subscribed successfully 🎉');
      this.email = '';
      this.validateEmail();
      this.submitting = false;
    },
    error: (err) => {
      this.submitting = false;

      if (err.status === 409) {
        alert('You are already subscribed 😊');
      } else {
        alert(err?.error?.message || 'Server error. Try again');
      }
    },
  });
}

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  // ================= PAGINATION =================
currentPage = 1;
pageSize = 9; // 👈 show 9 jobs per page

get totalPages(): number {
  return Math.ceil(this.sortedJobs.length / this.pageSize);
}

get paginatedJobs() {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.sortedJobs.slice(start, start + this.pageSize);
}

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

}
