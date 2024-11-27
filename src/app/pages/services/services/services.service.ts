import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { Response } from 'src/app/shared/models/reponse';
import { ServiceModel } from '../models/service.model';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {

    constructor(private http: HttpClient) { }

    getServiceList(): Observable<Response<ServiceModel[]>> {
        return this.http.get<Response<ServiceModel[]>>(env.orderApiUrl + `/references/driver-services`)
    }
    getServiceById(id): Observable<Response<ServiceModel>> {
        return this.http.get<Response<ServiceModel>>(env.orderApiUrl + `/references/driver-services/${id}`)
    }
    postService(data): Observable<Response<ServiceModel>> {
        return this.http.post<Response<ServiceModel>>(env.orderApiUrl + `/references/driver-services`,data)
    }
    putService(data): Observable<Response<ServiceModel>> {
        return this.http.put<Response<ServiceModel>>(env.orderApiUrl + `/references/driver-services`,data)
    }
    deleteService(id): Observable<Response<ServiceModel>> {
        return this.http.delete<Response<ServiceModel>>(env.orderApiUrl + `/references/driver-services/${id}`)
    }
}