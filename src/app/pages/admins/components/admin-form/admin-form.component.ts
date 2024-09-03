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

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
  imports: [NzModules, TranslateModule, ReactiveFormsModule, NgIf, CommonModule, NgxMaskDirective],
  standalone: true,
})
export class AdminFormComponent implements OnInit {
  @Input() admin?: AdminModel;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<void>();

  visible: boolean = false;
  roles: RoleModel[] = [];

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
  onCancel(): void {
    this.drawerRef.close({ success: false });
    this.form.reset();
  }
  onSubmit() {
    if (this.admin) {
      this.adminService.update(this.form.value).subscribe((res: any) => {
        if (res && res.success) {
          this.toastr.success(this.translate.instant('successfullUpdated'), '');
          this.drawerRef.close({ success: true });
          this.form.reset();
        }
      });
    } else {
      this.adminService.create(this.form.value).subscribe((res: any) => {
        if (res && res.success) {
          this.toastr.success(this.translate.instant('successfullCreated'), '');
          this.drawerRef.close({ success: true });
          this.form.reset();
        }
      });
    }
  }

}
