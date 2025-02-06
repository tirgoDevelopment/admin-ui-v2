import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ServicesService } from '../../services/services.service';
import { ReasonComponent } from '../reason/reason.component';

@Component({
  selector: 'app-service-pricing',
  templateUrl: './service-pricing.component.html',
  styleUrls: ['./service-pricing.component.scss'],
  standalone: true,
  imports: [
    NzModules,
    TranslateModule,
    CommonModules,
    NzModalModule,
    PipeModule,
    NgxMaskDirective,
  ],
})
export class ServicePricingComponent implements OnInit {
  @Input() service: any;
  @Input() refreshCallback!: () => void;
  loading: boolean = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private translate: TranslateService,
    private serviceApi: ServicesService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      id: null,
      tirAmount : [null, Validators.required],
    });
  }

  onSubmit() {
    this.form.patchValue({ id: this.service.id });
    this.loading = true;
    if (this.form.valid) {
      this.serviceApi.pricingService(this.form.value).subscribe(
        (res: any) => {
          if (res && res.success) {
            this.toastr.success(this.translate.instant('successfullUpdated'));
            this.drawerRef.close(); 
            this.loading = false;
            if (this.refreshCallback) {
              this.refreshCallback(); 
            }
          }
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      this.toastr.error(this.translate.instant('is_requireds'));
      this.loading = false;
    }
  }
  onCancel() {
    const modal = this.modal.create({
      nzComponentParams: { service: this.service },
      nzTitle: this.translate.instant('services.cancelService'),
      nzContent: ReasonComponent,
      nzMaskClosable: false,
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result === 'submitted') {
        this.drawerRef.close(); // Close the drawer
        if (this.refreshCallback) {
          this.refreshCallback(); // Trigger the callback
        }
      }
    });
  }

}
