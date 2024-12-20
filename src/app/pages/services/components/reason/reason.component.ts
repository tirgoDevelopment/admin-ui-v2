import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ServicesService } from '../../services/services.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.scss'],
  standalone: true,
  imports: [
    NzModules,
    TranslateModule,
    CommonModules,
    NzModalModule,
    PipeModule,
  ],
})
export class ReasonComponent implements OnInit {
  @Input() service:any;
  form: FormGroup;
  loading
  constructor(
    private modal: NzModalService,
    private serviceApi: ServicesService,
    private toastr: NotificationService,
    private translate: TranslateService,
    private modalRef: NzModalRef
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      id: new FormControl(this.service.id),
      status: new FormControl('cancel'),
      cancelReason: new FormControl('')
    })
  }
  onSubmit() {
    this.loading = true;
    this.serviceApi.patchServiceStatus(this.form.value,'/{id}/cancel').subscribe((res: any) => {
      if (res && res.success) {
        this.toastr.success(this.translate.instant('successfullyCanceled'));
        this.modalRef.close('submitted');
      }
    }, err => {
      this.loading = false;
    });
  }
  
  onCancel() {
    this.modalRef.close('closed');
  }
}
