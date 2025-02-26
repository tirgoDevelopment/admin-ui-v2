import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from './services/analytics.service';
import { EChartsOption, LegendComponentOption, TooltipComponentOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PriceFormatPipe } from 'src/app/shared/pipes/priceFormat.pipe';
import { TmsService } from '../merchant/merchant-driver/services/tms.service';
import { of } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IconsProviderModule } from 'src/app/shared/modules/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { generateQueryFilter } from 'src/app/shared/pipes/queryFIlter';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: true,
  imports: [PriceFormatPipe, NgxEchartsModule, CommonModule, TranslateModule, NzSelectModule, FormsModule, IconsProviderModule,
    NzTableModule, NzEmptyModule, NzRadioModule, NzDatePickerModule, NzInputModule, NzButtonModule],
})
export class AnalyticsComponent implements OnInit {
  percentageData = [];
  data: any[] = [];
  loading = false;
  filter = this.initializeFilter();
  amountChartOptions = {} as EChartsOption;
  countChartOptions = {} as EChartsOption;
    totalValue: number = 0;
  totalCount: number = 0;
  tms$
  constructor(
    private analiticsService: AnalyticsService,
    private tmsService: TmsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getPercentage();
  }

  private getBaseChartOptions(): EChartsOption {
    return {
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: { fontSize: 14, lineHeight: 18 },
      },
      series: [
        {
          type: 'pie',
          minAngle: 5,
          radius: ['50%', '70%'],
          center: ['20%', '50%'],
          label: {
            show: true,
            position: 'center',
            formatter: () => `{a|${this.formatNumber(this.totalValue)} TIR}\n{b|${this.totalCount} сервисов}`,
            rich: {
              a: { fontSize: 20, fontWeight: 'bold' },
              b: { fontSize: 14, color: '#888' },
            },
          },
          data: [],
        },
      ],
    };
  }

  private mapAmountData(services: any[]): any[] {
    return services
      .filter(item => Number(item.tirAmount) > 0)
      .map(item => ({
        value: Number(item.tirAmount),
        name: item.name,
        percentage: this.getPercentageByName(item.name) || '0',
        count: item.count,
      }));
  }

  private calculateTotals(amountData: any[]): void {
    this.totalValue = amountData.reduce((sum, item) => sum + Number(item.value), 0);
    this.totalCount = amountData.reduce((sum, item) => sum + Number(item.count), 0);
  }

  private prepareTableData(amountData: any[]): any[] {
    return amountData.map(item => ({
      name: item.name,
      amount: this.formatNumber(item.value),
      percentage: item.percentage,
      count: Number(item.count),
    }));
  }

  private updateChartOptions(amountData: any[]): void {
    if (!amountData || amountData.length === 0) {
      this.amountChartOptions = this.getBaseChartOptions();
      this.countChartOptions = this.getBaseChartOptions();
      this.cdr.detectChanges();
      return;
    }
  
    const legendNames = amountData.map(item => item.name);
    const legendOptions: LegendComponentOption = {
      orient: 'horizontal',
      left: 'center',
      top: '0%',
      textStyle: { fontSize: 14, lineHeight: 18 },
      data: legendNames,
      formatter: (name: string) => {
        const item = amountData.find(i => i.name === name);
        return item ? `${name} ${item.percentage}% (${item.count} кол-во)` : name;
      },
    };
  
    const baseOptions = this.getBaseChartOptions();
    const baseSeriesOptions = baseOptions.series[0];
  
    this.amountChartOptions = {
      ...baseOptions,
      legend: legendOptions,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => `${params.name}: <b>${this.formatNumber(params.value)} TIR</b>`,
      } as TooltipComponentOption,
      series: [
        {
          ...baseSeriesOptions,
          name: 'Amount',
          center: ['50%', '50%'],
          label: {
            ...baseSeriesOptions.label,
            formatter: `{a|${this.formatNumber(this.totalValue)} TIR}`
          },
          data: amountData,
        },
      ],
    };
  
    this.countChartOptions = {
      ...baseOptions,
      legend: legendOptions,
      tooltip: {
        trigger: 'item',
        formatter: params => `${params.name}: <b>${this.formatNumber(params.value)} кол-во</b>`,
      } as TooltipComponentOption,
      series: [
        {
          ...baseSeriesOptions,
          name: 'Count',
          center: ['50%', '50%'],
          label: {
            ...baseSeriesOptions.label,
            formatter: `{a|${this.formatNumber(this.totalCount)} кол-во}`
          },
          data: amountData.map(item => ({ value: item.count, name: item.name })),
        },
      ],
    };
  
    this.cdr.detectChanges();
  }
  
  
  getAmount(): void {
    this.analiticsService.completedServicesAmounts(generateQueryFilter(this.filter)).subscribe((res: any) => {
      if (!res) return;
      const amountData = this.mapAmountData(res.data.services);
      this.calculateTotals(amountData);
      this.data = this.prepareTableData(amountData);
      if (amountData.length === 0) return;
  
      this.updateChartOptions([...amountData]);
      this.cdr.detectChanges();
    });
  }
  getPercentage(): void {
    this.analiticsService.completedServicesPercentages(generateQueryFilter(this.filter)).subscribe((res: any) => {
      if (res) {
        this.percentageData = res.data.services;
        this.getAmount();
      }
    });
  }
  getPercentageByName(serviceName: string): string {
    const service = this.percentageData?.find(item => item.name === serviceName);
    return service ? service.percentage : '0';
  }
  formatNumber(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value);
  }
  
  findTms(searchTerm) {
    if (searchTerm) {
      this.tmsService.findTms(searchTerm, 'companyName').subscribe((response: any) => {
        this.tms$ = of(response.data.content);
      });
    }
  }
  filterApply() {
    this.filter['filterBy'] = this.filter['tmsesIds'].length > 0 ? 'user' : 'all';
    
    this.amountChartOptions = this.getBaseChartOptions();
    this.countChartOptions = this.getBaseChartOptions();
  
    setTimeout(() => {
      this.getPercentage();
      this.cdr.detectChanges();
    });
  }
  resetFilter() {
    this.filter = this.initializeFilter();
    this.getPercentage();
  }
  private initializeFilter(): Record<any, any> {
    return { type: 'chart', fromDate: '', toDate: '', tmsesIds: [], filterBy: 'all' };
  }
}
