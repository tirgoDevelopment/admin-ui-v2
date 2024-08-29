import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionModel } from '../../models/subscription.model';
import { Response } from 'src/app/shared/models/reponse';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { SubscriptionTypesService } from 'src/app/shared/services/references/subscription-types.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { CurrencyModel } from '../../../currencies/models/currency.model';

@Component({
  selector: 'app-subscription-types-form',
  templateUrl: './subscription-types-form.component.html',
  styleUrls: ['./subscription-types-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],

})
export class SubscriptionTypesFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  currencies: CurrencyModel[] = [];
  showForm: boolean = false;
  loading:boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    duration: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    currencyId: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private currenciesService: CurrenciesService,
    private subscriptionTypesService: SubscriptionTypesService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.patchForm();
    this.getCurrencies();
  }

  getCurrencies() {
    this.currenciesService.getAll().subscribe((res: Response<CurrencyModel[]>) => {
      if (res && res.success) {
        this.currencies = res.data;
      }
    })
  }
  patchForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        duration: this.data.duration,
        price: this.data.price,
        currencyId: this.data.currency.id
      });
    }

  }
  onCancel(): void {
    this.drawerRef.close({ success: false });
    this.form.reset();
  }
  onSubmit() {
    this.loading = true;
    const submitObservable = this.data
      ? this.subscriptionTypesService.update(this.form.value)
      : this.subscriptionTypesService.create(this.form.value);

    submitObservable.subscribe((res: Response<SubscriptionModel[]>) => {
      if (res && res.success) {
        this.loading = false;
        const messageKey = this.data ? 'successfullUpdated' : 'successfullCreated';
        this.toastr.success(this.translate.instant(messageKey), '');
        this.drawerRef.close({ success: true });
        this.form.reset();
      }
    },(error) => {
      this.loading = false;
    });
  }

}
