<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineEmits } from 'vue';
import SoundServiceCreator from './services/sound.service';
import GuitarHead from './components/GuitarHead.vue';

const emit = defineEmits(['dataUpdate', 'statusUpdate']);
const soundService = SoundServiceCreator();

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const pitch = ref<number | null>(null);
const note = ref<number | null>(null);
const detune = ref<number | null>(null);
const isTunerActive = ref(false);

const toggleGuitarTuner = () => {
    if (isTunerActive.value) soundService.stop();
    else soundService.start();
};

const setResults = (ac: number) => {
    if (ac === -1) {
        pitch.value = null;
        note.value = null;
        detune.value = null;
    } else {
        pitch.value = Math.round(ac);
        note.value = soundService.noteFromPitch(pitch.value);
        detune.value = soundService.centsOffFromPitch(pitch.value, note.value);
    }
    emit('dataUpdate', {
        pitch: pitch.value,
        note: note.value,
        detune: detune.value,
    });
};

onMounted(() => {
    soundService.on('acUpdate', (val: number) => setResults(val));

    soundService.on('statusUpdate', (isActive: boolean) => {
        isTunerActive.value = isActive;
        emit('statusUpdate', isTunerActive.value);
    });
});

onUnmounted(() => {
    soundService.off('acUpdate');
    soundService.off('statusUpdate');
});
</script>

<template>
    <div class="tuner-wrapper">
        <div class="tuner-decoration">
            <div :class="['grid-overlay', { play: isTunerActive }]"></div>
            <div class="reference-line"></div>
        </div>
        <div class="tuner-inner">
            <div class="top-bar">
                <GuitarHead />
                <button class="toggle-button" @click="toggleGuitarTuner">{{ isTunerActive ? 'STOP' : 'START' }}</button>
            </div>
            <div class="note">{{ note !== null ? NOTES[note % 12] : '--' }}</div>
            <div class="detune">
                <div class="key-signature flat">&#9837;</div>
                <div :class="['detune-tip', detune !== null && (Math.abs(detune) < 5 ? 'tuned' : 'untuned')]"
                    :style="{ transform: `translateX(${(detune || 0) * 4 || 0}px)` }">
                    <span class="detune-value">{{ detune !== null ? detune : '--' }}</span>
                </div>
                <div class="key-signature sharp">&#9839;</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use './styles/abstracts' as *;
@use 'sass:math';

.tuner-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    color: $c-silver;
    background-color: $c-eastern-blue;
    overflow: hidden;
}

.toggle-button {
    padding: $s-s $s-m;
    font-size: 1rem;
    background: $c-cod-gray;
    color: $c-silver;
    border-radius: $base-radius;
    cursor: pointer;
}

.grid-overlay {
    @include center;

    width: 100%;
    height: 110vh;
    overflow: hidden;

    &.play::before {
        animation-play-state: running;
    }

    &::before {
        @include fill;
        @include gridBackground($c-cod-gray, 30px);

        content: '';
        opacity: 0.25;
        animation: moveDown 0.5s infinite linear;
        animation-play-state: paused;
    }
}

.reference-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background: $c-cinnabar;
    transform: translateX(-50%);
    opacity: 0.4;
}

.tuner-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: $s-xs;
}

.top-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.note {
    @include square(150px);

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    line-height: 1;
    background: $c-cod-gray;
    border-radius: 50%;
    box-shadow: inset 0 0 30px $c-black;
    border: 1px solid $c-black;
}

.detune {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
}

.detune-tip {
    position: relative;
    bottom: $s-m;
    height: 60px;
    width: 60px;
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
        content: '';
        height: 100%;
        width: 100%;
        margin: 0 auto;
        background: $c-cod-gray;
        border-top-left-radius: 50%;
        border-top-right-radius: 50% 100%;
        border-bottom-right-radius: 2.5px;
        border-bottom-left-radius: 100% 50%;
        transform: rotate(45deg);
        opacity: 0.8;
        box-shadow: $s-m 0 $s-m $c-cod-gray;
    }
}

.detune-value {
    z-index: $z-highlight;
    padding-top: $s-xxs;
    font-weight: bold;
    font-size: 1.5rem;
}
</style>
