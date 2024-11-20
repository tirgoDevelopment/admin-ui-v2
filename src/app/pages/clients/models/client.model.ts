import { BaseModel } from "src/app/shared/models/base-model";

export interface ClientModel extends BaseModel {
    name?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    citizenship?: string;
    active?: boolean;
    isBlocked?: boolean;
    passport?: string;
    phoneNumbers:[{id: number, code: string, number: string, isMain: boolean}];
    passportFilePath?:string;
    user:{lastLogin:string}
    createdAt?:Date
}