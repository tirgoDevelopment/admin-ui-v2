import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environmens/environment';
import { RoleModel } from '../../models/role.model';
import { Response } from '../../models/reponse';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(
        private http: HttpClient
    ) { }


    getAll(): Observable<Response<RoleModel[]>> {
        return this.http.get<Response<RoleModel[]>>(env.apiUrl + '/references/roles/all-roles');
    }


}