import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModules } from 'src/app/shared/modules/common.module';
import { NzModules } from 'src/app/shared/modules/nz-modules.module';
import { CargoStatusModel } from '../../../references/cargo-status/models/cargo-status.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss'],
  standalone: true,
  imports: [CommonModules, NzModules, TranslateModule],
  animations: [
    trigger('showHideFilter', [
      state('show', style({ height: '*', opacity: 1, visibility: 'visible' })),
      state('hide', style({ height: '0', opacity: 0, visibility: 'hidden' })),
      transition('show <=> hide', animate('300ms ease-in-out'))
    ])
  ]
})
export class OrderFilterComponent {
  @Input() isVisible = false;
  @Input() filter: Record<string, string> = {};
  @Input() statuses: CargoStatusModel[] = [];
  
  @Output() filterChange = new EventEmitter<Record<string, string>>();
  @Output() search = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  get animationState(): string {
    return this.isVisible ? 'show' : 'hide';
  }

  onFilterChange(value: string, key: string): void {
    this.filter[key] = value;
    this.filterChange.emit(this.filter);
  }

  onSearch(): void {
    this.search.emit();
  }

  onReset(): void {
    this.reset.emit();
  }
}
