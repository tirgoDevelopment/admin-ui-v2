import { BaseModel } from "src/app/shared/models/base-model";


export interface CargoGroupModel extends BaseModel {
    name: string;
    codeTNVED: string;
}