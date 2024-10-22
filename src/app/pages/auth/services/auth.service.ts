import { HttpClient } from '@angular/common/http';
import { Injectable, forwardRef,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { env } from 'src/environmens/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private permissionService: NgxPermissionsService) { }

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    if (this.isAuthenticated) {
      return throwError('User is already logged in.');
    }
    return this.http.post(`${env.apiUrl}/users/login`, credentials).pipe(
      switchMap((response: any) => {
        // Set the access token
        this.accessToken = response.data.token;
        // Parse the access token and get the user's data
        let user: any;
        user = this.accessToken ? jwtDecode(this.accessToken) : null;
        this.isAuthenticated = true;
        // Load the user's permissions
        let allPermission = user?.role?.permission ? this.checkPermissions(user?.role?.permission) : [];
        this.permissionService.loadPermissions(allPermission);
        // Set the user's authentication status
        this.isAuthenticated = true;
        // Return the user's data
        return of(response);
      }),
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.clear();
    this.router.navigate(['/auth/sign-up']);
  }

  checkPermissions(permissions: any) {
    const keysToCheck = [
      'addDriver',
      'addClient',
      'addOrder',
      'cancelOrder',
      'seeDriversInfo',
      'seeClientsInfo',
      'sendPush',
      'chat',
      'tracking',
      'driverFinance',
      'clientMerchantFinance',
      'driverMerchantFinance',
      'registerClientMerchant',
      'registerDriverMerchant',
      'verifyDriver',
      'clientMerchantList',
      'driverMerchantList',
      'adminPage',
      'finRequest',
      'driverMerchantPage',
      'clientMerchantPage',
      'driverVerification',
      'agentPage',
      'dashboardPage',
      'archivedPage',
      'orderPage',
      'referencesPage',
      'activePage',
      'adminAgentPage',
      'attachDriverAgent',
      'addBalanceAgent',
      'seeSubscriptionTransactionAgent',
      'seePaymentTransactionAdmin',
      'seeServiceTransactionAdmin'
    ];
    let result = keysToCheck.filter(key => permissions[key]);
    return result
  }

  signOut(): void {
    localStorage.removeItem('accessToken');
    this.isAuthenticated = false;
    this.navigateAway();
  }
  private navigateAway(): void {
    this.router.navigate(['/auth/sign-up']);
  }
  check(): Observable<boolean> {
    if (this.accessToken) {
      return of(true);
    }
    if  (this.isAuthenticated) {
      return of(true);
    }
    else {
      return of(false);
    }
  }
}