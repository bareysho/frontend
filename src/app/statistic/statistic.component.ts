// import {Component, OnInit, OnDestroy} from '@angular/core';
// import {Chart} from 'angular-highcharts';
//
// @Component({
//   selector: 'statistic',
//   templateUrl: './statistic.component.html',
//   styleUrls: ['./statistic.component.scss']
// })
// export class StatisticComponent implements OnInit, OnDestroy {
//   days = [];
//   ngOnInit() {
//     for (let i = 1; i < 19; i++) {
//       this.days.push(i);
//       this.chart.addPoint(Math.floor(Math.random() * 20), 0);
//       this.chart.addPoint(Math.floor(Math.random() * 10), 1);
//     }
//   }
//
//   chart = new Chart({
//     chart: {
//       type: 'line'
//     },
//     title: {
//       text: 'Статистика Июнь'
//     },
//     xAxis: {
//       categories: this.days,
//     },
//     yAxis: {
//       title: {
//         text: "Активность",
//       }
//     },
//     credits: {
//       enabled: false
//     },
//     series: [{
//       name: 'Лайки',
//       data: [1, 2, 3]
//     }, {
//       name: 'Комментарии',
//       data: [1, 2, 3]
//     }]
//   });
//
//   ngOnDestroy(): void {
//   }
//
//   // add point to chart serie
//   add() {
//     this.chart.addPoint(Math.floor(Math.random() * 10));
//   }
// }
