import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { PageParams } from '../orders/models/page-params.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';
import { ServicesService } from './services/services.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { catchError, Observable, tap, throwError, Subscription, finalize, BehaviorSubject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { ServicePricingComponent } from './components/service-pricing/service-pricing.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { jwtDecode } from 'jwt-decode';
import { NzButtonType } from 'ng-zorro-antd/button';
import { MerchantDriverService } from '../merchant/merchant-driver/services/merchant-driver.service';
import { Router } from '@angular/router';
import { DriverFormComponent } from '../drivers/components/driver-form/driver-form.component';
import { DetailComponent } from '../merchant/merchant-driver/components/detail/detail.component';
import { ChatComponent } from 'src/app/shared/components/chat/chat.component';
import { ServiceDetailComponent } from './components/detail/detail.component';

export enum ServicesRequestsStatusesCodes {
  Waiting = 0,
  Priced = 1,
  Confirmed = 2,
  Working = 3,
  Active = 4,
  Completed = 5,
  Canceled = 6,
  Deleted = 7,
}

export enum SseEventNames {
  NewMessage = 'newMessage',
  NewServiceRequest = 'newServiceRequest',
  ServiceRequestCanceled = 'serviceRequestCanceled',
  ServiceRequestPriced = 'serviceRequestPriced',
  serviceRequestConfirm = 'serviceRequestConfirm',
  ServiceRequestToWorking = 'serviceRequestToWorking',
  ServiceRequestToCompleted = 'serviceRequestToCompleted',
  ServiceRequestDeleted = 'serviceRequestDeleted'
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [
    CommonModules,
    NzModules,
    TranslateModule,
    IconsProviderModule,
    PipeModule,
    ChatComponent
  ],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ServicesComponent implements OnInit, OnDestroy {
  showChat: boolean = false;
  selectedServiceId: string | null = null;

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

  private sseSubscription: Subscription | null = null;
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
  ) { }
  ngOnInit(): void {
    this.getStatuses();
    this.getRefServices();
    this.currentUser = jwtDecode(localStorage.getItem('accessToken') || '');
    this.sseSubscription = this.socketService.getSSEEvents().subscribe((event) => {
    this.handleSocketEvent(event);
      if (event.event === 'newServiceRequest') {
        this.getAll();
      }
    });
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
  handleSocketEvent(event: any): void {
    const service = this.data.find(i => i.id === event.data.requestId);
    if (!service) return;

    let status;
    switch (event.event) {
      case SseEventNames.ServiceRequestPriced:
        status = this.statuses.find(i => i.code === 1);
        break;
      case SseEventNames.serviceRequestConfirm:
        status = this.statuses.find(i => i.code === 2);
        break;
    }
    if (status) {
      service.status = status;
      this.cdr.detectChanges();
    }
  }
  ngOnDestroy() {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
    this.socketService.disconnectSSE();
  }
  public getAll(): void {
    this.loader = true;
    const params = {
      pageIndex: this.pageParams.pageIndex,
      pageSize: this.pageParams.pageSize,
      sortBy: this.pageParams.sortBy,
      sortType: this.pageParams.sortType,
      ...this.filter,
    };
    let query = generateQueryFilter(params)
    this.servicesService
      .getDriverServices(query)
      .pipe(
        tap((res: any) => {
          if (res && res?.success) {
            this.data = res.data.content;
            this.pageParams.totalPagesCount = res.data.totalPagesCount;
            this.totalItemsCount = this.pageParams.pageSize * this.pageParams.totalPagesCount;
          }
          else {
            this.data = [];
          }
        }),
        catchError(this.handleError.bind(this)),
        tap(() => (this.loader = false)),
        finalize(() => (this.loader = false))
      )
      .subscribe();
  }

  private handleError(): Observable<never> {
    this.data = [];
    return throwError(new Error('Error fetching orders'));
  }
  showDetails(item: any) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('information'),
      nzContent: ServiceDetailComponent,
      nzPlacement: 'right',
      nzContentParams: { item },
    });
  }
  showLog(id: string | number) {
    this.router.navigate(['/services', id, 'log']);
  }
  addService() {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add'),
      nzContent: ServiceFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  servicePricing(service: any) {
    const drawerRef = this.drawer.create({
      nzTitle: this.translate.instant('price'),
      nzContent: ServicePricingComponent,
      nzContentParams: {
        service,
        refreshCallback: this.getAll.bind(this),
      },
    });
  }
  getStatuses() {
    this.servicesService.getServiceStatus().subscribe((res: any) => {
      this.statuses = res.data;
    });
  }
  getRefServices() {
    this.servicesService.getServiceList().subscribe((res: any) => {
      this.services = res.data;
    });
  }
  private getNextStatus(currentCode: number): { status: string, apiPath: string } | null {
    switch (currentCode) {
      case ServicesRequestsStatusesCodes.Waiting:
        return { status: 'price', apiPath: '/{id}/price' };
      case ServicesRequestsStatusesCodes.Priced:
        return { status: 'confirm-price', apiPath: '/{id}/confirm-price' };
      case ServicesRequestsStatusesCodes.Confirmed:
        return { status: 'working', apiPath: '/{id}/working' };
      case ServicesRequestsStatusesCodes.Working:
        return { status: 'completed', apiPath: '/{id}/complete' };
      case ServicesRequestsStatusesCodes.Completed:
        return { status: 'cancel', apiPath: '/{id}/cancel' };
      default:
        return null;
    }
  }
  private getStatusName(code: number): string {
    switch (code) {
      case ServicesRequestsStatusesCodes.Waiting:
        return 'Waiting';
      case ServicesRequestsStatusesCodes.Working:
        return 'Working';
      case ServicesRequestsStatusesCodes.Priced:
        return 'Priced';
      case ServicesRequestsStatusesCodes.Active:
        return 'Active';
      case ServicesRequestsStatusesCodes.Completed:
        return 'Completed';
      case ServicesRequestsStatusesCodes.Canceled:
        return 'Canceled';
      default:
        return '';
    }
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
  calculateSum(amountDetails: any[]): number {
    if (!Array.isArray(amountDetails)) return 0;
    return amountDetails.reduce(
      (sum, detail) => sum + parseFloat(detail.amount || 0),
      0
    );
  }


  changeStatus(currentStatus: any, item: any): void {
    let restrictedCodes = [];
    this.currentUser.userId == 1 ? restrictedCodes = [6, 7] : restrictedCodes = [5,6, 7];
    if (this.isRestrictedStatus(currentStatus.code, restrictedCodes)) {
      this.showRestrictedStatusError(currentStatus.code);
      return;
    }
    if (currentStatus.code === 0) {
      this.servicePricing(item);
    } else {
      this.confirmStatusChange(currentStatus.code, item);
    }
  }
  isRestrictedStatus(code: number, restrictedCodes: number[]): boolean {
    return restrictedCodes.includes(code);
  }
  showRestrictedStatusError(code: number): void {
    const statusName = this.translate.instant(
      this.getStatusName(code).toLowerCase()
    );
    this.toastr.error(
      'Вы не можете изменить статус',
      `Статус в ${statusName} состоянии`
    );
  }
  confirmStatusChange(currentCode: number, item: any): void {
    const nextStatus = this.getNextStatus(currentCode);
    if (nextStatus) {
      const cancelButtonConfig = this.getCancelButtonConfig(item);
      this.modal.create({
        nzTitle: this.translate.instant('are_you_sure'),
        nzContent: `Изменить статус на ${this.translate.instant(nextStatus.status)}`,
        nzClosable: true,
        nzFooter: [
          {
            label: this.translate.instant(cancelButtonConfig.text),
            onClick: () => cancelButtonConfig.onCancel(),
          },
          ...(item.status.code !== 5 ? [{
            label: this.translate.instant('confirm'),
            type: 'primary' as NzButtonType,
            onClick: () => this.updateStatus(item.id, nextStatus),
          }] : []),
        ],
        nzKeyboard: true,
      });
    }
  }
  updateStatus(itemId: number, nextStatus: any): void {
    const payload = {
      id: itemId,
      status: nextStatus.status,
    };

    this.servicesService.patchServiceStatus(payload, nextStatus.apiPath)
      .subscribe((response: any) => {
        if (response && response?.success) {
          this.toastr.success(this.translate.instant('successfullUpdated'));
          this.getAll();
          this.modal.closeAll();
        }
        else if(response?.messages[0] == 'notEnoughBalance') {
          this.toastr.error(this.translate.instant('notEnoughBalance'));
        }
      });
  }
  getCancelButtonConfig(selectedService: any): { text: string; onCancel: () => void } {
    const currentUser: any = jwtDecode(localStorage.getItem('accessToken') || '');
  
    if (currentUser.userId == 1) {
      return {
        text: this.translate.instant('services.cancelService'),
        onCancel: () => this.cancelService(selectedService),
      };
    } else {
      return {
        text: this.translate.instant('cancel'),
        onCancel: () => {},
      };
    }
  }
  cancelService(selectedService: any): void {
    this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzOkText: this.translate.instant('confirm'),
      nzCancelText: this.translate.instant('cancel'),
      nzKeyboard: true,
      nzOnOk: () => {
        this.servicesService
          .patchServiceStatus({ id: selectedService.id, status: 'cancel' }, '/{id}/cancel')
          .subscribe((res: any) => {
            if (res && res.success) {
              this.getAll();
              this.toastr.success(this.translate.instant('successfullyCanceled'), '');
            }
          });
      },
    });
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
  showChatForService(id) {
    this.selectedServiceId = id;
    this.showChat = true;
  }
  onChatClose() {
    this.showChat = false;
    this.selectedServiceId = null;
  }
}
