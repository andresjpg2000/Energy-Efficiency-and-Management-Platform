<template>
    <v-card>
        <v-card class="rounded-xl teste">
        <v-card-item class="h-100">
            <div class="h-100 d-flex justify-space-between align-center mb-mb-0 mb-3">
                <v-card-title class="text-h5  text-md-body2">Equipaments Information</v-card-title>
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
import { useEquipmentsStore } from '@/stores/equipmentsStore';
import { useProductionsStore } from '@/stores/productionsStore';
import { useGivenEnergiesStore } from '@/stores/givenEnergiesStore';
export default {
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            equipmentsStore: useEquipmentsStore(),
            productionsStore: useProductionsStore(),
            givenEnergiesStore: useGivenEnergiesStore(),
            select: 'month', // default selection
        };
    },
    methods: {
        makeGivenEnergiesData(date) {
            let data = Array(this.equipmentsStore.equipments.length).fill(0);

            if (date == 'today') {
                const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
                this.equipmentsStore.equipments.forEach((eq,i) => {
                    data[i] = this.givenEnergiesStore.data
                         .filter((c) => c.id_equipment === eq.id_equipment && c.date.startsWith(today))
                         .reduce((total, c) => total + c.value, 0);
                    
                    data[i] = Math.round(data[i] * 100) / 100; // round to 2 decimal places      
                });
            } else if (date === 'week') {
                const startOfWeek = new Date();
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Get the start of the week (Sunday)
                const end = new Date();

                this.equipmentsStore.equipments.forEach((eq,i) => {
                    data[i] = this.givenEnergiesStore.data
                        .filter((c) => c.id_equipment === eq.id_equipment && new Date(c.date) >= startOfWeek && new Date(c.date) <= end)
                        .reduce((total, c) => total + c.value, 0);
                    data[i] = Math.round(data[i] * 100) / 100; // round to 2 decimal places
                });
            } else if (date === 'month') {
                const startOfMonth = new Date();
                startOfMonth.setDate(1); // Get the start of the month
                const end = new Date();
                
                this.equipmentsStore.equipments.forEach((eq,i) => {
                    data[i] = this.givenEnergiesStore.data
                        .filter((c) => c.id_equipment === eq.id_equipment && new Date(c.date) >= startOfMonth && new Date(c.date) <= end)
                        .reduce((total, c) => total + c.value, 0);
                    data[i] = Math.round(data[i] * 100) / 100; // round to 2 decimal places
                });
            }
            
            return data;
        },
        makeProductionData(date) {
            let data = Array(this.equipmentsStore.equipments.length).fill(0);

            if (date == 'today') {
                const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
                this.equipmentsStore.equipments.forEach((eq,i) => {
                    data[i] = this.productionsStore.data
                         .filter((c) => c.id_equipment === eq.id_equipment && c.date.startsWith(today))
                         .reduce((total, c) => total + c.value, 0);
                    data[i] = Math.round(data[i] * 100) / 100; // round to 2 decimal places      
                });
            } else if (date === 'week') {
                const startOfWeek = new Date();
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Get the start of the week (Sunday)
                const endOfWeek = new Date();
                endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay())); // Get the end of the week (Saturday)

                this.equipmentsStore.equipments.forEach((eq,i) => {
                    data[i] = this.productionsStore.data
                        .filter((c) => c.id_equipment === eq.id_equipment && new Date(c.date) >= startOfWeek && new Date(c.date) <= endOfWeek)
                        .reduce((total, c) => total + c.value, 0);
                    data[i] = Math.round(data[i] * 100) / 100; // round to 2 decimal places
                });
            } else if (date === 'month') {
                const startOfMonth = new Date();
                startOfMonth.setDate(1); // Get the start of the month
                const end = new Date();
                
                this.equipmentsStore.equipments.forEach((eq,i) => {
                    data[i] = this.givenEnergiesStore.data
                        .filter((c) => c.id_equipment === eq.id_equipment && new Date(c.date) >= startOfMonth && new Date(c.date) <= end)
                        .reduce((total, c) => total + c.value, 0);
                    data[i] = Math.round(data[i] * 100) / 100; // round to 2 decimal places
                });
            }
            
            return data;
        }
    },
    computed: {
        equipments(){
            let equipments = this.equipmentsStore.equipments.map((c) => c.name);
            
            if (equipments.length > 0) {
                return equipments;
            } else {
                return ['Panel Solar 1', 'Panel Solar 2', 'Panel Solar 3', 'Panel Solar 4', 'Panel Solar 5'];
            }    
        },
        Chart() {
            return {
                series: [
                    {
                    name: 'Production',
                    data: this.makeProductionData(this.select)
                    },
                    {
                    name: 'Given Energy',
                    data: this.makeGivenEnergiesData(this.select)
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
                
                plotOptions: {
                    bar: {
                    horizontal: true
                    }
                },
                xaxis: {
                    categories: this.equipments,
                    labels: {
                    formatter: (val) => val + 'Kw'
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