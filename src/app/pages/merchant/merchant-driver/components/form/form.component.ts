import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { CurrencyModel } from 'src/app/pages/references/currencies/models/currency.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MerchantDriverService } from '../../services/merchant-driver.service';
import { DriverMerchantModel } from '../../models/driver-merchant.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [NzModules, CommonModules, TranslateModule, NgxMaskDirective],
})
export class FormComponent implements OnInit {
  confirmModal?: NzModalRef;
  @Input() data?: DriverMerchantModel;
  @Input() mode?: 'add' | 'edit' | 'view';
  loading: boolean = false;
  form: FormGroup;
  currencies: CurrencyModel[] = [];

  constructor(
    private MerchantApi: MerchantDriverService,
    private fb: FormBuilder,
    private toastr: NotificationService,
    private currenciesApi: CurrenciesService,
    private translate: TranslateService) {
    this.form = this.fb.group({
      id: new FormControl(''),
      companyType: new FormControl(''),
      companyName: new FormControl(''),
      responsiblePersonLastName: new FormControl(''),
      responsiblePersonFistName: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      factAddress: new FormControl(''),
      legalAddress: new FormControl(''),
      bankName: new FormControl(''),
      bankAccounts: this.fb.array([]),
      notes: new FormControl(''),
      mfo: new FormControl(''),
      inn: new FormControl(''),
      oked: new FormControl(''),
      dunsNumber: new FormControl(''),
      ibanNumber: new FormControl(''),
      supervisorFirstName: new FormControl(''),
      supervisorLastName: new FormControl(''),
      taxPayerCode: new FormControl(''),
      responsbilePersonPhoneNumber: new FormControl(''),
      kzPaidWayCommission: new FormControl(''),
      debtLimit: new FormControl('')
    });
  }

  ngOnInit() {
    this.getCurrency();
    if (this.mode === 'edit') {
      this.loadBankAccounts(this.data.bankAccounts);
      this.patchValue();
    }
  }
  getCurrency() {
    this.currenciesApi.getAll().subscribe((res: any) => {
      if (res && res.success) {
        this.currencies = res.data;
        if (this.bankAccounts.length === 0) {
          this.addBankAccount();
        }
      }
    })
  }
  patchValue() {
    this.form.patchValue({
      ...this.data,
      bankAccounts: this.data.bankAccounts.map(account => ({
        account: account.account,
        currency: account.currency.id, 
        id: account.id,
      }))
    });
  }
  submit() {
    if (this.form.valid) {
      this.loading = true;
      this.form.value.bankAccounts = this.setId(this.form.value.bankAccounts);
      this.MerchantApi.update(this.form.value).subscribe((res:any) => {
        if (res && res.success) {
          this.loading = false;
          this.MerchantApi.emitCloseEvent({success: true});
          this.toastr.success(this.translate.instant('successfullUpdated'),'');
        }
      },  err => {
        this.loading = false;
      })
    }
  }
  get bankAccounts(): FormArray {
    return this.form.get('bankAccounts') as FormArray;
  }
  loadBankAccounts(accounts: any[]): void {
    accounts.forEach(account => {
      this.bankAccounts.push(
        this.fb.group({
          account: [account.account, Validators.required],
          currency: [account.currency.id, Validators.required],
          id: [account.id],
          active: [account.active] 
        })
      );
    });
  }
  addBankAccount(): void {
    if (this.bankAccounts.length < 2) {
      this.bankAccounts.push(
        this.fb.group({
          account: ['', Validators.required],
          currency: [this.currencies[0].id, Validators.required]
        })
      );
    }
  }
  removeBankAccount(index: number): void {
    if (this.bankAccounts.length > 1) {
      this.bankAccounts.removeAt(index);
    }
  }
  setId(bankAccounts: any[]): any[] {
    return bankAccounts.map(bankAccount => {
      const currencyObject = this.currencies.find(c => c.id === bankAccount.currency);
      return {
        ...bankAccount,
        currency: currencyObject
      };
    });
  }

}
