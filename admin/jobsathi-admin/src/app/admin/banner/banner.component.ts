import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-admin-banners',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {

  banners: any[] = [];

  title = '';
  link = '';
  file: File | null = null;
  preview: string | ArrayBuffer | null = null;
  loading = false;

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.bannerService.getAll().subscribe(data => {
      this.banners = data;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.file = file;

    const reader = new FileReader();
    reader.onload = () => (this.preview = reader.result);
    reader.readAsDataURL(file);
  }

  upload(): void {
    if (!this.file || !this.title.trim()) return;

    const form = new FormData();
    form.append('title', this.title);
    form.append('link', this.link);
    form.append('image', this.file);

    this.loading = true;

    this.bannerService.upload(form).subscribe(() => {
      this.resetForm();
      this.loadBanners();
      this.loading = false;
    });
  }

  toggle(banner: any): void {
    this.bannerService.toggle(banner._id).subscribe(() => {
      this.loadBanners();
    });
  }

  resetForm(): void {
    this.title = '';
    this.link = '';
    this.file = null;
    this.preview = null;
  }
}
