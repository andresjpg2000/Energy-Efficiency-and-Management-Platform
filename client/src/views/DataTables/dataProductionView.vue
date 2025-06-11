<template>
  <v-container class="container">
    <v-row justify="space-between" class="mb-4 align-content-center">
      <h1 class="text-h5 pl-4">Energies Production Data</h1>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="energies"
      :items-per-page="itemsPerPage"
      :items-length="totalItems"
      loading
      :page="page"
      class="elevation-1 p-0"
    >
      <!-- <template #item.actions="{ item }">
        <v-icon small class="me-2" @click="editUser(item)">mdi-pencil</v-icon>
        <v-icon small class="me-2" @click="exportUser(item)">mdi-file</v-icon>
        <v-icon small color="red" @click="deleteUser(item)">mdi-delete</v-icon>
      </template> -->
    </v-data-table-server>
  </v-container>
</template>


<script>
import { useProductionsStore } from '@/stores/productionsStore';
import { useHousingsStore } from '@/stores/housings';

    export default {
        data() {
            return {
                productionStore: useProductionsStore(),
                houseStore: useHousingsStore(),
                headers: [
                    { text: 'Equipment', value: 'id_equipment' },
                    { text: 'Value', value: 'value' },
                    { text: 'Date', value: 'date' },
                ],
                energies: [],
                itemsPerPage: 10,
                totalItems: 0,
                page: 1,
                startDate: null,
                endDate: null,
                houseId: null,
                equipment : null,
            }
        },
      beforeMount () {
        this.houseId = this.houseStore.selectedHousingId;
        this.Efetch();
      
      },
      methods: {
        async Efetch() {
          const data = await this.productionStore.fetchProdutionTable(this.itemsPerPage, this.page, this.startDate, this.endDate, this.equipment, this.houseId);
          console.log('Data fetched:', data);
          this.energies = data.data;
          this.totalItems = data.pagination.total;
          console.log('Energies:', this.energies); 
        }
      },
    }
</script>

<style lang="scss" scoped>

</style>