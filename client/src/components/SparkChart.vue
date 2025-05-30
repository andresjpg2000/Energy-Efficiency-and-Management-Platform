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
import { useConsumptionStore } from "@/stores/consumptionStore";
import ApexChart from "vue3-apexcharts";

export default {
  props: {
    title: {
      type: String,
    },
    earn: {
      type: String,
      default: "Sparkline Chart",
    },
    name: {
      type: String,
      default: "Subtitle",
    },
  },
  name: "SparkChart",
  components: {
    apexchart: ApexChart,
  },
  beforeMount() {
    console.log("name:", this.title);
    console.log("data:", this.consumptionStore.data);

    if (this.title == "Total-Consumption") {
      this.data = this.consumptionStore.data.map((c) => c.value);
    } else if (this.title == "Corrent-Consumption") {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      this.data = this.consumptionStore.data
        .filter((c) => c.date.startsWith(today))
        .map((c) => c.value);
    }
    this.total = this.data.reduce((total, c) => total + c, 0);
    if (this.data.length == 0) {
      this.data = this.sparklineData;  
    } 
  },
  data() {
    return {
      consumptionStore: useConsumptionStore(),
      total: -1,
      data: [],
      sparklineData: [
        47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53,
        61, 27, 54, 43, 19, 46,
      ],
    };
  },
  mounted() {
    // console.log(
    //   'SparkChart mounted',
    //   this.body
    // );
  },
  computed: {
    chartSeries() {
      return [
        {
          name: "Kw",
          data: this.data,
        },
      ];
    },
    chartOptions() {
      return {
        chart: {
          group: "sparklines",
          type: "area",
          height: 160,
          sparkline: { enabled: true },
        },
        dataLabels: {
          enabled: false,
          formatter: function (val) {
            return val.toFixed(2);
          },
          style: {
            fontSize: "12px",
            colors: ["#000"],
          },
        },
        stroke: {
          curve: "straight",
        },
        fill: {
          opacity: 1,
        },
        labels: this.data.map((v, i) => `${i + 1}`), // apenas índice, ou remove
        yaxis: {
          min: 0,
        },
        xaxis: {
          type: "category", // ✅ trocar para category se usar índices
        },
        colors: ["#1da1d4"],
        title: {
          text: this.total > -1 ? `${this.total.toFixed(2)} Kw` : this.earn,
          offsetX: 30,
          offsetY: 32,
          floating: true,
          style: {
            fontSize: "24px",
          },
        },
        subtitle: {
          text: this.name,
          floating: true,
          offsetX: 30,
          offsetY: 15,
          style: {
            fontSize: "14px",
          },
        },
      };
    },
  },
  methods: {},
};
</script>

<style scoped>
.box1 {
  background: #ffffff;
  box-shadow: 0px 1px 22px -12px #607d8b;
}
</style>
