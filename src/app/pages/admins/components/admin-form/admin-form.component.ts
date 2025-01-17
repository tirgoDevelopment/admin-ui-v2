import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RoleModel } from 'src/app/shared/models/role.model';
import { Response } from 'src/app/shared/models/reponse';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NgxMaskDirective } from 'ngx-mask';
import { AdminsService } from '../../services/admins.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdminModel } from '../../models/admin.model';
import { RolesService } from 'src/app/shared/services/references/role.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResponseContent } from 'src/app/shared/models/res-content.model';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { Permission } from 'src/app/shared/enum/per.enum';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
  imports: [TranslateModule, ReactiveFormsModule, NgIf, CommonModule, NgxMaskDirective, NzInputModule, NzSelectModule, NzButtonModule, NzIconModule, NzFormModule, NzSpinModule, NzNotificationModule, NzToolTipModule, NzCheckboxModule, NzWaveModule],
  providers: [NzModalService],
  standalone: true,
})
export class AdminFormComponent implements OnInit {
  Permission = Permission;
  @Input() admin?: AdminModel;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<void>();
  visible: boolean = false;
  roles: RoleModel[] = [];
  loading = false
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    fullName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[a-zA-Z0-9]+$')]),
    roleId: new FormControl('', [Validators.required]),
    phone: new FormControl('+998', [Validators.required]),
  });

  constructor(
    private toastr: NotificationService,
    private roleService: RolesService,
    private drawerRef: NzDrawerRef,
    private adminService: AdminsService,
    private modal: NzModalService,
    public perService: PermissionService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getRoles();
    this.patchForm();
  }

  patchForm() {
    if (this.admin) {
      this.form.patchValue({
        id: this.admin.id,
        fullName: this.admin.fullName,
        username: this.admin.username,
        roleId: this.admin.user.role.id,
        phone: this.admin.phone,
      });
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]);
      this.form.get('password')?.updateValueAndValidity();
    }

  }
  getRoles() {
    this.roleService.getAll().subscribe((res: Response<RoleModel[]>) => {
      if (res && res.success) {
        this.roles = res.data;
      }
    });
  }
  generatePassword() {
    this.form.patchValue({
      password: Math.random().toString(36).slice(-8)
    });
  }
  remove() {
    if (this.admin && this.perService.hasPermission(Permission.AdminDelete)) {
      let confirmModal = this.modal.confirm({
        nzTitle: this.translate.instant('are_you_sure'),
        nzContent: this.translate.instant('delete_sure'),
        nzOkText: this.translate.instant('remove'),
        nzCancelText: this.translate.instant('cancel'),
        nzOkDanger: true,
        nzOnOk: () =>
          this.adminService.delete(this.admin.id).subscribe((res: ResponseContent<AdminModel[]>) => {
            this.loading = true
            if (res && res.success) {
              this.toastr.success(this.translate.instant('successfullDeleted'), '');
              this.drawerRef.close({ success: true });
              this.loading = false;
            }
          }, err => {
            this.loading = false;
          }),
      });
    }
  }
  onSubmit() {
    if (this.admin && this.perService.hasPermission(Permission.AdminUpdate)) {
      this.loading = true;
      this.adminService.update(this.form.value).subscribe((res: any) => {
        if (res && res.success) {
          this.toastr.success(this.translate.instant('successfullUpdated'), '');
          this.drawerRef.close({ success: true });
          this.form.reset();
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
    }
    else if (this.perService.hasPermission(Permission.AdminCreate)) {
      this.loading = true;
      this.adminService.create(this.form.value).subscribe((res: any) => {
        if (res && res.success) {
          this.toastr.success(this.translate.instant('successfullCreated'), '');
          this.drawerRef.close({ success: true });
          this.form.reset();
          this.loading = false;
        }
      }, err => {
        this.loading = false;

      });
    }
  }

}
