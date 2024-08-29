import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environmens/environment';
import { Response } from '../../models/reponse';
import { SubscriptionModel } from 'src/app/pages/references/subscription-type/models/subscription.model';
import { TransportModel } from 'src/app/pages/references/transport-types/models/transport.model';

@Injectable({
  providedIn: 'root'
})
export class TransportTypesService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Response<TransportModel[]>>(env.references + '/references/transport-types/all')
  }
  create(data: SubscriptionModel) {
    return this.http.post<Response<TransportModel[]>>(env.references + '/references/transport-types', data)
  }
  update(data: SubscriptionModel) {
    return this.http.put<Response<TransportModel[]>>(env.references + '/references/transport-types', data)
  }
  delete(id: number | string) { 
    return this.http.delete(env.references + `/references/transport-types?id=${id}`)
  }
}