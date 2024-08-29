import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdminsService } from './services/admins.service';
import { AdminModel } from './models/admin.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AdminFormComponent } from './components/admin-form/admin-form.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ResponseContent } from 'src/app/shared/models/res-content.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, NzModules, TranslateModule, FormsModule, IconsProviderModule],
  providers: [NzModalService],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('showHideFilter', [
      state('show', style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('hide', style({
        height: '0',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class AdminsComponent implements OnInit {

  confirmModal?: NzModalRef;
  data: AdminModel[];
  loader: boolean = false;
  isFilterVisible: boolean = false
  filter = {id: '',loadingLocation: '',deliveryLocation: '',statusId: ''};
  showForm: boolean = false;
  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: 'id',
    sortType: 'desc'
  };

  constructor(
    private toastr: NotificationService,
    private modal: NzModalService,
    private adminsService: AdminsService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.adminsService.getAll(this.pageParams).subscribe((res: ResponseContent<AdminModel[]>) => {
      if (res && res.success) {
        this.data = res.data.content;
        this.loader = false;
      }
    }, err => {
      this.loader = false;
    })
  }
  add(): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add_admins'),
      nzContent: AdminFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe(() => {
      this.getAll();
      drawerRef.componentInstance?.form.reset();
    });
  }
  update(item:AdminModel) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: AdminFormComponent,
      nzPlacement: 'right',
      nzContentParams: { admin: item }
    });
    drawerRef.afterClose.subscribe(() => {
      this.getAll();
      drawerRef.componentInstance?.form.reset();
    });
  }
  remove(id: number | string) {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('delete_sure'),
      nzOkText: this.translate.instant('remove'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () =>
        this.adminsService.delete(id).subscribe((res: ResponseContent<AdminModel[]>) => {
          if (res && res.success) {
            this.toastr.success(this.translate.instant('successfullDeleted'),'');
            this.getAll();
          }
        }),
    });
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageParams.pageIndex = pageIndex;
    this.getAll();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageParams.pageSize = pageSize;
    this.pageParams.pageIndex = 1;
    this.getAll();
  }

}
