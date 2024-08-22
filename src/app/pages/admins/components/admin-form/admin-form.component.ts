import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
  imports: [NzModules, TranslateModule, ReactiveFormsModule, NgIf],
  standalone: true
})
export class AdminFormComponent {
  passwordVisible = false;

  visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    fullName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[a-zA-Z0-9]+$')]),
  })

  constructor() { }

  closeForm(): void {
    this.visible = false;
    this.close.emit();
  }

  generatePassword() {
    this.form.patchValue({
      password: Math.random().toString(36).slice(-8)
    })
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

}
