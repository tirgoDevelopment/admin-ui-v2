import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { DriverModel } from '../models/driver.model';
import { TransportModel } from '../../references/transport-types/models/transport.model';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  constructor(private http: HttpClient) { }

  getAll(params?: any, filter?:any): Observable<Response<DriverModel[]>> {
    return this.http.get<Response<DriverModel[]>>(`${env.apiUrl}/users/drivers?${filter}`,{params})
  }
  getById(id: any): Observable<Response<DriverModel>> {
    return this.http.get<Response<DriverModel>>(`${env.apiUrl}/users/drivers/`+id)
  }
  create(data:FormData) {
    return this.http.post<Response<DriverModel[]>>(env.apiUrl + '/users/drivers', data)
  }
  update(id,data: FormData) {
    return this.http.put<Response<DriverModel[]>>(env.apiUrl + `/users/drivers/${id}`, data)
  }
  delete(id) { 
    return this.http.delete(env.apiUrl + `/users/drivers/${id}`)
  }
  block(id: number | string) {
    return this.http.patch<Response<DriverModel>>(env.apiUrl + `/users/drivers/block-driver?id=${id}`, {})
  }
  unblock(id: number | string) {
    return this.http.patch<Response<DriverModel>>(env.apiUrl + `/users/drivers/unblock-driver?id=${id}`, {})
  }
  getTransport(driverId:number|string,transportId:number|string): Observable<Response<TransportModel[]>> {
    return this.http.get<Response<TransportModel[]>>(env.apiUrl + `/users/drivers/${driverId}/transports/${transportId}`)
  }
  updateTransport(data:any) {
    return this.http.put<Response<TransportModel[]>>(env.apiUrl + `/users/drivers/${data.driverId}/transports/${data.id}`, data)
  }
  createTransport(data:any) {
    return this.http.post<Response<TransportModel[]>>(env.apiUrl + `/users/drivers/${data.driverId}/transports`, data)
  }
  deleteTransport(driverId:number|string,transportId:number|string) {
    return this.http.delete<Response<TransportModel>>(env.apiUrl + `/users/drivers/${driverId}/transports/${transportId}`)
  }
  topupDriverBalance(data:any) {
    return this.http.post<Response<DriverModel>>(env.apiUrl + `/users/drivers/${data.driverId}/balances`, data)
  }
  findDrivers(searchTerm: string, searchAs: string) {
    const filter = generateQueryFilter({ [searchAs]: searchTerm });
    return this.getAll({}, filter).pipe(
      catchError(() => of({ data: { content: [] } }))
    );
  }
}