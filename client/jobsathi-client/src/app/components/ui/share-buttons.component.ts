import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-buttons',
  template: `
    <div class="share-buttons">
      <button (click)="whatsappShare()">Share (WA)</button>
      <button (click)="copyLink()">Copy Link</button>
    </div>
  `,
  styles: [
    `
      .share-buttons {
        display: flex;
        gap: 8px;
      }
      .share-buttons button {
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #e6eefc;
        background: #fff;
        color: #0b5ed7;
        cursor: pointer;
      }
    `,
  ],
})
export class ShareButtonsComponent {
  @Input() title = '';
  @Input() url = '';

  async copyLink() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(this.url || window.location.href);
        alert('Link copied');
      } else {
        window.prompt('Copy link', this.url || window.location.href);
      }
    } catch (e) {}
  }

  whatsappShare() {
    const text = encodeURIComponent(
      this.title + '\n' + (this.url || window.location.href)
    );
    const wa = `https://wa.me/?text=${text}`;
    window.open(wa, '_blank');
  }
}
