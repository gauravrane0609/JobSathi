import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category-filter',
  template: `
    <div class="category-filter">
      <button
        *ngFor="let c of categories"
        (click)="pick(c)"
        [class.active]="c === selected"
      >
        {{ c }}
      </button>
    </div>
  `,
  styles: [
    `
      .category-filter {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 12px;
      }
      .category-filter button {
        padding: 6px 10px;
        border-radius: 18px;
        border: 1px solid #e6eefc;
        background: #fff;
        color: #0b5ed7;
        cursor: pointer;
      }
      .category-filter button.active {
        background: #0b5ed7;
        color: #fff;
      }
    `,
  ],
})
export class CategoryFilterComponent {
  @Input() categories: string[] = [];
  @Input() selected = 'All';
  @Output() selectedChange = new EventEmitter<string>();

  pick(cat: string) {
    this.selected = cat;
    this.selectedChange.emit(cat);
  }
}
