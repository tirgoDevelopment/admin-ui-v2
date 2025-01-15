import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ServicesService } from '../../services/services/services.service';
import { ServiceModel } from '../../services/models/service.model';
import { Response } from 'src/app/shared/models/reponse';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Permission } from 'src/app/shared/enum/per.enum';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule, IconsProviderModule, PipeModule],
  providers: [NzModalService]
})
export class ServicesComponent implements OnInit {
  per = Permission;
  public data: ServiceModel[] = [];
  public loader = false;

  constructor(
    private translate: TranslateService,
    private drawer: NzDrawerService,
    private serviceApi: ServicesService,
    private modal: NzModalService,
    private toastr: NotificationService,
    public perService: PermissionService
  ) { }
  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.loader = true;
    this.serviceApi.getServiceList().subscribe({
      next: (res: Response<ServiceModel[]>) => {
        if (res && res.success) {
          this.data = res.data;
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant('errorOccurred'), '');
      },
      complete: () => {
        this.loader = false;
      }
    });
  }
  add(): void {
    const drawerRef: any = this.drawer.create({
      nzTitle: this.translate.instant('add'),
      nzContent: ServiceFormComponent,
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
      nzContent: ServiceFormComponent,
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
    this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('delete_sure'),
      nzOkText: this.translate.instant('remove'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () =>
      this.serviceApi.deleteService(id).subscribe({
        next: (res: any) => {
          if (res && res.success) {
            this.toastr.success(this.translate.instant('successfullDeleted'), '');
            this.getAll();
          }
        },
        error: () => {
          this.toastr.error(this.translate.instant('errorOccurred'), '');
        }
      })
    });
  }
}
