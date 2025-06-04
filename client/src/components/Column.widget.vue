<template>
    <v-card>
        <div id="chart" class="pt-1 h-100">
            
            <v-chip-group mandatory class="chips mx-12 h-100" v-model="select" >
                    <v-chip @click="datePicker=null" rounded="lg" value="today" >Today info</v-chip>
                    <v-chip @click="dialog = !dialog" rounded="lg" value="" >{{ datePicker ? formatDate(datePicker) : "📅 Pick a date" }}</v-chip>
            </v-chip-group>
            <apexchart type="bar" height="273" class="graphic" :options="chartOptions" :series="areaChart.series"></apexchart>
        </div>
    </v-card>
    <v-dialog
        v-model="dialog"
        width="auto"
        height="auto"
        persistent
    >
      <v-date-picker class="rounded-b-0" @update:model-value="console.log(datePicker); dialog=false;" v-model="datePicker"></v-date-picker>
      <v-btn @click="dialog=false;select='today';datePicker=null" variant="flat" class="rounded-t-0">cancel</v-btn>
    </v-dialog>
    
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            datePicker: null,
            select: 'today',
            dialog: false,
        };
    },
    methods: {
        formatDate(date) {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            });
        }
    },
    computed: {
        areaChart() {
            return {
                series: [{
                    name: 'Energy Consumption',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
                }, {
                    name: 'Energy Production',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
                }, {
                    name: 'Given Energy',
                    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
                }],
            };
        },
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
                    dataLabels: {
                    enabled: false
                    },
                    stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                    },
                    xaxis: {
                    categories: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
                    },
                    yaxis: {
                    title: {
                        text: 'Kw/h'
                    }
                    },
                    fill: {
                    opacity: 1
                    },
                    tooltip: {
                    y: {
                        formatter: function (val) {
                        return "$ " + val + " thousands"
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