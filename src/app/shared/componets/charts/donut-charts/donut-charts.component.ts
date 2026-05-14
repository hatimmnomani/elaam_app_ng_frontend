import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges
} from "@angular/core";

const symbolSize = 10;
@Component({
  selector: "app-donut-charts",
  templateUrl: "./donut-charts.component.html",
  styleUrls: ["./donut-charts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class donutChartsComponent implements OnInit {

  @Input() chartData: any;


  legends: any[] = [
    {color: '#1cdd52', name: "Active"},
    {color: '#ee1212', name: "Approval Pending"},
    {color: '#e7bb4b', name: "Completed"},
    {color: '#808080', name: "Deactivated"}
  ]

  options: any;
  totalData: any;

  constructor() {}

  ngOnInit(): void {

  }

  /******************************************************************************
   *
   * @brief ngOnChanges get the value of all input operators and detects the chart changes
   * @param changes
   * return the graph line chart series with title and chart data
   *
   ******************************************************************************/
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartData.currentValue) {
      // if (changes.chartData.currentValue.totalNiyat === undefined) {
      //   this.nodataOptions();
      //   return;
      // }

      this.chartOptions(changes.chartData.currentValue);

    } else {
      this.nodataOptions();
    }

    if (changes.chartData.currentValue === null) {
      this.chartData = [];
    }

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  ngOnDestroy() {
    // if (this.updatePosition) {
    //   window.removeEventListener("resize", this.updatePosition);
    // }
  }

  /******************************************************************************
   *
   * @brief chartOptions passing a paramets for styling and grids
   * @param changes
   * return passing a paramets for styling and grids
   *
   ******************************************************************************/
  chartOptions(data: any) {
    
    this.totalData = data.totalNiyat
    this.options = {
      icon: "circle",
      responsive: true,
      maintainAspectRatio: false,
      tooltip: {
        trigger: "item"
      },
      legend: {
        show: false,
        left: "center",
        bottom: "0%"
      },
      series: [
        {
          // markPoint: {
          //   tooltip: { show: false },
          //   label: {
          //     show: true,
          //     formatter: "{b}",
          //     color: "black",
          //     fontSize: 20
          //   },
          //   // data: [
          //   //   {
          //   //     name: JSON.stringify(data.totalNiyat),
          //   //     value: "-",
          //   //     symbol: "circle",
          //   //     itemStyle: { color: "transparent" },
          //   //     x: "50%",
          //   //     y: "50%"
          //   //   }
          //   // ]
          // },
          label: {
            show: true,
            position: 'center',
            formatter: '{x|' + JSON.stringify(data.totalNiyat) + '}{a| }',
         
            rich: {
              a: {
                color: 'red',
               
              },
              x: {
                fontweight: 'bold',
                fontSize: 20
              }
            }
          },

          // name: 'Araz',
          type: "pie",
          // radius: ['30%', '45%'],
          radius: ["45%", "80%"],
          avoidLabelOverlap: true,
          // label: {
          //   show: false
          // },
          labelLine: {
            show: false
          },
          color: ['#1cdd52','#ee1212','#e7bb4b','#808080'],
          data: [
            { value: data.active, name: 'Active',  },
            { value: data.approvalPending, name: 'Approval Pending' },
            { value: data.completed , name: 'Completed' },
            {value: data.deactivated, name: "Deactivated"}
          ]
        }
      ]
    };
  }

  /******************************************************************************
   *
   * @brief nodataOptions heliping to if no any data avilable on grpah it help to found not data
   * @param none
   * return the no data found value in all chart section
   *
   ******************************************************************************/
  nodataOptions() {
    this.options = {
      title: {
        show: true,
        color: "grey",
        fontSize: 20,
        text: "loading ...",
        left: "center",
        top: "center"
      },
      xAxis: {
        show: false
      },
      yAxis: {
        show: false
      },
      series: []
    };
  }
}
