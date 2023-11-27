<script setup lang="ts">
import { ref } from "vue";

const time = ref(
  ((now: Date) => {
    const h = now.getHours();
    if (h < 9) return "早上";
    else if (h < 12) return "上午";
    else if (h < 14) return "中午";
    else if (h < 17) return "下午";
    else return "晚上";
  })(new Date()),
);
</script>

<template>
  <h1>{{ time }}好！</h1>
</template>

<style scoped>
h1 {
  color: var(--c-text);
}
</style>
