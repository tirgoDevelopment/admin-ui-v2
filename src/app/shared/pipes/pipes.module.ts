import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneFormatPipe } from './phone-format.pipe';
import { FileFetchPipe } from './file-fetch.pipe';

@NgModule({
  declarations: [PhoneFormatPipe,FileFetchPipe],
  imports: [
    CommonModule
  ],
  exports: [PhoneFormatPipe,FileFetchPipe],
})
export class PipeModule { }
