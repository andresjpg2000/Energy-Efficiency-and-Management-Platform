<script >
export default {
  
  props: {
    body: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    // Define your computed properties here
  },
  methods: {
    // Define your methods here
  },
  mounted() {
    // Initialize your component here
  },
};
</script>
<template>
    <v-card variant="outlined" class='bg-white border-0 elevation-0' :style="{ width: '100%', height: '100%' }">
      <v-card-text class="d-flex flex-column justify-space-between h-100">
        <div class="d-flex align-items-center justify-space-between">
          <div>
            <h6 class="text-h6 text-lightText mb-1">{{ body.name }}</h6>
            <h4 class="text-h4 d-flex align-center mb-0">
              {{ body.earn }}
              <v-chip :color="body.color" :border="`${body.color} solid thin opacity-50`" class="ml-2" size="small" label>
                <template v-slot:prepend>
                  <component :is="body.icon" :style="{ fontSize: '12px' }" :class="'mr-1 text-' + body.color" />
                </template>
                {{ body.percent }}
              </v-chip>
            </h4>
            <span class="text-lightText text-caption pt-5 d-block"
              >You made an extra <span :class="'text-' + body.color">{{ body.text }}</span> this year</span
            >
          </div>
        </div>
      </v-card-text>
    </v-card>
   
</template>
