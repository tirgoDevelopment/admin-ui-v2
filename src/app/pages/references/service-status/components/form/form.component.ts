import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { ServicesService } from 'src/app/pages/services/services/services.service';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoStatusService } from 'src/app/shared/services/references/cargo-status.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})
export class FormComponent {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    color: new FormControl('#000000', Validators.required),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private serviceApi: ServicesService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.patchForm();
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

    formValue.color = this.form.value.color.startsWith('#')
      ? this.form.value.color
      : this.convertRgbToHex(this.form.value.color);

    const submitObservable = this.data
      ? this.serviceApi.putServiceStatus(formValue)
      : this.serviceApi.postServiceStatus(formValue);

    submitObservable.subscribe(
      (res: any) => {
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

  convertRgbToHex(rgb: string): string {
    const result = rgb
      .replace(/[^\d,]/g, '')
      .split(',')
      .map((num) => parseInt(num).toString(16).padStart(2, '0'))
      .join('');
    return `#${result}`;
  }
}
