import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoTypeGroupsService } from 'src/app/shared/services/references/cargo-type-grpups.service';
import { CargoGroupModel } from '../../models/cargo-group.model';
import { Response } from 'src/app/shared/models/reponse';
import { CommonModules } from 'src/app/shared/modules/common.module';

@Component({
  selector: 'app-cargo-type-groups-form',
  templateUrl: './cargo-type-groups-form.component.html',
  styleUrls: ['./cargo-type-groups-form.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule],
})
export class CargoTypeGroupsFormComponent implements OnInit {
  @Input() item?: CargoGroupModel;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<void>();
  loading: boolean = false;
  visible: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    codeTNVED: new FormControl('', Validators.required),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private cargoTypeGroupsService: CargoTypeGroupsService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.patchForm();
  }
  patchForm() {
    if (this.item) {
      this.form.patchValue({
        id: this.item.id,
        name: this.item.name,
        codeTNVED: this.item.codeTNVED,
      });
    }
  }
  onCancel(): void {
    this.drawerRef.close({ success: false });
    this.form.reset();
  }
  onSubmit() {
    this.loading = true;
    const submitObservable = this.item
      ? this.cargoTypeGroupsService.update(this.form.value)
      : this.cargoTypeGroupsService.create(this.form.value);

    submitObservable.subscribe((res: Response<CargoGroupModel[]>) => {
      if (res && res.success) {
        this.loading = false;
        const messageKey = this.item ? 'successfullUpdated' : 'successfullCreated';
        this.toastr.success(this.translate.instant(messageKey), '');
        this.drawerRef.close({ success: true });
        this.form.reset();
      }
    },(error) => {
      this.loading = false;
    });
  }

}
