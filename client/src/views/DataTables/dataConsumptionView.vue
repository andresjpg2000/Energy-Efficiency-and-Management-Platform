<template>
  <v-container class="container">
    <v-row justify="space-between" class="mb-4 align-content-center">
      <h1 class="text-h5 pl-4">Consumption Data</h1>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="energies"
      :items-per-page="itemsPerPage"
      :items-length="totalItems"
      :loading="loading"
      :page="page"
      @update:options="onPageChange"
      class="elevation-1 styled-table"
      hover
    >
      <!-- SLOT: format date -->
      <template #item.date="{ item }">
        {{ new Date(item.date).toLocaleString('pt-PT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) }}
      </template>

      <!-- SLOT: format value -->
      <template #item.value="{ item }">
        {{ item.value.toFixed(2) }} kWh
      </template>

      <!-- SLOT: no data -->
      <template #no-data>
        <div class="text-center py-4 text-grey">No Data to Show.</div>
      </template>
      <!-- SLOT: DATE CHANGE -->
      <template v-slot:tfoot>
        <tr>
          <td>
            <v-date-input
              v-model="dateRange"
              class="ma-2 w-75"
              density="compact"
              label="Select data range"
              multiple="range"
            ></v-date-input>
          </td>
        </tr>
      </template>
    </v-data-table-server>
  </v-container>
</template>


<script>
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useConsumptionStore } from '@/stores/consumptionStore';

    export default {
        components: {
            VDateInput,
        },
        data() {
            return {
                consumptionStore: useConsumptionStore(),
                headers: [
                    { title: 'Value', value: 'value', align: "start"},
                    { title: 'Date', value: 'date', align: "end" },
                ],
                energies: [],
                itemsPerPage: 10,
                totalItems: 0,
                page: 1,
                loading: false,
                dateRange: null,
                startDate: null,
                endDate: null,
            }
        },
      methods: {
        async Efetch() {
          this.loading = true;

          try {
            const data = await this.consumptionStore.fetchConsumptionByDate(
                this.startDate,
                this.endDate,
                this.page,
                this.itemsPerPage,
            );
            
            this.energies = data.data.consumptions;
            this.totalItems = data.pagination.total;
          } catch (error) {
            this.energies = [];
            this.totalItems = 0;
          } finally {
            this.loading = false;
          }
        },
        async onPageChange(options) {
          this.loading = true;
          this.page = options.page;
          this.itemsPerPage = options.itemsPerPage;
          await this.Efetch();
          this.loading = false;
        },
        async changeEquipments() {
          if (this.equipment === null) {
            this.houseId = this.houseStore.selectedHousingId;
          }else {
            this.houseId = null; // Reset houseId when a specific equipment is selected
          }
          this.page = 1; // Reset to first page when changing equipment
          await this.Efetch();
        },
      },
      watch: {
        dateRange(newRange) {
          if (newRange) {
            this.startDate = newRange[0];
            this.endDate = newRange[newRange.length - 1];
          } else {
            this.startDate = new Date(0);
            this.endDate = new Date();
          }
          this.onPageChange({ page: 1, itemsPerPage: this.itemsPerPage });
        },
      },
    }
</script>

<style>
.styled-table {
  th {
    background-color: #f5f5f5 !important;
    font-weight: bold;
    font-size: 0.9rem;
  }

  td {
    font-size: 0.85rem;
  }

  tbody tr:nth-child(odd) {
    background-color: #fafafa;
  }

  tbody tr:hover {
    background-color: #f0f0f0;
  }
}
</style>