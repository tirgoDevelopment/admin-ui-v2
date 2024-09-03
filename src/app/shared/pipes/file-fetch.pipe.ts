import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUrlService } from '../services/file.service';

@Pipe({
  name: 'fileFetch'
})
export class FileFetchPipe implements PipeTransform {

  constructor(private fileService: FileUrlService) { }

  transform(fileName: string, keyName:string): Observable<string> {
    return this.fileService.getFileUrl(keyName, fileName)
  }

}
