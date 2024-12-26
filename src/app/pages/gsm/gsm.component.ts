import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { MerchantDriverService } from '../merchant/merchant-driver/services/merchant-driver.service';
import { ServicesService } from '../services/services/services.service';
import { DriverFormComponent } from '../drivers/components/driver-form/driver-form.component';
import { DetailComponent } from '../merchant/merchant-driver/components/detail/detail.component';
import { PageParams } from '../orders/models/page-params.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';

@Component({
  selector: 'app-gsm',
  templateUrl: './gsm.component.html',
  styleUrls: ['./gsm.component.scss'],
  standalone: true,
  imports: [ CommonModules, NzModules,TranslateModule, IconsProviderModule, PipeModule,],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out')),
    ]),
  ],
})
export class GSMComponent implements OnInit{
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
    private servicesService: ServicesService,
    private modal: NzModalService,
    private drawer: NzDrawerService,
    private translate: TranslateService,
    private socketService: SocketService,
    private toastr: NotificationService,
    private cdr: ChangeDetectorRef,
    private merchantApi: MerchantDriverService,
    private router: Router
  ) {}
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
  getAll() {

  }
  changeStatus(item) {}
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
    showTms(item) {
      if(item) {
        const drawerRef: any = this.drawer.create({
          nzTitle: this.translate.instant('information'),
          nzContent: DetailComponent,
          nzMaskClosable: false,
          nzPlacement: 'right',
          nzWidth: '400px',
          nzContentParams: {
            data: item,
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
        serviceId: '',
        driverId: '',
        statusId: '',
        createdAtFrom: '',
        createdAtTo: '',
      };
    }
    public onQueryParamsChange(params: NzTableQueryParams): void {
      this.pageParams.pageIndex = params.pageIndex;
      this.pageParams.pageSize = params.pageSize;
      let { sort } = params;
      let currentSort = sort.find((item) => item.value !== null);
      let sortField = (currentSort && currentSort.key) || null;
      let sortOrder = (currentSort && currentSort.value) || null;
      sortOrder === 'ascend'
        ? (sortOrder = 'asc')
        : sortOrder === 'descend'
          ? (sortOrder = 'desc')
          : (sortOrder = '');
      this.pageParams.sortBy = sortField;
      this.pageParams.sortType = sortOrder;
      this.getAll();
    }
}
