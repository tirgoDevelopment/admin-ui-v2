import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, NzModules, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.1)' }),
        animate('500ms ease-out', style({ transform: 'scale(0.9)' })),
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ transform: 'scale(0.9)' })),
      ]),
    ]),
  ]
})

export class SignUpComponent implements OnInit {
  passwordVisible = false;
  form: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private authService: AuthService,) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(4)]],
      userType: ['staff'],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    this.form.disable();
    this.authService.signIn(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.form.enable();
      },
      error: () => {
        this.form.enable();
        this.notificationService.error('Войти', 'Не удалось войти в систему');
      }
    });
  }
}