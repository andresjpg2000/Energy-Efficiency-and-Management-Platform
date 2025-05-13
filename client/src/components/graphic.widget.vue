<template>
    <v-card class="rounded-xl teste">
        <v-card-item class="h-100">
            <div class="h-100 d-flex justify-space-between align-center mb-mb-0 mb-3">
                <v-card-title class="text-h5  text-md-body2">Energy Consumption</v-card-title>
                <!-- <v-select class="select" 
                    v-model="select"
                    :items="['year', 'month', 'week']"
                    variant="underlined"
                    color="primary"
                    hide-details
                    single-line
                    dense></v-select> -->
                <v-chip-group mandatory class="chips" v-model="select" >
                    <v-chip rounded="lg" value="year" >year</v-chip>
                    <v-chip rounded="lg" value="month" >last month</v-chip>
                    <v-chip rounded="lg" value="week">last week</v-chip>
                </v-chip-group>
            </div>
                <apexchart type="area" height="100%" :options="areachartOptions" :series="areaChart.series"></apexchart>
        </v-card-item>
    </v-card>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            select: 'year',

            labels: {
                year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                month: ['1', '2','3','4','5','6','7','8', '9','10','11','12','13','14','15','16','17','18','19','20','21','22','23', '24','25','26','27','28','29','30'],
                week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"]  
            } ,
            rawData: {
                year: {
                    thisYear: [25, 25, 10, 10, 45, 45, 75, 70, 35, 12, 32, 32],
                    lastYear: [50, 50, 25, 20, 20, 20, 35, 35, 60, 30, 20, 20]
                },
                month: {
                    thisYear: [25, 25, 20, 10, 45, 54, 65, 70, 35, 12, 32, 32, 25, 25, 20, 10, 45, 54, 65, 70, 35, 12, 32, 32, 65, 70, 35, 12, 32, 32],
                    lastYear: [50, 50, 25, 20, 20, 20, 35, 35, 60, 30, 20, 20, 25, 25, 20, 10, 45, 54, 65, 70, 35, 12, 32, 32, 65, 70, 35, 12, 32, 32]
                },
                week: {
                    thisYear: [11, 15, 16, 18, 22, 66, 12],
                    lastYear: [11, 19, 17, 14, 20, 20, 35]
                },
            },
        };
    },
    computed: {
        areaChart() {
            const data = this.rawData[this.select];

            return {
            series: [
                {
                name: 'This Year',
                data: data.thisYear
                },
                {
                name: 'Last Year',
                data: data.lastYear
                }
            ]
            };
        },
        areachartOptions() {
            return {
            chart: {
                height: '100%',
                fontFamily: 'inherit',
                foreColor: '#adb0bb',
                fontSize: '12px',
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
            colors: ['#00A1FF', '#adb0bb'],
            dataLabels: { enabled: false },
            fill: {
                type: 'gradient',
                gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.4,
                opacity: 0.3,
                stops: [100]
                }
            },
            grid: {
                show: true,
                strokeDashArray: 3,
                borderColor: '#90A4AE50'
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                type: 'date',
                categories: this.labels[this.select],
                labels: {
                    style: {
                        colors: '#adb0bb',
                        fontSize: '12px',
                        fontFamily: 'inherit'
                    }
                },
            },
            yaxis: {
                tickAmount: 3
            },
            legend: { show: false },
            tooltip: { theme: 'dark' }
            };
        },
    },
}

</script>

<style>
    .teste {
        height: 100%;
        width: 100%;
    }
   
</style>