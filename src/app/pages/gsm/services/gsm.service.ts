import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environmens/environment";

@Injectable({
    providedIn: 'root'
})
export class GSMService {

    constructor(private http: HttpClient) { }

    postGSMCardNumber(data) {
        return this.http.post(`${env.apiUrl}/drivers/${data.driverId}/gcm/set-card-number`, data);
    }
    deleteGSMCardNumber(data) {
        return this.http.delete(`${env.apiUrl}/drivers/${data.driverId}/gcm/remove-card-number`);
    }
    topUpTmsGSMBalance(data) {
        return this.http.post(`${env.apiUrl}/tmses/${data.tmsId}/gcm-balances`, data);
    }

    getTmsGSMTransactios(filter) {
        return this.http.get(`${env.apiUrl}/tmses/gcm-transactions${filter}`);
    }
    postGsmBalanceRequest(data) {
        return this.http.post(`${env.apiUrl}/tmses/${data.tmsId}/gcm-balance-requests/${data.id}/${data.status}`, {});
    }

}