import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico-donut',
  templateUrl: './grafico-donut.component.html',
  styles: []
})
export class GraficoDonutComponent implements OnInit {

  // Doughnut
  @Input('labels') public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  @Input('data') public doughnutChartData: MultiDataSet = [
    [350, 450, 100],
    [50, 150, 120],
    [250, 130, 70],
  ];
  @Input('type') public doughnutChartType: ChartType = 'doughnut';
  @Input() public leyenda: string = 'Leyenda';

  constructor() { }

  ngOnInit() {
  }

}
