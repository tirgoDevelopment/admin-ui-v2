import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
  standalone: true
})
export class PriceFormatPipe implements PipeTransform {

  transform(value: number | string, decimalPlaces: number = 2): string {
    if (value == null || value === '') return (0).toFixed(decimalPlaces);
    const numValue = typeof value === 'string' ? Number(value) : value;
    if (isNaN(numValue)) return value.toString();

    const truncatedValue = Math.floor(numValue * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
    return truncatedValue
      .toFixed(decimalPlaces)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
