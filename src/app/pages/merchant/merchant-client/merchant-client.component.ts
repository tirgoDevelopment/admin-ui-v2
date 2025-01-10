import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { MerchantModel } from './models/merchant.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MerchantClientService } from './services/merchant-client.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { catchError, of, tap } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FormComponent } from './components/form/form.component';
import { DetailComponent } from '../merchant-driver/components/detail/detail.component';
import { RequestsComponent } from './components/requests/requests.component';
import { Router, RouterModule } from '@angular/router';
import { Permission } from 'src/app/shared/enum/per.enum';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-merchant-client',
  templateUrl: './merchant-client.component.html',
  styleUrls: ['./merchant-client.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, NgxMaskDirective, PipeModule,RouterModule],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class MerchantClientComponent implements OnInit {
  Per = Permission;
  confirmModal?: NzModalRef;
  data: MerchantModel[] = [];
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
    private merchantApi: MerchantClientService,
    private drawer: NzDrawerService,
    public perService: PermissionService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getUnverified();
    this.merchantApi.closeEvent$.subscribe((res: any) => {
      if (res.success) {
        this.getUnverified();
        this.getAll();
      }
    })
  }
  getAll(): void {
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
  requests(): void {
    this.confirmModal = this.modal.create({
      nzTitle: this.translate.instant('requests'),
      nzContent: RequestsComponent,
      nzFooter: null,
    });
    this.confirmModal.afterClose.subscribe((res: any) => {
      if (res?.success) {
        this.getUnverified();
      }
    });
  }
  handleDrawer(action: 'add' | 'edit' | 'view', item?: MerchantModel): void {
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
        this.getAll();
        this.getUnverified();
      }
    });
  }
  showHistoryTransaction(item:MerchantModel) {
    this.router.navigate([`/merchant-client/transactions/${item.id}/${item.companyType + ' ' + item.companyName}`]);
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
  private initializeFilter(): Record<string, string> {
    return { companyName: '', merchantId: '', createdAtFrom: '', createdAtTo: '' };
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    let { sort } = params;
    let currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;
    sortOrder === 'ascend' ? (sortOrder = 'asc') : sortOrder === 'descend' ? (sortOrder = 'desc') : sortOrder = '';
    this.pageParams.sortBy = sortField;
    this.pageParams.sortType = sortOrder;
    this.getAll();
  }
  resetFilter(): void {
    this.filter = this.initializeFilter();
    this.getAll();
  }

}