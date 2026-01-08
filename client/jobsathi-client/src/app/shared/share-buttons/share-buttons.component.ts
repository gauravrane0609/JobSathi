import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.css'],
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
    } catch (e) {
      // ignore
    }
  }

  whatsappShare() {
    const text = encodeURIComponent(
      this.title + '\n' + (this.url || window.location.href)
    );
    const wa = `https://wa.me/?text=${text}`;
    window.open(wa, '_blank');
  }
}
