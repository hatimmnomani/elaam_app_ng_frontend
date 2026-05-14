import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import LinearGradient from "zrender/lib/graphic/LinearGradient";

@Component({
  selector: "app-bardashboard",
  templateUrl: "./bardashboard.component.html",
  styleUrls: ["./bardashboard.component.scss"],
})
export class BardashboardComponent implements OnInit {
  options: any;

  @Input() barData: any;

  activebarresult: any[] = [];
  pendingbarresult: any[] = [];
  completedbarresult: any[] = [];
  deactivatedbarresult: any[] = [];
  totalbarresut: any[] = [];
  xaxislabelresult: any[] = [];

  private eventsSubscription!: Subscription;

  labelOption = {
    rotate: 90,
    show: true,
    align: "center",
  };
  barWidth: string = '3%';
  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.barData.currentValue.activebar === null && 
      changes.barData.currentValue.pendingbar === null && 
      changes.barData.currentValue.completedbar === null && 
      changes.barData.currentValue.deactivatedbar === null &&
      changes.barData.currentValue.totalbar === null) {
        this.nodataOptions();
        return;
      }

    // Xaxis
    if (changes.barData.currentValue.xaxis) {
      this.xaxislabelresult = changes.barData.currentValue.xaxis;
  
      if(this.xaxislabelresult.length  === 2 || this.xaxislabelresult.length  === 3) { this.barWidth = "6%" }

      if(this.xaxislabelresult.length  === 4) { this.barWidth = "10%" }
      
      if(this.xaxislabelresult.length  === 5 || this.xaxislabelresult.length  >= 6) { this.barWidth = "20%" }

      // if(this.xaxislabelresult.length  >= 7) { this.barWidth = "28%" }

    } else {
      this.nodataOptions();
      return;
    }

    // Bar 1
    if (changes.barData.currentValue.activebar) {
      this.activebarresult = changes.barData.currentValue.activebar;
    } else {
      this.activebarresult = [];
    }
    // Bar 2
    if (changes.barData.currentValue.pendingbar) {
      this.pendingbarresult = changes.barData.currentValue.pendingbar;
    } else {
      this.pendingbarresult = [];
    }
    // Bar 3
    if (changes.barData.currentValue.completedbar) {
      this.completedbarresult = changes.barData.currentValue.completedbar;
    } else {
      this.completedbarresult = [];
    }
    // Bar 4
    if (changes.barData.currentValue.totalbar) {
      this.totalbarresut = changes.barData.currentValue.totalbar;
    }else {
      this.totalbarresut = [];
    }
    if (changes.barData.currentValue.deactivatedbar) {
       this.deactivatedbarresult = changes.barData.currentValue.deactivatedbar;
    } else {
      this.deactivatedbarresult = [];
    }

    this.chartOptions();
  }

  /******************************************************************************
   *
   * @brief get xaxis and get yaxis
   * @param none
   * return none
   *
   ******************************************************************************/

  chartOptions() {
    this.options = {
      legend: {
        data: ["Active", "Approval Pending", "Completed", "Total","Deactivated"],
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        data: this.xaxislabelresult,
        axisTick: { show: false },
        axisLabel: {
          rotate: 40,
          color: "#394554",
        },
      },
      yAxis: { type: "value" },
      grid: {
        left: "5%",
        right: "4%",
        bottom: "0%",
        containLabel: true,
      },
      series: [
        {
          name: "Active",
          type: "bar",
          barGap: 0,
          emphasis: { focus: "series" },
          barWidth: this.barWidth,
          itemStyle: { color: "#1cdd52" },
          data: this.activebarresult,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }        },
        {
          name: "Approval Pending",
          type: "bar",
          barGap: 0,
          emphasis: { focus: "series" },
          barWidth: this.barWidth,
          itemStyle: { color: "#ee1212" },
          data: this.pendingbarresult,
        },
        {
          name: "Completed",
          type: "bar",
          barGap: 0,
          emphasis: { focus: "series" },
          barWidth: this.barWidth,
          itemStyle: { color: "#e7bb4b" },
          data: this.completedbarresult,
        },
        {
          name: "Total",
          type: "bar",
          barGap: 0,
          emphasis: { focus: "series" },
          barWidth: this.barWidth,
          itemStyle: { color: "#feab2b" },
          data: this.totalbarresut,
        },
        {
          name: "Deactivated",
          type: "bar",
          barGap: 0,
          emphasis: { focus: "series" },
          barWidth: this.barWidth,
          itemStyle: { color: "#808080" },
          data: this.deactivatedbarresult,
        },
      ],
    };
  }

  onChartEvent(event: any, type: string) {
  }

  ngOnDestroy() {
    this.eventsSubscription && this.eventsSubscription.unsubscribe();
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
        top: "center",
      },
      xAxis: {
        show: false,
      },
      yAxis: {
        show: false,
      },
      series: [],
    };
  }
}
