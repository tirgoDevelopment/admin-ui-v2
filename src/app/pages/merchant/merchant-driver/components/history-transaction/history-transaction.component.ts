import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { catchError, finalize, of, tap } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TopupBalanceTmsComponent } from '../topup-balance-tms/topup-balance-tms.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { PriceFormatPipe } from 'src/app/shared/pipes/priceFormat.pipe';
import { TmsService } from '../../services/tms.service';

@Component({
  selector: 'app-history-transaction',
  templateUrl: './history-transaction.component.html',
  styleUrls: ['./history-transaction.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, PriceFormatPipe, RouterModule],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class HistoryTransactionComponent {
  tirBalance: number = 0;
  serviceBalance: number = 0;
  data: any[] = [];
  merchantId;
  merchantName: string;
  loader: boolean = false;
  isFilterVisible: boolean = false;
  requestsCount: number = 0;
  filter: Record<string, string> = this.initializeFilter();
  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
  };
  totalItemsCount
  constructor(
    private drawer: NzDrawerService,
    private tmsService: TmsService,
    private translate: TranslateService,
    private route: ActivatedRoute) {
    this.merchantId = this.route.snapshot.params['id'];
    this.merchantName = this.route.snapshot.params['name'];
  }
  ngOnInit(): void {
    this.getBalance();
  }
  getAll(): void {
    this.loader = true;
    const params = {
      pageIndex: this.pageParams.pageIndex,
      pageSize: this.pageParams.pageSize,
      sortBy: this.pageParams.sortBy,
      sortType: this.pageParams.sortType,
      ...this.filter,
    };
    const queryString = generateQueryFilter(params);
    this.tmsService.balanceTransactions(this.merchantId, queryString).pipe(
      tap((res: any) => {
        this.data = res?.success ? res.data.content : [];
        this.data = res.data.content;
        this.pageParams.totalPagesCount = res.data.totalPagesCount;
        this.totalItemsCount = this.pageParams.pageSize * this.pageParams.totalPagesCount;
      }),
      catchError(() => {
        this.data = [];
        return of(null);
      }),
      tap(() => (this.loader = false)),
      finalize(() => (this.loader = false))

    ).subscribe();
  }
  getBalance() {
    this.tmsService.tmsBalance(this.merchantId).subscribe((res: any) => {
      if (res && res.success) {
        this.tirBalance = res.data.tirgoBalance;
        this.serviceBalance = res.data.serviceBalance;
      }
    })
  }
  topupBalance() {
   let drawerRef = this.drawer.create({
      nzTitle: this.translate.instant('top_up_balance'),
      nzContent: TopupBalanceTmsComponent,
      nzPlacement: 'right',
      nzContentParams: { merchantId: this.merchantId }
    });
    drawerRef.afterClose.subscribe((res:any) => {
      if(res.success){
        this.getBalance();
        this.getAll();
      }
    });
  }
  private initializeFilter(): Record<string, string> {
    return { transactionType: '', fromDate: '', toDate: '' };
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  resetFilter(): void {
    this.filter = this.initializeFilter();
    this.getAll();
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize, sort } = params;
    this.pageParams.pageIndex = pageIndex;
    this.pageParams.pageSize = pageSize;

    const currentSort = sort.find(item => item.value !== null);
    this.pageParams.sortBy = currentSort?.key || null;
    this.pageParams.sortType = currentSort?.value === 'ascend' ? 'asc' : currentSort?.value === 'descend' ? 'desc' : '';
  
    this.getAll();
  }
  filterApply() {
    this.pageParams.pageIndex = 1;
    this.getAll();
  }
}
