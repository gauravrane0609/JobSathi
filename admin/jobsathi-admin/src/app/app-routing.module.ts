import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './guards/auth.guard';
import { JobsComponent } from './admin/jobs/jobs.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { BannerComponent } from './admin/banner/banner.component';
import { ResultsComponent } from './admin/results/results.component';
import { AdmitCardsComponent } from './admin/admit-cards/admit-cards.component';
import { SyllabusAdminComponent } from './admin/syllabus/syllabus.component';
import { SubscribersComponent } from './admin/subscribers/subscribers.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: '',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
    ],
  },
  // Jobs Management

  { path: 'admin/jobs', component: JobsComponent, canActivate: [authGuard] },

  {
    path: 'admin/categories',
    component: CategoriesComponent,
    canActivate: [authGuard],
  },

  {
    path: 'admin/banners',
    component: BannerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/results',
    component: ResultsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/admit-cards',
    component: AdmitCardsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/syllabus',
    component: SyllabusAdminComponent,
    canActivate: [authGuard],
  },

  {
    path: 'admin/subscribers',
    component: SubscribersComponent,
    canActivate: [authGuard],
  },

  // Fallback (optional)
  { path: '**', redirectTo: 'admin/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
