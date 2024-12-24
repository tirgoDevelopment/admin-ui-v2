import { NgModule } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgStyle, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    NgFor,
    NgStyle,
    NgClass
  ],
  exports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    NgFor,
    NgStyle,
    NgClass
  ]
})
export class CommonModules {}
