import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from './services/analytics.service';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: true,
  imports: [DecimalPipe, NgxEchartsModule, CommonModule, TranslateModule, NzRadioModule, NzSelectModule, FormsModule, NzTableModule, NzEmptyModule],
})
export class AnalyticsComponent implements OnInit {
  percentageData = [];
  amountData = [];
  data
  loading = false;
  filter = { type: 'chart' }
  chartOptionsBase: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: params => `${params.name}: <b>${this.formatNumber(params.value)} TIR</b>`,
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle',
      formatter: name => {
        const item = this.currentData.find(i => i.name === name);
        return item ? `${name}  ${item.percentage}%` : name;
      },
      textStyle: {
        fontSize: 14,
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        minAngle: 5,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: params => `{a|${this.formatNumber(this.totalValue)} TIR}\n{b|${this.totalCount} сервисов}`,
          rich: {
            a: { fontSize: 20, fontWeight: 'bold' },
            b: { fontSize: 14, color: '#888' },
          },
        },
        data: [],
      },
    ],
  };

  amountChartOptions: EChartsOption = { ...this.chartOptionsBase };
  totalValue: number = 0;
  totalCount: number = 0;
  currentData: any[] = [];
  chartOptions
  totalCountTable = 0;
  constructor(
    private translate: TranslateService,
    private analiticsService: AnalyticsService
  ) { }
  ngOnInit(): void {
    this.getPercentage();
  }

  getAmount() {
    this.analiticsService.completedServicesAmounts().subscribe((res: any) => {
      if (res) {
        const amountData = res.data.services
          .filter(item => Number(item.tirAmount) > 0)
          .map(item => ({
            value: Number(item.tirAmount),
            name: item.name,
            percentage: this.getPercentageByName(item.name) || "0",
            count: item.count
          }));
        this.totalValue = amountData.reduce((sum, item) => sum + Number(item.value), 0);
        this.totalCount = amountData.length;
        this.currentData = amountData;
        this.data = amountData.map((item, index) => ({
          name: item.name,
          amount:this.formatNumber(item.value),
          percentage: item.percentage,
          count: Number(item.count) 
        }));
        
        if (amountData.length > 0) {
          this.amountChartOptions = {
            ...this.chartOptionsBase,
            legend: {
              ...this.chartOptionsBase.legend,
              data: amountData.map(item => item.name),
              formatter: name => {
                const item = amountData.find(i => i.name === name);
                return item ? `${name}  ${item.percentage}% (${item.count} кол-во)` : name;
              },
            },
            series: [
              {
                ...this.chartOptionsBase.series[0],
                data: amountData,
              },
            ],
          };
        }
      }
    });
  }
  getPercentage() {
    this.analiticsService.completedServicesPercentages().subscribe((res: any) => {
      if (res) {
        this.percentageData = res.data.services;
        this.totalCountTable = res.data.totalCount;
        this.getAmount();
      }
    });
  }
  getPercentageByName(serviceName: string): string {
    const service = this.percentageData?.find(item => item.name === serviceName);
    return service ? service.percentage : "0";
  }
  formatNumber(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value);
  }


}