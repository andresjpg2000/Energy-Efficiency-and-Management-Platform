<template>
    <v-card class="rounded-xl teste">
        <v-card-item class="h-100">
            <div class="h-100 d-flex justify-space-between align-center mb-mb-0 mb-3">
                <v-card-title class="text-h5 ">Sales Profit</v-card-title>
                <v-chip-group mandatory class="chips" v-model="select" >
                    <v-chip rounded="lg" value="year" >year</v-chip>
                    <v-chip rounded="lg" value="month" >month</v-chip>
                    <v-chip rounded="lg" value="today">today</v-chip>
                </v-chip-group class="chips"  color="primary">
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

            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            rawData: {
                year: {
                    thisYear: [25, 25, 10, 10, 45, 45, 75, 70, 35, 12, 32, 32],
                    lastYear: [50, 50, 25, 20, 20, 20, 35, 35, 60, 30, 20, 20]
                },
                month: {
                    thisYear: [25, 25, 20, 10, 45, 54, 65, 70, 35, 12, 32, 32],
                    lastYear: [50, 50, 25, 20, 20, 20, 35, 35, 60, 30, 20, 20]
                },
                today: {
                    thisYear: [25, 25, 10, 10, 65, 45, 15, 10, 15, 12, 32, 32],
                    lastYear: [50, 50, 25, 20, 30, 20, 35, 35, 10, 30, 20, 20]
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
                animations: { speed: 500 },
                toolbar: { show: false }
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
                categories: this.labels,
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