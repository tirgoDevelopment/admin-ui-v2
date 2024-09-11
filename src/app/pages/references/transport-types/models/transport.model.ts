import { BaseModel } from "src/app/shared/models/base-model";


export interface TransportModel extends BaseModel {
    name: string;
    weight?: number;
    volume?: number;
    loading_side?: string;
    type?: number;
    trailer?: number;
    transportKinds?: any[];
    transportTypes?: any[];
    cubicCapacity?: number;
    stateNumber: string;
    stateNumberTrailer?: string;
    refrigeratorFrom?: string;
    refrigeratorTo?: string;
    refrigeratorCount?: string;
    isHook?: boolean;
    isAdr?: boolean;
    isHighCube?: boolean;
    containerVolume?: number;
    transportKindIds?: any[];
    transportTypeIds?: any[];
    loadingMethodIds?: any[];
    techPassportFrontFilePath?: string;
    techPassportBackFilePath?: string;
    goodsTransportationLicenseCardFilePath?: string;
    cargoTypeIds?: any[];
    loadFrom?: string;
    loadTo?: string;
    cisternVolume: number;
}