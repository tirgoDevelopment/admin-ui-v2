import { Route } from "@angular/router";
import { MainComponent } from "./shared/components/main/main.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { NoAuthGuard } from "./shared/guards/noAuth.guard";
import { AuthGuard } from "./shared/guards/auth.guard";

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'admins', loadChildren: () => import('./pages/admins/admins.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'drivers', loadChildren: () => import('./pages/drivers/drivers.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'clients', loadChildren: () => import('./pages/clients/clients.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'orders', loadChildren: () => import('./pages/orders/orders.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'archive-users', loadChildren: () => import('./pages/archive-users/archive-users.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'merchant-client', loadChildren: () => import('./pages/merchant/merchant-client/merchant-client.routes').then(m => m.default), canActivate: [AuthGuard] },
      // References
      { path: 'references/cargo-type-groups', loadChildren: () => import('./pages/references/cargo-type-groups/cargo-type-groups.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/cargo-types', loadChildren: () => import('./pages/references/cargo-types/cargo-types.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/transport-types', loadChildren: () => import('./pages/references/transport-types/transport-types.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/subscription-types', loadChildren: () => import('./pages/references/subscription-type/subscription-types.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/currencies', loadChildren: () => import('./pages/references/currencies/currencies.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/transport-kinds', loadChildren: () => import('./pages/references/transport-kinds/transport-kinds.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/cargo-status', loadChildren: () => import('./pages/references/cargo-status/cargo-status.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/loading-method', loadChildren: () => import('./pages/references/loading-method/loading-method.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/cargo-packages', loadChildren: () => import('./pages/references/cargo-packages/cargo-packages.routes').then(m => m.default), canActivate: [AuthGuard] },
      { path: 'references/roles', loadChildren: () => import('./pages/references/roles/roles.routes').then(m => m.default), canActivate: [AuthGuard] },
    ]
    
  
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [NoAuthGuard],
    children: [
      { path: 'sign-in', loadChildren: () => import('./pages/auth/components/sign-in/sign-in.routes').then(m => m.default) },
      { path: 'sign-up', loadChildren: () => import('./pages/auth/components/sign-up/sign-up.routes').then(m => m.default) },
    ]
  }
]