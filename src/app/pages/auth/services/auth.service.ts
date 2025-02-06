import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, switchMap, throwError } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { env } from 'src/environmens/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private _accessTokenSubject = new BehaviorSubject<string | null>(null);
  public accessToken$ = this._accessTokenSubject.asObservable();

  isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private permissionService: NgxPermissionsService
  ) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this._accessTokenSubject.next(token);
      this.isAuthenticated = true;
    }
  }

  set accessToken(token: string | null) {
    if (token) {
      localStorage.setItem('accessToken', token);
      this._accessTokenSubject.next(token);
      this.isAuthenticated = true;
    } else {
      localStorage.removeItem('accessToken');
      this._accessTokenSubject.next(null);
      this.isAuthenticated = false;
    }
  }

  get accessToken(): string | null {
    return this._accessTokenSubject.getValue();
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    if (this.isAuthenticated) {
      return throwError('User is already logged in.');
    }
    return this.http.post(`${env.authUrl}/login`, credentials).pipe(
      switchMap((response: any) => {
        this.accessToken = response.data.accessToken;
        const user: any = this.accessToken ? jwtDecode(this.accessToken) : null;
        const allPermission = user?.role?.permission
          ? this.checkPermissions(user.role.permission)
          : [];
        this.permissionService.loadPermissions(allPermission);
        return of(response);
      })
    );
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    this.isAuthenticated = false;
    this.router.navigate(['/auth/sign-up']);
  }

  check(): Observable<boolean> {
    return of(!!this.accessToken);
  }

  private checkPermissions(permissionObj: any): string[] {
    return Object.keys(permissionObj).filter((key) => permissionObj[key]);
  }
}
