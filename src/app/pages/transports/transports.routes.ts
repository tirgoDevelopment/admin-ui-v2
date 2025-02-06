import { Route } from '@angular/router';
import { TransportsComponent } from './transports.component';
import { TransportHistoryComponent } from './components/transport-history/transport-history.component';

const routes: Route[] = [
  {
    path: '',
    component: TransportsComponent,
  },
  {
    path: ':id/history',
    component: TransportHistoryComponent,
  }
]
export default routes;
