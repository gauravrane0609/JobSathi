import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

/**
 * JobCardComponent
 * - Displays job summary with qualification and actions
 * - Apply opens `job.applyLink || job.link` in a new tab
 * - Share uses Web Share API when available, otherwise copies link
 */

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css'],
})
export class JobCardComponent {
  @Input() job: any;
  @Input() compact = false;
  constructor(private router: Router) {}

  apply() {
    const url = this.job?.applyLink || this.job?.link;
    if (!url) return;
    window.open(url, '_blank');
  }

  async share() {
    const url = this.job?.applyLink || this.job?.link || window.location.href;
    const text = `${this.job?.title || 'Job'} - ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: this.job?.title, text, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } else {
        // fallback
        window.prompt('Copy link', url);
      }
    } catch (e) {
      // ignore share errors
    }
  }

  openDetail() {
    // prefer internal detail route when available
    if (this.job?._id) {
      this.router.navigate(['/job', this.job._id]);
    } else if (this.job?.applyLink || this.job?.link) {
      window.open(this.job.applyLink || this.job.link, '_blank');
    }
  }
}
