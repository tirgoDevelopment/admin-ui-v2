import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { ServicesService } from '../../services/services.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PriceFormatPipe } from 'src/app/shared/pipes/priceFormat.pipe';

@Component({
  selector: 'app-kazjul-token',
  templateUrl: './kazjul-token.component.html',
  styleUrls: ['./kazjul-token.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule, PriceFormatPipe],
})
export class KazjulTokenComponent {
  form: FormGroup;
  loading = false;
  loadingPage = false;
  kazJulBalance = 0;
  last_update: Date;
  constructor(
    private serviceApi: ServicesService,
    private drawerRef: NzDrawerRef,
    private toastr: NotificationService,
    private translate: TranslateService
  ) { }
  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.form = new FormGroup({
      kzCurrencyRate: new FormControl(null, Validators.required),
      token: new FormControl(null, Validators.required),
    })

  }
  getData() {
    this.loadingPage = true;
    this.serviceApi.kzPaidWayAccount().subscribe((res: any) => {
      if (res && res.success)
        this.form.patchValue(res.data);
        this.kazJulBalance = res.data.balance;
        this.last_update = res.data.transactionsLastUpdatedate;
        this.loadingPage = false;
    })
  }
  onSubmit() {
    this.loading = true;
    this.serviceApi.putkzPaidWayAccount(this.form.value).subscribe((res: any) => {
      if (res && res.success) {
        this.drawerRef.close();
        this.toastr.success(this.translate.instant('successfullUpdated'), '');
      }
    })
  }
  onRequst() {
    this.loading = true;
    this.serviceApi.requestKazJul({}).subscribe((res:any) => {
      if (res) {
        this.loading = false;
        this.toastr.success(this.translate.instant('successfullUpdated'), '');
      }
    }, err => {
      this.loading = false;
    })
  }
}
