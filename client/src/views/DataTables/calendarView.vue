<template>
  <div>
    <v-sheet class="d-flex rounded-t-lg" height="54" tile>
      <v-select
        v-model="type"
        :items="types"
        class="ma-2 px-2"
        density="compact"
        label="View Mode"
        variant="outlined"
        hide-details
      />
    </v-sheet>
    <v-sheet>
      <v-calendar
        ref="calendar"
        class="px-2 pb-1"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
      />
    </v-sheet>
  </div>
</template>

<script>
import { VCalendar } from 'vuetify/labs/VCalendar';
import { useDate } from 'vuetify';
import { useProductionsStore } from '@/stores/productionsStore.js';
import { useConsumptionStore } from '@/stores/consumptionStore.js';
import { useGivenEnergiesStore } from '@/stores/givenEnergiesStore.js';

export default {
  name: 'CalendarView',
  components: { VCalendar },
  data: () => ({
    type: 'month',
    types: ['month', 'week', 'day'],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    value: [new Date()],
    events: [],
  }),
  async mounted () {
    const adapter = useDate();
    const start = adapter.startOfDay(adapter.startOfMonth(new Date()));
    const end = adapter.endOfDay(adapter.endOfMonth(new Date()));

    await this.loadEnergyEvents(start, end);
  },
  methods: {
    async loadEnergyEvents (start, end) {
      const productionsStore = useProductionsStore();
      const consumptionStore = useConsumptionStore();
      const givenEnergiesStore = useGivenEnergiesStore();

      await productionsStore.fetchProductions();
      await consumptionStore.fetchConsumption();
      await givenEnergiesStore.fetchGivenEnergies();

      const prodEvents = productionsStore.data.map(p => ({
        title: `${p.value} Kw (Production)`,
        start: new Date(p.date),
        end: new Date(new Date(p.date).getTime() + 3600000),
        color: '#2196f3'
      }));

      const consEvents = consumptionStore.data.map(c => ({
        title: `${c.value} Kw (Consumption)`,
        start: new Date(c.date),
        end: new Date(new Date(c.date).getTime() + 3600000),
        color: '#e53935'
      }));

      const givenEvents = givenEnergiesStore.data.map(g => ({
        title: `${g.value} Kw (Given)`,
        start: new Date(g.date),
        end: new Date(new Date(g.date).getTime() + 3600000),
        color: '#43a047'
      }));

      this.events = [...prodEvents, ...consEvents, ...givenEvents];
    }
  }
};
</script>

<style scoped>
</style>
