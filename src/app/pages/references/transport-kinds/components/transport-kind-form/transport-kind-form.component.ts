import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { Response } from 'src/app/shared/models/reponse';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TransportKindsService } from 'src/app/shared/services/references/transport-kinds.service';
import { TransportKindModel } from '../../models/transport-kinds.model';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-transport-kind-form',
  templateUrl: './transport-kind-form.component.html',
  styleUrls: ['./transport-kind-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules, NgxMaskDirective],
})
export class TransportKindFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading:boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    isMode: new FormControl(false),
    code: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private transportKindsService: TransportKindsService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.patchForm();
  }

  
  patchForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        isMode: this.data.isMode,
        code: this.data.code
      });
    }

  }
  onCancel(): void {
    this.drawerRef.close({ success: false });
    this.form.reset();
  }
  onSubmit() {
    this.loading = true;
    this.form.value.code = Number(this.form.value.code)
    const submitObservable = this.data
      ? this.transportKindsService.update(this.form.value)
      : this.transportKindsService.create(this.form.value);

    submitObservable.subscribe((res: Response<TransportKindModel[]>) => {
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