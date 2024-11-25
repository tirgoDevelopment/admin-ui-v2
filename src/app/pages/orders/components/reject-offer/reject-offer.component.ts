import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { OrdersService } from '../../services/orders.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-reject-offer',
  templateUrl: './reject-offer.component.html',
  styleUrls: ['./reject-offer.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule],
  providers: [NzModalService]
})
export class RejectOfferComponent implements OnInit {
  @Input() offer: any;
  form:FormGroup;
  loading: boolean = false;
  constructor(
    private modal: NzModalService,
    private orderService: OrdersService,
    private toastr: NotificationService,
    private translate: TranslateService,
    private drawerRef: NzDrawerRef,
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      rejectReason: new FormControl(null),
      offerId : new FormControl(this.offer.isReplied ? this.offer.clientReplyOrderOffer.id : this.offer.id),
      orderId: new FormControl(this.offer.order.id)
    });
  }

  onCancel() {
    this.form.reset();
    this.modal.closeAll();
  }

  onSubmit() {
    this.loading = true;
    const rejectMethod = this.offer.isReplied
      ? this.orderService.rejectClientOffer(this.form.value)
      : this.orderService.rejectDriverOffer(this.form.value);
    rejectMethod.subscribe(
      (res: any) => {
        if (res?.success) {
          this.toastr.success(this.translate.instant('successfullyRejected'));
          this.form.reset();
          this.drawerRef.close({ success: true });
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  

}
