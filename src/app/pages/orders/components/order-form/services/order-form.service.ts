import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderFormData } from '../models/order-form.interface';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ClientsService } from 'src/app/pages/clients/services/clients.service';
import { GeoDbService } from 'wft-geodb-angular-client';
import { OrderModel } from '../../../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderFormService {
  private readonly searchDebounceTime = 300;
  private citySearchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private geoDbService: GeoDbService
  ) {}

  convertOrderModelToFormData(orderModel: OrderModel): Partial<OrderFormData> {
    if (!orderModel) return {};

    return {
      id: typeof orderModel.id === 'string' ? parseInt(orderModel.id, 10) : orderModel.id,
      clientId: orderModel.clientId ? parseInt(orderModel.clientId, 10) : null,
      sendDate: orderModel.sendDate ? new Date(orderModel.sendDate) : null,
      loadingLocation: orderModel.loadingLocation,
      deliveryLocation: orderModel.deliveryLocation,
      isAdr: orderModel.isAdr || false,
      isCarnetTir: orderModel.isCarnetTir || false,
      isBorderCrossing: orderModel.isGlonas || false,
      isParanom: orderModel.isParanom || false,
      offeredPrice: orderModel.offeredPrice ? parseFloat(orderModel.offeredPrice) : null,
      offeredPriceCurrencyId: orderModel.offeredPriceCurrencyId ? parseInt(orderModel.offeredPriceCurrencyId, 10) : null,
      inAdvancePrice: Array.isArray(orderModel.inAdvancePrice) ? orderModel.inAdvancePrice[0] : null,
      inAdvancePriceCurrencyId: orderModel.inAdvancePriceCurrencyId ? parseInt(orderModel.inAdvancePriceCurrencyId, 10) : null,
      selectedLocations: orderModel.selectedLocations || [],
      customsOutClearanceLocation: orderModel.customsOutClearanceLocation,
      customsInClearanceLocation: orderModel.customsInClearanceLocation,
      additionalLoadingLocation: orderModel.additionalLoadingLocation,
      additionalDeliveryLocation: orderModel.additionalDeliveryLocation,
      transportTypeId: orderModel.transportTypeIds ? parseInt(orderModel.transportTypeIds, 10) : null,
      transportKindId: orderModel.transportKindIds ? parseInt(orderModel.transportKindIds, 10) : null,
      cargoTypeId: orderModel.cargoTypeId ? parseInt(orderModel.cargoTypeId, 10) : null,
      packageId: orderModel.cargoPackageId ? parseInt(orderModel.cargoPackageId, 10) : null,
      loadingMethodId: orderModel.loadingMethodId ? parseInt(orderModel.loadingMethodId, 10) : null,
      weight: orderModel.cargoWeight ? parseFloat(orderModel.cargoWeight) : null,
      volume: orderModel.cisternVolume || null,
      length: orderModel.cargoLength ? parseFloat(orderModel.cargoLength) : null,
      width: orderModel.cargoWidth ? parseFloat(orderModel.cargoWidth) : null,
      height: orderModel.cargoHeight ? parseFloat(orderModel.cargoHeight) : null,
      temperature: orderModel.refrigeratorFrom ? parseFloat(orderModel.refrigeratorFrom) : null,
      description: null
    };
  }

  createForm(orderModel?: OrderModel): FormGroup {
    const initialData = orderModel ? this.convertOrderModelToFormData(orderModel) : {};
    
    return this.fb.group({
      id: [initialData.id ?? null],
      clientId: [initialData.clientId ?? null, [Validators.required]],
      sendDate: [initialData.sendDate ?? null, [Validators.required]],
      loadingLocation: [initialData.loadingLocation ?? '', [Validators.required]],
      deliveryLocation: [initialData.deliveryLocation ?? '', [Validators.required]],
      isAdr: [initialData.isAdr ?? false],
      isCarnetTir: [initialData.isCarnetTir ?? false],
      isBorderCrossing: [initialData.isBorderCrossing ?? false],
      isParanom: [initialData.isParanom ?? false],
      offeredPrice: [initialData.offeredPrice ?? null],
      offeredPriceCurrencyId: [initialData.offeredPriceCurrencyId ?? null],
      inAdvancePrice: [initialData.inAdvancePrice ?? null],
      inAdvancePriceCurrencyId: [initialData.inAdvancePriceCurrencyId ?? null],
      selectedLocations: [initialData.selectedLocations ?? []],
      customsOutClearanceLocation: [initialData.customsOutClearanceLocation ?? null],
      customsInClearanceLocation: [initialData.customsInClearanceLocation ?? null],
      additionalLoadingLocation: [initialData.additionalLoadingLocation ?? null],
      additionalDeliveryLocation: [initialData.additionalDeliveryLocation ?? null],
      transportTypeId: [initialData.transportTypeId ?? null],
      transportKindId: [initialData.transportKindId ?? null],
      cargoTypeId: [initialData.cargoTypeId ?? null],
      packageId: [initialData.packageId ?? null],
      loadingMethodId: [initialData.loadingMethodId ?? null],
      weight: [initialData.weight ?? null],
      volume: [initialData.volume ?? null],
      length: [initialData.length ?? null],
      width: [initialData.width ?? null],
      height: [initialData.height ?? null],
      temperature: [initialData.temperature ?? null],
      description: [initialData.description ?? null]
    });
  }

  setupClientSearch(searchTerm$: BehaviorSubject<string>): Observable<any> {
    return searchTerm$.pipe(
      debounceTime(this.searchDebounceTime),
      distinctUntilChanged(),
      switchMap(term => this.clientsService.getAll({ pageSize: 10, pageIndex: 1 }, term))
    );
  }

  setupCitySearch(): Observable<any> {
    return this.citySearchSubject.pipe(
      debounceTime(this.searchDebounceTime),
      distinctUntilChanged(),
      switchMap(term => this.searchCities(term))
    );
  }

  searchCity(term: string): void {
    this.citySearchSubject.next(term);
  }

  private searchCities(term: string): Observable<any> {
    return new Observable(observer => {
      if (term.length < 3) {
        observer.next([]);
        observer.complete();
        return;
      }

      this.geoDbService.findPlaces({
        namePrefix: term,
        limit: 10,
        offset: 0,
        types: ['CITY'],
        languageCode: this.detectLanguage(term)
      }).subscribe({
        next: (response) => {
          const cities = response.data.map(city => ({
            name: city.name,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude
          }));
          observer.next(cities);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  private detectLanguage(input: string): string {
    return /[А-Яа-яЁё]/.test(input) ? 'ru' : 'en';
  }

  getDynamicLabel(location: string): string {
    const labels: Record<string, string> = {
      customsOutClearanceLocation: 'custom_place',
      customsInClearanceLocation: 'custom_clearance_place',
      additionalLoadingLocation: 'add_loading_area',
      additionalDeliveryLocation: 'add_unloading_area'
    };
    return labels[location] || location;
  }

  disableFutureDates = (current: Date): boolean => {
    return current.getTime() <= new Date().getTime();
  };
}
