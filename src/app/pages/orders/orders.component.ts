import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { OrdersService } from './services/orders.service';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CargoStatusService } from 'src/app/shared/services/references/cargo-status.service';
import { TransportTypesService } from 'src/app/shared/services/references/transport-type.service';
import { CargoStatusModel } from '../references/cargo-status/models/cargo-status.model';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';
import { TransportKindModel } from '../references/transport-kinds/models/transport-kinds.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderModel } from './models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, NgxMaskDirective, PipeModule],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class OrdersComponent implements OnInit {
  confirmModal?: NzModalRef;
  data: OrderModel[] = [];
  loader: boolean = false;
  isFilterVisible: boolean = false;
  filter: Record<string, string> = this.initializeFilter();
  transportKinds: TransportKindModel[] = [];
  transportTypes: any[] = [];
  statuses: CargoStatusModel[] = [];
  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
  };
  constructor(
    private orderService: OrdersService,
    private statusService: CargoStatusService,
    private transportKindsService: TransportKindsService,
    private transportTypeService: TransportTypesService,
    public translate: TranslateService,
    private drawer: NzDrawerService
  ) { }
  ngOnInit(): void {
    this.getTypes();
  }
  getAll(): void {
    this.loader = true;
    const queryString = generateQueryFilter(this.filter);
    this.orderService.getAll(this.pageParams, queryString).pipe(
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
  handleDrawer(action: 'add' | 'edit' | 'view', item?: any) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant(
        action === 'add' ? 'cargo_placement' :
          action === 'edit' ? 'edit' :
            'information'
      ),
      nzContent: OrderFormComponent,
      nzWidth: '450px',
      nzMaskClosable: false,
      nzPlacement: 'right',
      nzContentParams: {
        data: item,
        mode: action
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res?.success && res?.mode !== 'add') {
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  getTypes() {
    forkJoin({
      transportKinds: this.transportKindsService.getAll(),
      statuses: this.statusService.getAll(),
      transportTypes: this.transportTypeService.getAll(),
    }).subscribe({
      next: (results: any) => {
        this.transportKinds = results.transportKinds.data;
        this.transportTypes = results.transportTypes.data;
        this.statuses = results.statuses.data;
      },
      
      error: (error: any) => {
        console.error('Error fetching currencies and cargo types:', error);
      }
    });
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageParams.pageIndex = pageIndex;
    this.getAll();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageParams.pageSize = pageSize;
    this.pageParams.pageIndex = 0;
    this.getAll();
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  resetFilter(): void {
    this.filter = this.initializeFilter();
    this.getAll();
  }
  private initializeFilter(): Record<string, string> {
    return {
      orderId : '',
      statusId : '',
      deliveryLocation : '',
      loadingLocation: '',
      transportKindId : '',
      transportTypeId : '',
      createdAt : '',
      sendDate: '',
      merchantOrder : ''
    };
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
}
