import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { TmsService } from '../../services/tms.service';

@Component({
  selector: 'app-topup-balance-tms',
  templateUrl: './topup-balance-tms.component.html',
  styleUrls: ['./topup-balance-tms.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule,NgxMaskDirective ]
})
export class TopupBalanceTmsComponent implements OnInit {
  @Input() merchantId: string;
  form: FormGroup;
  currencies: any[] = [];
  loading: boolean = false;
  constructor(
    private toastr: NotificationService,
    private tmsService: TmsService,
    private currenciesService: CurrenciesService,
    private drawer: NzDrawerRef,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getCurrencies();
    this.setupValueChangeListeners();
  }
  getCurrencies(): void {
    this.currenciesService.getAll().subscribe((res: any) => {
      this.currencies = res.data;
      this.form.get('currencyId').setValue(this.currencies[0].id);
      this.form.get('currencyRate').setValue(this.currencies[0].tirRate);
    });
  }
  initializeForm(): void {
    this.form = new FormGroup({
      tmsId: new FormControl(this.merchantId, [Validators.required]),
      currencyId: new FormControl(null, [Validators.required]),
      currencyAmount: new FormControl('', [Validators.required]),
      currencyRate: new FormControl(null),
      tirAmount: new FormControl('', [Validators.required]),
      balanceType: new FormControl(null, [Validators.required]),
      description: new FormControl(null)
    });
  }
  submit(): void {
    this.form.value.currencyAmount = this.form.value.currencyAmount.toString();
    this.form.value.tirAmount = this.form.value.tirAmount.toString();
    this.loading = true;
    this.tmsService.topupBalance(this.form.value).subscribe((res: any) => {
      this.loading = false;
      this.toastr.success(this.translate.instant('successfullCreated'));
      this.drawer.close({success:true});
    },err => {
      this.loading = false;
    });
  }
  setupValueChangeListeners(): void {
    this.form.get('currencyId').valueChanges.subscribe((currencyId) => {
      const selectedCurrency = this.currencies.find((currency) => currency.id === currencyId);
      if (selectedCurrency) {
        this.form.get('currencyRate').setValue(selectedCurrency.tirRate);
      }
    });
  
    this.form.get('currencyAmount').valueChanges.subscribe((currencyAmount) => {
      const currencyRate = this.form.get('currencyRate').value || 1;
      const tirAmount = currencyAmount / currencyRate;
      this.form.get('tirAmount').setValue(tirAmount, { emitEvent: false });
    });
  }

}
