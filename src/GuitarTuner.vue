<script>
import soundServiceCreator from "./services/sound.service";
const soundService = soundServiceCreator();
import "./styles/style.scss";
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default {
  props: {
    displayNote: {
      type: Boolean,
      default: true,
    },
    displayReferenceLine: {
      type: Boolean,
      default: true,
    },
    displayGrid: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: Array,
      default: () => NOTES,
      validator: (arr) => {
        return arr.length === 12 && !arr.some((i) => typeof i !== "string");
      },
    },
    tunerClasses: {
      type: Array,
      default: () => ["tuner"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
    gridClasses: {
      type: Array,
      default: () => ["gridOverlay"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
    detuneClasses: {
      type: Array,
      default: () => ["detune"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
    detuneTipClasses: {
      type: Array,
      default: () => ["detuneTip"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
    detuneValueClasses: {
      type: Array,
      default: () => ["detuneValue"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
    keySignatureClasses: {
      type: Array,
      default: () => ["keySignature"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
    flatClasses: {
      type: Array,
      default: () => ["flat"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
    sharpClasses: {
      type: Array,
      default: () => ["sharp"],
      validator: (arr) => {
        return !arr.some((i) => typeof i !== "string");
      },
    },
  },
  mounted() {
    soundService.on("acUpdate", (val) => {
      this.setResults(val);
    });
    soundService.on("statusUpdate", (val) => {
      this.isTunerActive = val;
      this.$emit("statusUpdate", this.isTunerActive);
    });
    this.$root.$toggleGuitarTuner = this.toggleGuitarTuner;
  },
  destroyed() {
    soundService.off("acUpdate");
    soundService.off("statusUpdate");
  },
  data() {
    return {
      soundService,
      pitch: null,
      note: null,
      detune: null,
      isTunerActive: false,
    };
  },
  methods: {
    toggleGuitarTuner() {
      if (this.isTunerActive) {
        this.soundService.stop();
      } else {
        this.soundService.start();
      }
    },
    setResults(ac) {
      if (ac === -1) {
        this.pitch = null;
        this.note = null;
        this.detune = null;
      } else {
        this.pitch = Math.round(ac);
        this.note = soundService.noteFromPitch(this.pitch);
        this.detune = soundService.centsOffFromPitch(this.pitch, this.note);
      }
      this.$emit("dataUpdate", {
        pitch: this.pitch,
        note: this.note,
        detune: this.detune,
      });
    },
  },
};
</script>

<template>
  <div :class="[...tunerClasses]">
    <div
      v-if="displayGrid"
      :class="[...gridClasses, { play: isTunerActive }]"
    ></div>
    <div v-if="displayReferenceLine" class="referenceLine"></div>

    <div v-if="displayNote" class="note">
      {{ note ? notes[note % 12] : "--" }}
    </div>
    <div :class="[...detuneClasses]">
      <div :class="[...keySignatureClasses, ...flatClasses]">&#9837;</div>
      <div
        :class="[
          ...detuneTipClasses,
          detune !== null && (Math.abs(detune) < 5 ? 'tuned' : 'untuned'),
        ]"
        :style="{ transform: `translateX(${detune * 4 || 0}px)` }"
      >
        <span :class="[...detuneValueClasses]">{{ detune || "--" }}</span>
      </div>
      <div :class="[...keySignatureClasses, ...sharpClasses]">&#9839;</div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./styles/design";

.tuner * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.tuner {
  position: relative;
  width: 100%;
  height: 100%;
  color: $c-silver;
}

.gridOverlay {
  @include center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &.play::before {
    animation-play-state: running;
  }
  &::before {
    @include fill;
    display: inline-block;
    content: "";
    width: 100%;
    height: 100%;
    background: $c-san-juan-blue;
    background-image: repeating-linear-gradient(
        $c-white -1px 1px,
        transparent 1px 100%
      ),
      repeating-linear-gradient(90deg, $c-white -1px 1px, transparent 1px 100%);
    background-size: ($tuning-area-size / 20) ($tuning-area-size / 20);
    background-position: center center;
    opacity: 0.15;
    animation: moveDown 0.5s infinite linear;
    animation-play-state: paused;
  }
  &::after {
    @include fill;
    content: "";
    background-image: linear-gradient(
        to left,
        transparent 90%,
        $c-cod-gray 100%
      ),
      linear-gradient(to right, transparent 90%, $c-cod-gray 100%);
  }
}

.referenceLine {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: $z-minus;
  width: 1px;
  height: 100%;
  background: $c-cinnabar;
  transform: translateX(-50%);
  opacity: 0.4;
}

.note {
  font-size: $s-xxxl;
  text-align: center;
  margin-bottom: $s-xxl * 4;
}

.detune {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-around;
  bottom: $s-l;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.detuneTip {
  position: relative;
  bottom: $s-xxl;
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  transition: transform 0.3s linear;
  &.tuned::before {
    background: $c-eastern-snow-gradient;
  }
  &.untuned::before {
    background: $c-passion-gradient;
  }
  &::before {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    content: "";
    height: 100%;
    width: 100%;
    margin: 0 auto;
    background: $c-dove-gray;
    border-top-left-radius: 50%;
    border-top-right-radius: 50% 100%;
    border-bottom-right-radius: 2.5px;
    border-bottom-left-radius: 100% 50%;
    transform: rotate(45deg);
    opacity: 0.8;
    box-shadow: $s-m 0 $s-m $c-cod-gray;
  }
}

.detuneValue {
  position: relative;
  z-index: $z-highlight;
  padding-top: $s-s;
  font-weight: bold;
  font-size: $s-l;
}

@include desktop {
  .detune {
    width: $tuning-area-size * 1.5;
  }
  .gridOverlay {
    &::after {
      @include fill;
      content: "";
      background-image: linear-gradient(
          to left,
          transparent 90%,
          $c-cod-gray 100%
        ),
        linear-gradient(to right, transparent 90%, $c-cod-gray 100%),
        linear-gradient(to top, transparent 90%, $c-cod-gray 100%),
        linear-gradient(to bottom, transparent 90%, $c-cod-gray 100%);
    }
  }
}
</style>
