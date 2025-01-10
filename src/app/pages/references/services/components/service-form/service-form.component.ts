import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { ServiceModel } from 'src/app/pages/services/models/service.model';
import { ServicesService } from 'src/app/pages/services/services/services.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Response } from 'src/app/shared/models/reponse';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NgxMaskDirective],
})

export class ServiceFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  showAmounts: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    uzsAmount: new FormControl(null),
    kztAmount: new FormControl(null),
    tirAmount: new FormControl(null),
    type: new FormControl(null, [Validators.required]),
    withoutSubscription: new FormControl(false, [Validators.required]),
    isLegalEntity: new FormControl(false, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private translate: TranslateService,
    private serviceApi: ServicesService) { }

  ngOnInit(): void {
    if (this.data) {
      this.patchForm();
      this.updateAmountValidators(this.data.type);
    }
    this.form.get('type')?.valueChanges.subscribe((value) => this.updateAmountValidators(value));
  }
  patchForm() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
  onCancel(): void {
    this.drawerRef.close({ success: false });
    this.form.reset();
  }
  onSubmit() {
    this.loading = true;
    const formValue = { ...this.form.value };
  
    if (formValue.type !== 'fixed' && formValue.type !== 'from') {
      formValue.uzsAmount = '0';
      formValue.kztAmount = '0';
      formValue.tirAmount = '0';
    }
    
    formValue.uzsAmount = formValue.uzsAmount.toString();
    formValue.kztAmount = formValue.kztAmount.toString();
    formValue.tirAmount = formValue.tirAmount.toString();
  
    const isDifferent =
      this.data?.description !== formValue.description ||
      this.data?.uzsAmount !== formValue.uzsAmount ||
      this.data?.kztAmount !== formValue.kztAmount ||
      this.data?.tirAmount !== formValue.tirAmount;
    console.log(isDifferent);
    console.log(formValue);
    console.log(this.data);
    
    const submitObservable = isDifferent
      ? this.serviceApi.changePriceStatus(formValue)
      : this.data
        ? this.serviceApi.putService(formValue)
        : this.serviceApi.postService(formValue); 
  
    submitObservable.subscribe(
      (res: Response<ServiceModel>) => {
        if (res && res.success) {
          this.loading = false;
          const messageKey = this.data ? 'successfullUpdated' : 'successfullCreated';
          this.toastr.success(this.translate.instant(messageKey), '');
          this.drawerRef.close({ success: true });
          this.form.reset();
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  
  updateAmountValidators(type: string): void {
    const requiredValidators = [Validators.required];
    if (type === 'fixed' || type === 'from') {
      this.showAmounts = true;

      this.form.get('uzsAmount')?.setValidators(requiredValidators);
      this.form.get('kztAmount')?.setValidators(requiredValidators);
      this.form.get('tirAmount')?.setValidators(requiredValidators);
    } else {
      this.showAmounts = false;

      this.form.get('uzsAmount')?.clearValidators();
      this.form.get('kztAmount')?.clearValidators();
      this.form.get('tirAmount')?.clearValidators();
    }
    this.form.get('uzsAmount')?.updateValueAndValidity();
    this.form.get('kztAmount')?.updateValueAndValidity();
    this.form.get('tirAmount')?.updateValueAndValidity();
  }
  onTypeChange(value: string): void {
    this.updateAmountValidators(value);
  }
  
}
