import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './phone-format.pipe';
import { DateFormatPipe } from './dateFormat.pipe';
import { PriceFormatPipe } from './priceFormat.pipe';
import { ReferencePointsPipe } from './reference-points.pipe';
import { LabelPipe } from './label.pipe';
import { UppercaseValidationDirective } from './uppercase.directive';
import { CreatedAtPipe } from './createdAt.pipe';
import { TrimSpacesDirective } from './trimSpaces.pipe';

@NgModule({
  declarations: [TrimSpacesDirective,PhoneFormatPipe, DateFormatPipe,PriceFormatPipe,ReferencePointsPipe,LabelPipe,UppercaseValidationDirective,CreatedAtPipe],
  imports: [
    CommonModule
  ],
  exports: [TrimSpacesDirective,PhoneFormatPipe,DateFormatPipe, PriceFormatPipe,ReferencePointsPipe,LabelPipe,UppercaseValidationDirective,CreatedAtPipe],
})
export class PipeModule { }