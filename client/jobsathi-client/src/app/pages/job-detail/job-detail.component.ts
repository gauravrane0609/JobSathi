import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
})
export class JobDetailComponent implements OnInit {
  job: any;

  constructor(private route: ActivatedRoute, private jobService: JobService) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.jobService.getJobById(jobId).subscribe((data) => {
        this.job = data;
      });
    }
  }

  apply() {
    const url = this.job?.applyLink || this.job?.link;
    if (!url) return;
    window.open(url, '_blank');
  }

  async share() {
    const url = this.job?.applyLink || this.job?.link || window.location.href;
    const text = `${this.job?.title || 'Job'} - ${url}`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: this.job?.title, text, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } else {
        window.prompt('Copy link', url);
      }
    } catch (e) {
      // ignore
    }
  }
}
