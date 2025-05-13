<template>
  <div class="box box1 overflow-hidden h-100">
    <apexchart
      type="area"
      height="100%"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script>
import ApexChart from 'vue3-apexcharts';

export default {
  props: {
    body: {
      type: Object,
      required: true,
    },
  },
  name: 'SparkChart',
  components: {
    apexchart: ApexChart
  },
  data() {
    return {
      sparklineData: [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46]
    };
  },
  computed: {
    chartSeries() {
      return [
        {
          name: 'Kw',
          data: this.randomizeArray(this.body.data || this.sparklineData)
        }
      ];
    },
    chartOptions() {
      return {
        chart: {
          group: 'sparklines',
          type: 'area',
          height: 160,
          sparkline: { enabled: true }
        },
        stroke: {
          curve: 'straight'
        },
        fill: {
          opacity: 1
        },
        labels: [...Array(24).keys()].map(n => `2018-09-${(n + 1).toString().padStart(2, '0')}`),
        yaxis: {
          min: 0
        },
        xaxis: {
          type: 'datetime'
        },
        colors: ['#1da1d4'],
        title: {
          text: this.body.earn,
          offsetX: 30,
          offsetY: 32,
          floating: true,
          style: {
            fontSize: '24px'
          }
        },
        subtitle: {
          text: this.body.name,
          floating: true,
          offsetX: 30,
          offsetY: 15,
          style: {
            fontSize: '14px'
          }
        }
      };
    }
  },
  methods: {
    randomizeArray(arr) {
      const array = arr.slice();
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  }
};
</script>

<style scoped>
.box1 {
  background: #ffffff;
  box-shadow: 0px 1px 22px -12px #607D8B;
}
</style>
