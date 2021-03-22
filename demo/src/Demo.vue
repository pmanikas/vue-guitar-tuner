<script>
// Import from /dist
// import GuitarTuner from "./../../dist/vue-guitar-tuner.common.js";
// import("./../../dist/vue-guitar-tuner.css");

// Import directly from component for live dev
import GuitarTuner from "./../../src/GuitarTuner";

export default {
  name: "App",
  components: { GuitarTuner },
  data() {
    return {
      isTunerActive: false,
      data: {},
    };
  },
  methods: {
    statusUpdate(status) {
      this.isTunerActive = status;
    },
    dataUpdate(data) {
      this.data = data;
    },
  },
};
</script>

<template>
  <div scoped>
    <button
      @click.prevent="$root.$toggleGuitarTuner()"
      :class="['button', { isActive: isTunerActive }]"
    >
      {{ isTunerActive ? "Stop" : "Start" }}
    </button>
    <div class="container">
      <GuitarTuner @statusUpdate="statusUpdate" @dataUpdate="dataUpdate" />
    </div>
  </div>
</template>

<style lang="scss" scpoed>
* {
  margin: 0;
  padding: 0;
}

.container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

body {
  background: #333;
}
</style>
