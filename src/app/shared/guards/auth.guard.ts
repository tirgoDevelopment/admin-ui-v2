import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Use constructor injection instead of inject()
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          const urlTree = this.router.parseUrl(`/auth/sign-up`);
          return of(urlTree);
        }
        return of(true);
      })
    );
  }
}
