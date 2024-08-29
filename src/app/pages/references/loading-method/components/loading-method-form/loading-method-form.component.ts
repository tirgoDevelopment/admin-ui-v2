import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Response } from 'src/app/shared/models/reponse';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { LoadingMethodService } from 'src/app/shared/services/references/loading-method.service';
import { LoadingMethodModel } from '../../models/loading-method.model';

@Component({
  selector: 'app-loading-method-form',
  templateUrl: './loading-method-form.component.html',
  styleUrls: ['./loading-method-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})
export class LoadingMethodFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading:boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private loadingMethodService: LoadingMethodService,
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
      ? this.loadingMethodService.update(this.form.value)
      : this.loadingMethodService.create(this.form.value);

    submitObservable.subscribe((res: Response<LoadingMethodModel[]>) => {
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
