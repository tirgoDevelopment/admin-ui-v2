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
    return this.http.get<Response<LoadingMethodModel[]>>(env.references + `/references/cargo-loading-method/all?pageIndex=${params?.pageIndex}&pageSize=${params?.pageSize}&totalPagesCount=${params?.totalPagesCount}&sortBy=${params?.sortBy}&sortType=${params?.sortType}`)
  }
  create(data: LoadingMethodModel) {
    return this.http.post<Response<LoadingMethodModel[]>>(env.references + '/references/cargo-loading-method', data)
  }
  update(data: LoadingMethodModel) {
    return this.http.put<Response<LoadingMethodModel[]>>(env.references + '/references/cargo-loading-method', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.references + `/references/cargo-loading-method?id=${id}`)
  }
}