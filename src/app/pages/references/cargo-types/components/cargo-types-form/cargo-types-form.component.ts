import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { Response } from 'src/app/shared/models/reponse';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoTypeGroupsService } from 'src/app/shared/services/references/cargo-type-grpups.service';
import { CargoTypesService } from 'src/app/shared/services/references/cargo-type.service';
import { CargoGroupModel } from '../../../cargo-type-groups/models/cargo-group.model';
import { CargoTypesModel } from '../../models/cargo-type.model';

@Component({
  selector: 'app-cargo-types-form',
  templateUrl: './cargo-types-form.component.html',
  styleUrls: ['./cargo-types-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})

export class CargoTypesFormComponent implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  groupTypes: CargoGroupModel[] = [];
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [Validators.required]),
    codeTNVED: new FormControl('', [Validators.required]),
    cargoTypeGroupId: new FormControl('', [Validators.required]),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private cargoTypesService: CargoTypesService,
    private cargoTypeGroupService: CargoTypeGroupsService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.patchForm();
    this.getTypeGroups();
  }
  getTypeGroups() {
    this.cargoTypeGroupService.getAll().subscribe((res: Response<CargoGroupModel[]>) => {
      if (res && res.success) {
        this.groupTypes = res.data;
      }
    })
  }
  patchForm() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        codeTNVED: this.data.codeTNVED,
        cargoTypeGroupId: this.data.group.id
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
      ? this.cargoTypesService.update(this.form.value)
      : this.cargoTypesService.create(this.form.value);

    submitObservable.subscribe((res: Response<CargoTypesModel[]>) => {
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
