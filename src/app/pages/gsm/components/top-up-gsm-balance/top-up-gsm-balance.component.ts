import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { of } from 'rxjs';
import { MerchantDriverService } from 'src/app/pages/merchant/merchant-driver/services/merchant-driver.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { GSMService } from '../../services/gsm.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-top-up-gsm-balance',
  templateUrl: './top-up-gsm-balance.component.html',
  styleUrls: ['./top-up-gsm-balance.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, PipeModule, NgxMaskDirective],

})
export class TopUpGsmBalanceComponent implements OnInit {
  form:FormGroup;
  loading: boolean = false;
  tms$
  constructor(
    private tmsService: MerchantDriverService,
    private gsmService: GSMService,
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private translate: TranslateService
  ) { }
  ngOnInit(): void { 
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      tmsId: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
    })
  }
  find(searchTerm) {
    this.tmsService.findTms(searchTerm, 'companyName').subscribe((response:any) => {
      this.tms$ = of(response.data.content);
    });
  }
  onSubmit() {
    this.loading = true;
    this.form.value.amount = this.form.value.amount.toString(); 
    this.gsmService.topUpTmsGSMBalance(this.form.value).subscribe((res:any) => {
      if(res && res.success) {
        this.loading = false;
        this.toastr.success(this.translate.instant('successfullUpdated'));
        this.drawerRef.close({success: true});
      }
    },err => {
      this.loading = false;
    })
  }
}
