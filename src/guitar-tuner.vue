<script>
import soundServiceCreator from "@/services/sound.service";
import Detune from "./components/Detune";
import Switch from "./components/Switch";
const soundService = soundServiceCreator();
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default {
  props: {
    displayNotes: {
      type: Boolean,
      default: true,
    },
    displayDetune: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    hasGrid: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    soundService.on("acUpdate", (val) => {
      this.setResults(val);
    });
    soundService.on("statusUpdate", (val) => {
      this.isTunerActive = val;
    });
  },
  components: {
    Switch,
    Detune,
  },
  data() {
    return {
      soundService,
      notes: NOTES,
      pitch: null,
      note: null,
      detune: null,
      isTunerActive: false,
    };
  },
  methods: {
    toggleInputHandler() {
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
    },
  },
};
</script>

<template>
  <div class="tuningArea">
    <Switch :is-active="isTunerActive" @press-button="toggleInputHandler" />
    <div :class="['gridOverlay', { play: isTunerActive }]"></div>
    <div class="referenceLine"></div>
    <div class="detuneArea">
      <div class="note">{{ note ? notes[note % 12] : "--" }}</div>
      <Detune :detune="detune" class="detuneArea" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./styles/design";

.tuningArea {
  position: relative;
  width: 100%;
  min-height: 100vh;
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

.detuneArea {
  position: absolute;
  bottom: $s-l;
  left: 0;
  right: 0;
  width: $tuning-area-size;
  max-width: 100%;
  margin: 0 auto;
}

@include desktop {
  .detuneArea {
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
