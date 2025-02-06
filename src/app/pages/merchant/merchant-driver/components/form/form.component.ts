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
    this.form = this.fb.group({
      id: new FormControl(''),
      companyType: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      responsiblePersonLastName: new FormControl(''),
      responsiblePersonFistName: new FormControl(''),
      email: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
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
      debtLimit: new FormControl(''),
      password: new FormControl(''),
      isCompleted: new FormControl(true),
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
      passwordControl.setValidators(Validators.required);
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
