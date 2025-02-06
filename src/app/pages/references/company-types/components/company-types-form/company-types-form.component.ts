import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CargoTypeGroupsService } from 'src/app/shared/services/references/cargo-type-grpups.service';
import { CargoTypesService } from 'src/app/shared/services/references/cargo-type.service';
import { CargoTypesModel } from '../../../cargo-types/models/cargo-type.model';
import { CompanyTypesService } from 'src/app/shared/services/references/company-types.service';

@Component({
  selector: 'app-company-types-form',
  templateUrl: './company-types-form.component.html',
  styleUrls: ['./company-types-form.component.scss'],
  standalone: true,
  imports: [NzModules, TranslateModule, CommonModules],
})
export class CompanyTypesFormComponent  implements OnInit {
  @Input() data?: any;
  @Output() close = new EventEmitter<void>();
  showForm: boolean = false;
  loading: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    private toastr: NotificationService,
    private drawerRef: NzDrawerRef,
    private companyTypesService: CompanyTypesService,
    private translate: TranslateService
  ) {

  }
  ngOnInit(): void {
    this.patchForm();
  }

  patchForm() {
    if (this.data) {
      this.form.patchValue(this.data)
    }
  }
  onCancel(): void {
    this.drawerRef.close({ success: false });
    this.form.reset();
  }
  onSubmit() {
    this.loading = true;
    const submitObservable = this.data
      ? this.companyTypesService.update(this.form.value)
      : this.companyTypesService.create(this.form.value);

    submitObservable.subscribe((res: any) => {
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
