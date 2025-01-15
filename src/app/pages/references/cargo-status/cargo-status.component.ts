import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { CargoStatusFormComponent } from './components/cargo-status-form/cargo-status-form.component';
import { CargoStatusModel } from './models/cargo-status.model';
import { CargoStatusService } from 'src/app/shared/services/references/cargo-status.service';
import { Permission } from 'src/app/shared/enum/per.enum';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-cargo-status',
  templateUrl: './cargo-status.component.html',
  styleUrls: ['./cargo-status.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, CargoStatusFormComponent],
  providers: [NzModalService]
})
export class CargoStatusComponent implements OnInit {
  Per = Permission;
  confirmModal?: NzModalRef;
  data: any[];
  loader: boolean = false;
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
    private cargoStatusService: CargoStatusService,
    private drawer: NzDrawerService,
    private translate: TranslateService,
    public perService: PermissionService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.cargoStatusService.getAll().subscribe((res:any) => {
      if (res && res.success) {
        this.data = res.data;
        this.loader = false;
      }else {
        this.loader = false;
      }
    }, err => {
      this.loader = false;
    })
  }
  add(): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add'),
      nzContent: CargoStatusFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((res:any) => {
      if(res && res.success){
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  update(item:CargoStatusModel) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: CargoStatusFormComponent,
      nzPlacement: 'right',
      nzContentParams: { data: item }
    });
    drawerRef.afterClose.subscribe((res:any) => {
      if(res && res.success){
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
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
        this.cargoStatusService.delete(id).subscribe((res: any) => {
          if (res && res.success) {
            this.toastr.success(this.translate.instant('successfullDeleted'),'');
            this.getAll();
          }
        }),
    });
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
