import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { TransportModel } from '../../models/transport.model';
import { TransportTypesService } from 'src/app/shared/services/references/transport-type.service';

@Component({
  selector: 'app-transport-types-form',
  templateUrl: './transport-types-form.component.html',
  styleUrls: ['./transport-types-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})
export class TransportTypesFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  currencies: CurrencyModel[] = [];
  showForm: boolean = false;
  loading:boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private transportTypesService: TransportTypesService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.patchForm();
  }

  patchForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
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
      ? this.transportTypesService.update(this.form.value)
      : this.transportTypesService.create(this.form.value);

    submitObservable.subscribe((res: Response<TransportModel[]>) => {
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
