import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from './services/analytics.service';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: true,
  imports: [NgxEchartsModule, CommonModule, TranslateModule, NzRadioModule, NzSelectModule, FormsModule],
})
export class AnalyticsComponent implements OnInit {
  percentageData = [];
  amountData = [];
  filter = { type: 'tir' }
  chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: params => `${params.name}: <b>${params.value} ${this.filter.type === 'percent' ? '%' : 'TIR'}</b>`
    },
    legend: {
      top: '0%',
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        data: [],
      },
    ],
  };

  constructor(
    private translate: TranslateService,
    private analiticsService: AnalyticsService
  ) { }
  ngOnInit(): void {
    this.getCounts();
    this.getAmounts();
    this.getPercentages();
  }
  getCounts() {
    this.analiticsService.completedServicesCounts().subscribe((res: any) => {
      if (res) {
        console.log("Counts:", res);
      }
    });
  }

  getAmounts() {
    this.analiticsService.completedServicesAmounts().subscribe((res: any) => {
      if (res) {
        this.amountData = res.data.services;
        this.updateChart();
      }
    });
  }

  getPercentages() {
    this.analiticsService.completedServicesPercentages().subscribe((res: any) => {
      if (res) {
        this.percentageData = res.data.services;
      }
    });
  }

  updateChart() {
    const selectedData = this.filter.type === 'percent' ? this.percentageData : this.amountData;

    this.chartOptions = {
      ...this.chartOptions,
      tooltip: {
        ...this.chartOptions.tooltip,
        formatter: params => `${params.name}: <b>${params.value} ${this.filter.type === 'percent' ? '%' : 'TIR'}</b>`
      },
      series: [
        {
          ...this.chartOptions.series[0],
          data: selectedData.map(item => ({
            value: this.filter.type === 'percent' ? item.percentage : item.tirAmount,
            name: item.name
          })),
        }
      ],
    };

  }
  changeType(type) {
    this.updateChart();
  }
}