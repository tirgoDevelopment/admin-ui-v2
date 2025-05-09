import { BaseModel } from "src/app/shared/models/base-model";

export interface DriverMerchantModel extends BaseModel {
    rowIndex: number
    email: string,
    phoneNumber: string,
    companyName: string,
    companyType: string,
    responsiblePersonLastName: string,
    responsiblePersonFistName: string,
    registrationCertificateFilePath: string,
    passportFilePath: string,
    transportationCertificateFilePath: string,
    logoFilePath: string,
    notes: string,
    mfo: string,
    inn: string,
    oked: string,
    dunsNumber: string,
    ibanNumber: string,
    supervisorFirstName: string,
    supervisorLastName: string,
    legalAddress: string,
    factAddress: string,
    bankName: string,
    taxPayerCode: string,
    responsbilePersonPhoneNumber: string,
    isVerified: boolean,
    isRejected: boolean,
    rejectedAt: string,
    verifiedBy: string,
    verifiedAt: Date,
    createdAt: Date,
    completed: boolean,
    active: boolean,
    bankAccounts: any[],
    balances: [];
    user:any;
    garageAddress?: string,
    postalCode?: string,
    internationalCargoLisensePath?: string,
    isBlocked: boolean,
    balance:any,
    debtLimit: number
    kzPaidWayCommission: number
    serviceBalance: number
    tirgoBalance: number
    gsmBalance:number
}