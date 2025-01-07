import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientModel } from './models/client.model';
import { ClientsService } from './services/clients.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { catchError, tap, of } from 'rxjs';
import { ClientsFormComponent } from './components/clients-form/clients-form.component';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SendPushComponent } from '../drivers/components/send-push/send-push.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/enum/per.enum';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  standalone: true,
  imports: [ CommonModules, NzModules, TranslateModule, IconsProviderModule, NgxMaskDirective, PipeModule],
  providers: [NzModalService],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class ClientsComponent implements OnInit {
  Permission = Permission;
  confirmModal?: NzModalRef;
  data: ClientModel[] = [];
  loader: boolean = false;
  isFilterVisible: boolean = false;
  filter: Record<string, string> = this.initializeFilter();
  pageParams = {
    pageIndex: 0,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: '',
    sortType: '',
    state: 'notDeleted'
  };

  constructor(
    private toastr: NotificationService,
    private modal: NzModalService,
    private clientsService: ClientsService,
    private drawer: NzDrawerService,
    private translate: TranslateService,
    public  perService: PermissionService
  ) { }

  ngOnInit(): void {  
  }

  getAll(): void {
    this.loader = true;
    const queryString = generateQueryFilter(this.filter);
    this.clientsService.getAll(this.pageParams, queryString).pipe(
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
  handleDrawer(action: 'add' | 'edit' | 'view', id?: string | number): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant(
        action === 'add' ? 'add' : 
        action === 'edit' ? 'edit_admins' : 
        'see_clients_info'
      ),
      nzContent: ClientsFormComponent,
      nzPlacement: 'right',
      nzContentParams: { 
        clientId: id,
        mode: action
      }
    });
  
    drawerRef.afterClose.subscribe((res: any) => {
      if (res?.success) {
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  remove(id: number | string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('delete_sure'),
      nzOkText: this.translate.instant('remove'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () => {
        this.clientsService.delete(id).subscribe((res: any) => {
          if (res?.success) {
            this.toastr.success(this.translate.instant('successfullDeleted'), '');
            this.getAll();
          }
        });
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
    return { firstName: '', clientId: '', phoneNumber: '', createdAtTo: '', createdAtFrom: '', lastLoginFrom: '', lastLoginTo: '' };
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
  sendNotification() {
    this.drawer.create({
      nzTitle: this.translate.instant('send_push'),
      nzContent: SendPushComponent,
      nzPlacement: 'right'
    }) 
  }
}