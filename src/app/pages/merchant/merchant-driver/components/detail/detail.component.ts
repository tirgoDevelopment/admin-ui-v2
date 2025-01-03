import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { MerchantDriverService } from '../../services/merchant-driver.service';
import { DriverMerchantModel } from '../../models/driver-merchant.model';
import { Response } from 'src/app/shared/models/reponse';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NzModalModule, PipeModule],
})
export class DetailComponent implements OnInit {
  confirmModal?: NzModalRef;
  @Input() id?: string | number;
  @Input() mode?: 'add' | 'edit' | 'view'; 
  loading: boolean = false;
  form: FormGroup;
  data:DriverMerchantModel;
  loadingPage = false;

  constructor(
    private toastr: NotificationService,
    private merchantApi: MerchantDriverService,
    private translate: TranslateService,
    private drawerRef: NzDrawerRef,
    private modal: NzModalService
  ) {}
  ngOnInit(): void { 
    this.getTms();
  }
  getTms() {
    this.loadingPage = true;
    this.merchantApi.getById(this.id).subscribe((res:any) => {
      if(res) {
        this.data = res.data;
        this.loadingPage = false;
      }
    })
  }
  onApprove() {
    this.loading = true;
    this.merchantApi.verify(this.data.id).subscribe((res: any) => {
      if(res && res.success) {
        this.loading = false;
        this.drawerRef.close();
        // this.merchantApi.emitCloseEvent({success: true});
        this.toastr.success(this.translate.instant('successfullUpdated'),'');
      }
    })
  }
  onReject() {
    this.loading = true;
    this.merchantApi.reject(this.data.id).subscribe((res: any) => {
      if(res && res.success) {
        // this.merchantApi.emitCloseEvent({success: true});
        this.loading = false;
        this.drawerRef.close();
        this.toastr.success(this.translate.instant('successfullUpdated'),'');
      }
    })
  }
  onBlock() {
    if (this.data.blocked) {
      this.merchantApi.activate(this.data.id).subscribe((res: Response<DriverMerchantModel>) => {
        this.toastr.success(this.translate.instant('successfullyActivated'), '');
        this.drawerRef.close({ success: true });
      });
    }
    else {
      this.blockModal()
    }
  }
  blockModal(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('are_you_sure'),
      nzContent: this.translate.instant('block_sure'),
      nzOkText: this.translate.instant('block'),
      nzCancelText: this.translate.instant('cancel'),
      nzOkDanger: true,
      nzOnOk: () => {
        this.merchantApi.block(this.data.id).subscribe((res: any) => {
          if (res?.success) {
            this.toastr.success(this.translate.instant('successfullBlocked'), '');
            this.drawerRef.close({ success: true });
          }
        });
      }
    });
  }
}
