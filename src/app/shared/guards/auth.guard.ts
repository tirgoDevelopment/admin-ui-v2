import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  canActivate(): Observable<boolean | UrlTree> {
    const router: Router = inject(Router);
    return inject(AuthService).check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          const urlTree = router.parseUrl(`/auth/sign-in`);
          return of(urlTree);
        }
        return of(true);
      }),
    );
  }

}
