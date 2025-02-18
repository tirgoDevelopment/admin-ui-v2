import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filePreview',standalone: true })
export class FilePreviewPipe implements PipeTransform {
  transform(file: File): string | null {
    if (file && file.type.startsWith('image')) {
      return URL.createObjectURL(file);
    }
    return null;
  }
}