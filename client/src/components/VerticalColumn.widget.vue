<template>
    <v-card>
        <v-card class="rounded-xl teste">
        <v-card-item class="h-100">
            <div class="h-100 d-flex justify-space-between align-center mb-mb-0 mb-3">
                <v-card-title class="text-h5  text-md-body2">Equipaments Information</v-card-title>
                <!-- <v-select class="select" 
                    v-model="select"
                    :items="['year', 'month', 'week']"
                    variant="underlined"
                    color="primary"
                    hide-details
                    single-line
                    dense></v-select> -->
                <v-chip-group mandatory class="chips" v-model="select" >
                    <v-chip rounded="lg" value="today" >today</v-chip>
                    <v-chip rounded="lg" value="week" >week</v-chip>
                    <v-chip rounded="lg" value="month">month</v-chip>
                </v-chip-group>
            </div>
                <apexchart type="bar" height="245" :options="chartOptions" :series="Chart.series"></apexchart>
        </v-card-item>
    </v-card>
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
            select: 'today',
        };
    },
    computed: {
        Chart() {
            return {
                series: [
                    {
                    name: 'Production',
                    data: [48000, 50000, 40000, 65000, 25000]
                    },
                    {
                    name: 'Given',
                    data: [20000, 40000, 25000, 10000, 12000]
                    }
                ],
            };
        },
        chartOptions() {
            return {
                chart: {
                type: 'bar',
                height: 320,
                stacked: true,
                animations: { speed: 250 }
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                dataLabels: {
                    formatter: (val) => val / 1000 + 'K'
                },
                plotOptions: {
                    bar: {
                    horizontal: true
                    }
                },
                xaxis: {
                    categories: [
                    'Panel Solar 1',
                    'Panel Solar 2',
                    'Panel Solar 3',
                    'Panel Solar 4',
                    'Panel Solar 5',
                    ],
                    labels: {
                    formatter: (val) => val / 1000 + 'Kw'
                    }
                },
                fill: {
                    opacity: 1
                },
                colors: ['#008FFB', '#11E396'],
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                }
            }
        }
    },
}

</script>

<style>
    .teste {
        height: 100%;
        width: 100%;
    }
    .select {
        width: 2rem;
    }
    .chips {
        margin-right: 2rem;
    }
     
   
</style>