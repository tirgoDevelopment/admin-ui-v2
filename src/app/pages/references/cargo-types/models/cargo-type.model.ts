import { BaseModel } from "src/app/shared/models/base-model";

export interface CargoTypesModel extends BaseModel {
    name: string;
    codeTNVED:string;
}