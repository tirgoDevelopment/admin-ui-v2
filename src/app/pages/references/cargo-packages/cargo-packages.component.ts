import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { CargoPackagesFormComponent } from './components/cargo-packages-form/cargo-packages-form.component';
import { CargoPackagesService } from 'src/app/shared/services/references/cargo-packages.service';
import { CargoPackagesModel } from './models/cargo-packages.model';


@Component({
  selector: 'app-cargo-packages',
  templateUrl: './cargo-packages.component.html',
  styleUrls: ['./cargo-packages.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, CargoPackagesFormComponent],
  providers: [NzModalService]
})
export class CargoPackagesComponent implements OnInit {

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
    private cargoPackagesService: CargoPackagesService,
    private drawer: NzDrawerService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.loader = true;
    this.cargoPackagesService.getAll().subscribe((res:any) => {
      if (res && res.success) {
        this.data = res.data;
        // for(let i = 0; i < 50; i++){
        //   this.data.push({id:i+1, value: i})
        // }
        this.loader = false;
      }
    }, err => {
      this.loader = false;
    })
  }
  add(): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add'),
      nzContent: CargoPackagesFormComponent,
      nzPlacement: 'right',
    });
    drawerRef.afterClose.subscribe((res:any) => {
      if(res && res.success){
        this.getAll();
        drawerRef.componentInstance?.form.reset();
      }
    });
  }
  update(item:CargoPackagesModel) {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('edit_admins'),
      nzContent: CargoPackagesFormComponent,
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
        this.cargoPackagesService.delete(id).subscribe((res: any) => {
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
