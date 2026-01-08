import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  template: `
    <div class="skeleton-grid">
      <div class="skeleton" *ngFor="let _ of [].constructor(count)"></div>
    </div>
  `,
  styles: [
    `
      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 12px;
      }
      .skeleton {
        height: 100px;
        background: linear-gradient(90deg, #f3f6fb, #eef4ff, #f3f6fb);
        border-radius: 8px;
      }
      @media (min-width: 600px) {
        .skeleton-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 960px) {
        .skeleton-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `,
  ],
})
export class LoadingSkeletonComponent {
  @Input() count = 6;
}
