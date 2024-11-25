export interface OrderFormData {
  id: number | null;
  clientId: number | null;
  sendDate: Date | null;
  loadingLocation: any;
  deliveryLocation: any;
  isAdr: boolean;
  isCarnetTir: boolean;
  isBorderCrossing: boolean;
  isParanom: boolean;
  offeredPrice: number | null;
  offeredPriceCurrencyId: number | null;
  inAdvancePrice: number | null;
  inAdvancePriceCurrencyId: number | null;
  selectedLocations: string[];
  customsOutClearanceLocation: any;
  customsInClearanceLocation: any;
  additionalLoadingLocation: any;
  additionalDeliveryLocation: any;
  transportTypeId: number | null;
  transportKindId: number | null;
  cargoTypeId: number | null;
  packageId: number | null;
  loadingMethodId: number | null;
  weight: number | null;
  volume: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  temperature: number | null;
  description: string | null;
}

export type OrderFormMode = 'add' | 'edit' | 'view';
