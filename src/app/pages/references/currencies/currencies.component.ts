import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { CurrenciesFormComponent } from './components/currencies-form/currencies-form.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, CurrenciesFormComponent],
  providers: [NzModalService]
})
export class CurrenciesComponent implements OnInit {
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
    private currenciesService: CurrenciesService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.currenciesService.getAll(this.pageParams).subscribe((res: any) => {
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
      nzContent: CurrenciesFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((result: any) => {
      console.log(result);
      
      if (result && result.success) {
        this.getAll();
      }
    });
  }
  update(item: any) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: CurrenciesFormComponent,
      nzPlacement: 'right',
      nzContentParams: { data: item }
    });
    drawerRef.afterClose.subscribe((result: any) => {
      if (result && result.success) {
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
        this.currenciesService.delete(id).subscribe((res: any) => {
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
