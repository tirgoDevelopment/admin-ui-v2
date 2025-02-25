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
import { TmsService } from '../../services/tms.service';
import { DriverMerchantModel } from '../../models/driver-merchant.model';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { CompanyTypesService } from 'src/app/shared/services/references/company-types.service';

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
  companyTypes = [];
  
  constructor(
    private tmsService: TmsService,
    private fb: FormBuilder,
    private drawerRef: NzDrawerRef,
    private toastr: NotificationService,
    private currenciesApi: CurrenciesService,
    private companyTypeApi: CompanyTypesService,
    private translate: TranslateService) {
    this.form = new FormGroup({
      id: new FormControl(null),
      companyType: new FormControl(null, Validators.required),
      companyName: new FormControl(null, Validators.required),
      responsiblePersonLastName: new FormControl(null),
      responsiblePersonFistName: new FormControl(null),
      email: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      factAddress: new FormControl(null),
      legalAddress: new FormControl(null),
      bankName: new FormControl(null),
      bankAccounts: this.fb.array([]),
      notes: new FormControl(null),
      mfo: new FormControl(null),
      inn: new FormControl(null),
      oked: new FormControl(null),
      dunsNumber: new FormControl(null),
      ibanNumber: new FormControl(null),
      supervisorFirstName: new FormControl(null),
      supervisorLastName: new FormControl(null),
      taxPayerCode: new FormControl(null),
      responsbilePersonPhoneNumber: new FormControl(null),
      kzPaidWayCommission: new FormControl('5'),
      debtLimit: new FormControl(null),
      password: new FormControl(null),
      isCompleted: new FormControl(true)
    });
  }

  ngOnInit() {
    this.getCompanyType();
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
  getCompanyType() {
    this.companyTypeApi.getAll().subscribe((res: any) => {
      if (res) {
        this.companyTypes = res.data;
        if (this.mode === 'add') {
          this.form.get('companyType').setValue(this.companyTypes[0].name);
        }
      }
    })
  }
  patchValue() {
    this.form.value.password
    this.form.patchValue({
      ...this.data,
      bankAccounts: this.data.bankAccounts.map(account => ({
        account: account.account,
        currency: account.currency.id,
        id: account.id,
      }))
    });
    this.updatePasswordValidation();
  }
  updatePasswordValidation() {
    const passwordControl = this.form.get('password');
    if (!this.data && !this.data.id) {
      passwordControl.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
    } else {
      passwordControl.clearValidators();
    }
    passwordControl.updateValueAndValidity();
  }
  submit() {
    this.loading = true;
    this.form.value.bankAccounts = this.setId(this.form.value.bankAccounts);
    const submitObservable = this.data
      ? this.tmsService.update(this.form.value)
      : this.tmsService.post(this.form.value);

    submitObservable.subscribe((res: any) => {
      if (res && res.success) {
        this.loading = false;
        this.drawerRef.close({ success: true });
        this.tmsService.emitCloseEvent({ success: true });
        const messageKey = this.data ? 'successfullUpdated' : 'successfullCreated';
        this.toastr.success(this.translate.instant(messageKey), '');
      }
    }, err => {
      this.loading = false;
    })
  }
  get bankAccounts(): FormArray {
    return this.form.get('bankAccounts') as FormArray;
  }
  loadBankAccounts(accounts: any[]): void {
    accounts.forEach(account => {
      this.bankAccounts.push(
        this.fb.group({
          account: [account.account],
          currency: [account.currency.id],
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
          account: [''],
          currency: [this.currencies[0].id]
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
