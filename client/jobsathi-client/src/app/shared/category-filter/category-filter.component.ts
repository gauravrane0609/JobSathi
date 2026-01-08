import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
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
