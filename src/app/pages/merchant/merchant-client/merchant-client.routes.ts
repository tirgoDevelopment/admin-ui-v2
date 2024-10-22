import { Route } from '@angular/router';
import { MerchantClientComponent } from './merchant-client.component';
import { HistoryTransactionComponent } from './components/history-transaction/history-transaction.component';

const routes: Route[] = [
  {
    path: '',
    component: MerchantClientComponent,
  },
];

export default routes;
