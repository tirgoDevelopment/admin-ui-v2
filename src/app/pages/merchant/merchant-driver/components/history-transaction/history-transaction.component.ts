import { Component } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { catchError, of, tap } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { MerchantDriverService } from '../../services/merchant-driver.service';

@Component({
  selector: 'app-history-transaction',
  templateUrl: './history-transaction.component.html',
  styleUrls: ['./history-transaction.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, NgxMaskDirective, PipeModule, RouterModule],
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

  constructor(
    private toastr: NotificationService,
    private merchantApi: MerchantDriverService,
    private translate: TranslateService,
    private route: ActivatedRoute) {
    this.merchantId = this.route.snapshot.params['id'];
    this.merchantName = this.route.snapshot.params['name'];
  }
  ngOnInit(): void { }
  getAll(): void {
    this.loader = true;
    const queryString = generateQueryFilter(this.filter);
    this.merchantApi.transactions(this.merchantId, this.pageParams, queryString).pipe(
      tap((res: any) => {
        this.data = res?.success ? res.data.content : [];
        this.pageParams.totalPagesCount = res.data.pageSize * res?.data?.totalPagesCount;
      }),
      catchError(() => {
        this.data = [];
        return of(null);
      }),
      tap(() => (this.loader = false))
    ).subscribe();
  }
  private initializeFilter(): Record<string, string> {
    return { transactionType: '', fromDate: '', toDate: '' };
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageParams.pageIndex = pageIndex;
    this.getAll();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageParams.pageSize = pageSize;
    // this.pageParams.pageIndex = 0;
    this.getAll();
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  resetFilter(): void {
    this.filter = this.initializeFilter();
    this.getAll();
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    let { sort } = params;
    let currentSort = sort.find((item) => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;
    sortOrder === 'ascend' ? (sortOrder = 'asc') : sortOrder === 'descend' ? (sortOrder = 'desc') : sortOrder = '';
    this.pageParams.sortBy = sortField;
    this.pageParams.sortType = sortOrder;
    this.getAll();
  }
}
