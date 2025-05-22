import { defineStore } from 'pinia'
import { useUsersStore } from './users.js'
import { useAuthStore } from './auth.js'
import { URL } from '../utils/constants.js'

export const useWidgetsStore = defineStore('widgets', {
  state: () => ({
    userWidgets: [],
  }),
  persist: true,
  getters: {
  },  
  actions: {
    async fetchUserWidgets() {
      const usersStore = useUsersStore();
      const authStore = useAuthStore();
      const gridItems = [
        {
          type: 1,
          title: 'Corrent-Consumption',
          body: {
            name: 'Current Energy Consumption',
            earn: '4,42,236',
            x: 0, y: 0,
            w: 3, h: 2
          }
        },
        {
          type: 1,
          title: 'Energy-Production',
          body: {
            name: 'Renewable Energy Production',
            earn: '78,250',
            x: 3, y: 0,
            w: 3, h: 2
          }
        },
        {
          type: 1,
          title: 'Total-Consumption',
          body: {
            name: 'Total Consumption this year',
            earn: '18,800',
            x: 6, y: 0,
            w: 3, h: 2
          }
        },
        {
          type: 1,
          title: 'Total-Expenses',
          body: {
            name: 'Expected Expenses (This Month)',
            earn: '$35,078',
            color: 'error',
            x: 9, y: 0,
            w: 3, h: 2
          }
        },
        {
          type: 5,
          title: 'Graphic',
          body: { x: 0, y: 6, w: 6, h: 3 }
        },
        {
          type: 2,
          title: 'Column',
          body: { x: 0, y: 9, w: 12, h: 3 }
        },
        {
          type: 3,
          title: 'Vertical-Column',
          body: { x: 6, y: 3, w: 6, h: 3 }
        },
      ];
      if (this.userWidgets.length == 0) {
        const response = await fetch(`${URL}/users/${usersStore.user.id_user}/widgets`, {
            method: 'GET',
            headers: {
            'authorization': `Bearer ${authStore.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user widgets');
        }
        let responseData = await response.json();

        let widgets = responseData.data.widgets || [];

        widgets.forEach(el => {
          el.body = JSON.parse(el.body);
          el.type = parseInt(el.type);
          delete el.id_user;
        });

        gridItems.forEach(w => {
          const jaExiste = widgets.some(widget => widget.title.trim() === w.title.trim());
          console.log(jaExiste);

          if (!jaExiste) {
            console.log("NÃO EXISTE");
            
            widgets.push(w);
            this.addWidget(w)
          }   
          
        });

        this.userWidgets = widgets;

        console.log("all widgets", widgets);

        console.log(this.userWidgets.length);
      }
    },

    async addWidget(widget) {
      try {
        const usersStore = useUsersStore();
        const authStore = useAuthStore();
        widget.id_user = usersStore.user.id_user;

        const response = await fetch(`${URL}/widgets`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${usersStore.token}`,
          },
          body: JSON.stringify(widget),
        });

        if (!response.ok) {
          throw new Error('Failed to add widget');
        }
        const data = await response.json();
        this.userWidgets.push(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
})