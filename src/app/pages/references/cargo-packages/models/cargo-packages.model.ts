import { BaseModel } from "src/app/shared/models/base-model";

export interface CargoPackagesModel extends BaseModel {
    name?: string;
    code?: string;
}