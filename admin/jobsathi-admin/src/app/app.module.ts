import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminHeaderComponent } from './admin/layout/admin-header.component';
import { AdminSidebarComponent } from './admin/layout/admin-sidebar.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { JobsComponent } from './admin/jobs/jobs.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { BannerComponent } from './admin/banner/banner.component';
import { ResultsComponent } from './admin/results/results.component';
import { AdmitCardsComponent } from './admin/admit-cards/admit-cards.component';
import { SyllabusAdminComponent } from './admin/syllabus/syllabus.component';
import { SubscribersComponent } from './admin/subscribers/subscribers.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    LoginComponent,
    JobsComponent,
    CategoriesComponent,
    BannerComponent,
    ResultsComponent,
    AdmitCardsComponent,
    SyllabusAdminComponent,
    SubscribersComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
