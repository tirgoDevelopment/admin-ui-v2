import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map, finalize, BehaviorSubject } from 'rxjs';
import { FileUrlService } from '../services/file.service';
import { HttpClient } from '@angular/common/http';
import { env } from 'src/environmens/environment';

@Pipe({
  name: 'fileFetch',
  standalone: true
})
export class FileFetchPipe implements PipeTransform {
  private loading = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  constructor(private http: HttpClient) { }

  transform(fileName: string | ArrayBuffer | null, keyName: string): Observable<string> | null {
    if (!fileName || typeof fileName === 'object') {
      return null;
    }
    
    this.loading.next(true);
    return this.http.get(env.references + `/references/files?keyName=${keyName}&fileName=${fileName}`, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => URL.createObjectURL(blob)),
        finalize(() => this.loading.next(false))
      );
  }
}