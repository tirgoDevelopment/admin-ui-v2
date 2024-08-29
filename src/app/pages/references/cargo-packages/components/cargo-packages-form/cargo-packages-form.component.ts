import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { Response } from 'src/app/shared/models/reponse';
import { CargoPackagesService } from 'src/app/shared/services/references/cargo-packages.service';
import { CargoPackagesModel } from '../../models/cargo-packages.model';

@Component({
  selector: 'app-cargo-packages-form',
  templateUrl: './cargo-packages-form.component.html',
  styleUrls: ['./cargo-packages-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],

})
export class CargoPackagesFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private cargoPackagesService: CargoPackagesService,
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
      ? this.cargoPackagesService.update(this.form.value)
      : this.cargoPackagesService.create(this.form.value);

    submitObservable.subscribe(
      (res: Response<CargoPackagesModel[]>) => {
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

}
