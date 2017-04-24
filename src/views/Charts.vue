<template lang="jade">
.admin
  .echarts
    IEcharts(:option='line')
  .echarts
    IEcharts(:option='bar')
  .echarts
    IEcharts(:option='pie')
  .echarts
    IEcharts(:option='pie_radius')
</template>

<script>
import IEcharts from 'vue-echarts-v3';
export default {
  components: {
    IEcharts
  },
  data: () => ({
    line: {
      color:["#20a0ff","#13CE66","#F7BA2A","#FF4949"],
      title: {
        text: '曲线图'
      },
      xAxis: {
        data: ["文章", "用户", "专题", "广告", "视频", "元信息"]
      },
      yAxis:{},
      series: [
        {
          name: "总量",
          type: "line",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    },
    bar: {
      color:["#20a0ff","#13CE66","#F7BA2A","#FF4949"],
      title: {
        text: '柱状图'
      },
      xAxis: {
        data: ["文章", "用户", "专题", "广告", "视频", "元信息"]
      },
      yAxis:{},
      series: [
        {
          name: "总量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    },
    pie: {
      color:["#20a0ff","#13CE66","#F7BA2A","#FF4949","#61a0a8"],
      title : {
        text: '饼状图',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ["文章", "用户", "专题", "广告", "视频"]
      },
      series : [
        {
          name: '总量',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data:[
            {value:335, name:'文章'},
            {value:310, name:'用户'},
            {value:234, name:'专题'},
            {value:135, name:'广告'},
            {value:548, name:'视频'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    },
    pie_radius:{
      color:["#20a0ff","#13CE66","#F7BA2A","#FF4949","#61a0a8"],
      title : {
        text: '环形图',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ["文章", "用户", "专题", "广告", "视频"]
      },
      series : [
        {
          name: '总量',
          type: 'pie',
          radius : ['40%','60%'],
          data:[
            {value:335, name:'文章'},
            {value:310, name:'用户'},
            {value:234, name:'专题'},
            {value:135, name:'广告'},
            {value:548, name:'视频'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  })
}
</script>

<style scoped>
.echarts {
  float: left;
  width: 500px;
  height: 400px;
}
</style>
