import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from '../../models/reponse';
import { CargoPackagesModel } from 'src/app/pages/references/cargo-packages/models/cargo-packages.model';

@Injectable({
  providedIn: 'root'
})
export class CargoPackagesService {

  constructor(private http: HttpClient) { }

  getAll(params?: any): Observable<Response<CargoPackagesModel[]>> {
    return this.http.get<Response<CargoPackagesModel[]>>(env.references + `/references/cargo-packages/all?pageIndex=${params?.pageIndex}&pageSize=${params?.pageSize}&totalPagesCount=${params?.totalPagesCount}&sortBy=${params?.sortBy}&sortType=${params?.sortType}`)
  }
  create(data: CargoPackagesModel) {
    return this.http.post<Response<CargoPackagesModel[]>>(env.references + '/references/cargo-packages', data)
  }
  update(data: CargoPackagesModel) {
    return this.http.put<Response<CargoPackagesModel[]>>(env.references + '/references/cargo-packages', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.references + `/references/cargo-packages?id=${id}`)
  }
}