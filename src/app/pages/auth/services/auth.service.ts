import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { env } from 'src/environmens/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private _accessTokenSubject = new BehaviorSubject<string | null>(null);
  public accessToken$ = this._accessTokenSubject.asObservable();
  private refreshToken: string | null = null;
  private refreshInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

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
        this.refreshToken = response.data.refreshToken;
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
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
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isAuthenticated = false;
    this.router.navigate(['/auth/sign-up']);
  }

  check(): Observable<boolean> {
    return of(!!this.accessToken);
  }

  private checkPermissions(permissionObj: any): string[] {
    return Object.keys(permissionObj).filter((key) => permissionObj[key]);
  }

  refreshTokenRequest(): Observable<any> {
    if (this.refreshInProgress) {
      return this.refreshTokenSubject.asObservable();
    }
  
    this.refreshInProgress = true;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token is missing'));
    }
  
    return this.http.post(`${env.authUrl}/refresh-token`, { refreshToken }).pipe(
      switchMap((response: any) => {
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('refreshToken', this.refreshToken);
        this.refreshInProgress = false;
        this.refreshTokenSubject.next(response.data.accessToken);
        return of(response);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }
  
}
