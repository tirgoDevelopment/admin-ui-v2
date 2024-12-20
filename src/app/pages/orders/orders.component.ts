import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { OrdersService } from './services/orders.service';
import { catchError, finalize, forkJoin, Observable, of, tap, throwError } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CargoStatusService } from 'src/app/shared/services/references/cargo-status.service';
import { TransportTypesService } from 'src/app/shared/services/references/transport-type.service';
import { CargoStatusModel } from '../references/cargo-status/models/cargo-status.model';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';
import { TransportKindModel } from '../references/transport-kinds/models/transport-kinds.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderModel } from './models/order.model';
import { CargoStatusCodes } from 'src/app/shared/enum/statusCode.enum';
import { PageParams } from './models/page-params.interface';
import { OrderFilterComponent } from './components/order-filter/order-filter.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, PipeModule, OrderFilterComponent]
})
export class OrdersComponent implements OnInit {
  public readonly CargoStatusCodes = CargoStatusCodes;
  private confirmModal?: NzModalRef;

  public data: OrderModel[] = [];
  public loader = false;
  public isFilterVisible = false;
  public filter: Record<string, string> = this.initializeFilter();
  public transportKinds: TransportKindModel[] = [];
  public transportTypes: any[] = [];
  public statuses: CargoStatusModel[] = [];

  private pageParams: PageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
  };

  constructor(
    private readonly orderService: OrdersService,
    private readonly statusService: CargoStatusService,
    private readonly transportKindsService: TransportKindsService,
    private readonly transportTypeService: TransportTypesService,
    public readonly translate: TranslateService,
    private readonly drawer: NzDrawerService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const { clientId, driverId } = params;
      if (clientId || driverId) {
        this.filter = {
          ...this.filter,
          clientId,
          driverId
        };
        this.getAll();
      }
    });
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getTypes();
  }

  public getAll(): void {
    this.setLoading(true);
    const queryString = generateQueryFilter(this.filter);

    this.orderService.getAll(this.pageParams, queryString)
      .pipe(
        tap(this.handleOrdersResponse.bind(this)),
        catchError(this.handleError.bind(this)),
        tap(() => this.setLoading(false)),
        finalize(() => this.setLoading(false))
      )
      .subscribe();
    this.removeQuery();
  }

  private handleOrdersResponse(response: any): void {
    if (response?.success) {
      this.data = response.data.content;
      this.pageParams.totalPagesCount = response.data.pageSize * response.data.totalPagesCount;
    }
  }

  private handleError(): Observable<never> {
    this.data = [];
    return throwError(new Error('Error fetching orders'));
  }

  private setLoading(status: boolean): void {
    this.loader = status;
  }

  public handleDrawer(action: 'add' | 'edit' | 'view', orderId?: string | number): void {
    const drawerRef = this.createDrawer(action, orderId);
    this.handleDrawerClose(drawerRef);
  }

  private createDrawer(action: 'add' | 'edit' | 'view', orderId?: string | number): any {
    return this.drawer.create({
      nzTitle: this.getDrawerTitle(action),
      nzContent: OrderFormComponent,
      nzWidth: '450px',
      nzMaskClosable: false,
      nzPlacement: 'right',
      nzContentParams: {
        orderId: orderId,
        mode: action
      }
    });
  }

  private getDrawerTitle(action: 'add' | 'edit' | 'view'): string {
    const titles = {
      add: 'cargo_placement',
      edit: 'edit',
      view: 'information'
    };
    return this.translate.instant(titles[action]);
  }

  private handleDrawerClose(drawerRef: any): void {
    drawerRef.afterClose.subscribe((result: any) => {
      if (result?.success && result?.mode !== 'add') {
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }

  public getTypes(): void {
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
      }
    });
  }

  public onPageIndexChange(pageIndex: number): void {
    this.pageParams.pageIndex = pageIndex;
    this.getAll();
  }

  public onPageSizeChange(pageSize: number): void {
    this.pageParams.pageSize = pageSize;
    this.pageParams.pageIndex = 0;
    this.getAll();
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
      orderId: '',
      statusId: '',
      deliveryLocation: '',
      loadingLocation: '',
      transportKindId: '',
      transportTypeId: '',
      createdAt: '',
      sendDate: '',
      merchantOrder: ''
    };
  }

  public onQueryParamsChange(params: NzTableQueryParams): void {
    let { sort } = params;
    let currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;
    sortOrder === 'ascend' ? (sortOrder = 'asc') : sortOrder === 'descend' ? (sortOrder = 'desc') : sortOrder = '';
    this.pageParams.sortBy = sortField;
    this.pageParams.sortType = sortOrder;
    this.getAll();
  }
  removeQuery() {
    this.router.navigate(['/orders'], { queryParams: {} });
  }
}
