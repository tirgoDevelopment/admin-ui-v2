import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './phone-format.pipe';
import { DateFormatPipe } from './dateFormat.pipe';
import { ReferencePointsPipe } from './reference-points.pipe';
import { LabelPipe } from './label.pipe';
import { UppercaseValidationDirective } from './uppercase.directive';
import { TrimSpacesDirective } from './trimSpaces.pipe';

@NgModule({
  declarations: [TrimSpacesDirective,UppercaseValidationDirective],
  imports: [
    CommonModule
  ],
  exports: [TrimSpacesDirective, UppercaseValidationDirective],
})
export class PipeModule { }