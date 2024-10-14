import { Injectable } from '@angular/core';
import * as echarts from 'echarts';
import { barData, barDataTwo } from '../../pages/uac/components/admin-dashboard/data';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  constructor() { }

  doughnutChart(id: string, data: any) {
    var chartDom = document.getElementById(id);
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        show: false,
        trigger: 'item',
      },
      title: {
        text: 'fake data',
        bottom: '0', // Position the title at the bottom of the chart
        left: 'center',
        fontWeight: 'normal',
        fontSize: 15,
      },
      legend: {
        show: false,
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };

    option && myChart.setOption(option);
  }

  pieChart(id: string, data: any) {
    const chart2Dom = document.getElementById(id);
    const pieChart = echarts.init(chart2Dom);
    let option;

    option = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        right: 'center',
        bottom: '0'
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        show: false,
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    option && pieChart.setOption(option);
  }
  stackedBarChart(id: string, data: any) {
    var chartDom = document.getElementById(id);
    var myChart = echarts.init(chartDom);
    var option;

    let xAxisData: any[] = [];
    let series: any[] = [
      {
        data: [],
        type: 'bar',
        stack: 'a',
        name: 'Reported',
      },
      {
        data: [],
        type: 'bar',
        stack: 'a',
        name: 'Not Reported',
      },
    ];

    barData.forEach((res: any) => {
      xAxisData.push(res.name);
      series[0].data.push(res.series[0].value);
      series[1].data.push(res.series[1].value);
    });

    option = {
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          show: true,
          rotate: 90,
          fontSize: 12,

          fontFamily: 'Arial',
        },
      },
      yAxis: {
        type: 'value',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        show: true,
        orient: 'vertical',
        left: 'left',
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },

      series: series,
    };

    option && myChart.setOption(option);
  }

  groupedBarChart(id: string, data: any) {
    var chartDom = document.getElementById(id);
    var myChart = echarts.init(chartDom);
    var option;


    let xAxisData: any[] = [];
    let seriesData: any[] = [
      {
        name: 'Meal Served',
        type: 'bar',
        barGap: 0,
        label: 'labelOption',
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        name: 'Total Present',
        type: 'bar',
        label: 'labelOption',
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
      {
        name: 'Total Enrolled',
        type: 'bar',
        label: 'labelOption',
        emphasis: {
          focus: 'series',
        },
        data: [],
      },
    ];

    barDataTwo.forEach((res: any) => {
      xAxisData.push(res.name);
      seriesData[0].data.push(res.series[0].value);
      seriesData[1].data.push(res.series[1].value);
      seriesData[2].data.push(res.series[2].value);
    });

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Meal Served', 'Total Present', 'Total Enrolled'],
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: xAxisData,
          axisLabel: {
            show: true,
            rotate: 90,
            fontSize: 12,

            fontFamily: 'Arial',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: seriesData
    };

    option && myChart.setOption(option);
  }
}
