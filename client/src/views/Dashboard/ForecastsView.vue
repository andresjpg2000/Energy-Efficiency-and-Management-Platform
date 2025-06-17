<template>
    <v-container class="py-6 px-6">
        <v-row justify="space-between" align="center" class="mb-4">
            <h1 class="text-h5 pl-2">Forecasts</h1>
        </v-row>

        <v-card class="pa-6">
            <!-- Energy score and progress bars -->
            <v-row>
                <v-col>
                    <div id="energy-score-header">
                        <h2 class="text-h6 mb-3">
                            <v-icon @click="openInfo = true" class="mr-2">mdi-information</v-icon>
                            Energy Score
                        </h2>
                    </div>
                    <v-row>
                        <v-col class="d-flex flex-column align-center">
                            <apexchart type="radialBar" :options="options" :series="series" width="350"></apexchart>
                            <v-list class="w-75">
                                <v-list-item class="px-0">
                                    <v-list-item-title>Consumption</v-list-item-title>
                                    <v-progress-linear v-model="consumptionRatio" height="20"
                                        :color="consumptionRatio >= 100 ? 'error' : (consumptionRatio > 65 ? 'warning' : 'success')">
                                        <strong>{{ Math.ceil(consumptionRatio) }}%</strong>
                                    </v-progress-linear>
                                    <div class="d-flex flex-row justify-space-between mt-2">
                                        <v-list-item-subtitle>{{ consumptionStore.getConsumptionThisMonth.toFixed(4)
                                        }}
                                            kWh</v-list-item-subtitle>
                                        <v-list-item-subtitle>{{ consumptionTarget }} kWh</v-list-item-subtitle>
                                    </div>
                                </v-list-item>
                                <v-list-item class="px-0">
                                    <v-list-item-title>Production</v-list-item-title>
                                    <v-progress-linear v-model="productionRatio" height="20"
                                        :color="productionRatio >= 100 ? 'success' : (productionRatio > 65 ? 'warning' : 'error')">
                                        <strong>{{ Math.ceil(productionRatio) }}%</strong>
                                    </v-progress-linear>
                                    <div class="d-flex flex-row justify-space-between mt-2">
                                        <v-list-item-subtitle>{{ productionsStore.getProductionThisMonth.toFixed(4) }}
                                            kWh</v-list-item-subtitle>
                                        <v-list-item-subtitle>{{ productionTarget }} kWh</v-list-item-subtitle>
                                    </div>
                                </v-list-item>
                                <v-list-item class="px-0">
                                    <v-list-item-title>Energy Cost</v-list-item-title>
                                    <v-progress-linear v-model="costRatio" height="20"
                                        :color="costRatio >= 100 ? 'error' : (costRatio > 65 ? 'warning' : 'success')">
                                        <strong>{{ Math.ceil(costRatio) }}%</strong>
                                    </v-progress-linear>
                                    <div class="d-flex flex-row justify-space-between mt-2">
                                        <v-list-item-subtitle>{{ energyCost }} €</v-list-item-subtitle>
                                        <v-list-item-subtitle>{{ costTarget }} €</v-list-item-subtitle>
                                    </div>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col class="d-flex flex-column justify-space-between">
                    <div>
                        <h2 class=" text-h6 mb-3">
                            <v-icon class="mr-2">mdi-chart-line</v-icon>
                            Cost Predictions
                        </h2>
                    </div>
                    <h1 class="font-weight-bold align-self-center">
                        {{ costPrediction }} €
                    </h1>
                    <div>
                        <h2>
                            This prediction is based on your current consumption and production rates, adjusted
                            for the number of days left in the month.
                        </h2>
                    </div>
                </v-col>
            </v-row>
            <!-- Smart recommendations -->
            <v-row>
                <v-col cols="12" class="mt-4">
                    <h2 class="text-h6 mb-3">
                        <v-icon class="mr-2">mdi-lightbulb</v-icon>
                        Smart Recommendations
                    </h2>

                    <v-expansion-panels v-if="smartRecommendations.length > 0" multiple>
                        <v-expansion-panel v-for="(rec, index) in smartRecommendations" :key="index" class="mb-2">
                            <v-expansion-panel-title>
                                <v-row no-gutters align="center">
                                    <v-col cols="auto">
                                        <v-icon :color="getRecommendationColor[rec.type]" class="mr-3">
                                            {{ rec.icon }}
                                        </v-icon>
                                    </v-col>
                                    <v-col>
                                        <span class="font-weight-bold">{{ rec.title }}</span>
                                    </v-col>
                                    <v-col cols="auto" v-if="rec.potentialSaving">
                                        <v-chip :color="rec.type === 'success' ? 'green' : 'primary'" size="small"
                                            variant="outlined">
                                            Save: {{ rec.potentialSaving }}
                                        </v-chip>
                                    </v-col>
                                    <v-col cols="auto" v-if="rec.potentialGain">
                                        <v-chip color="success" size="small" variant="outlined">
                                            Gain: {{ rec.potentialGain }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-title>

                            <v-expansion-panel-text>
                                <p class="mb-3">{{ rec.message }}</p>

                                <v-list density="compact">
                                    <v-list-item v-for="(action, actionIndex) in rec.actions" :key="actionIndex"
                                        class="pl-0">
                                        <template v-slot:prepend>
                                            <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
                                        </template>
                                        <v-list-item-title class="text-body-2">
                                            {{ action }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <v-card v-else class="pa-4 text-center">
                        <v-icon size="64" color="success" class="mb-2">mdi-check-circle</v-icon>
                        <h3>Perfect Energy Management!</h3>
                        <p class="text-body-2 mt-2">
                            You're meeting all your energy targets. Keep up the great work!
                        </p>
                    </v-card>
                </v-col>
            </v-row>

        </v-card>
    </v-container>
    <v-dialog v-model="openInfo" max-width="500px">
        <v-card>
            <v-card-title class="headline">Energy Score Calculation</v-card-title>
            <v-card-subtitle>
                The energy score is calculated based on the following factors:
            </v-card-subtitle>
            <v-card-text>
                <v-list>
                    <v-list-item class="px-0">
                        <v-list-item-title>Consumption</v-list-item-title>
                        <v-list-item-subtitle>Lower consumption leads to a higher score.</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item class="px-0">
                        <v-list-item-title>Production</v-list-item-title>
                        <v-list-item-subtitle>Higher production increases the score.</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item class="px-0">
                        <v-list-item-title>Cost</v-list-item-title>
                        <v-list-item-subtitle>Lower costs contribute positively to the
                            score.</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="openInfo = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import ApexCharts from 'vue3-apexcharts';

import { useConsumptionStore } from '../../stores/consumptionStore.js';
import { useProductionsStore } from '../../stores/productionsStore.js';
import { useHousingsStore } from '@/stores/housings.js';
import { useSuppliersStore } from '@/stores/suppliers.js';
import { useAuthStore } from '@/stores/auth.js';

export default {
    name: 'ForecastsView',
    components: {
        apexchart: ApexCharts,
    },
    data() {
        return {
            consumptionStore: useConsumptionStore(),
            productionsStore: useProductionsStore(),
            housingsStore: useHousingsStore(),
            suppliersStore: useSuppliersStore(),
            authStore: useAuthStore(),
            options: {
                chart: {
                    height: 150,
                    type: 'radialBar',
                },
                labels: ['Energy Score'],
                fill: {
                    type: "gradient",
                    gradient: {
                        shade: "dark",
                        type: "vertical",
                        gradientToColors: ["#00FF00"], // Green for high scores
                        stops: [0, 100]
                    }
                },
            },
            openInfo: false,
        };
    },
    computed: {
        dayOfMonth() {
            return new Date().getDate();
        },
        currentMonth() {
            return new Date().getMonth();
        },
        currentMonthDaysCount() {
            return new Date(new Date().getFullYear(), this.currentMonth + 1, 0).getDate();
        },
        supplierCost() {
            // This will return the cost per kWh for the selected housing's supplier
            return this.suppliersStore.getSupplierCostByID(
                this.housingsStore.getSelectedHousing?.id_supplier
            ) || 0;
        },
        series() {
            const consumption = this.consumptionStore.getConsumptionThisMonth;
            const production = this.productionsStore.getProductionThisMonth;
            const cost = (consumption - production) * this.supplierCost;

            return [this.calculateEnergyScore({ consumption, production, cost })];
        },
        notificationSettings() {
            if (this.authStore.user) {
                return JSON.parse(this.authStore.getUserNotificationSettings) || {
                    thresholds: {
                        consumption: 10,
                        production: 10,
                        cost: 10
                    },
                };
            } else {
                return {
                    thresholds: {
                        consumption: 10,
                        production: 10,
                        cost: 10
                    },
                };
            }
        },
        consumptionTarget() {
            return parseFloat((this.notificationSettings.thresholds?.consumption * 24 * 30).toFixed(2)) || "Not Set";
        },
        productionTarget() {
            return parseFloat((this.notificationSettings.thresholds?.production * 24 * parseFloat(this.currentMonthDaysCount)).toFixed(2)) || "Not Set";
        },
        costTarget() {
            return (this.notificationSettings.thresholds?.cost.toFixed(2)) || "Not Set";
        },
        consumptionRatio() {
            const consumption = this.consumptionStore.getConsumptionThisMonth || 0;
            const target = this.consumptionTarget || 10;
            return Math.min(((consumption / target) * 100), 100);
        },
        productionRatio() {
            const production = this.productionsStore.getProductionThisMonth || 0;
            const target = this.productionTarget;
            return Math.min(((production / target) * 100), 100);
        },
        costRatio() {
            const cost = (this.supplierCost *
                (this.consumptionStore.getConsumptionThisMonth -
                    this.productionsStore.getProductionThisMonth)).toFixed(4);
            const target = this.notificationSettings.thresholds?.cost || 10;
            return Math.max(Math.min(((cost / target) * 100), 100), 0);
        },
        energyCost() {
            return (this.supplierCost *
                (this.consumptionStore.getConsumptionThisMonth -
                    this.productionsStore.getProductionThisMonth)).toFixed(2);
        },
        smartRecommendations() {
            const recommendations = [];
            const consumption = this.consumptionStore.getConsumptionThisMonth || 0;
            const production = this.productionsStore.getProductionThisMonth || 0;
            const cost = (this.supplierCost * (consumption - production));

            const consumptionTarget = this.consumptionTarget || 10;
            const productionTarget = this.productionTarget || 10;
            const costTarget = this.notificationSettings.thresholds?.cost || 10;

            // Calculate differences
            const consumptionOverage = consumption - (consumptionTarget / this.currentMonthDaysCount) * this.dayOfMonth;
            const productionShortfall = (productionTarget / this.currentMonthDaysCount) * this.dayOfMonth - production;
            const costOverage = cost - costTarget;

            // CONSUMPTION RECOMMENDATIONS
            if (consumptionOverage > 0) {
                const percentageOver = ((consumptionOverage / consumptionTarget) * 100).toFixed(1);
                const dailyReduction = (consumptionOverage / this.currentMonthDaysCount).toFixed(2);

                if (percentageOver <= 10) {
                    recommendations.push({
                        type: 'warning',
                        icon: 'mdi-lightbulb-outline',
                        title: 'Minor Consumption Adjustment Needed',
                        message: `You're ${percentageOver}% over your consumption target. Try reducing usage by ${dailyReduction} kWh daily.`,
                        actions: [
                            'Switch to LED bulbs if you haven\'t already',
                            'Unplug devices when not in use',
                            'Use natural light during the day'
                        ],
                        potentialSaving: `${(consumptionOverage * this.supplierCost).toFixed(2)}€/month`
                    });
                } else if (percentageOver <= 25) {
                    recommendations.push({
                        type: 'warning',
                        icon: 'mdi-alert',
                        title: 'Significant Overconsumption',
                        message: `You're ${percentageOver}% over target (${consumptionOverage.toFixed(2)} kWh excess). Focus on high-energy appliances.`,
                        actions: [
                            'Check thermostat settings - lower by 2°C',
                            'Run dishwasher/washing machine with full loads only',
                            'Consider upgrading old appliances'
                        ],
                        potentialSaving: `${(consumptionOverage * this.supplierCost).toFixed(2)}€/month`
                    });
                } else {
                    recommendations.push({
                        type: 'error',
                        icon: 'mdi-alert-octagon',
                        title: 'Critical Overconsumption',
                        message: `You're ${percentageOver}% over target! This requires immediate action.`,
                        actions: [
                            'Audit all electrical appliances immediately',
                            'Consider professional energy assessment',
                            'Check for faulty equipment or insulation issues'
                        ],
                        potentialSaving: `${(consumptionOverage * this.supplierCost).toFixed(2)}€/month`
                    });
                }
            }

            // PRODUCTION RECOMMENDATIONS
            if (production > 0 && productionShortfall > 0) {
                const percentageShort = ((productionShortfall / productionTarget) * 100).toFixed(1);

                recommendations.push({
                    type: 'info',
                    icon: 'mdi-solar-panel',
                    title: 'Solar Production Below Target',
                    message: `Your solar production is ${percentageShort}% below target (${productionShortfall.toFixed(2)} kWh short).`,
                    actions: [
                        'Clean solar panels - dust reduces efficiency by 15-25%',
                        'Check for shading from trees or new structures',
                    ],
                    potentialGain: `${(productionShortfall * this.supplierCost).toFixed(2)}€/month in savings`
                });
            }

            // COST OPTIMIZATION
            if (costOverage > 0) {
                const netUsage = consumption - production;
                recommendations.push({
                    type: 'success',
                    icon: 'mdi-cash-multiple',
                    title: 'Cost Optimization Strategy',
                    message: `You're ${costOverage.toFixed(2)}€ over budget. Focus on timing and efficiency.`,
                    actions: [
                        netUsage > 0 ? 'Shift high-energy tasks to daylight hours when you are producing more energy' : '',
                        'Use washing machine/dishwasher during off-peak hours',
                    ].filter(Boolean),
                    potentialSaving: `${costOverage.toFixed(2)}€/month`
                });
            }

            // POSITIVE REINFORCEMENT
            if (consumption <= consumptionTarget && cost <= costTarget) {
                const savingsAmount = (costTarget - cost).toFixed(2);
                recommendations.push({
                    type: 'success',
                    icon: 'mdi-check-circle',
                    title: 'Excellent Energy Management!',
                    message: `You're on track with your energy goals and saving ${savingsAmount}€ this month.`,
                    actions: [
                        'Keep up the current habits',
                        'Consider lowering your targets for even more savings',
                        'Share your success strategies with friends'
                    ]
                });
            }

            if ([11, 0, 1].includes(this.currentMonth)) { // Winter months
                recommendations.push({
                    type: 'info',
                    icon: 'mdi-snowflake',
                    title: 'Winter Energy Tips',
                    message: 'Winter typically increases energy consumption by 20-40%.',
                    actions: [
                        'Set heating to 18-20°C instead of higher temperatures',
                        'Use thick curtains to retain heat',
                        'Seal gaps around windows and doors'
                    ],
                    potentialSaving: '15-30€/month during winter'
                });
            }

            return recommendations;
        },
        getRecommendationColor() {
            return {
                success: 'green',
                warning: 'orange',
                error: 'red',
                info: 'blue'
            };
        },
        costPrediction() {
            const today = new Date();
            const dayOfMonth = today.getDate();
            const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

            const consumptionSoFar = this.consumptionStore.getConsumptionThisMonth || 0;
            const productionSoFar = this.productionsStore.getProductionThisMonth || 0;
            if (dayOfMonth === 0 || totalDaysInMonth === 0) {
                return "0.00";
            }
            const projectedConsumption = (consumptionSoFar / dayOfMonth) * totalDaysInMonth;
            const projectedProduction = (productionSoFar / dayOfMonth) * totalDaysInMonth;

            const projectedCost = (projectedConsumption - projectedProduction) * this.supplierCost;

            // Make sure cost is not negative and fixed to 2 decimals
            return Math.max(0, projectedCost).toFixed(2);
        },
    },
    methods: {
        calculateEnergyScore({
            consumption,
            production,
            cost,
        }) {
            const maxCost = 500;
            let score = 0;
            let weightSum = 0;

            if (consumption === 0 && production === 0 && cost === 0) {
                return 100;
            }

            if (consumption != 0) {
                const netConsumption = Math.max(consumption - production, 0);
                const consumptionScore = 100 * (1 - netConsumption / 1000);
                score += Math.max(consumptionScore, 0);
                weightSum += 1;
            }

            if (production != 0 && !(consumption != 0)) {
                const productionScore = consumption > 0
                    ? 100 * Math.min(production / consumption, 1)
                    : 100;
                score += productionScore;
                weightSum += 1;
            }

            if (cost != 0) {
                const costScore = 100 * (1 - cost / maxCost);
                score += Math.max(costScore, 0);
                weightSum += 1;
            }

            return weightSum > 0 ? Math.min(Math.round(score / weightSum), 100) : null;
        }

    },
};
</script>

<style scoped>
.v-list-item-title {
    font-weight: bold;
    text-align: left;
}
</style>
