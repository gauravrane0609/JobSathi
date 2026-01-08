import { Component, OnInit } from '@angular/core';
import { AdmitCardService } from '../../services/admit-card.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-admit-cards',
  templateUrl: './admit-cards.component.html',
  styleUrls: ['./admit-cards.component.css'],
})
export class AdmitCardsComponent implements OnInit {
  items: any[] = [];
  editing: any = null;

  form: any = {
    title: '',
    organization: '',
    category: '',
    examName: '',
    admitCardDate: '',
    instructions: '',
    status: 'Draft',
  };
  file: File | null = null;
  categories = ['Railway', 'Bank', 'Police', 'State', 'Central'];

  constructor(private svc: AdmitCardService, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.getAdmitCards().subscribe((r) => (this.items = r));
  }

  pickFile(e: any) {
    this.file = e.target.files[0] ?? null;
  }

  edit(it: any) {
    this.editing = it;
    this.form = { ...it };
  }

  reset() {
    this.editing = null;
    this.form = {
      title: '',
      organization: '',
      category: '',
      examName: '',
      admitCardDate: '',
      instructions: '',
      status: 'Draft',
    };
    this.file = null;
  }

  submit() {
    const fd = new FormData();
    fd.append('title', this.form.title || '');
    fd.append('organization', this.form.organization || '');
    fd.append('category', this.form.category || '');
    fd.append('examName', this.form.examName || '');
    fd.append('admitCardDate', this.form.admitCardDate || '');
    fd.append('instructions', this.form.instructions || '');
    fd.append('status', this.form.status || 'Draft');
    if (this.file) fd.append('file', this.file);

    if (this.editing) {
      const idx = this.items.findIndex((i) => i._id === this.editing._id);
      const original = { ...this.editing };
      if (idx >= 0) this.items[idx] = { ...this.items[idx], ...this.form };
      this.svc.updateAdmitCard(this.editing._id, fd).subscribe({
        next: () => {
          this.toast.success('Updated');
          this.svc.clearClientCache();
          this.reset();
          this.load();
        },
        error: () => {
          if (idx >= 0) this.items[idx] = original;
          this.toast.error('Update failed');
        },
      });
    } else {
      this.svc.createAdmitCard(fd).subscribe({
        next: () => {
          this.toast.success('Created');
          this.svc.clearClientCache();
          this.reset();
          this.load();
        },
        error: () => this.toast.error('Create failed'),
      });
    }
  }

  remove(id: string) {
    if (!confirm('Delete?')) return;
    const idx = this.items.findIndex((i) => i._id === id);
    const removed = idx >= 0 ? this.items.splice(idx, 1)[0] : null;
    this.svc.deleteAdmitCard(id).subscribe({
      next: () => {
        this.toast.success('Deleted');
        this.svc.clearClientCache();
      },
      error: () => {
        if (removed) this.items.splice(idx, 0, removed);
        this.toast.error('Delete failed');
      },
    });
  }
}
