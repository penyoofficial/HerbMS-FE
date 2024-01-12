<script setup lang="ts">
import { ref } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useDanmuStore } from "@/stores/danmu";

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

const timer = ref(
  ((waves: number, lines: number) => {
    const timer = [];
    for (let i = 0; i < waves; i++)
      timer.push({
        display: false,
        danmus: useDanmuStore().getDanmus(lines),
      });
    return timer;
  })(6, 18),
);

timer.value.forEach((_, i) => {
  setTimeout(
    () => (timer.value[i].display = true),
    (8000 / timer.value.length) * i,
  );
});
</script>

<template>
  <div class="shell">
    <div
      class="theme"
      title="切换主题"
      @click="useThemeStore().changeTheme()"
    ></div>
    <h1>{{ time }}好！</h1>
    <div class="danmu-pool">
      <span v-for="t in timer">
        <p
          v-if="t.display"
          v-for="(d, i) in t.danmus"
          class="danmu"
          :style="`top: ${i * 1.25}rem; --speed: ${8 - i * 0.1}s; opacity: ${
            1 - i / 18
          };`"
        >
          {{ d }}
        </p>
      </span>
    </div>
  </div>
</template>

<style scoped>
@keyframes danmu-action {
  0% {
    left: 110%;
  }

  100% {
    left: -25%;
  }
}

.shell {
  position: relative;
  padding: 3rem 4rem;

  & .theme {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background: var(--c-highlight);
    opacity: 0.3;
  }

  & h1 {
    margin-bottom: 3rem;
    color: var(--c-text);
  }

  & .danmu-pool {
    position: relative;

    & .danmu {
      position: absolute;
      color: var(--c-text);
      white-space: nowrap;
      animation: danmu-action var(--speed) linear infinite;

      &:hover {
        z-index: 999;
        color: var(--c-highlight);
        animation-play-state: paused;
      }
    }
  }
}
</style>
