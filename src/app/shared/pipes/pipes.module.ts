import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './phone-format.pipe';
import { FileFetchPipe } from './file-fetch.pipe';
import { DateFormatPipe } from './dateFormat.pipe';
import { PriceFormatPipe } from './priceFormat.pipe';
import { ReferencePointsPipe } from './reference-points.pipe';

@NgModule({
  declarations: [PhoneFormatPipe,FileFetchPipe, DateFormatPipe,PriceFormatPipe,ReferencePointsPipe],
  imports: [
    CommonModule
  ],
  exports: [PhoneFormatPipe,FileFetchPipe,DateFormatPipe, PriceFormatPipe,ReferencePointsPipe],
})
export class PipeModule { }
