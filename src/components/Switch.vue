<script>
export default {
  name: 'NavButton',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
  }
}
</script>

<template>
  <button :class="['button', { 'isActive' : isActive }]" @click.prevent="$emit('press-button')">
      {{ isActive ? 'Stop' : 'Start' }}
  </button>
</template>

<style lang="scss" scoped>
@import './../styles/design';

.button {
  position: relative;
  width: $s-xxl;
  height: $s-xxl;
  text-align: center;
  color: $c-cod-gray;
  font-size: $s-m;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: $c-viking;
  background: linear-gradient(90deg, $c-riptide 0%, $c-viking 100%);
  border-radius: 50%;
  box-shadow: 0px 0px 24px transparentize($c-viking, 0.639);
  opacity: 0.8;
  cursor: pointer;
  &::before, &::after {
    @include center;
    content: '';
    width: $s-xxl;
    height: $s-xxl;
    pointer-events: none;
    border-radius: 50%;
  }
  &::before {
    box-shadow: 0 0 60px transparentize($c-bright-turquoise, 0.639);
    opacity: 0;
    transition: all .3s ease-in-out 0s;
  }
  &::after {
    z-index: $z-minus;
    border: 6px solid $c-bright-turquoise;
    animation: ring 1.5s infinite;
  }
  &.isActive {
    background: $c-passion-gradient;
    box-shadow: 0px 0px 24px transparentize($c-cinnabar, 0.639);
    color: $c-silver;
    &::before, &::after {
      animation-play-state: 'paused';
      display: none;
    }
  }
}

button:hover::before, button:active::before {
  opacity: 1;
}

button:hover::after, button:active::after {
  animation-play-state: 'paused';
  opacity: 0;
}
</style>
