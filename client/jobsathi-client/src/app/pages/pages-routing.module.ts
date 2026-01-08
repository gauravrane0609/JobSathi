import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { ResultsComponent } from './results/results.component';
import { AdmitCardComponent } from './admit-card/admit-card.component';
import { SyllabusComponent } from './syllabus/syllabus.component';

const routes: Routes = [
  { path: '', component: HomeComponent },          // Home page
  { path: 'jobs', component: JobsComponent },      // Job list page
  { path: 'job/:id', component: JobDetailComponent }, // Job detail page
  { path: 'results', component: ResultsComponent }, // Results page
  { path: 'admit-card', component: AdmitCardComponent }, // Admit Card page
  { path: 'syllabus', component: SyllabusComponent } // Syllabus page
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
