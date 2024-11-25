import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { OrdersService } from '../../services/orders.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-send-offer',
  templateUrl: './send-offer.component.html',
  styleUrls: ['./send-offer.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule, NgxMaskDirective],
  providers: [NzModalService]

})
export class SendOfferComponent implements OnInit {
  @Input() offer: any;
  @Input() clientId: any;
  form:any;
  loading: boolean = false;
  currencies: any;

  constructor(
    private currencyApi: CurrenciesService,
    private orderApi: OrdersService,
    private drawerRef: NzDrawerRef,
    private toastr: NotificationService,
    private translate: TranslateService
  ) {
    this.form = new FormGroup({
      orderId: new FormControl(''),
      clientId: new FormControl(''),
      offerId: new FormControl(''),
      amount: new FormControl(null,[Validators.required]),
    })
  }
  ngOnInit(): void {
    this.form.patchValue({
      orderId: this.offer.order.id,
      offerId: this.offer.id,
      clientId: this.clientId
    })
  }
  replyToDriverOffer() {
    this.form.value.amount = Number(this.form.value.amount);
    if(this.form.value.amount && typeof this.form.value.amount === 'number') {
      this.loading = true;
      this.orderApi.replyToDriverOffer(this.form.value).subscribe((res: any) => {
        if (res && res.success) {
          this.loading = false;
          this.toastr.success(this.translate.instant('successfullUpdated'));
          this.form.reset();
          this.drawerRef.close({ success: true });
        } else {
          this.loading = false;
        }
      });
    }
    else if(typeof this.form.value.amount === 'string') {
      this.toastr.error(this.translate.instant('Предлагаемая цена должна быть числом'));
      this.loading = false;
    }
    else {
      this.loading = false;
      this.toastr.success(this.translate.instant('is_requireds'));
    }
  }

}
