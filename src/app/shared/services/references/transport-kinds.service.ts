import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environmens/environment';
import { Response } from '../../models/reponse';
import { TransportKindModel } from 'src/app/pages/references/transport-kinds/models/transport-kinds.model';

@Injectable({
  providedIn: 'root'
})
export class TransportKindsService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Response<TransportKindModel[]>>(env.references + '/references/transport-kinds/all')
  }
  create(data: TransportKindModel) {
    return this.http.post<Response<TransportKindModel[]>>(env.references + '/references/transport-kinds', data)
  }
  update(data: TransportKindModel) {
    return this.http.put<Response<TransportKindModel[]>>(env.references + '/references/transport-kinds', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.references + `/references/transport-kinds?id=${id}`)
  }
}