import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobCardComponent } from '../components/job-card/job-card.component';
import { CategoryFilterComponent } from '../components/ui/category-filter.component';
import { ShareButtonsComponent } from '../components/ui/share-buttons.component';
import { LoadingSkeletonComponent } from '../components/ui/loading-skeleton.component';
import { EmptyStateComponent } from '../components/ui/empty-state.component';

@NgModule({
  declarations: [
    JobCardComponent,
    CategoryFilterComponent,
    ShareButtonsComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    JobCardComponent,
    CategoryFilterComponent,
    ShareButtonsComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
  ],
})
export class SharedModule {}
