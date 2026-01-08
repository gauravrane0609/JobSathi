import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';

/**
 * Admin JobsComponent
 * - Adds optimistic update for update/delete
 * - Shows success/error toasts
 * - Clears client cache key when data mutates
 */

@Component({
  selector: 'app-admin-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];
  editingJob: any = null;

  form = {
    title: '',
    category: '',
    organization: '',
    location: '',
    lastDate: '',
    link: '',
    qualification: '',
    description: '',
    applyLink: '',
    logo: '',
  };

  constructor(private jobService: JobService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getJobs().subscribe((res) => {
      this.jobs = res.data ?? res;
    });
  }

  edit(job: any) {
    this.editingJob = job;
    this.form = { ...job };
  }

  submit() {
    if (this.editingJob) {
      // Optimistic update
      const original = { ...this.editingJob };
      const idx = this.jobs.findIndex((j) => j._id === this.editingJob._id);
      if (idx >= 0) this.jobs[idx] = { ...this.jobs[idx], ...this.form };

      this.jobService.updateJob(this.editingJob._id, this.form).subscribe({
        next: () => {
          this.toast.success('Job updated successfully');
          this.jobService.clearClientCache();
          this.reset();
          this.loadJobs();
        },
        error: () => {
          if (idx >= 0) this.jobs[idx] = original;
          this.toast.error('Update failed');
        },
      });
    } else {
      this.jobService.createJob(this.form).subscribe({
        next: () => {
          this.toast.success('Job created');
          this.jobService.clearClientCache();
          this.reset();
          this.loadJobs();
        },
        error: () => this.toast.error('Create failed'),
      });
    }
  }

  delete(id: string) {
    if (!confirm('Delete this job?')) return;

    const idx = this.jobs.findIndex((j) => j._id === id);
    const removed = idx >= 0 ? this.jobs.splice(idx, 1)[0] : null;

    this.jobService.deleteJob(id).subscribe({
      next: () => {
        this.toast.success('Job deleted');
        this.jobService.clearClientCache();
      },
      error: () => {
        if (removed) this.jobs.splice(idx, 0, removed);
        this.toast.error('Delete failed');
      },
    });
  }

  reset() {
    this.editingJob = null;
    this.form = {
      title: '',
      category: '',
      organization: '',
      location: '',
      lastDate: '',
      link: '',
      qualification: '',
      description: '',
      applyLink: '',
      logo: '',
    };
  }
}
