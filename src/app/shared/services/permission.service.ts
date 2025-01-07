import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  constructor(private authService: AuthService) {}

  hasPermission(permission: string): boolean {
    const user: any = jwtDecode(this.authService.accessToken);
    return user.role?.permission[permission];
  }
}
