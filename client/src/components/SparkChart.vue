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
import { useProductionsStore } from "@/stores/productionsStore";
import { useHousingsStore } from "@/stores/housings";
import { useSuppliersStore } from "@/stores/suppliers";
import { useColorsStore } from "@/stores/colorsStore";
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
    ///////////////// total consumption
    console.log(this.colorsStore.consumptionColor + " - " +this.colorsStore.productionColor);
    
    if (this.title == "Total-Consumption") {
      const thisYear = new Date().getFullYear();

      console.log("thisYear:", thisYear);
      console.log("total consumption:", this.consumptionStore.data);
      
      this.data = this.consumptionStore.data
        .filter((c) => new Date(c.date).getFullYear() === thisYear)
        .map((c) => c.value);
      console.log("filtered data:", this.data);
      
      this.total = this.data.reduce((total, c) => total + c, 0);
      ///////////////// corrent consumption
    } else if (this.title == "Corrent-Consumption") {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      this.data = this.consumptionStore.data
        .filter((c) => c.date.startsWith(today))
        .map((c) => c.value);

      this.total = this.data.reduce((total, c) => total + c, 0);
      ///////////////// energy production today
    } else if (this.title == "Energy-Production") {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      this.data = this.productionsStore.data
        .filter((c) => c.date.startsWith(today))
        .map((c) => c.value);
      this.total = this.data.reduce((total, c) => total + c, 0);
      ///////////////// total expenses
    } else if (this.title == "Total-Expenses") {
      const thisMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"


      const productionData = (this.productionsStore.data || [])
        .filter((p) => p.date.startsWith(thisMonth))
        .reduce((total, p) => total + (p.value || 0), 0);
      
      const consumptionData = (this.consumptionStore.data || [])
        .filter((c) => c.date?.startsWith(thisMonth))
        .reduce((total, c) => total + (c.production || 0), 0);

      const supplier = this.suppliersStore.suppliers.find(
        s => s.id == this.housingsStore.selectedSupplierId
      );
      console.log(supplier);
      let price = consumptionData - productionData;
      this.total = price > 0 ? price * supplier.cost_kWh : 0;//multiplicação e validação aqui
    }
    if (this.data.length < 5|| this.data.length > 25) {
      this.data = this.sparklineData;
    }
  },
  data() {
    return {
      consumptionStore: useConsumptionStore(),
      productionsStore: useProductionsStore(),
      housingsStore: useHousingsStore(),
      suppliersStore: useSuppliersStore(),
      colorsStore: useColorsStore(),
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
        labels: this.data.map((v, i) => `${i + 1}`),
        yaxis: {
          min: 0,
        },
        xaxis: {
          type: "category",
        },
        colors: this.title == "Total-Consumption" || this.title == "Corrent-Consumption" ? [this.colorsStore.consumptionColor] : [this.colorsStore.productionColor],
        title: {
          text:
            this.title == "Total-Expenses"
              ? `${this.total.toFixed(2)} €`
              : `${this.total.toFixed(2)} Kw`,
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
