import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { CategoryComponent } from './category/category.component';
import { ResultsComponent } from './results/results.component';
import { AdmitCardComponent } from './admit-card/admit-card.component';
import { SyllabusComponent } from './syllabus/syllabus.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    JobsComponent,
    JobDetailComponent,
    CategoryComponent,
    ResultsComponent,
    AdmitCardComponent,
    SyllabusComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule,
    // <-- Add this line
  ],
})
export class PagesModule {}
