import { Component, OnInit } from '@angular/core';
import { SubscriptionTypesFormComponent } from './components/subscription-types-form/subscription-types-form.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SubscriptionTypesService } from 'src/app/shared/services/references/subscription-types.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { SubscriptionModel } from './models/subscription.model';

@Component({
  selector: 'app-subscription-type',
  templateUrl: './subscription-type.component.html',
  styleUrls: ['./subscription-type.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, SubscriptionTypesFormComponent],
  providers: [NzModalService]

})
export class SubscriptionTypeComponent implements OnInit {

  confirmModal?: NzModalRef;
  data: any[];
  loader: boolean = false;
  showForm: boolean = false;
  isFilterVisible: boolean = false
  filter = {id: '',loadingLocation: '',deliveryLocation: '',statusId: ''};

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
    private subscriptionTypesService: SubscriptionTypesService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.subscriptionTypesService.getAll().subscribe((res:any) => {
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
      nzContent: SubscriptionTypesFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((res:any) => {
      if(res && res.success){
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  update(item:SubscriptionModel) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: SubscriptionTypesFormComponent,
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
        this.subscriptionTypesService.delete(id).subscribe((res: any) => {
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