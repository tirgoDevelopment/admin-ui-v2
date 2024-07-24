import { Route } from "@angular/router";
import { WelcomeComponent } from "./pages/welcome/welcome.component";
import { MainComponent } from "./shared/components/main/main.component";
import { AuthComponent } from "./pages/auth/auth.component";

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent }
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'sign-in', loadChildren: () => import('./pages/auth/components/sign-in/sign-in.routes').then(m => m.default) },
      { path: 'sign-up', loadChildren: () => import('./pages/auth/components/sign-up/sign-up.routes').then(m => m.default) },
    ]
  }
]