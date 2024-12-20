import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { Response } from 'src/app/shared/models/reponse';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CurrenciesService } from 'src/app/shared/services/references/currencies.service';
import { CurrencyModel } from '../../models/currency.model';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';

@Component({
  selector: 'app-currencies-form',
  templateUrl: './currencies-form.component.html',
  styleUrls: ['./currencies-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})
export class CurrenciesFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    tirRate: new FormControl(''),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private currenciesService: CurrenciesService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.patchForm();
  }
  patchForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        code: this.data.code,
        tirRate: this.data.tirRate,
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
      ? this.currenciesService.update(this.form.value)
      : this.currenciesService.create(this.form.value);

    submitObservable.subscribe((res: Response<CurrencyModel[]>) => {
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
