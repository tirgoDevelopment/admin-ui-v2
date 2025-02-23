import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientModel } from './models/client.model';
import { ClientsService } from './services/clients.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { catchError, tap, of } from 'rxjs';
import { ClientsFormComponent } from './components/clients-form/clients-form.component';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { SendPushComponent } from '../drivers/components/send-push/send-push.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/enum/per.enum';
import { PhoneFormatPipe } from 'src/app/shared/pipes/phone-format.pipe';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  standalone: true,
  imports: [
     CommonModules, TranslateModule, IconsProviderModule, PhoneFormatPipe,
      NzInputModule, NzDatePickerModule, NzTableModule, NzDropDownModule, NzEmptyModule, NzResultModule, NzDrawerModule, NzButtonModule
    ],
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
    return { firstName: '', clientId: '', phoneNumber: '', createdAtTo: '', createdAtFrom: '', lastLoginFrom: '', lastLoginTo: '' };
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
  sendNotification() {
    this.drawer.create({
      nzTitle: this.translate.instant('send_push'),
      nzContent: SendPushComponent,
      nzPlacement: 'right'
    }) 
  }
}