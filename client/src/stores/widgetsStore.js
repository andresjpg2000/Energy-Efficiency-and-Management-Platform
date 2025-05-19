import { defineStore } from 'pinia'
import { useUsersStore } from './usersStore.js'

export const useWidgetsStore = defineStore('widgets', {
  state: () => ({
    userWidgets: [],
  }),
  persist: true,
  getters: {
  },  
  actions: {
    async fetchUserWidgets() {
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
      
      try {
        const usersStore = useUsersStore();
        if (!usersStore.isLoggedIn) {
          this.userWidgets = [];
          return;
        }
        const response = await fetch(`http://localhost:3000/users/${usersStore.user.id_user}/widgets`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user widgets');
        }
        const responseData = await response.json();
        
        const widgets = responseData.data.widgets || [];

        gridItems.forEach(widget => {
          if (!responseData.data.widgets.includes(widget.title)) {
            widgets.push(widget);
          }
        });

        this.userWidgets = widgets;

        console.log(this.userWidgets);
        
      } catch (error) {
        console.log(error);
        this.userWidgets = [];
      }
    },
    async addWidget(widget) {
      try {
        const response = await fetch('http://localhost:3000/widgets', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
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