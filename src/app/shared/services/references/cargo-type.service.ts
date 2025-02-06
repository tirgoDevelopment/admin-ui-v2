import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CargoTypesModel } from 'src/app/pages/references/cargo-types/models/cargo-type.model';
import { env } from 'src/environmens/environment';
import { Response } from '../../models/reponse';

@Injectable({
  providedIn: 'root'
})
export class CargoTypesService {

  constructor(private http: HttpClient) { }

  getAll(params?:any) {
    return this.http.get<Response<CargoTypesModel[]>>(env.references + `/references/cargo-types`)
  }
  create(data: CargoTypesModel) {
    return this.http.post<Response<CargoTypesModel[]>>(env.references + '/references/cargo-types', data)
  }
  update(data: CargoTypesModel) {
    return this.http.put<Response<CargoTypesModel[]>>(env.references + '/references/cargo-types', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.references + `/references/cargo-types/${id}`)
  }
} 