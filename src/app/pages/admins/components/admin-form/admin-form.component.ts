import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RoleModel } from 'src/app/shared/models/role.model';
import { Response } from 'src/app/shared/models/reponse';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { RoleService } from 'src/app/shared/services/role.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NgxMaskDirective } from 'ngx-mask';
import { AdminsService } from '../../services/admins.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
  imports: [NzModules, TranslateModule, ReactiveFormsModule, NgIf, CommonModule, NgxMaskDirective],
  standalone: true,

})
export class AdminFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  visible: boolean = false;
  roles: RoleModel[] = [];

  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[a-zA-Z0-9]+$')]),
    roleId: new FormControl('', [Validators.required]),
    phone: new FormControl('+998', [Validators.required]),
  })

  constructor(
    private roleService: RoleService, 
    private drawerRef: NzDrawerRef,
    private adminService: AdminsService) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.roleService.getAll().subscribe((res: Response<RoleModel[]>) => {
      if (res && res.success) {
        this.roles = res.data;
      }
    })
  }
  closeForm(): void {
    this.visible = false;
    this.close.emit();
  }
  generatePassword() {
    this.form.patchValue({
      password: Math.random().toString(36).slice(-8)
    })
  }
  onCancel(): void {
    this.drawerRef.close();
    this.form.reset();
  }
  onSubmit() {
    this.adminService.create(this.form.value).subscribe((res:any) => {
      if (res && res.success) {
        this.drawerRef.close();
        this.form.reset();
      }
    })
  }
}
