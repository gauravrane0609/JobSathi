import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  templateUrl: './loading-skeleton.component.html',
  styleUrls: ['./loading-skeleton.component.css'],
})
export class LoadingSkeletonComponent {
  @Input() count = 6;
}
