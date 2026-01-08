import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <div class="icon">📭</div>
      <div class="text">{{ message }}</div>
    </div>
  `,
  styles: [
    `
      .empty-state {
        text-align: center;
        padding: 20px;
        color: #6b7280;
      }
      .empty-state .icon {
        font-size: 36px;
      }
      .empty-state .text {
        margin-top: 8px;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() message = 'No items found';
}
