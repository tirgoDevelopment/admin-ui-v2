import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { Permission } from '../enum/per.enum';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private decodedToken: any;
  private permissionCache: { [key: string]: boolean } = {};

  constructor(private authService: AuthService) {
    try {
      this.decodedToken = jwtDecode(this.authService.accessToken);
    } catch (error) {
      this.decodedToken = null;
    }
  }

  hasPermission(permission: Permission): boolean {
    if (permission in this.permissionCache) {
      return this.permissionCache[permission];
    }
    const hasPerm = this.decodedToken.role?.permission[permission] || false;
    this.permissionCache[permission] = hasPerm;
    return hasPerm;
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }
}

