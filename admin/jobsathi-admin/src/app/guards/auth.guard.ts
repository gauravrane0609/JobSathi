import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 🚫 No token at all → redirect immediately
  if (!auth.isAuthenticated()) {
    router.navigate(['/admin/login']);
    return false;
  }

  // ✅ Verify token with backend
  return auth.verify().pipe(
    map((valid) => {
      if (valid) {
        return true;
      }

      // ❌ Token invalid
      auth.logout();
      router.navigate(['/admin/login']);
      return false;
    }),
    catchError(() => {
      // ❌ Any error → treat as unauthenticated
      auth.logout();
      router.navigate(['/admin/login']);
      return of(false);
    })
  );
};
