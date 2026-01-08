import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  // Forgot password UI
  showForgotModal = false;
  resetEmail = '';
  resetSent = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(event: Event): void {
    event.preventDefault();
    this.error = null;
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe(success => {
  if (success) {
    this.router.navigate(['/admin']);
  } else {
    this.error = 'Invalid email or password';
  }
});
  }

  openForgot(): void {
    this.showForgotModal = true;
    this.resetEmail = '';
    this.resetSent = false;
  }

  closeForgot(): void {
    this.showForgotModal = false;
  }

  sendReset(): void {
  if (!this.resetEmail) return;

  this.auth
    .forgotPassword(this.resetEmail)
    .subscribe(() => {
      this.resetSent = true;
    });
}

}
