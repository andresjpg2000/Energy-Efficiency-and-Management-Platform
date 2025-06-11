<template>
    <v-card>
        <div id="chart" class="pt-1 h-100">
            
            <v-chip-group mandatory class="chips mx-12 h-100" v-model="select" >
                    <v-chip @click="datePicker=null;" rounded="lg" value="today" >Today info</v-chip>
                    <v-chip @click="dialog = !dialog" rounded="lg" value="" >{{ datePicker ? formatDate(datePicker) : "📅 Pick a date" }}</v-chip>
            </v-chip-group>
                <apexchart type="bar" height="273" class="graphic" :options="chartOptions" :series="areaChartData.series"></apexchart>
        </div>
    </v-card>
    <v-dialog
        v-model="dialog"
        width="auto"
        height="auto"
        persistent
    >
      <v-date-picker class="rounded-b-0" @update:model-value="console.log(new Date(datePicker).toISOString()); dialog=false;select='newDate'" v-model="datePicker"></v-date-picker>
      <v-btn @click="dialog=false;select='today';datePicker=null" variant="flat" class="rounded-t-0">cancel</v-btn>
    </v-dialog>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { useConsumptionStore } from '@/stores/consumptionStore';
import { useProductionsStore } from '@/stores/productionsStore';
import { useGivenEnergiesStore } from '@/stores/givenEnergiesStore';

export default {
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            productionStore: useProductionsStore(),
            consumptionStore: useConsumptionStore(),
            givenEnergiesStore: useGivenEnergiesStore(),
            datePicker: null,
            select: 'today',
            dialog: false,
            areaChartData: {
                series: []
            },
        };
    },
    methods: {
        async updateChart() {
            const [cons, prod, given] = await Promise.all([
                this.dataConsumption(this.select),
                this.dataProduction(this.select),
                this.dataGivenEnergies(this.select)
            ]);

            this.areaChartData.series = [
                { name: 'Energy Consumption', data: cons },
                { name: 'Energy Production', data: prod },
                { name: 'Given Energy', data: given },
            ];
        },
        formatDate(date) {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        },
        async dataProduction(select) {
            let allHoursData = Array(24).fill(0);
            let productions = [];

            if (select === 'today') {
                productions = this.productionStore.getAllProductionToday;
            } else if (select === 'newDate') {
                productions = await this.productionStore.fetchProductionsByDate(this.datePicker);
            }
            productions.forEach((prod) => {
                    const hour = new Date(prod.date).getHours();
                    allHoursData[hour] += prod.value;
                });
                return allHoursData;
        },
        async dataConsumption(select) {
            let allHoursData = Array(24).fill(0);
            let consumptions = [];

            if (select === 'today') {
                consumptions = this.consumptionStore.getConsumptionToday;
            } else if (select === 'newDate') {
                consumptions = await this.consumptionStore.fetchConsumptionByDate(this.datePicker);
            }
            consumptions.forEach((cons) => {
                const hour = new Date(cons.date).getHours();
                allHoursData[hour] += cons.value;
            });
            return allHoursData;
        },
        async dataGivenEnergies(select) {
            let allHoursData = Array(24).fill(0);
            let givenEnergies = [];
            
            if (select === 'today') {
                givenEnergies = this.givenEnergiesStore.getAllGivenEnergyToday;
            } else if (select === 'newDate') {
                givenEnergies = await this.givenEnergiesStore.fetchGivenEnergiesByDate(this.datePicker);    
            }

            givenEnergies.forEach((prod) => {
                const hour = new Date(prod.date).getHours();
                allHoursData[hour] += prod.value;
            });
            return allHoursData;  
        },
    },
    mounted() {
        
        this.updateChart();
    },
    watch: {
        select: 'updateChart',
    },
    computed: {
        chartOptions() {
            return {
                    chart: {
                    type: 'bar',
                    height: 320,
                    animations: { speed: 250 },
                    toolbar: {
                        show: true,
                        export: {
                            scale: undefined,
                            width: undefined,
                        csv: {
                            filename: undefined,
                            columnDelimiter: ',',
                            headerCategory: 'category',
                            headerValue: 'value',
                            categoryFormatter(x) {
                                return new Date(x).toDateString()
                            }
                        },
                        svg: {
                            filename: undefined,
                        },
                        png: {
                            filename: undefined,
                        }
                        },
                        autoSelected: 'zoom' 
                    },
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            borderRadius: 5,
                            borderRadiusApplication: 'end'
                        },
                    },
                    colors: ['#FF4560', '#008FFB', '#11E396'],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 2,
                    },
                    xaxis: {
                    categories: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
                    },
                    yaxis: {
                        labels: {
                            formatter: (val) => Number(val).toFixed(2)
                        },
                        title: {
                            text: 'kW'
                        }
                    },
                    fill: {
                    opacity: 1
                    },
                    tooltip: {
                    y: {
                        formatter: function (val) {
                        return val.toFixed(2) + " kw"
                        }
                    }
                },
            };
        },
    },
}

</script>

<style>
.graphic {
    overflow: hidden !important;
}
     
   
</style>