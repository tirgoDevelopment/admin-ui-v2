import { NgModule } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgStyle, NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgStyle,
    NgClass
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgStyle,
    NgClass
  ]
})
export class CommonModules {}
