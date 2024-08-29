import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { CargoStatusService } from 'src/app/shared/services/references/cargo-status.service';
import { CargoStatusModel } from '../../models/cargo-status.model';
import { Response } from 'src/app/shared/models/reponse';

@Component({
  selector: 'app-cargo-status-form',
  templateUrl: './cargo-status-form.component.html',
  styleUrls: ['./cargo-status-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})
export class CargoStatusFormComponent implements OnInit {
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
    private cargoStatusService: CargoStatusService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.patchForm();
  }

  patchForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        code: this.data.code,
        color: this.data.color,
      });
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
      ? this.cargoStatusService.update(formValue)
      : this.cargoStatusService.create(formValue);

    submitObservable.subscribe(
      (res: Response<CargoStatusModel[]>) => {
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
