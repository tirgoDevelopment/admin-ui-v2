import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './phone-format.pipe';
import { DateFormatPipe } from './dateFormat.pipe';
import { ReferencePointsPipe } from './reference-points.pipe';
import { LabelPipe } from './label.pipe';
import { UppercaseValidationDirective } from './uppercase.directive';
import { TrimSpacesDirective } from './trimSpaces.pipe';

@NgModule({
  declarations: [TrimSpacesDirective,LabelPipe,UppercaseValidationDirective],
  imports: [
    CommonModule
  ],
  exports: [TrimSpacesDirective, LabelPipe,UppercaseValidationDirective],
})
export class PipeModule { }