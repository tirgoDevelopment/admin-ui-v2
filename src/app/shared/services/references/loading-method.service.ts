import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from '../../models/reponse';
import { LoadingMethodModel } from 'src/app/pages/references/loading-method/models/loading-method.model';

@Injectable({
  providedIn: 'root'
})
export class LoadingMethodService {

  constructor(private http: HttpClient) { }

  getAll(params?: any): Observable<Response<LoadingMethodModel[]>> {
    return this.http.get<Response<LoadingMethodModel[]>>(env.references + `/references/cargo-loading-methodes`)
  }
  create(data: LoadingMethodModel) {
    return this.http.post<Response<LoadingMethodModel[]>>(env.references + '/references/cargo-loading-methodes', data)
  }
  update(data: LoadingMethodModel) {
    return this.http.put<Response<LoadingMethodModel[]>>(env.references + '/references/cargo-loading-methodes', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.references + `/references/cargo-loading-methodes/${id}`)
  }
}