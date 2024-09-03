import { BaseModel } from "src/app/shared/models/base-model";
import { PermissionModel } from "./permsission.model";

export interface RoleModel extends BaseModel {
    name: string;
    description: string;
    permission: PermissionModel;
}