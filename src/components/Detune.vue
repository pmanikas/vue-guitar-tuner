<script>
export default {
  name: 'Detune',
  props: {
    detune: {
      type: Number,
      default: null
    }
  }
}
</script>

<template>
  <div class="detune">
    <div>&#9837;</div>
    <div
      :class="['detuneTip', detune !== null && (Math.abs(detune) < 5 ? 'tuned' : 'outOfTune')]"
      :style="{ transform: `translateX(${detune * 4 || 0}px)` }"
    >
      <span class="detuneValue">{{ detune || '--' }}</span>
    </div>
    <div>&#9839;</div>
  </div>
</template>

<style lang="scss" scoped>
@import './../styles/design';

.detune {
  display: flex;
  align-items: center;
  justify-content: space-around;
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
  &.outOfTune::before {
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
</style>
