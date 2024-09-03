import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoTypesService } from 'src/app/shared/services/references/cargo-type.service';
import { CargoTypesFormComponent } from "./components/cargo-types-form/cargo-types-form.component";
import { CommonModules } from 'src/app/shared/modules/common.module';

@Component({
  selector: 'app-cargo-types',
  templateUrl: './cargo-types.component.html',
  styleUrls: ['./cargo-types.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, CargoTypesFormComponent],
  providers: [NzModalService]
})
export class CargoTypesComponent implements OnInit {

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
    private cargoTypesService: CargoTypesService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.cargoTypesService.getAll(this.pageParams).subscribe((res: any) => {
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
      nzContent: CargoTypesFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.getAll();
      }
    });
  }
  update(item: any) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: CargoTypesFormComponent,
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
        this.cargoTypesService.delete(id).subscribe((res: any) => {
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
