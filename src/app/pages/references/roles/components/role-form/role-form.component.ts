import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls:['./role-form.component.scss'],
  standalone: true,
  imports: [TranslateModule, CommonModules, NzModules, IconsProviderModule],
})
export class RoleFormComponent implements OnInit {
  @Input() data?: any;
  form: FormGroup;
  permissionKeys: string[] = [];
  loading = false;
  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      permission: this.fb.group({})
    });

  }

  ngOnInit(): void {
    if (this.data) {
      this.permissionKeys = Object.keys(this.data.permission || {});
      this.permissionKeys = Object.keys(this.data.permission || {}).filter(
        (key) => !['id', 'createdAt', 'active', 'deleted'].includes(key)
      );
      const permissionGroup = this.fb.group({});
      this.permissionKeys.forEach((key) => {
        permissionGroup.addControl(key, new FormControl(this.data.permission[key] || false));
      });
      this.form.setControl('permission', permissionGroup);
      this.form.patchValue({
        name: this.data.name,
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {

    }
  }
  onDelete() {

  }
}