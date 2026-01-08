import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private containerId = 'simple-toast-container';

  private ensureContainer() {
    let c = document.getElementById(this.containerId);
    if (!c) {
      c = document.createElement('div');
      c.id = this.containerId;
      c.style.position = 'fixed';
      c.style.top = '12px';
      c.style.right = '12px';
      c.style.zIndex = '9999';
      c.style.display = 'flex';
      c.style.flexDirection = 'column';
      c.style.gap = '8px';
      document.body.appendChild(c);
    }
    return c;
  }

  private show(message: string, bg = '#4caf50') {
    const c = this.ensureContainer();
    const el = document.createElement('div');
    el.textContent = message;
    el.style.background = bg;
    el.style.color = '#fff';
    el.style.padding = '8px 12px';
    el.style.borderRadius = '4px';
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
    el.style.maxWidth = '320px';
    el.style.fontFamily = 'sans-serif';
    el.style.fontSize = '13px';
    el.style.opacity = '0';
    el.style.transition =
      'opacity 180ms ease-in-out, transform 180ms ease-in-out';
    c.appendChild(el);

    // enter
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    const timeout = setTimeout(() => {
      // exit
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 200);
      clearTimeout(timeout);
    }, 3000);
  }

  success(msg: string) {
    this.show(msg, '#4caf50');
  }
  error(msg: string) {
    this.show(msg, '#f44336');
  }
}
