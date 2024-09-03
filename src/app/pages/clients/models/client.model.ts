import { BaseModel } from "src/app/shared/models/base-model";

export interface ClientModel extends BaseModel {
    name?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    citizenship?: string;
    active?: boolean;
    blocked?: boolean;
    passport?: string;
    phoneNumbers:[];
    passportFilePath?:string;
}