import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { MerchantDriverService } from '../../services/merchant-driver.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DriversService } from 'src/app/pages/drivers/services/drivers.service';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { DriverFormComponent } from 'src/app/pages/drivers/components/driver-form/driver-form.component';
import { AddTransportComponent } from 'src/app/pages/drivers/components/add-transport/add-transport.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { AddDriverComponent } from '../add-driver/add-driver.component';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
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
export class DriversComponent implements OnInit {
  confirmModal?: NzModalRef;

  data: any[] = [];
  merchantId;
  merchantName: string;
  loader: boolean = false;
  isFilterVisible: boolean = false;
  requestsCount: number = 0;
  filter: Record<string, string> = this.initializeFilter();
  pageParams = {
    pageIndex: 0,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
  };
  constructor(private toastr: NotificationService,
    private driverApi: DriversService,
    private merchantApi: MerchantDriverService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private driversService: DriversService,
    private drawer: NzDrawerService,) {
    this.merchantId = this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.getMerchant();
    
  }
  getMerchant() {
    this.merchantApi.getById(this.merchantId).subscribe((res: any) => {
      if (res && res.success) {
        this.merchantName = res.data.companyName + ' ' + res.data.companyType;
      }
    });
  }
  getAll() {
    this.loader = true;
    if (this.merchantId) {
      this.filter['merchantId'] = this.merchantId;
      this.driverApi.getAll(this.pageParams, generateQueryFilter(this.filter)).subscribe((res: any) => {
        if (res && res.success) {
          this.data = res.data.content;
          this.pageParams.totalPagesCount = res.data.totalPagesCount * res.data.pageSize;
          this.loader = false;
        }else {
          this.loader = false;
        }
      },err => {
        this.loader = false;
      });
    }
  }
  private initializeFilter(): Record<string, string> {
    return { };
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
    this.pageParams.pageIndex = pageIndex ;
    this.pageParams.pageSize = pageSize;
  
    const currentSort = sort.find(item => item.value !== null);
    this.pageParams.sortBy = currentSort?.key || null;
    this.pageParams.sortType = currentSort?.value === 'ascend' ? 'asc' : currentSort?.value === 'descend' ? 'desc' : '';
  
    this.getAll();
  }
  handleDrawer(action: 'add' | 'edit' | 'view', id?:number|string): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant(
        action === 'add' ? 'add' :
          action === 'edit' ? 'edit' :
            'information'
      ),
      nzContent: DriverFormComponent,
      nzMaskClosable: false,
      nzPlacement: 'right',
      nzWidth: '400px',
      nzContentParams: {
        id: id,
        mode: action
      }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res?.success && res?.mode !== 'add') {
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
      if (res && res.success && res?.mode === 'add') {
        this.confirmModal = this.modal.confirm({
          nzTitle: this.translate.instant('Вы хотите добавить транспорт ?'),
          nzOkText: this.translate.instant('yes'),
          nzCancelText: this.translate.instant('cancel'),
          nzOnOk: () => {
            const addTransportDrawerRef: any = this.drawer.create({
              nzTitle: this.translate.instant('add_transport'),
              nzContent: AddTransportComponent,
              nzPlacement: 'right',
              nzContentParams: {
                mode: 'add',
                driverId: res.driverId
              }
            });
            this.confirmModal.close();
            addTransportDrawerRef.afterClose.subscribe(() => {
              this.getAll();
            });
          },
          nzOnCancel:() => {
            this.getAll();
          }
        })
      }
    });
  }
  addDriver(){
    let drawerRef = this.drawer.create({
      nzTitle: this.translate.instant('add_driver'),
      nzContent: AddDriverComponent,
      nzPlacement: 'right',
      nzContentParams: {
        merchantId: this.merchantId
      }
    });
    drawerRef.afterClose.subscribe((res:any) => {
      if(res && res.success){
        this.getAll();
      }
    });
  }
  unassignDriver(id:number|string){
    let data = {
      tmsId: this.merchantId,
      driverId: id
    }
    this.merchantApi.unassignDriver(data).subscribe((res:any) => {
      if(res && res.success){
        this.toastr.success(this.translate.instant('successfullUpdated'),'');
        this.getAll();
      }
    });
  }
  filterApply() { 
    this.pageParams.pageIndex = 1;
    this.getAll();
  }
}
