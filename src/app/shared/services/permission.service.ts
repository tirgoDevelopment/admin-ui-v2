import { Injectable } from '@angular/core';
import { Permission } from '../enum/per.enum';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private decodedToken: any = null;
  private permissionCache: { [key: string]: boolean } = {};

  constructor(private authService: AuthService) {
    this.authService.accessToken$.subscribe((token) => {
      if (token) {
        try {
          this.decodedToken = jwtDecode(token);
          this.permissionCache = {};
        } catch (error) {
          this.decodedToken = null;
        }
      } else {
        this.decodedToken = null;
        this.permissionCache = {};
      }
    });
  }

  hasPermission(permission: Permission): boolean {
    if (permission in this.permissionCache) {
      return this.permissionCache[permission];
    }
    const hasPerm = this.decodedToken?.role?.permission[permission] || false;
    this.permissionCache[permission] = hasPerm;
    return hasPerm;
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }
}
