import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { MerchantDriverService } from './services/merchant-driver.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { DriverMerchantModel } from './models/driver-merchant.model';
import { catchError, of, tap } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RequestsComponent } from './components/requests/requests.component';
import { DetailComponent } from './components/detail/detail.component';
import { FormComponent } from './components/form/form.component';
import { TopupBalanceTmsComponent } from './components/topup-balance-tms/topup-balance-tms.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/enum/per.enum';

@Component({
  selector: 'app-merchant-driver',
  templateUrl: './merchant-driver.component.html',
  styleUrls: ['./merchant-driver.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, PipeModule, RouterModule],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class MerchantDriverComponent implements OnInit {
  Per = Permission;
  confirmModal?: NzModalRef;
  data: DriverMerchantModel[] = [];
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
    private router: Router,
    private modal: NzModalService,
    private merchantApi: MerchantDriverService,
    private drawer: NzDrawerService,
    private translate: TranslateService,
    public perService: PermissionService
    ) { }
  ngOnInit(): void {
    this.getVerified();
    this.getUnverified();
  }
  requests(): void {
    if(this.perService.hasPermission(this.Per.TmsRequstsList)) {
      this.confirmModal = this.modal.create({
        nzTitle: this.translate.instant('requests'),
        nzContent: RequestsComponent,
        nzFooter: null,
      });
      this.confirmModal.afterClose.subscribe((res: any) => {
        if (res?.success) {
          this.getVerified();
        }
      });
    } 
   
  }
  getVerified(): void {
    this.loader = true;
    const queryString = generateQueryFilter(this.filter);
    this.merchantApi.getVerified(this.pageParams, queryString).pipe(
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
  getUnverified() {
    this.merchantApi.getUnverified().subscribe((res: any) => {
      if (res && res.success) {
        this.requestsCount = res.data.content.length;
      }
    })
  }
  handleDrawer(action: 'add' | 'edit' | 'view', item?: DriverMerchantModel): void {
    let component: any;
    (action === 'add' || action === 'edit') ? component = FormComponent : component = DetailComponent;
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant(
        action === 'add' ? 'add' :
          action === 'edit' ? 'edit' :
            'detail'
      ),
      nzContent: component,
      nzPlacement: 'right',
      nzWidth: '430px',
      nzContentParams: {
        data: item,
        mode: action
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res?.success) {
        this.getVerified();
        this.getUnverified();
      }
    });
  }
  showDetail(id) {
    if(this.perService.hasPermission(this.Per.DriverDetail) && id) {
      const drawerRef: any = this.drawer.create({
        nzTitle: this.translate.instant('information'),
        nzContent: DetailComponent,
        nzMaskClosable: false,
        nzPlacement: 'right',
        nzWidth: '400px',
        nzContentParams: {
          id: id,
        }
      });
    }
  }
  showHistoryTransaction(item: DriverMerchantModel) {
    if(!this.perService.hasPermission(this.Per.TmsTransactionsHistory)) return
    this.router.navigate([`/merchant-driver/transactions/${item.id}/${item.companyType + ' ' + item.companyName}`]);
  }
  showDrivers(id) {
    if(this.perService.hasPermission(this.Per.TmsDriversList) && id) {
      this.router.navigate([`/merchant-driver/drivers/${id}`]);
    }
    
  }
  topupBalance(id) {
    if(this.perService.hasPermission(this.Per.TmsTopupBalance)) {
      let drawerRef = this.drawer.create({
        nzTitle: this.translate.instant('top_up_balance'),
        nzContent: TopupBalanceTmsComponent,
        nzPlacement: 'right',
        nzContentParams: { merchantId: id }
      });
    }
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  private initializeFilter(): Record<string, string> {
    return { companyName: '', merchantId: '', createdAtFrom: '', createdAtTo: '' };
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize, sort } = params;
    this.pageParams.pageIndex = pageIndex ;
    this.pageParams.pageSize = pageSize;
  
    const currentSort = sort.find(item => item.value !== null);
    this.pageParams.sortBy = currentSort?.key || null;
    this.pageParams.sortType = currentSort?.value === 'ascend' ? 'asc' : currentSort?.value === 'descend' ? 'desc' : '';
  
    this.getVerified();
  }
  resetFilter(): void {
    this.filter = this.initializeFilter();
    this.getVerified();
  }
  onBlock(item: DriverMerchantModel) {
    if (item.blocked) {
      this.merchantApi.activate(item.id).subscribe((res) => {
        this.toastr.success(this.translate.instant('successfullyActivated'), '');
        this.getUnverified();
        this.getVerified();
      });
    }
    else {
      this.blockModal(item)
    }
  }
  blockModal(item: DriverMerchantModel): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('block_sure'),
      nzOkText: this.translate.instant('block'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () => {
        this.merchantApi.block(item.id).subscribe((res: any) => {
          if (res?.success) {
            this.toastr.success(this.translate.instant('successfullBlocked'), '');
            this.getUnverified();
            this.getVerified();
          }
        });
      }
    });
  }
}
