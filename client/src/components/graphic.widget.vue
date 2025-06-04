<template>
  <v-card class="rounded-xl teste">
    <v-card-item class="h-100">
      <div class="h-100 d-flex justify-space-between align-center mb-mb-0 mb-3">
        <v-card-title class="text-h5 text-md-body2"
          >Energy Consumption</v-card-title
        >
        <v-chip-group mandatory class="chips" v-model="select">
          <v-chip rounded="lg" value="year">year</v-chip>
          <v-chip rounded="lg" value="month">last month</v-chip>
          <v-chip rounded="lg" value="week">last week</v-chip>
        </v-chip-group>
      </div>
      <apexchart
        type="area"
        height="100%"
        :options="areachartOptions"
        :series="areaChart.series"
      ></apexchart>
    </v-card-item>
  </v-card>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { useConsumptionStore } from "@/stores/consumptionStore";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
        consumptionStore: useConsumptionStore(),
        select: "week",
        labels: {
            year: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            ],
            month: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            ],
            week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        },
        rawData: {
            year: {
                actual: [25, 25, 10, 10, 45, 45, 75, 70, 35, 12, 32, 32],
                last: [50, 50, 25, 20, 20, 20, 35, 35, 60, 30, 20, 20],
            },
            month: {
                actual: [
                    25, 25, 20, 10, 45, 54, 65, 70, 35, 12, 32, 32, 25, 25, 20, 10, 45,
                    54, 65, 70, 35, 12, 32, 32, 65, 70, 35, 12, 32, 32,
                ],
                last: [
                50, 50, 25, 20, 20, 20, 35, 35, 60, 30, 20, 20, 25, 25, 20, 10, 45,
                54, 65, 70, 35, 12, 32, 32, 65, 70, 35, 12, 32, 32,
                ],
            },
            week: {
                actual: [11, 15, 16, 18, 22, 66, 12],
                last: [11, 19, 17, 14, 20, 20, 35],
            },
        },
};
    },
    methods: {
        
        selectDate(time) {
            if (time == "year") {
                return this.rawData.year;
            } else if (time == "month") {
                const today = new Date();

                const startThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // último dia do mês

                const startLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const endLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // último dia do mês anterior

                const actual = Array(30).fill(0);
                const last = Array(30).fill(0);

                const data = this.consumptionStore.data || [];

                data.forEach((c) => {
                const date = new Date(c.date);
                const day = date.getDate() - 1;
                const value = c.value || 0;

                if (date >= startThisMonth && date <= endThisMonth) {
                    actual[day] += value;
                    actual[day] = Math.round(actual[day] * 100) / 100;
                } else if (date >= startLastMonth && date <= endLastMonth) {
                    last[day] += value;
                    last[day] = Math.round(last[day] * 100) / 100;
                }
                });
                
                return { actual, last };

            } else if (time == "week") {
                //criar a lógica para calcular o consumo da semana atual e da semana passada
                const today = new Date();
                const dayOfWeek = today.getDay(); // 0 (Domingo) a 6 (Sábado)

                // domingo desta semana
                const sundayThisWeek = new Date(today);
                sundayThisWeek.setDate(today.getDate() - dayOfWeek);
                sundayThisWeek.setHours(0, 0, 0, 0);

                // domingo da semana passada
                const sundayLastWeek = new Date(sundayThisWeek);
                sundayLastWeek.setDate(sundayThisWeek.getDate() - 7);

                // sábado da semana passada
                const saturdayLastWeek = new Date(sundayLastWeek);
                saturdayLastWeek.setDate(sundayLastWeek.getDate() + 6);
                saturdayLastWeek.setHours(23, 59, 59, 999);

                const data = this.consumptionStore.data || [];

                const actual = Array(7).fill(0); // domingo a sábado
                const last = Array(7).fill(0);

                data.forEach((c) => {
                const date = new Date(c.date);
                const day = date.getDay(); // 0 = Domingo

                const value = c.value || 0;

                if (date >= sundayThisWeek && date <= today) {
                    actual[day] += value;
                    actual[day] = Math.round(actual[day] * 100) / 100;
                } else if (date >= sundayLastWeek && date <= saturdayLastWeek) {
                    last[day] += value;
                    last[day] = Math.round(last[day] * 100) / 100;
                }
                });

                return { actual, last };
            }
        },
    },
    computed: {
        areaChart() {
            const data = this.selectDate(this.select);

            return {
                series: [
                {
                    name: `this ${this.select}`,
                    data: data.actual,
                },
                {
                    name: `last ${this.select}`,
                    data: data.last,
                },
                ],
            };
        },
        areachartOptions() {
            return {
                chart: {
                    height: "100%",
                    fontFamily: "inherit",
                    foreColor: "#adb0bb",
                    fontSize: "12px",
                    offsetX: 0,
                    offsetY: 10,
                    animations: { speed: 250 },
                    toolbar: {
                        show: true,
                        offsetX: 0,
                        offsetY: 0,
                        tools: {
                            download: true,
                            selection: true,
                            zoom: false, // ver depois
                            zoomin: true,
                            zoomout: true,
                            pan: false, // ver depois
                        },
                        export: {
                            scale: undefined,
                            width: undefined,
                            csv: {
                                filename: undefined,
                                columnDelimiter: ",",
                                headerCategory: "category",
                                headerValue: "value",
                                categoryFormatter(x) {
                                return new Date(x).toDateString()
                            }
                            },
                            svg: {
                                filename: undefined,
                            },
                            png: {
                                filename: undefined,
                            },
                        },
                        autoSelected: "zoom",
                    },
                },
                colors: ["#00A1FF", "#adb0bb"],
                dataLabels: { enabled: false },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 0,
                        inverseColors: false,
                        opacityFrom: 0.4,
                        opacity: 0.3,
                        stops: [100],
                    },
                },
                grid: {
                    show: true,
                    strokeDashArray: 3,
                    borderColor: "#90A4AE50",
                },
                stroke: {
                    curve: "smooth",
                    width: 2,
                },
                xaxis: {
                    type: "date",
                    categories: this.labels[this.select],
                    labels: {
                    style: {
                        colors: "#adb0bb",
                        fontSize: "12px",
                        fontFamily: "inherit",
                    },
                },
            },
            yaxis: {
                tickAmount: 3,
            },
            legend: { show: false },
            tooltip: { theme: "dark" },
        };
    },
  },
};
</script>

<style>
.teste {
    height: 100%;
    width: 100%;
}
</style>
