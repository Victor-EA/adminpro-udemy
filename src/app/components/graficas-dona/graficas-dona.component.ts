import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-graficas-dona',
  templateUrl: './graficas-dona.component.html',
  styles: [],
})
export class GraficasDonaComponent implements OnInit {

  // Doughnut
  @Input('chartLabels') doughnutChartLabels: string[] = [];
  @Input('chartData') doughnutChartData: number[] = [];
  @Input('chartType') doughnutChartType: string = '';

  constructor() {}

  ngOnInit(): void {}
}
