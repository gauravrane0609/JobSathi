import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobSearch',
  standalone: true
})
export class JobSearchPipe implements PipeTransform {

  transform(
    jobs: any[],
    keyword: string,
    location: string
  ): any[] {

    if (!jobs) return [];

    const k = (keyword || '').toLowerCase().trim();
    const l = (location || '').toLowerCase().trim();

    return jobs.filter(job => {

      const titleMatch =
        job.title?.toLowerCase().includes(k) ||
        job.organization?.toLowerCase().includes(k);

      const locationMatch =
        job.location?.toLowerCase().includes(l);

      // if both inputs empty → show all
      if (!k && !l) return true;

      if (k && l) return titleMatch && locationMatch;

      if (k) return titleMatch;

      return locationMatch;
    });
  }
}
