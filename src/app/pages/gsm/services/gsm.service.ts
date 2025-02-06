import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environmens/environment";

@Injectable({
    providedIn: 'root'
})
export class GSMService {

    constructor(private http: HttpClient) { }

    postGSMCardNumber(data) {
        return this.http.post(`${env.apiUrl}/drivers/${data.id}/gcm/set-card-number`, data);
    }
    deleteGSMCardNumber(data) {
        return this.http.delete(`${env.apiUrl}/drivers/${data.id}/gcm/remove-card-number`);
    }
    topUpTmsGSMBalance(data) {
        return this.http.post(`${env.apiUrl}/tmses/${data.tmsId}/gcm-balance-incomes`, data);
    }

    getTmsGSMTransactios(filter) {
        return this.http.get(`${env.apiUrl}/tmses/gcm-transactions`);
    }
    postGsmBalanceRequest(data) {
        return this.http.post(`${env.apiUrl}/tmses/${data.tmsId}/gsm-balance-request/${data.id}/${data.status}`, {});
    }

}