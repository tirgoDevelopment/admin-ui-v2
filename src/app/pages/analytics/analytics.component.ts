import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from './services/analytics.service';
import { EChartsOption, LegendComponentOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PriceFormatPipe } from 'src/app/shared/pipes/priceFormat.pipe';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: true,
  imports: [PriceFormatPipe, NgxEchartsModule, CommonModule, TranslateModule, NzSelectModule, FormsModule,
    NzTableModule, NzEmptyModule, NzRadioModule, NzDatePickerModule,],
})
export class AnalyticsComponent implements OnInit {
  percentageData = [];
  data: any[] = [];
  loading = false;
  filter = { type: 'chart', fromDate: '', toDate: '' };
  amountChartOptions: EChartsOption = {};
  countChartOptions: EChartsOption = {};
  totalValue: number = 0;
  totalCount: number = 0;

  constructor(private analiticsService: AnalyticsService) {}

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
        formatter: params => `${params.name}: <b>${this.formatNumber(params.value)} TIR</b>`,
      },
      series: [
        {
          ...baseSeriesOptions,
          name: 'Amount',
          center: ['25%', '55%'],
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
      legend: undefined,
      tooltip: {
        trigger: 'item',
        formatter: params => `${params.name}: <b>${this.formatNumber(params.value)} кол-во</b>`,
      },
      series: [
        {
          ...baseSeriesOptions,
          name: 'Count',
          center: ['55%', '55%'],
          label: {
            ...baseSeriesOptions.label,
            formatter: `{a|${this.formatNumber(this.totalCount)} кол-во}`
          },
          data: amountData.map(item => ({ value: item.count, name: item.name })),
        },
      ],
    };
  }
  getAmount(): void {
    this.analiticsService.completedServicesAmounts().subscribe((res: any) => {
      if (!res) return;
      const amountData = this.mapAmountData(res.data.services);
      this.calculateTotals(amountData);
      this.data = this.prepareTableData(amountData);
      if (amountData.length === 0) return;

      this.updateChartOptions(amountData);
    });
  }
  getPercentage(): void {
    this.analiticsService.completedServicesPercentages().subscribe((res: any) => {
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
  onDateChange(e) {

  }
}
