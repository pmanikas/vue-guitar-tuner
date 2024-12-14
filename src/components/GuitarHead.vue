<script setup lang="ts">
import { ref } from 'vue';

const keys = ref(['D', 'A', 'E', 'G', 'B', 'e']);
</script>

<template>
    <div class="guitar-head">
        <div class="head-shape">
            <div v-for="key in keys" :key="key" class="tuning-key">{{ key }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use './../styles/abstracts' as *;

.guitar-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: $s-m;
}

.head-shape {
    position: relative;
    width: 100px;
    height: 140px;
    background-color: $c-cod-gray;
    border-radius: 20px;
}

.tuning-key {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.25rem;
    height: 1.25rem;
    color: $c-cod-gray;
    background-color: $c-silver;
    border-radius: 50%;
}

.tuning-key:nth-child(1) {
    top: 20px;
    left: 10px;
}

.tuning-key:nth-child(2) {
    top: 60px;
    left: 10px;
}

.tuning-key:nth-child(3) {
    top: 100px;
    left: 10px;
}

.tuning-key:nth-child(4) {
    top: 20px;
    right: 10px;
}

.tuning-key:nth-child(5) {
    top: 60px;
    right: 10px;
}

.tuning-key:nth-child(6) {
    top: 100px;
    right: 10px;
}
</style>
