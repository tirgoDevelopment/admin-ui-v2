import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './phone-format.pipe';
import { FileFetchPipe } from './file-fetch.pipe';
import { DateFormatPipe } from './dateFormat.pipe';
import { PriceFormatPipe } from './priceFormat.pipe';
import { ReferencePointsPipe } from './reference-points.pipe';
import { LabelPipe } from './label.pipe';
import { FileFormatPipe } from './fileType.pipe';
import { UppercaseValidationDirective } from './uppercase.directive';
import { CreatedAtPipe } from './createdAt.pipe';

@NgModule({
  declarations: [PhoneFormatPipe,FileFetchPipe, DateFormatPipe,PriceFormatPipe,ReferencePointsPipe,LabelPipe,FileFormatPipe,UppercaseValidationDirective,CreatedAtPipe],
  imports: [
    CommonModule
  ],
  exports: [PhoneFormatPipe,FileFetchPipe,DateFormatPipe, PriceFormatPipe,ReferencePointsPipe,LabelPipe,FileFormatPipe,UppercaseValidationDirective,CreatedAtPipe],
})
export class PipeModule { }