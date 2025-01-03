import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { MerchantDriverService } from '../merchant/merchant-driver/services/merchant-driver.service';
import { DriverFormComponent } from '../drivers/components/driver-form/driver-form.component';
import { DetailComponent } from '../merchant/merchant-driver/components/detail/detail.component';
import { PageParams } from '../orders/models/page-params.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { AssignDriverCardComponent } from './components/assign-driver-card/assign-driver-card.component';
import { TopUpGsmBalanceComponent } from './components/top-up-gsm-balance/top-up-gsm-balance.component';
import { GSMService } from './services/gsm.service';

@Component({
  selector: 'app-gsm',
  templateUrl: './gsm.component.html',
  styleUrls: ['./gsm.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, PipeModule,],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out')),
    ]),
  ],
})
export class GSMComponent implements OnInit {
  public data: any[] = [];
  public loader = false;
  public isFilterVisible = false;
  public filter: Record<string, string> = this.initializeFilter();
  statuses: any[] = [];
  services: any[] = [];
  pageParams: PageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
  };

  totalItemsCount
  currentUser: any;
  searchTms$ = new BehaviorSubject<string>('');
  tms$: Observable<any>;
  constructor(
    private gsmService: GSMService,
    private drawer: NzDrawerService,
    private translate: TranslateService,
    private merchantApi: MerchantDriverService,
  ) { }
  ngOnInit(): void {
    this.currentUser = jwtDecode(localStorage.getItem('accessToken') || '');
    this.tms$ = this.searchTms$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.merchantApi.getVerified({}, searchTerm).pipe(
        catchError((err) => {
          return of({ data: { content: [] } });
        })
      )),
    );
  }
  find(ev: string) {
    let filter = generateQueryFilter({ companyName: ev });
    this.searchTms$.next(filter);
  }
  getAll(): void {
    this.data = [];
    const params = {
      ...this.filter,
      pageIndex: this.pageParams.pageIndex,
      pageSize: this.pageParams.pageSize
    };
    this.loader = true;
    this.gsmService.getTmsGSMTransactios(generateQueryFilter(params)).subscribe(
      (res: any) => {
        if (res?.success) {
          this.data = res.data?.content || [];
          this.pageParams.totalPagesCount = res.data.totalPagesCount;
          this.totalItemsCount = this.pageParams.pageSize * this.pageParams.totalPagesCount;
      }
        this.loader = false;
      },
      () => {
        this.loader = false;
      }
    );
  }
  assignDriverCard() {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('gsm.cardManagment'),
      nzContent: AssignDriverCardComponent,
      nzPlacement: 'right',
      nzWidth: '400px',
    });
  }
  topUpBalance() {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('top_up_balance'),
      nzContent: TopUpGsmBalanceComponent,
      nzPlacement: 'right',
      nzWidth: '400px',
    });
  }
  changeStatus(item, type) {
    item.status = type
    this.gsmService.postGsmBalanceRequest(item).subscribe((res: any) => {
      if (res && res.success) {
        this.getAll();
      }
    })
  }
  showDriver(id) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('information'),
      nzContent: DriverFormComponent,
      nzMaskClosable: false,
      nzPlacement: 'right',
      nzWidth: '400px',
      nzContentParams: {
        id: id,
        mode: 'view'
      }
    });
  }
  showTms(tmsId) {
    if (tmsId) {
      const drawerRef: any = this.drawer.create({
        nzTitle: this.translate.instant('information'),
        nzContent: DetailComponent,
        nzMaskClosable: false,
        nzPlacement: 'right',
        nzWidth: '400px',
        nzContentParams: {
          id: tmsId,
        }
      });
    }

  }
  public toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  public resetFilter(): void {
    this.filter = this.initializeFilter();
    this.getAll();
  }
  private initializeFilter(): Record<string, string> {
    return {
      driverId: '',
      merchantId: '',
      transactionType: 'request',
      createdAtFrom: '',
      createdAtTo: '',
    };
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageParams.pageIndex = params.pageIndex;
    this.pageParams.pageSize = params.pageSize;

    const currentSort = params.sort.find((item) => item.value !== null);
    this.pageParams.sortBy = currentSort?.key || '';
    this.pageParams.sortType = currentSort?.value === 'ascend' ? 'asc' : currentSort?.value === 'descend' ? 'desc' : '';

    this.getAll();
  }
  onTabChange(index: number): void {
    this.filter['transactionType'] = index === 0 ? 'request' : 'topup';
    this.getAll();
  }
}
