import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'
import { URL } from '../utils/constants.js'
import { useMessagesStore } from './messages.js';
import { useColorsStore } from './colorsStore.js';

export const useWidgetsStore = defineStore('widgets', {
  state: () => ({
    userWidgets: [],
  }),
  persist: true,
  getters: {
  },
  actions: {
    async fetchUserWidgets() {
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
            name: 'Energy Production Today',
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
        {
          type: 99,
          title: 'Colors',
          body: {
            consumptionColor: "#E87461",
            productionColor: "#7AC74F",
            givenEnergyColor: "#326273"
          }
        },
      ];
      if (this.userWidgets.length == 0) {
        const response = await fetch(`${URL}/users/${authStore.user.id_user}/widgets`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
          if (w.type === 99) {
            const colorsStore = useColorsStore();
            if (jaExiste) {
              colorsStore.init(widgets.find(widget => widget.title.trim() === "Colors").body);
              widgets.splice(widgets.findIndex(widget => widget.title.trim() === "Colors"), 1);
            }
            else {
              colorsStore.init(w.body);
              this.addWidget(w);
            }
          } else {
            if (!jaExiste) {
              widgets.push(w);
              this.addWidget(w);
            }
          }
        });

        this.userWidgets = widgets;
      }
    },

    updateWidget(x, y, title) {
      this.userWidgets.forEach(widget => {
        if (widget.title == title) {
          widget.body.x = x;
          widget.body.y = y;
        }
      });
    },

    async updateOneWidget(title, x, y) {
      const authStore = useAuthStore();
      const messagesStore = useMessagesStore();

      const body = {
        x: x,
        y: y
      };

      try {
        const response = await fetch(`${URL}/widgets/${title}?id_user=${authStore.user.id_user}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Failed to update widget');
        }
        const data = await response.json();
      } catch (error) {
        messagesStore.add({
          color: 'error',
          text: error.message || 'Failed to update widget',
        });
      }
    },

    async updateDBWidgets(changedWidgets = this.userWidgets.map(widget => widget.title)) {
      const authStore = useAuthStore();
      const messagesStore = useMessagesStore();
      try {
        const promises = this.userWidgets
          .filter(widget => changedWidgets.includes(widget.title))
          .map(widget =>
            fetch(`${URL}/widgets/${widget.title.trim()}?id_user=${authStore.user.id_user}`, {
              method: 'PATCH',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${authStore.token}`,
              },
              body: JSON.stringify({ x: widget.body.x, y: widget.body.y }),
            })
          );

        const responses = await Promise.all(promises);

        responses.forEach((response, index) => {
          if (!response.ok) {
            messagesStore.add({
              color: 'error',
              text: `Failed to update widget ${this.userWidgets[index].title}`,
            });
          }
        });
      } catch (error) {
        messagesStore.add({
          color: 'error',
          text: error.message || 'Failed to update widgets',
        });
      }
    },

    async addWidget(widget) {
      const messagesStore = useMessagesStore();
      try {
        const authStore = useAuthStore();
        widget.id_user = authStore.user.id_user;

        const response = await fetch(`${URL}/widgets`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${authStore.token}`,
          },
          body: JSON.stringify(widget),
        });

        if (!response.ok) {
          throw new Error('Failed to add widget');
        }
      } catch (error) {
        messagesStore.add({
          color: 'error',
          text: error.message || 'Failed to add widget',
        });
      }
    },
    async deleteWidget(title) {
      const authStore = useAuthStore();
      const messagesStore = useMessagesStore();
      try {
        const response = await fetch(`${URL}/widgets/${title}?id_user=${authStore.user.id_user}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${authStore.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete widget');
        }
      } catch (error) {
        messagesStore.add({
          color: 'error',
          text: error.message || 'Failed to delete widget',
        });
      }
    },
  },
})