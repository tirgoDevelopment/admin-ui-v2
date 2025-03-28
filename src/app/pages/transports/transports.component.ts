import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Permission } from 'src/app/shared/enum/per.enum';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TransportsService } from './services/transports.service';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { TransportBrandService } from '../references/transport-brand/services/transport-brand.service';
import { AddTransportComponent } from './components/add-transport/add-transport.component';
import { catchError, of, tap } from 'rxjs';
import { TransportManageComponent } from './components/transport-manage/transport-manage.component';
import { Router } from '@angular/router';
import { DriversService } from '../drivers/services/drivers.service';
import { TmsService } from '../merchant/merchant-driver/services/tms.service';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-transports',
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out')),
    ]),
  ],
})
export class TransportsComponent implements OnInit {
  Permission = Permission;
  brandGroups: any[] = [];
  confirmModal?: NzModalRef;
  data: any[] = [];
  loader: boolean = false;
  loading: boolean = false;
  isFilterVisible: boolean = false;
  drivers: any[] = [];
  tmses: any[] = [];
  filter: Record<string, string> = this.initializeFilter();
  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
  };
  constructor(
    public perService: PermissionService,
    private toastr: NotificationService,
    private transportsService: TransportsService,
    private brandsService: TransportBrandService,
    private drawer: NzDrawerService,
    private translate: TranslateService,
    private modal: NzModalService,
    private route: Router,
    private driverService: DriversService,
    private tmsService: TmsService
  ) { }
  ngOnInit(): void {
    this.getTransportBrands();
  }

  getAll() {
    this.loader = true;
    this.pageParams = {
      ...this.pageParams,
      ...this.filter
    }
    this.transportsService.getAll(generateQueryFilter(this.pageParams)).pipe(
      tap((res: any) => {
        this.data = res?.success ? res.data.content : [];
        this.pageParams.totalPagesCount = res?.data?.totalPagesCount * this.pageParams.pageSize;
        this.loader = false;
      }),
      catchError(() => {
        this.data = [];
        this.loader = false;
        return of(null);
      }),
      tap(() => (this.loader = false))
    ).subscribe();
  }
  add() {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add_transport'),
      nzContent: AddTransportComponent,
      nzPlacement: 'right',
      nzContentParams: {
        driverId: 1,
        mode: 'add'
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res.success) {
        this.getAll()
      }
    });
  }
  editTransport(item) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_transport'),
      nzContent: AddTransportComponent,
      nzPlacement: 'right',
      nzContentParams: {
        driverId: null,
        data: item.id,
        mode: 'edit'
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res.success) {
        this.getAll()
      }
    });
  }
  transportManagment() {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('transportManagment'),
      nzContent: TransportManageComponent,
      nzPlacement: 'right',
    })
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res.success) {
        this.getAll();
      }
    })
  }
  histroyTransport(id) {
    this.route.navigate([`transports/${id}/history`]);
  }
  remove(id) {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('delete_sure'),
      nzOkText: this.translate.instant('yes'),
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.transportsService.deleteTransport(id).subscribe({
          next: (res: any) => {
            if (res?.success) {
              this.toastr.success(this.translate.instant('successfullDeleted'), '');
              this.getAll()
            }
          }
        })
      }
    })
  }
  getTransportBrands() {
    this.brandsService.getBrandGroups().subscribe((res: any) => {
      if (res && res.success) {
        this.brandGroups = res.data;
      }
    })
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  fiterApply() {
    this.pageParams.pageIndex = 1;
    this.getAll();
  }
  resetFilter(): void {
    this.filter = this.initializeFilter();
    this.getAll();
  }
  private initializeFilter(): Record<string, string> {
    return { transportBrandId: '', transportNumber: '', isKzPaidWay: '', driverId: '', tmsId: '' };
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
  findDriver(ev: string) {
    if (ev) {
      this.driverService.findDrivers(ev, 'driverId').subscribe((res: any) => {
        if (res) {
          this.drivers = res.data.content;
        }
      })
    }
  }
  findTms(ev: string) {
    if (ev) {
      this.tmsService.findTms(ev, 'companyName').subscribe((res: any) => {
        if (res) {
          this.tmses = res.data.content;
        }
      })
    }
  }

  exportTransports() {
    this.loading = true;
    const params = {
      pageIndex: this.pageParams.pageIndex,
      pageSize: this.pageParams.pageSize,
      sortBy: this.pageParams.sortBy,
      sortType: this.pageParams.sortType,
      ...this.filter,
    };
    let query = generateQueryFilter(params)

    this.transportsService.export(query).subscribe((res: any) => {
      if (res) {
        this.loading = false;
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'transports.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    })
  }
}
