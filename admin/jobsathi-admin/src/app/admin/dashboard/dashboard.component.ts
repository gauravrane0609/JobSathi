import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  // ===== DASHBOARD STATS =====
  stats = {
    totalJobs: 0,
    totalBanners: 0,
    totalCategories: 0,
    totalSubscribers: 0,
  };

  loading = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = {
          totalJobs: data.totalJobs ?? 0,
          totalBanners: data.activeBanners ?? 0,
          totalCategories: data.totalCategories ?? 0,
          totalSubscribers: data.totalSubscribers ?? 0,
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
