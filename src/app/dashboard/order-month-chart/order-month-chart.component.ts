import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {AngularDataContext} from "@themost/angular/client";

@Component({
  selector: 'app-order-month-chart',
  templateUrl: './order-month-chart.component.html',
  styleUrls: ['./order-month-chart.component.scss'],
    providers: [DatePipe]
})
export class OrderMonthChartComponent implements OnInit {

    public brandPrimary = '#20a8d8';
    public brandSuccess = '#4dbd74';
    public brandInfo = '#63c2de';
    public brandWarning = '#f8cb00';
    public brandDanger = '#f86c6b';

    public mainChartData1: Array<number> = [];
    public mainChartData: Array<any>;
/*
    public mainChartData: Array<any> = [
        {
            data: this.mainChartData1,
            label: 'Current'
        }
    ];
    */
    /* tslint:disable:max-line-length */
    public mainChartLabels: Array<any> = [];
    /* tslint:enable:max-line-length */
    public mainChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function(value: any) {
                        return value.substr(0,3);
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(150 / 5),
                    max: 150
                }
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            }
        },
        legend: {
            display: false
        }
    };
    public mainChartColours: Array<any> = [
        { // brandInfo
            backgroundColor: this.convertHex(this.brandInfo, 10),
            borderColor: this.brandInfo,
            pointHoverBackgroundColor: '#fff'
        }
    ];
    public mainChartLegend = false;
    public mainChartType = 'line';


  constructor(public context: AngularDataContext, private datePipe: DatePipe) { }

    // convert Hex to RGBA
    public convertHex(hex: string, opacity: number) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
        return rgba;
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

  public orderAnalytics:any;

  private initAnalyticsData() {
      this.context.model('orderStatuses').getItems().then( orderStatuses => {
          let analytics = {
              total:0
          };
          orderStatuses.value.forEach(x=> {
              analytics[x.alternateName] = 0;
          });
          this.context.model('orders')
              .select('orderStatus',' count(id) as total')
              .where('orderDate').getFullYear().equal(2015)
              .groupBy('orderStatus')
              .getItems().then(res => {
              res.value.forEach(x=> {
                  analytics[x.orderStatus.alternateName] = x.total;
                  analytics.total += x.total;
              });
              this.orderAnalytics = analytics;
          });
      });
  }

  private initChartData() {
      this.context.model('orders')
          .select('year(orderDate) as year','month(orderDate) as month', 'count(id) as total')
          .where('orderDate').getFullYear().equal(2015)
          .groupBy('year(orderDate)','month(orderDate)')
          .orderBy('year(orderDate)')
          .thenBy('month(orderDate)')
          .getItems().then(res => {
              let _mainChartData1 = [];
              let _mainChartLabels = [];
          res.value.forEach( x=> {
              _mainChartData1.push(x.total);
              let d = new Date(x.year, x.month-1,1);
              _mainChartLabels.push(this.datePipe.transform(d,'MMM'));
          });
          //get max value
          var maxValue = _mainChartData1.reduce(function(a, b) {
              return Math.max(a, b);
          });

          this.mainChartOptions.scales.yAxes[0].ticks.max = Math.ceil(maxValue/100)*100;
          this.mainChartOptions.scales.yAxes[0].ticks.stepSize = (Math.ceil(maxValue/100)*100) / 4;
          this.mainChartLabels = _mainChartLabels;
          this.mainChartData1 = _mainChartData1;
          this.mainChartData = [
              {
                  data: this.mainChartData1,
                  label: 'Orders'
              }
          ];
      }).catch(err => {
          console.log(err);
      });
  }

  ngOnInit() {
      this.initAnalyticsData();
      this.initChartData();
  }

}
