import { Component, OnInit } from '@angular/core';
import { TransportKindFormComponent } from './components/transport-kind-form/transport-kind-form.component';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SubscriptionModel } from '../subscription-type/models/subscription.model';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';

@Component({
  selector: 'app-transport-kinds',
  templateUrl: './transport-kinds.component.html',
  styleUrls: ['./transport-kinds.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, TransportKindFormComponent],
  providers: [NzModalService]

})
export class TransportKindsComponent implements OnInit {

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
    private transportKindsService: TransportKindsService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.transportKindsService.getAll().subscribe((res: any) => {
      if (res && res.success) {
        this.data = res.data;
        this.loader = false;
      }
    }, err => {
      this.loader = false;
    })
  }
  add(): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add'),
      nzContent: TransportKindFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res.success) {
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  update(item: SubscriptionModel) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: TransportKindFormComponent,
      nzPlacement: 'right',
      nzContentParams: { data: item }
    });
    drawerRef.afterClose.subscribe((res: any) => {
      if (res && res.success) {
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
        this.transportKindsService.delete(id).subscribe((res: any) => {
          if (res && res.success) {
            this.toastr.success(this.translate.instant('successfullDeleted'), '');
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
