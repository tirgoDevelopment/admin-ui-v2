import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, of } from "rxjs";
import { generateQueryFilter } from "src/app/shared/pipes/queryFIlter";
import { env } from "src/environmens/environment";

@Injectable({
    providedIn: 'root',
  })
  export class TransportsService { 
    constructor(private http: HttpClient) {}
    
    getAll(filter: any) {
      return this.http.get(`${env.adminUrl}/drivers/transports/list${filter}`)
    }
    getById(id) {
      return this.http.get(`${env.adminUrl}/drivers/transports/${id}`)
    }
    getTransportHistory(query) {
      return this.http.get(`${env.adminUrl}/drivers/transports/operations/histories`+query)
    }
    postTransport(data) {
      return this.http.post(`${env.adminUrl}/drivers/transports`, data)
    }
    putTransport(data) {
      return this.http.put(`${env.adminUrl}/drivers/transports/${data.id}`, data)
    }
    deleteTransport(id) {
      return this.http.delete(`${env.adminUrl}/drivers/transports/${id}`)
    }
    assignToDriver(data) {
      return this.http.post(`${env.adminUrl}/drivers/${data.driverId}/transports/${data.transportId}/assign`, data);
    }
    unassignToDriver(data) {
      return this.http.post(`${env.adminUrl}/drivers/${data.driverId}/transports/${data.transportId}/unassign`, data);
    }
    findTransport(searchTerm: string) {
      const filter = generateQueryFilter({ transportNumber: searchTerm });
      return this.getAll(filter).pipe(
        catchError(() => of({ data: { content: [] } }))
      );
    }
  }