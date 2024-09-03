import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ResponseContent } from 'src/app/shared/models/res-content.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoTypeGroupsFormComponent } from './components/cargo-type-groups-form/cargo-type-groups-form.component';
import { CargoTypeGroupsService } from 'src/app/shared/services/references/cargo-type-grpups.service';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { CargoGroupModel } from './models/cargo-group.model';
import { Response } from 'src/app/shared/models/reponse';
import { CommonModules } from 'src/app/shared/modules/common.module';

@Component({
  selector: 'app-cargo-type-groups',
  templateUrl: './cargo-type-groups.component.html',
  styleUrls: ['./cargo-type-groups.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, CargoTypeGroupsFormComponent],
  providers: [NzModalService, CargoTypeGroupsFormComponent]
})
export class CargoTypeGroupsComponent implements OnInit {

  confirmModal?: NzModalRef;
  data: CargoGroupModel[];
  loader: boolean = false;
  showForm: boolean = false;
  pageParams = {
    pageIndex: 1,
    pageSize: 10,
    totalPagesCount: 1,
    sortBy: 'id',
    sortType: 'asc'
  };

  constructor(
    private toastr: NotificationService,
    private modal: NzModalService,
    private cargoTypeGroupsService: CargoTypeGroupsService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.cargoTypeGroupsService.getAll(this.pageParams).subscribe((res: Response<CargoGroupModel[]>) => {
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
      nzTitle: this.translate.instant('add_admins'),
      nzContent: CargoTypeGroupsFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  update(item: CargoGroupModel) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: CargoTypeGroupsFormComponent,
      nzPlacement: 'right',
      nzContentParams: { item: item }
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
        this.cargoTypeGroupsService.delete(id).subscribe((res: ResponseContent<any[]>) => {
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
